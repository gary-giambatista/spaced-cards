import {fireEvent, render, screen} from '@testing-library/react';
import EditCard from '@/components/hud/Overview/Edit_Card_Modal';
test('editing saves hints without mutating the original card or its schedule', () => {
  const card = Object.freeze({id: 1, question: 'Q', answer: 'A', hint: 'old', note: '', interval: 6, repetition: 2, efactor: 2.5, due_date: 123456});
  const deck = {id: 1, cards: [card]};
  const save = jest.fn();
  render(<EditCard selectedDeck={deck} selectedCard={card} setSelectedDeck={save} setSelectedCard={jest.fn()} />);
  fireEvent.change(screen.getByLabelText('Hint:'), {target: {value: 'new hint'}});
  fireEvent.click(screen.getByRole('button', {name: 'Save'}));
  const updated = save.mock.calls[0][0](deck);
  expect(card.hint).toBe('old');
  expect(updated.cards[0]).toEqual({...card, hint: 'new hint'});
  expect(updated.cards[0]).not.toBe(card);
});
