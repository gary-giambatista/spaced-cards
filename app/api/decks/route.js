import { auth } from '@clerk/nextjs/server';
import { database } from '@/library/server/firestore';
import { readDecks, writeDecks } from '@/library/server/deck-store';
import { MAX_DECK_BYTES, validateDecks } from '@/library/deck-validation';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const respond = (body, status = 200) => Response.json(body, {status, headers: {'Cache-Control': 'private, no-store'}});
async function identity() { return (await auth()).userId; }
export async function GET(request) {
  try {
    const userId = await identity();
    if (!userId) return respond({error: 'Sign in to access cloud decks.'}, 401);
    if (request.headers.get('x-deck-owner') !== userId) return respond({error: 'Account changed. Reload before continuing.'}, 409);
    return respond(await readDecks(database(), userId));
  } catch { return respond({error: 'Cloud decks could not be loaded. Your local copy has been kept.'}, 503); }
}
export async function PUT(request) {
  try {
    const userId = await identity();
    if (!userId) return respond({error: 'Sign in to save cloud decks.'}, 401);
    if (request.headers.get('x-deck-owner') !== userId) return respond({error: 'Account changed. Reload before continuing.'}, 409);
    if (request.headers.get('origin') !== new URL(request.url).origin) return respond({error: 'Invalid request origin.'}, 403);
    if (!request.headers.get('content-type')?.startsWith('application/json')) return respond({error: 'JSON required.'}, 415);
    const reader = request.body?.getReader();
    if (!reader) return respond({error: 'Request body required.'}, 400);
    let size = 0;
    const chunks = [];
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_DECK_BYTES) { await reader.cancel(); return respond({error: 'Deck collection is too large.'}, 413); }
      chunks.push(Buffer.from(value));
    }
    let payload;
    try {
      payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      if (!payload || Object.keys(payload).some(key => !['decks', 'version'].includes(key)) || !(payload.version === null || (typeof payload.version === 'string' && /^\d+:\d+$/.test(payload.version)))) throw new Error();
      validateDecks(payload.decks);
    } catch { return respond({error: 'Invalid deck data.'}, 400); }
    return respond(await writeDecks(database(), userId, payload.decks, payload.version));
  } catch (error) { return respond({error: error.status === 409 ? error.message : 'Cloud save failed. Your local copy has been kept.'}, error.status === 409 ? 409 : 503); }
}
