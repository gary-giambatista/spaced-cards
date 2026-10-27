/** @jest-environment node */
import {readFileSync} from 'node:fs';
import {initializeTestEnvironment, assertFails} from '@firebase/rules-unit-testing';
import {doc, collection, getDoc, getDocs, setDoc, updateDoc, deleteDoc} from 'firebase/firestore';
const integration = process.env.RUN_FIRESTORE_INTEGRATION === '1' ? describe : describe.skip;
integration('deny-all client rules', () => {
  let environment;
  beforeAll(async () => {
    const address = process.env.FIRESTORE_EMULATOR_HOST || '';
    if (!/^(127\.0\.0\.1|localhost):\d+$/.test(address)) throw new Error('Local emulator required');
    const [host, port] = address.split(':');
    environment = await initializeTestEnvironment({projectId: 'demo-spaced-cards', firestore: {host, port: Number(port), rules: readFileSync('firestore.rules', 'utf8')}});
    await environment.withSecurityRulesDisabled(async context => {
      const db = context.firestore();
      await setDoc(doc(db, 'users/user_rules_owner/decks/deck1'), {decks: '[]'});
      await setDoc(doc(db, 'users/user_rules_owner/deckBackups/original'), {decks: '[]'});
    });
  });
  afterAll(async () => {if (environment) await environment.cleanup();});
  test.each(['anonymous', 'owner', 'other-user', 'admin-claim'])('%s cannot read or mutate any protected path', async identity => {
    const context = identity === 'anonymous' ? environment.unauthenticatedContext() : environment.authenticatedContext(identity === 'owner' ? 'user_rules_owner' : 'user_rules_other', identity === 'admin-claim' ? {admin: true, role: 'admin'} : {});
    const db = context.firestore();
    for (const path of ['users/user_rules_owner/decks/deck1', 'users/user_rules_owner/deckBackups/original', 'users/user_rules_other/decks/new', 'arbitrary/orphan/nested/document']) {
      const reference = doc(db, path);
      await assertFails(getDoc(reference));
      await assertFails(setDoc(reference, {decks: '[]', ownerId: 'user_rules_other', role: 'admin'}));
      await assertFails(updateDoc(reference, {role: 'admin', decks: 42}));
      await assertFails(deleteDoc(reference));
    }
    await assertFails(getDocs(collection(db, 'users/user_rules_owner/decks')));
    await assertFails(getDocs(collection(db, 'users/user_rules_owner/deckBackups')));
  }, 30000);
});
