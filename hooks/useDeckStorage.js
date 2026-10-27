'use client';
import { useEffect, useRef, useState } from 'react';
import { DeckSync, storageKey } from '@/library/deck-sync';
import { loadCloudDecks, saveCloudDecks } from '@/library/database_functions';
export default function useDeckStorage(userId, isLoaded) {
  const ref = useRef(null);
  const [snapshot, setSnapshot] = useState(null);
  const key = storageKey(userId);
  useEffect(() => {
    if (!isLoaded) return;
    const sync = new DeckSync({userId, storage: localStorage, load: () => loadCloudDecks(userId), save: (decks, version) => saveCloudDecks(decks, version, userId), changed: state => setSnapshot({...state, key})});
    ref.current = sync;
    sync.start();
    const changed = event => { if (event.key === key) sync.externalChange(); };
    window.addEventListener('storage', changed);
    return () => { sync.close(); window.removeEventListener('storage', changed); };
  }, [userId, isLoaded, key]);
  const active = isLoaded && snapshot?.key === key;
  const run = fn => { if (active && ref.current?.key === key) return fn(ref.current); };
  return { ...(active ? snapshot : {decks: [], status: 'Loading', ready: false}),
    setDecks: update => run(sync => sync.edit(update)),
    retry: () => run(sync => sync.retry()),
    useCloud: () => run(sync => sync.useCloud()),
  };
}
