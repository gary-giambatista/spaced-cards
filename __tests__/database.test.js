import {loadCloudDecks, saveCloudDecks} from '@/library/database_functions';
afterEach(() => {delete global.fetch;});
test('save sends an account guard, a revision, and data but never selects a user path', async () => {
  global.fetch = jest.fn().mockResolvedValue({ok: true, json: async () => ({decks: [], version: '1:0'})});
  await saveCloudDecks([], null, 'user_A');
  const [url, options] = fetch.mock.calls[0];
  expect(url).toBe('/api/decks');
  expect(JSON.parse(options.body)).toEqual({decks: [], version: null});
  expect(options.headers['X-Deck-Owner']).toBe('user_A');
});
test('permission/network failures reach callers rather than disappearing into console output', async () => {
  global.fetch = jest.fn().mockResolvedValue({ok: false, status: 401, json: async () => ({error: 'Sign in'})});
  await expect(loadCloudDecks('user_A')).rejects.toMatchObject({status: 401});
});
