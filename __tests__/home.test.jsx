import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
jest.mock('@clerk/nextjs', () => ({useAuth: () => ({isLoaded: true, userId: null})}));
jest.mock('@tanstack/react-query', () => ({useQuery: () => ({isFetching: false})}));
jest.mock('@/library/database_functions', () => ({fetchDecks: jest.fn(), setDecksInDB: jest.fn()}));
jest.mock('@/components/hud/Deck_Selector/Deck_Selector', () => function Decks({decks}) { return <output data-testid="decks">{JSON.stringify(decks)}</output>; });
jest.mock('@/components/hud/Hud_Header', () => () => null);
jest.mock('@/components/hud/Overview/Overview', () => () => null);
jest.mock('@/components/hud/Study/Study', () => () => null);
function writeLocal(decks) { localStorage.setItem('spaced-cards:v1:guest', JSON.stringify({decks, version: null, dirty: false})); }
const now = Date.UTC(2026, 9, 26, 12);
beforeEach(() => { localStorage.clear(); jest.spyOn(Date, 'now').mockReturnValue(now); jest.spyOn(console, 'log').mockImplementation(() => {}); jest.spyOn(console, 'group').mockImplementation(() => {}); jest.spyOn(console, 'groupEnd').mockImplementation(() => {}); });
afterEach(() => jest.restoreAllMocks());
test('reload recomputes all decks, including after an empty deck and at the exact due time', () => {
  writeLocal([
    {id: 1, name: 'Empty', cards: [], reviews_due: 0},
    {id: 2, name: 'Due', cards: [{id: 2, question: 'Q', answer: 'A', interval: 0, repetition: 0, efactor: 2.5, due_date: now, review_due: false}], reviews_due: 0},
    {id: 3, name: 'Future', cards: [{id: 3, question: 'Q', answer: 'A', interval: 0, repetition: 0, efactor: 2.5, due_date: now + 1000, review_due: true}], reviews_due: 1},
  ]);
  render(<Home/>);
  const decks = JSON.parse(screen.getByTestId('decks').textContent);
  expect(decks.find(d => d.id === 2).reviews_due).toBe(1);
  expect(decks.find(d => d.id === 3).cards[0].review_due).toBe(false);
});
