import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { supermemo } from "supermemo";
import Card from "./Card";

function Study({ setMode, selectedDeck, setSelectedDeck }) {
	const [isQuestionShowing, setIsQuestionShowing] = useState(true);
	const [isNoteOpen, setIsNoteOpen] = useState(false);
	const [isHintOpen, setIsHintOpen] = useState(false);
	const [reviewCount, setReviewCount] = useState(selectedDeck.reviews_due);
	const [selectedCard, setSelectedCard] = useState(pickCard());

	//TODO:
	// 1. Check to make sure the time check is in the same format
	// 2. Move this function to page.js?

	//TODO: Move this function to page.js
	// Update selectedDecks review_due based upon due_date
	function updateReviews() {
		for (let card of selectedDeck.cards) {
			if (card.due_date < Date.now()) {
				card.review_due = true;
			}
		}
	}
	// Handle selectedDeck changing
	useEffect(() => {
		updateReviews();
	}, [selectedDeck]);

	function pickCard() {
		const cardsLength = selectedDeck.cards.length;

		// Max number returned is always 1 below cardsLength (0 indexed)
		const randomIndex = Math.floor(Math.random() * (cardsLength - 0) + 0);

		const randomCard = selectedDeck.cards[randomIndex];

		return randomCard;

		//Todo: handle the logic of reviewing the correct cards - Date.now?
		// Not necessary as updateReviews handles this

		// Pick a card only if the review is due
		// if (randomCard.due_date < Date.now()) {
		// 	randomCard.review_due = true;
		// 	return randomCard;
		// } else {
		// 	// Pick again if review isn't due
		// 	randomCard = Math.floor(Math.random() * (cardsLength - 0) + 0);
		// }
	}

	console.log("Selected CARD: ", selectedCard);
	console.log("Selected DECK: ", selectedDeck);

	function practice(selectedCard, grade) {
		const { interval, repetition, efactor } = supermemo(selectedCard, grade);

		const due_date = dayjs(Date.now()).add(interval, "day").toISOString();

		const updatedCard = {
			...selectedCard,
			interval,
			repetition,
			efactor,
			due_date,
		};

		setSelectedCard(updatedCard);
		// setSelectedCard(pickCard());

		return setSelectedDeck((prevSelectedDeck) => {
			const decreasedReviewsDue = prevSelectedDeck.reviews_due - 1;
			const updatedCards = prevSelectedDeck.cards.map((card) => {
				if (card.id === selectedCard.id) {
					// If the card id matches, update the card
					return updatedCard;
				}
				return card; // Otherwise, return the card unchanged
			});
			return {
				...prevSelectedDeck,
				reviews_due: decreasedReviewsDue,
				cards: updatedCards,
			};
		});
		//todo: update selected card, determine which card has just been reviewed and
		//prevent it from being re-selected
	}

	return (
		<section
			className={`flex flex-col gap-4 flex-grow bg-slate-600 p-4 overflow-y-auto`}
		>
			<Card
				isHintOpen={isHintOpen}
				setIsHintOpen={setIsHintOpen}
				isQuestionShowing={isQuestionShowing}
				setIsQuestionShowing={setIsQuestionShowing}
				selectedCard={selectedCard}
			/>
			{/* Answers */}
			<div className="flex justify-between items-center">
				<button
					onClick={() => practice(selectedCard, 1)}
					className="basis-1/3 bg-red-400 p-2"
				>
					Hard
				</button>
				<button
					onClick={() => practice(selectedCard, 3)}
					className="basis-1/3 bg-yellow-400 p-2"
				>
					Medium
				</button>
				<button
					onClick={() => practice(selectedCard, 5)}
					className="basis-1/3 bg-green-400 p-2"
				>
					Easy
				</button>
			</div>

			{/* Notes */}
			<div className="flex flex-col gap-1 justify-center items-center bg-slate-500">
				<div
					onClick={() => setIsNoteOpen((prevState) => !prevState)}
					className="flex w-full gap-1 justify-center items-center"
				>
					<div>Notes</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className={`w-5 h-5 transition-transform ${
							isNoteOpen ? "rotate-180" : "rotate-0"
						}`}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m19.5 8.25-7.5 7.5-7.5-7.5"
						/>
					</svg>
				</div>
				{isNoteOpen ? (
					<textarea
						type="textarea"
						className="w-full p-2 rounded-md text-black resize-none"
						name="notes_input"
						placeholder="Your notes here"
						defaultValue={selectedCard.note}
						rows={2}
						cols={40}
					/>
				) : null}
			</div>
		</section>
	);
}

export default Study;

//Todo: style card component
//Todo: create a function for updating notes
//Todo: add function to switch selectedCard => pickCard()
