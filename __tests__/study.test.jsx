import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Study from '@/components/hud/Study/Study';
const now = Date.UTC(2026, 9, 26, 12);
const card = (id, extra = {}) => ({id, question: `Question ${id}`, answer: `Answer ${id}`, hint: '', note: '', interval: 0, repetition: 0, efactor: 2.5, due_date: now - id, review_due: true, ...extra});
function Harness({cards}) {
  const [deck, setDeck] = useState({id: 1, cards, reviews_due: cards.length});
  return <><Study selectedDeck={deck} setSelectedDeck={setDeck}/><output data-testid="deck">{JSON.stringify(deck)}</output></>;
}
beforeEach(() => { jest.spyOn(Date, 'now').mockReturnValue(now); jest.spyOn(console, 'log').mockImplementation(() => {}); });
afterEach(() => jest.restoreAllMocks());
test('reviewing the oldest card advances to the next due card and resets the answer', () => {
  render(<Harness cards={[card(1), card(2)]}/>);
  expect(screen.getByText('Question 2')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Flip'));
  fireEvent.click(screen.getByText('Easy'));
  expect(screen.getByText('Question 1')).toBeInTheDocument();
  const saved = JSON.parse(screen.getByTestId('deck').textContent);
  expect(saved.cards[1].review_due).toBe(false);
  expect(saved.cards[1].repetition).toBe(1);
  expect(saved.cards[1].due_date).toBeGreaterThan(now);
  expect(saved.reviews_due).toBe(1);
});
test('future cards are not shown even if their cached due flag is stale', () => {
  render(<Harness cards={[card(1, {due_date: now + 86400000})]}/>);
  expect(screen.queryByText('Question 1')).not.toBeInTheDocument();
});
test('ratings require revealing the answer and Hard counts as successful recall', () => {
  render(<Harness cards={[card(1, {repetition: 2, interval: 6})]}/>);
  expect(screen.getByText('Hard')).toBeDisabled();
  fireEvent.click(screen.getByText('Flip'));
  fireEvent.click(screen.getByText('Hard'));
  const saved = JSON.parse(screen.getByTestId('deck').textContent);
  expect(saved.cards[0].last_answer).toBe(3);
  expect(saved.cards[0].repetition).toBe(3);
  expect(saved.reviews_due).toBe(0);
});
