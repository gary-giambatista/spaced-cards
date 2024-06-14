import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { supermemo } from "supermemo";
import Card from "./Card";
import No_More_Reviews_Due from "./No_More_Reviews_Due";

/**
 * @typedef {import('@/typedefs.js').card} card
 */

function Study({ setMode, selectedDeck, setSelectedDeck }) {
	const [isQuestionShowing, setIsQuestionShowing] = useState(true);
	const [isNoteOpen, setIsNoteOpen] = useState(false);
	const [isHintOpen, setIsHintOpen] = useState(false);
	/**
	 * @type {[card, React.Dispatch<React.SetStateAction<card>>]}
	 */
	const [selectedCard, setSelectedCard] = useState(pickCard());

	// Todo: <Card /> ONLY selectedCard is not being updated correctly, calling it before pickCard() filters the updated selectedDeck.cards

	// Trace
	//1. selectedDeck changes
	//2. page.js useEffect()->updateReviewsDue() -- updates reviews_due & card.review_due
	//3. page.js useEffect()->updateDecks() -- updates selectedDeck

	/**
	 * Does NOT handle validating if the review is DUE
	 * return statement below renders different component if no reviews_due
	 * @returns {object} a single card object
	 */
	function pickCard() {
		const dueCards = selectedDeck.cards.filter(
			(card) => card.review_due === true
		);

		const dueCardsLength = dueCards.length;

		// Max number returned is always 1 below cardsLength (0 indexed)
		const randomIndex = Math.floor(Math.random() * (dueCardsLength - 0) + 0);
		// const randomCard = dueCards[randomIndex];
		// return randomCard;

		//1. Pick a card based upon the date, where smallest = first
		//2. Pick a card based upon efactor, where higher = harder
		//3.
		dueCards.sort((a, b) => {
			return b.due_date - a.due_date;
		});
		console.log("Sorted due cards: ", dueCards);

		//First card is the newest, last is oldest
		return dueCards[dueCards.length - 1];
	}
	// useEffect(() => {
	// 	setSelectedCard(() => pickCard());
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
			last_answer: grade,
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

		// return setSelectedCard(pickCard());
	}

	//FIX
	useEffect(() => {
		return setSelectedCard(pickCard());
	}, [selectedDeck]);

	//TODO: Figured out a better way to deal with no selectedCard to avoid FLASH
	if (selectedDeck.reviews_due === 0 || !selectedCard) {
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
			className={`flex flex-col gap-4 flex-grow bg-white dark:bg-black p-4 overflow-y-auto @container sm:w-3/4 sm:mx-auto lg:max-w-screen-sm`}
		>
			<Card
				isHintOpen={isHintOpen}
				setIsHintOpen={setIsHintOpen}
				isQuestionShowing={isQuestionShowing}
				setIsQuestionShowing={setIsQuestionShowing}
				selectedCard={selectedCard}
				selectedDeck={selectedDeck}
			/>
			{/* Answers */}
			<div className="flex justify-between items-center gap-2">
				<button
					onClick={() => practice(selectedCard, 1)}
					className="basis-1/3 bg-[#D74848] p-2 rounded-xl"
				>
					Hard
				</button>
				<button
					onClick={() => practice(selectedCard, 3)}
					className="basis-1/3 bg-[#CBD748] p-2 rounded-xl"
				>
					Medium
				</button>
				<button
					onClick={() => practice(selectedCard, 5)}
					className="basis-1/3 bg-[#5FB55D] p-2 rounded-xl"
				>
					Easy
				</button>
			</div>

			{/* Notes */}
			<div className="flex flex-col gap-1 justify-center items-center">
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
						className="w-full p-2 rounded-md resize-none"
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
