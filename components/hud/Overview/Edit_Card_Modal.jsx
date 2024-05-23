import React, { useMemo, useState } from "react";

function Edit_Card_Modal({
	selectedDeck,
	setSelectedDeck,
	selectedCard,
	setSelectedCard,
}) {
	const [isDeleting, setIsDeleting] = useState(false);

	function editCard(e) {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);
		const formJson = Object.fromEntries(formData.entries());

		// Create a copy of the card and update it
		const editedCard = selectedCard;
		editedCard.question = formJson.question_input;
		editedCard.answer = formJson.answer_input;
		editedCard.hinter = formJson.hint_input;
		editedCard.note = formJson.notes_input;

		// Update selectedDeck with the edited card
		setSelectedDeck((prevSelectedDeck) => {
			const updatedCards = prevSelectedDeck.cards.map((card) => {
				if (card.id === selectedCard.id) {
					// If the card id matches, update the card
					return editedCard;
				}
				return card; // Otherwise, return the card unchanged
			});
			return {
				...prevSelectedDeck,
				cards: updatedCards,
			};
		});

		// Clear selectedCard to close the editing modal
		return setSelectedCard(null);
	}

	/**
	 * Deletes the user's selected card and updates the selectedDeck
	 * @param {Event} e - event from clicking the "Delete" button
	 * @returns {object & null} a study deck object & null
	 */
	function deleteCard(e) {
		e.preventDefault();

		// Update selectedDeck with the edited card
		setSelectedDeck((prevSelectedDeck) => {
			// Find the index of the selectedCard by using the card's Id
			const indexToRemove = prevSelectedDeck.cards.findIndex(
				(card) => card.id === selectedCard.id
			);

			/**@type {object[]} Create a new array with the selected card spliced out */
			const updatedCards = prevSelectedDeck.cards.toSpliced(indexToRemove, 1);

			// Return the previous state and ONLY update cards
			return {
				...prevSelectedDeck,
				cards: updatedCards,
			};
		});

		// Clear state to hide delete confirmation prompt
		setIsDeleting(false);
		// Clear selectedCard to close the editing modal
		return setSelectedCard(null);
	}

	return (
		<div className="@container absolute h-full w-full left-0 top-0 bg-black bg-opacity-10 flex items-start justify-center @lg:items-center backdrop-blur-sm p-2 z-10">
			<div className="bg-neutral-300 dark:bg-neutral-800 border border-white relative rounded-md">
				<div className="w-full flex justify-between p-4 @lg:p-6">
					<h2 className="text-xl text-center font-extrabold">Edit your card</h2>
					<button className="" onClick={() => setSelectedCard(null)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6 "
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18 18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<form
					className="w-full h-full flex flex-col gap-4 p-4 @lg:p-6 pt-0 @lg:pt-0"
					method="post"
					onSubmit={editCard}
				>
					<label className="flex flex-col font-extrabold">
						Question:{" "}
						<input
							className="w-full p-2 rounded-md font-normal"
							name="question_input"
							placeholder="Your question here"
							defaultValue={selectedCard.question}
						/>
					</label>
					<label className="flex flex-col font-extrabold">
						Answer:{" "}
						<input
							className="w-full p-2 rounded-md font-normal"
							name="answer_input"
							placeholder="Your answer here"
							defaultValue={selectedCard.answer}
						/>
					</label>
					<label className="flex flex-col font-extrabold">
						Hint:{" "}
						<input
							className="w-full p-2 rounded-md font-normal"
							name="hint_input"
							placeholder="Your hint here"
							defaultValue={selectedCard.hint}
						/>
					</label>
					<label className="flex flex-col font-extrabold">
						Notes:{" "}
						<textarea
							type="textarea"
							className="w-full p-2 rounded-md resize-none font-normal"
							name="notes_input"
							placeholder="Your notes here"
							defaultValue={selectedCard.note}
							rows={2}
							cols={40}
						/>
					</label>
					<hr />
					{/* Show/Hide Delete Confirmation Prompt */}
					{isDeleting ? (
						<div className="flex flex-col items-center justify-center gap-2 font-extrabold">
							<h3 className="">Are you sure?</h3>
							<div className="flex w-full justify-evenly items-center">
								<button
									onClick={() => setIsDeleting(false)}
									className="bg-green-800 hover:bg-green-900 text-white py-3 px-5 rounded-md"
								>
									Cancel
								</button>
								<button
									onClick={(e) => deleteCard(e)}
									className="bg-red-600 text-white py-3 px-5 rounded-md"
								>
									Delete
								</button>
							</div>
						</div>
					) : (
						<div className="flex justify-evenly items-center font-extrabold">
							<button
								className="bg-red-600 text-white py-3 px-5 rounded-md"
								onClick={() => setIsDeleting(true)}
							>
								Delete
							</button>
							<button
								className="bg-green-800 hover:bg-green-900 text-white py-3 px-5 rounded-md"
								type="submit"
							>
								Save
							</button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}

export default Edit_Card_Modal;
