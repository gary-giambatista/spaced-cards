import React, { useEffect, useState } from "react";
import { nextDueCard, refreshDeck, reviewDeck } from "@/library/srs";
import Card from "./Card";
import No_More_Reviews_Due from "./No_More_Reviews_Due";

/**
 * @typedef {import('@/typedefs.js').card} card
 */

function Study({ setMode, selectedDeck, setSelectedDeck }) {
	const [isQuestionShowing, setIsQuestionShowing] = useState(true);
	const [isNoteOpen, setIsNoteOpen] = useState(false);
	const [isHintOpen, setIsHintOpen] = useState(false);
	const [now, setNow] = useState(Date.now);
	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(timer);
	}, []);
	const currentDeck = refreshDeck(selectedDeck, now);
	const selectedCard = nextDueCard(currentDeck, now);
	const [updatedNote, setUpdatedNote] = useState("");

	function practice(card, grade) {
		if (isQuestionShowing) return;
		const reviewedAt = Date.now();
		setSelectedDeck(deck => reviewDeck(deck, card.id, grade, reviewedAt));
		setNow(reviewedAt);
	}

	useEffect(() => {
		setIsQuestionShowing(true);
		setIsHintOpen(false);
		setIsNoteOpen(false);
	}, [selectedDeck.id, selectedCard?.id]);
	useEffect(() => { setUpdatedNote(selectedCard?.note || ""); }, [selectedCard?.id, selectedCard?.note]);

	function updateNote() {
		const updatedCard = {
			...selectedCard,
			note: updatedNote,
		};

		setSelectedDeck((prevSelectedDeck) => {
			const updatedCards = prevSelectedDeck.cards.map((card) => {
				if (card.id === selectedCard.id) {
					// If the card id matches, update the card
					return updatedCard;
				}
				return card; // Otherwise, return the card unchanged
			});

			return {
				...prevSelectedDeck,
				last_modified: Date.now(), //2.triggers page.js useEffect?
				cards: updatedCards,
			};
		});
	}

	//TODO: Figured out a better way to deal with no selectedCard to avoid FLASH
	if (!selectedCard) {
		return (
			<section
				className={`flex flex-col gap-4 flex-grow bg-white dark:bg-black p-4 overflow-y-auto`}
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
				selectedDeck={currentDeck}
			/>
			{/* Answers */}
			<div className="flex justify-between items-center gap-2">
				<button
					disabled={isQuestionShowing}
					onClick={() => practice(selectedCard, 1)}
					className="basis-1/4 disabled:opacity-50 bg-[#D74848] p-2 rounded-xl"
				>
					Again
				</button>
				<button
					disabled={isQuestionShowing}
					onClick={() => practice(selectedCard, 3)}
					className="basis-1/4 disabled:opacity-50 bg-[#CBD748] p-2 rounded-xl"
				>
					Hard
				</button>
				<button disabled={isQuestionShowing} onClick={() => practice(selectedCard, 4)} className="basis-1/4 bg-sky-500 p-2 rounded-xl disabled:opacity-50">Good</button>
				<button
					disabled={isQuestionShowing}
					onClick={() => practice(selectedCard, 5)}
					className="basis-1/4 disabled:opacity-50 bg-[#5FB55D] p-2 rounded-xl"
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
					<div className="w-full flex gap-2">
						<textarea
							type="textarea"
							className="w-full p-2 rounded-md resize-none"
							name="notes_input"
							placeholder="Your notes here"
							// defaultValue={selectedCard.note}
							rows={2}
							cols={40}
							value={updatedNote}
							onChange={(e) => setUpdatedNote(e.target.value)}
						/>
						{selectedCard.note !== updatedNote ? (
							<button
								onClick={() => updateNote()}
								className="bg-green-800 hover:bg-green-900 text-white py-3 px-5 rounded-md font-extrabold"
							>
								Update
							</button>
						) : null}
					</div>
				) : null}
			</div>
		</section>
	);
}

export default Study;
