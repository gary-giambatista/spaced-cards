import { fetchDecks, setDecksInDB } from '@/library/database_functions';
import { refreshDecks } from '@/library/srs';
import { getDocs, setDoc } from 'firebase/firestore';
jest.mock('@/firebase', () => ({db: {}}));
jest.mock('firebase/firestore', () => ({
  collection: (...parts) => parts,
  doc: (...parts) => parts,
  getDocs: jest.fn(), getDoc: jest.fn(), setDoc: jest.fn(),
}));
const now = Date.UTC(2026, 0, 12, 12);
beforeEach(() => { localStorage.clear(); jest.spyOn(Date, 'now').mockReturnValue(now); jest.spyOn(console, 'log').mockImplementation(() => {}); jest.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(() => jest.restoreAllMocks());
test('Firestore adapter saves and reloads the full scheduler state', async () => {
  const decks = [{id: 1, cards: [{id: 2, interval: 6, repetition: 2, efactor: 2.6, due_date: now, last_practiced: now - 6*86400000, review_due: false}]}];
  await setDecksInDB('test-user', decks);
  const [path, document] = setDoc.mock.calls[0];
  expect(JSON.stringify(path)).toContain('test-user');
  expect(JSON.parse(document.decks)).toEqual(decks);
  getDocs.mockResolvedValue({docs: [{id: 'deck1', data: () => document}]});
  const setDecks = jest.fn(), setSelectedDeck = jest.fn();
  await fetchDecks('test-user', [], setDecks, setSelectedDeck, refreshDecks);
  expect(setDecks.mock.calls[0][0][0].cards[0]).toMatchObject({...decks[0].cards[0], review_due: true});
  expect(JSON.parse(localStorage.getItem('decks'))).toEqual(decks);
});
test('failed database reads preserve the local copy (known limitation: errors only logged)', async () => {
  localStorage.setItem('decks', '[{"id":1,"cards":[]}]');
  getDocs.mockRejectedValue(new Error('permission-denied'));
  const setDecks = jest.fn();
  await fetchDecks('test-user', [], setDecks, jest.fn(), refreshDecks);
  expect(setDecks).not.toHaveBeenCalled();
  expect(JSON.parse(localStorage.getItem('decks'))[0].id).toBe(1);
  expect(console.error).toHaveBeenCalled();
});
