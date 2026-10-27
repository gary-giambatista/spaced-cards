import {DeckSync, storageKey} from '@/library/deck-sync';
const decks = [{id: 1, name: 'A', cards: []}];
const deferred = () => {let resolve, reject; const promise = new Promise((a,b) => {resolve=a;reject=b;}); return {promise,resolve,reject};};
function setup(extra = {}) {
  const changed = jest.fn();
  const load = jest.fn().mockResolvedValue({decks: [], version: null});
  const save = jest.fn().mockImplementation(async data => ({decks: data, version: '1:0'}));
  const sync = new DeckSync({userId: 'user_A', storage: localStorage, load, save, changed, ...extra});
  return {sync, load, save, changed};
}
beforeEach(() => {localStorage.clear();jest.useFakeTimers();});
afterEach(() => jest.useRealTimers());
test('save failure retains dirty edits for retry and reload', async () => {
  const {sync, save} = setup(); await sync.start();
  save.mockRejectedValueOnce(new Error('offline'));
  sync.edit(decks); await sync.flush();
  expect(sync.state.status).toBe('Save failed');
  expect(JSON.parse(localStorage.getItem(storageKey('user_A'))).dirty).toBe(true);
  await sync.retry(); expect(sync.state.status).toBe('Saved to cloud');
});
test('stale local drafts do not overwrite newer cloud decks', async () => {
  localStorage.setItem(storageKey('user_A'), JSON.stringify({decks, version: '1:0', dirty: true}));
  const {sync,save} = setup({load: async () => ({decks: [], version: '2:0'})});
  await sync.start(); await sync.flush();
  expect(sync.state.conflict).toBe(true); expect(sync.state.decks).toEqual(decks); expect(save).not.toHaveBeenCalled();
});
test('account switch ignores old responses and never copies data into the other account', async () => {
  const pending = deferred(); const {sync} = setup({load: () => pending.promise});
  const started = sync.start(); sync.close();
  const other = setup({userId: 'user_B'}).sync; await other.start();
  pending.resolve({decks, version: '1:0'});await started;
  expect(other.state.decks).toEqual([]);
  expect(localStorage.getItem(storageKey('user_A'))).toBeNull();
});
test('edits during a save remain dirty until a second serialized save', async () => {
  const first = deferred();const {sync,save} = setup();await sync.start();
  save.mockReturnValueOnce(first.promise);
  sync.edit(decks);const pending = sync.flush();
  sync.edit([{...decks[0], name: 'B'}]);
  first.resolve({decks,version:'1:0'});await pending;
  expect(sync.state.dirty).toBe(true);await sync.flush();
  expect(save.mock.calls[1][1]).toBe('1:0');expect(sync.state.dirty).toBe(false);
});
test('other-tab changes block automatic overwrites', async () => {
  const {sync,save} = setup();await sync.start();sync.edit(decks);sync.externalChange();await sync.flush();
  expect(save).not.toHaveBeenCalled();expect(sync.state.conflict).toBe(true);
});
test('corrupt storage is not overwritten', async () => {
  localStorage.setItem(storageKey('user_A'), '{broken');
  const {sync,save} = setup();await sync.start();sync.edit(decks);
  expect(localStorage.getItem(storageKey('user_A'))).toBe('{broken');expect(save).not.toHaveBeenCalled();
});
test('guest data is never automatically imported into an account', async () => {
  localStorage.setItem('decks', JSON.stringify(decks));
  localStorage.setItem(storageKey(null),JSON.stringify({decks}));
  const {sync,save}=setup();await sync.start();
  expect(sync.state.decks).toEqual([]);expect(save).not.toHaveBeenCalled();
});
test('choosing cloud preserves a recovery snapshot', async () => {
  const {sync}=setup();await sync.start();sync.edit(decks);sync.state.conflict=true;
  await sync.useCloud();expect(sync.state.decks).toEqual([]);
  const backup = Object.keys(localStorage).find(key => key.includes(':backup:'));
  expect(JSON.parse(localStorage.getItem(backup)).decks).toEqual(decks);
});
test('an acknowledged cloud save recovers after its original response was lost', async () => {
  localStorage.setItem(storageKey('user_A'),JSON.stringify({decks,version:'1:0',dirty:true}));
  const {sync,save}=setup({load:async()=>({decks,version:'2:0'})});await sync.start();
  expect(sync.state.conflict).toBe(false);expect(sync.state.dirty).toBe(false);expect(save).not.toHaveBeenCalled();
});
