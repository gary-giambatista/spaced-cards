/** @jest-environment node */
import {GET, PUT} from '@/app/api/decks/route';
import {auth} from '@clerk/nextjs/server';
import {readDecks, writeDecks} from '@/library/server/deck-store';
jest.mock('@clerk/nextjs/server', () => ({auth: jest.fn()}));
jest.mock('@/library/server/firestore', () => ({database: () => ({})}));
jest.mock('@/library/server/deck-store', () => ({readDecks: jest.fn(), writeDecks: jest.fn()}));
const request = (body = {decks: [], version: null}, headers = {}) => new Request('https://cards.test/api/decks', {method: 'PUT', headers: {'Origin':'https://cards.test','Content-Type':'application/json','X-Deck-Owner':'user_A', ...headers}, body: JSON.stringify(body)});
beforeEach(() => {auth.mockReturnValue({userId:'user_A'});readDecks.mockResolvedValue({decks:[],version:null});writeDecks.mockResolvedValue({decks:[],version:'1:0'});});
test('signed-out reads and writes return 401 without touching storage', async () => {
  auth.mockReturnValue({userId:null});
  expect((await GET(request())).status).toBe(401);expect((await PUT(request())).status).toBe(401);
  expect(readDecks).not.toHaveBeenCalled();expect(writeDecks).not.toHaveBeenCalled();
});
test('identity comes from the session; caller cannot select another user', async () => {
  expect((await PUT(request({decks:[],version:null,userId:'user_B'}))).status).toBe(400);
  expect((await PUT(request(undefined, {'X-Deck-Owner':'user_B'}))).status).toBe(409);
  expect(writeDecks).not.toHaveBeenCalled();
  expect((await PUT(request())).status).toBe(200);
  expect(writeDecks).toHaveBeenCalledWith({}, 'user_A', [], null);
});
test('GET rejects stale-account requests and disables caching', async () => {
  expect((await GET(request(undefined, {'X-Deck-Owner':'user_B'}))).status).toBe(409);
  const response = await GET(request());expect(response.status).toBe(200);expect(response.headers.get('cache-control')).toContain('no-store');
});
test('cross-origin and non-JSON writes are rejected', async () => {
  expect((await PUT(request(undefined, {Origin:'https://attacker.test'}))).status).toBe(403);
  expect((await PUT(request(undefined, {'Content-Type':'text/plain'}))).status).toBe(415);
  expect(writeDecks).not.toHaveBeenCalled();
});
test('malformed and oversized payloads are rejected', async () => {
  expect((await PUT(request({decks:[{id:1}],version:null}))).status).toBe(400);
  expect((await PUT(request({decks:[],version:'x'.repeat(710000)}))).status).toBe(413);
});
test('conflicts are explicit and server errors do not expose credentials', async () => {
  writeDecks.mockRejectedValueOnce(Object.assign(new Error('Cloud decks changed'),{status:409}));
  expect((await PUT(request())).status).toBe(409);
  readDecks.mockRejectedValueOnce(new Error('private-key-secret'));
  const response=await GET(request());expect(response.status).toBe(503);expect(await response.text()).not.toContain('private-key-secret');
});
