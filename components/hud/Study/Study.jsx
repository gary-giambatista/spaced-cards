import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { supermemo } from "supermemo";
import Card from "./Card";
import No_More_Reviews_Due from "./No_More_Reviews_Due";

function Study({ setMode, selectedDeck, setSelectedDeck }) {
	const [isQuestionShowing, setIsQuestionShowing] = useState(true);
	const [isNoteOpen, setIsNoteOpen] = useState(false);
	const [isHintOpen, setIsHintOpen] = useState(false);
	const [reviewCount, setReviewCount] = useState(selectedDeck.reviews_due);
	const [selectedCard, setSelectedCard] = useState(pickCard());
	const [noCardsToReview, setNoCardsToReview] = useState(false);

	// Todo: selecting cards is not selecting ONLY cards with the review due
	// Todo: after reviewing the last card, the card won't finish and nothing handles no cards

	// Trace
	//1. selectedDeck changes
	//2. page.js useEffect()->updateReviewsDue() -- updates reviews_due & card.review_due
	//3. page.js useEffect()->updateDecks() -- updates selectedDeck

	/**
	 * Does NOT handle validating if the review is DUE
	 * return statement below renders different component if so
	 * @returns {object} a single card object
	 */
	function pickCard() {
		const cardsLength = selectedDeck.cards.length;

		// Max number returned is always 1 below cardsLength (0 indexed)
		const randomIndex = Math.floor(Math.random() * (cardsLength - 0) + 0);

		const randomCard = selectedDeck.cards[randomIndex];

		return randomCard;
	}
	// useEffect(() => {
	// 	setSelectedCard(pickCard());
	// }, []);

	console.log("Selected CARD: ", selectedCard);
	console.log("Selected DECK: ", selectedDeck);

	function practice(selectedCard, grade) {
		const { interval, repetition, efactor } = supermemo(selectedCard, grade);

		const due_date = dayjs(Date.now()).add(interval, "day").valueOf();

		const updatedCard = {
			...selectedCard,
			interval,
			repetition,
			efactor,
			due_date,
		};

		// setSelectedCard(updatedCard);

		//FLOW
		// 1. update selectedDeck -> page.js useEffect to update decks
		// 2. IF reviews are different -> call updateReviewsDue()

		setSelectedDeck((prevSelectedDeck) => {
			// Moved this update to page.js to make updateReviews() more consistent
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
				reviews_due: decreasedReviewsDue, //2.triggers page.js useEffect
				cards: updatedCards,
			};
		});

		return setSelectedCard(pickCard());
	}

	if (selectedDeck.reviews_due === 0) {
		return (
			<section
				className={`flex flex-col gap-4 flex-grow bg-slate-600 p-4 overflow-y-auto`}
			>
				<No_More_Reviews_Due />
			</section>
		);
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
