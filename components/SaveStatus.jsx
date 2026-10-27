'use client';
import { useEffect, useState } from 'react';
import { storageKey } from '@/library/deck-sync';
import { validateDecks } from '@/library/deck-validation';
export default function SaveStatus({storage, userId}) {
  const [importable, setImportable] = useState([]);
  const [message, setMessage] = useState('');
  useEffect(() => {
    setMessage('');
    try {
      // Old storage cannot be attributed to an account. Never upload it automatically.
      const legacy = JSON.parse(localStorage.getItem('decks') || 'null');
      const guest = userId ? JSON.parse(localStorage.getItem(storageKey(null)) || 'null')?.decks : null;
      const candidate = guest?.length ? guest : legacy;
      setImportable(candidate?.length ? validateDecks(candidate) : []);
    } catch { setMessage('Older local decks could not be read; the original storage is unchanged.'); setImportable([]); }
  }, [userId]);
  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(storage.decks, null, 2)], {type: 'application/json'}));
    const link = document.createElement('a'); link.href = url; link.download = 'spaced-cards-backup.json'; link.click(); URL.revokeObjectURL(url);
  }
  function importDecks() {
    if (!window.confirm('Import these local decks into the current account or guest workspace? Existing decks will be kept.')) return;
    const imported = importable.map(deck => ({...deck, id: crypto.randomUUID(), cards: deck.cards.map(card => ({...card, id: crypto.randomUUID()}))}));
    try { storage.setDecks(decks => [...decks, ...imported]); setImportable([]); }
    catch { setMessage('These decks could not be imported. The original local copy is unchanged.'); }
  }
  return <section className="px-4 py-2 bg-neutral-100 dark:bg-neutral-900 text-sm" aria-label="Save status">
    <span role="status">{storage.status}</span>
    {storage.error && <p role="alert">{storage.error}</p>}
    {message && <p role="alert">{message}</p>}
    {storage.ready && <button className="underline ml-4" onClick={download}>Export backup</button>}
    {userId && storage.error && !storage.conflict && <button className="underline ml-4" onClick={storage.retry}>Retry cloud save</button>}
    {userId && storage.conflict && <button className="underline ml-4" onClick={() => {if (window.confirm('Keep a local backup and replace this view with the cloud copy?')) storage.useCloud();}}>Load cloud copy</button>}
    {!!importable.length && storage.ready && <button className="underline ml-4" onClick={importDecks}>Import {importable.length} local decks</button>}
  </section>;
}
