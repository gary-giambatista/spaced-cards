/** @jest-environment node */
import {readDecks,writeDecks,userPath} from '@/library/server/deck-store';
const decks=[{id:1,name:'Old',cards:[]}];
function setup() {
  const snapshot={exists:true,updateTime:{seconds:10,nanoseconds:9},data:()=>({decks:JSON.stringify(decks)})};
  const tx={get:jest.fn().mockResolvedValueOnce(snapshot).mockResolvedValueOnce({exists:false}),create:jest.fn(),set:jest.fn()};
  const db={doc:jest.fn(path=>({path,get:async()=>snapshot})),runTransaction:async fn=>fn(tx)};
  return {db,tx};
}
test('user paths are isolated and path traversal rejected',async()=>{
  const {db}=setup();await readDecks(db,'user_A');await readDecks(db,'user_B');
  expect(db.doc.mock.calls.map(call=>call[0])).toEqual(['users/user_A/decks/deck1','users/user_B/decks/deck1']);
  expect(()=>userPath('user_A/../../user_B')).toThrow();
});
test('first server save backs up the original document in the same transaction',async()=>{
  const {db,tx}=setup();await writeDecks(db,'user_A',[],'10:9');
  expect(tx.create).toHaveBeenCalledWith(expect.objectContaining({path:'users/user_A/deckBackups/before-server-persistence-v1'}),{decks:JSON.stringify(decks),originalVersion:'10:9'});
  expect(tx.set).toHaveBeenCalledWith(expect.objectContaining({path:'users/user_A/decks/deck1'}),{decks:'[]',schemaVersion:1});
});
test('stale save cannot overwrite the current cloud document',async()=>{
  const {db,tx}=setup();await expect(writeDecks(db,'user_A',[],'9:9')).rejects.toMatchObject({status:409});
  expect(tx.set).not.toHaveBeenCalled();expect(tx.create).not.toHaveBeenCalled();
});
