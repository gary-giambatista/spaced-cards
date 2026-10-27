import { reviewCard, reviewDeck, refreshDecks, nextDueCard } from '@/library/srs';
const now = Date.UTC(2026, 0, 12, 12);
const day = 86400000;
const fresh = { id: 1, question: 'Q', answer: 'A', interval: 0, repetition: 0, efactor: 2.5, due_date: now, review_due: false };
test('successful reviews produce 1, 6, then 16 day intervals and survive JSON round trips', () => {
  let card = fresh;
  let time = now;
  for (const interval of [1, 6, 16]) {
    card = reviewCard(JSON.parse(JSON.stringify(card)), 5, time);
    expect(card.interval).toBe(interval);
    expect(card.due_date).toBe(time + interval * day);
    expect(card.last_practiced).toBe(time);
    expect(card.review_due).toBe(false);
    time = card.due_date;
  }
  expect(card.repetition).toBe(3);
  expect(card.question).toBe('Q');
});
test('failure resets repetitions; difficult success preserves them', () => {
  const learned = {...fresh, repetition: 4, interval: 30};
  expect(reviewCard(learned, 1, now)).toMatchObject({repetition: 0, interval: 1});
  expect(reviewCard(learned, 3, now)).toMatchObject({repetition: 5, interval: 75});
});
test('ease has a lower bound after repeated failures', () => {
  let card = fresh;
  for (let i = 0; i < 30; i++) card = reviewCard(card, 0, now);
  expect(card.efactor).toBe(1.3);
});
test('due refresh is immutable, clears future flags, handles empty decks and equality', () => {
  const decks = [{id: 1, cards: []}, {id: 2, cards: [fresh, {...fresh, id: 2, due_date: now + day, review_due: true}]}];
  const before = JSON.stringify(decks);
  const result = refreshDecks(decks, now);
  expect(result[0].reviews_due).toBe(1);
  expect(result[0].cards[1].review_due).toBe(false);
  expect(JSON.stringify(decks)).toBe(before);
  expect(nextDueCard(result[0], now).id).toBe(1);
});
test('review changes only the target and rejects a stale duplicate click', () => {
  const deck = {id: 1, cards: [fresh, {...fresh, id: 2}]};
  const next = reviewDeck(deck, 1, 4, now);
  expect(next.reviews_due).toBe(1);
  expect(next.cards[1]).toMatchObject({interval: 0, repetition: 0});
  expect(deck.cards[0].interval).toBe(0);
  expect(reviewDeck(next, 1, 4, now)).toBe(next);
});
test.each([-1, 6, 1.5, NaN])('rejects invalid grade %s', grade => {
  expect(() => reviewCard(fresh, grade, now)).toThrow(RangeError);
});
