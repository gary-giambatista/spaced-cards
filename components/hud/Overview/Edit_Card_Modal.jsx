import React, { useMemo } from "react";

function Edit_Card_Modal({
	selectedDeck,
	setSelectedDeck,
	selectedCard,
	setSelectedCard,
}) {
	// TODO: find the cause of the un-clickable (uneditable) cards after clicking create a card -- state isn't updating so no re-renders are occurring
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

		// Clear selectedCard to close the editing modal
		return setSelectedCard(null);
	}

	return (
		<div className="@container absolute h-full w-full left-0 top-0 bg-black bg-opacity-10 flex items-start justify-center  @lg:items-center backdrop-blur-sm p-2">
			<div className="bg-green-700 relative rounded-md">
				<div className="w-full flex justify-between p-4 @lg:p-6">
					<h2 className="text-xl text-center">Edit your card</h2>
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
					<label className="flex flex-col">
						Question:{" "}
						<input
							className="w-full p-2 rounded-md text-black"
							name="question_input"
							placeholder="Your question here"
							defaultValue={selectedCard.question}
						/>
					</label>
					<label className="flex flex-col">
						Answer:{" "}
						<input
							className="w-full p-2 rounded-md text-black"
							name="answer_input"
							placeholder="Your answer here"
							defaultValue={selectedCard.answer}
						/>
					</label>
					<label className="flex flex-col">
						Hint:{" "}
						<input
							className="w-full p-2 rounded-md text-black"
							name="hint_input"
							placeholder="Your hint here"
							defaultValue={selectedCard.hint}
						/>
					</label>
					<label className="flex flex-col">
						Notes:{" "}
						<textarea
							type="textarea"
							className="w-full p-2 rounded-md text-black resize-none"
							name="notes_input"
							placeholder="Your notes here"
							defaultValue={selectedCard.note}
							rows={2}
							cols={40}
						/>
					</label>
					<hr />
					<div className="flex justify-evenly items-center">
						<button
							className="bg-red-400 py-3 px-5 rounded-md"
							onClick={(e) => deleteCard(e)}
						>
							Delete
						</button>
						<button className="bg-green-400 py-3 px-5 rounded-md" type="submit">
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Edit_Card_Modal;
