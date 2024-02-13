import debounce from "@/library/debounce";
import dayjs from "dayjs";
import React, { useState } from "react";
import { supermemo } from "supermemo";
import Card from "./Card";

function Study({ setMode, selectedDeck }) {
	const [isQuestionShowing, setIsQuestionShowing] = useState(true);
	const [isNoteOpen, setIsNoteOpen] = useState(false);
	const [isHintOpen, setIsHintOpen] = useState(false);
	const [reviewCount, setReviewCount] = useState(selectedDeck.reviews_due);
	const [selectedCard, setSelectedDark] = useState(pickCard());

	function pickCard() {
		// const cards = selectedDeck.cards;
		const cardsLength = selectedDeck.cards.length;

		const randomIndex = Math.floor(Math.random() * (cardsLength - 0) + 0);

		const randomCard = selectedDeck.cards[randomIndex];

		return randomCard;
	}
	console.log("Selected CARD: ", selectedCard);

	function practice(selectedCard, grade) {
		const { interval, repetition, efactor } = supermemo(selectedCard, grade);

		const due_date = dayjs(Date.now()).add(interval, "day").toISOString();

		return { ...selectedCard, interval, repetition, efactor, due_date };
	}

	// Updating cards[] and decks[]
	// Do we update deck[] every time a card is practiced?
	//
	// Worrying about calculating remaining reviews vs. initial reviews
	// 1. use math to calculate based upon how many were reviewed so far +
	// 2. add another property to decks, reviews_due and remaining_reviews
	// !3. add state to study based upon initial selectedDecks review_count, then update selectedDeck as each card is reviewed, and use study's state - 1 for remaining -- can add another state for initial vs. updated?

	// Triggers for updating decks[] correctly after selectedDeck's cards[] is updated
	// add a boolean to page.js and flip it every time practice occurs
	// !modify existing if statement to check if deck.reviews_due !== selectDeck.reviews_due -- this will give extra ability for it to update correctly -- requires that the practice() function correctly decrements selectedDeck.reviews_due -1

	return (
		<section
			className={`flex flex-col gap-4 flex-grow bg-slate-600 p-4 overflow-y-auto`}
		>
			<Card
				isHintOpen={isHintOpen}
				setIsHintOpen={setIsHintOpen}
				isQuestionShowing={isQuestionShowing}
				setIsQuestionShowing={setIsQuestionShowing}
			/>
			{/* Answers */}
			<div className="flex justify-between items-center">
				<button className="basis-1/3 bg-red-400">Hard</button>
				<button className="basis-1/3 bg-yellow-400">Medium</button>
				<button className="basis-1/3 bg-green-400">Easy</button>
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
						defaultValue=""
						rows={2}
						cols={40}
					/>
				) : null}
			</div>
		</section>
	);
}

export default Study;
