export const MAX_DECK_BYTES = 700000;
const plain = value => value && typeof value === 'object' && !Array.isArray(value);
const id = value => (typeof value === 'string' && value.length > 0 && value.length <= 128) || Number.isSafeInteger(value);
const finite = value => Number.isFinite(value) && value >= 0;
export function validateDecks(decks) {
  if (!Array.isArray(decks) || decks.length > 500) throw new Error('Invalid deck list');
  const ids = new Set();
  for (const deck of decks) {
    if (!plain(deck) || !id(deck.id) || ids.has(String(deck.id)) || typeof deck.name !== 'string' || deck.name.length > 500 || !Array.isArray(deck.cards) || deck.cards.length > 10000) throw new Error('Invalid deck');
    ids.add(String(deck.id));
    const cards = new Set();
    for (const card of deck.cards) {
      if (!plain(card) || !id(card.id) || cards.has(String(card.id))) throw new Error('Invalid card ID');
      cards.add(String(card.id));
      for (const field of ['question', 'answer']) if (typeof card[field] !== 'string' || card[field].length > 20000) throw new Error('Invalid card text');
      for (const field of ['hint', 'note']) if (card[field] != null && (typeof card[field] !== 'string' || card[field].length > 20000)) throw new Error('Invalid card text');
      if (!finite(card.interval) || !Number.isSafeInteger(card.repetition) || card.repetition < 0 || !finite(card.efactor) || card.efactor < 1.3 || !finite(card.due_date) || card.due_date > 8640000000000000) throw new Error('Invalid card schedule');
    }
  }
  return decks;
}
