import { validateDecks } from '@/library/deck-validation';
const version = snapshot => snapshot.exists ? `${snapshot.updateTime.seconds}:${snapshot.updateTime.nanoseconds}` : null;
export function userPath(userId) {
  if (!/^user_[A-Za-z0-9]+$/.test(userId)) throw new Error('Invalid authenticated user');
  return `users/${userId}/decks/deck1`;
}
function read(snapshot) {
  return {decks: snapshot.exists ? validateDecks(JSON.parse(snapshot.data().decks)) : [], version: version(snapshot)};
}
export async function readDecks(db, userId) {
  return read(await db.doc(userPath(userId)).get());
}
export async function writeDecks(db, userId, decks, expectedVersion) {
  validateDecks(decks);
  const ref = db.doc(userPath(userId));
  // A persistent pre-migration backup is created atomically before the first overwrite.
  const backup = db.doc(`users/${userId}/deckBackups/before-server-persistence-v1`);
  await db.runTransaction(async tx => {
    const snapshot = await tx.get(ref);
    if (version(snapshot) !== expectedVersion) {
      const error = new Error('Cloud decks changed. Reload cloud data before saving again.');
      error.status = 409;
      throw error;
    }
    const savedBackup = await tx.get(backup);
    if (snapshot.exists && !savedBackup.exists) tx.create(backup, {...snapshot.data(), originalVersion: version(snapshot)});
    tx.set(ref, {decks: JSON.stringify(decks), schemaVersion: 1});
  });
  // The client re-reads after saves. If another writer won meanwhile, it detects the different content.
  return readDecks(db, userId);
}
