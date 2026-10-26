import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Home from '@/app/page';
jest.mock('@clerk/nextjs', () => ({useAuth: () => ({isLoaded: true, userId: null})}));
jest.mock('@tanstack/react-query', () => ({useQuery: () => ({isFetching: false})}));
jest.mock('@/library/database_functions', () => ({fetchDecks: jest.fn(), setDecksInDB: jest.fn()}));
jest.mock('@/components/hud/Deck_Selector/Deck_Selector', () => function Decks({decks, setDecks, setSelectedDeck}) { return <><output data-testid="decks">{JSON.stringify(decks)}</output><button onClick={() => {const deck = {id: 99, name: 'Empty', cards: [], last_modified: Date.now(), reviews_due: 0};setDecks([...decks, deck]);setSelectedDeck(deck);}}>New test deck</button></>; });
jest.mock('@/components/hud/Overview/Overview', () => () => null);
const now = Date.UTC(2026, 0, 12, 12);
const deck = {id: 1, name: 'Test', last_modified: now - 1000, last_reviewed: null, reviews_due: 1, cards: [{id: 1, question: 'Q', answer: 'A', note: '', interval: 0, repetition: 0, efactor: 2.5, due_date: now, review_due: true}]};
beforeEach(() => { localStorage.clear(); jest.useFakeTimers(); jest.setSystemTime(now); for(const method of ['log','group','groupEnd']) jest.spyOn(console, method).mockImplementation(() => {}); });
afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });
test('real page + study review persists and is not offered again after reload', () => {
  localStorage.setItem('decks', JSON.stringify([deck]));
  const view = render(<Home/>);
  fireEvent.click(screen.getByText('Study'));
  fireEvent.click(screen.getByText('Flip'));
  fireEvent.click(screen.getByText('Easy'));
  const saved = JSON.parse(localStorage.getItem('decks'));
  expect(saved[0].cards[0]).toMatchObject({repetition: 1, interval: 1, last_answer: 5, review_due: false});
  expect(saved[0].reviews_due).toBe(0);
  view.unmount();
  render(<Home/>);
  expect(screen.getByText('Study')).toBeDisabled();
  act(() => {jest.setSystemTime(now + 86400000); jest.advanceTimersByTime(1000);});
  expect(screen.getByText('Study')).toBeEnabled();
});
test('a newly created empty deck survives reload', () => {
  localStorage.setItem('decks', '[]');
  const view = render(<Home/>);
  fireEvent.click(screen.getByText('New test deck'));
  expect(JSON.parse(localStorage.getItem('decks'))[0].name).toBe('Empty');
  view.unmount();render(<Home/>);
  expect(JSON.parse(screen.getByTestId('decks').textContent)[0].name).toBe('Empty');
});
test('two reviews with the same timestamp both persist', () => {
  const second = {...deck.cards[0], id: 2, question: 'Q2'};
  localStorage.setItem('decks', JSON.stringify([{...deck, cards: [...deck.cards, second], reviews_due: 2}]));
  render(<Home/>);
  fireEvent.click(screen.getByText('Study'));
  for (let i = 0; i < 2; i++) {
    fireEvent.click(screen.getByText('Flip'));
    fireEvent.click(screen.getByText('Easy'));
  }
  expect(JSON.parse(localStorage.getItem('decks'))[0].cards.every(c => c.repetition === 1)).toBe(true);
});
