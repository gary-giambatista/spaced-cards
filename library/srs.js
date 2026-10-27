import dayjs from 'dayjs';
import { supermemo } from 'supermemo';

// Stored dates are authoritative; review_due/reviews_due are derived UI caches.
export function isDue(card, now = Date.now()) {
  return Number.isFinite(card.due_date) && card.due_date <= now;
}
export function refreshDeck(deck, now = Date.now()) {
  const cards = deck.cards.map(card => ({...card, review_due: isDue(card, now)}));
  return {...deck, cards, reviews_due: cards.filter(card => card.review_due).length};
}
export function refreshDecks(decks, now = Date.now()) {
  return (decks || []).map(deck => refreshDeck(deck, now))
    .sort((a, b) => b.reviews_due - a.reviews_due);
}
export function nextDueCard(deck, now = Date.now()) {
  return deck.cards.filter(card => isDue(card, now))
    .sort((a, b) => a.due_date - b.due_date)[0];
}
export function reviewCard(card, grade, now = Date.now()) {
  if (!Number.isInteger(grade) || grade < 0 || grade > 5) throw new RangeError('Grade must be an integer from 0 to 5');
  const schedule = supermemo(card, grade);
  return {...card, ...schedule, due_date: dayjs(now).add(schedule.interval, 'day').valueOf(),
    review_due: false, last_answer: grade, last_practiced: now};
}
export function reviewDeck(deck, cardId, grade, now = Date.now()) {
  const card = deck.cards.find(card => card.id === cardId);
  // Protect against double clicks and stale events after advancing the queue.
  if (!card || !isDue(card, now)) return deck;
  return refreshDeck({...deck, last_reviewed: now,
    cards: deck.cards.map(card => card.id === cardId ? reviewCard(card, grade, now) : card)}, now);
}
