/** @jest-environment node */
import {initializeApp, deleteApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {readDecks,writeDecks} from '@/library/server/deck-store';
const integration = process.env.RUN_FIRESTORE_INTEGRATION === '1' ? describe : describe.skip;
integration('isolated Firestore emulator',()=>{
  let app,db;
  const old=[{id:1,name:'Existing',cards:[]}];
  beforeAll(async()=>{
    if (!/^(127\.0\.0\.1|localhost):\d+$/.test(process.env.FIRESTORE_EMULATOR_HOST || '')) throw new Error('Local emulator required');
    app=initializeApp({projectId:'demo-spaced-cards'},'integration-tests');db=getFirestore(app);
    await db.doc('users/user_A/decks/deck1').set({decks:JSON.stringify(old)});
    await db.doc('users/user_B/decks/deck1').set({decks:JSON.stringify([{id:2,name:'Other',cards:[]}])});
  });
  afterAll(async()=>{if(app) await deleteApp(app);});
  test('real transactions preserve backup, reject racing saves, and isolate user documents',async()=>{
    const first=await readDecks(db,'user_A');
    const results=await Promise.allSettled([
      writeDecks(db,'user_A',[{id:1,name:'Writer 1',cards:[]}],first.version),
      writeDecks(db,'user_A',[{id:1,name:'Writer 2',cards:[]}],first.version),
    ]);
    expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(1);
    expect(results.find(r=>r.status==='rejected').reason.status).toBe(409);
    const backup=await db.doc('users/user_A/deckBackups/before-server-persistence-v1').get();
    expect(JSON.parse(backup.data().decks)).toEqual(old);
    expect((await readDecks(db,'user_B')).decks[0].name).toBe('Other');
  },20000);
  test.each(['GET','PATCH','DELETE'])('direct unauthenticated %s is denied',async method=>{
    const response=await fetch(`http://${process.env.FIRESTORE_EMULATOR_HOST}/v1/projects/demo-spaced-cards/databases/(default)/documents/users/user_A/decks/deck1`,{method, ...(method==='PATCH'?{headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{decks:{stringValue:'[]'}}})}:{})});
    expect(response.status).toBe(403);
  });
  test('direct collection queries are denied',async()=>{
    const response=await fetch(`http://${process.env.FIRESTORE_EMULATOR_HOST}/v1/projects/demo-spaced-cards/databases/(default)/documents:runQuery`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({structuredQuery:{from:[{collectionId:'users'}]}})});
    expect(response.status).toBe(403);
  });
});
