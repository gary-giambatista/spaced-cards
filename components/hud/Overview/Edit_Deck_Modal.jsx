import React, { useState } from "react";

function Edit_Deck_Modal({
	selectedDeck,
	setSelectedDeck,
	decks,
	setDecks,
	setIsEditDeckModalOpen,
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	/**
	 * Delete the currently selectedDeck
	 */
	function deleteDeck() {
		setDecks((prevDecks) => {
			// Match selectedDeck in decks and capture that index
			const indexToRemove = prevDecks.findIndex(
				(deck) => deck.id === selectedDeck.id
			);

			// Create a new decks object with the removed deck
			const newDecks = prevDecks.toSpliced(indexToRemove, 1);

			// If there will be no new deck to set as selectedDeck -> null
			if (newDecks.length > 0) {
				setSelectedDeck(newDecks[0]);
			} else {
				setSelectedDeck(null);
			}
			// Close the Edit_Deck_Modal
			setIsEditDeckModalOpen(false);

			return newDecks;
		});
	}

	return (
		<div className="@container absolute h-full w-full left-0 top-0 bg-black bg-opacity-10 flex items-start justify-center  @lg:items-center backdrop-blur-sm p-2">
			<div className="bg-green-700 relative rounded-md min-w-80 min-h-80 md:min-w-96">
				<div className="w-full flex justify-between p-4 @lg:p-6">
					<h2 className="text-xl text-center">Manage Your Deck</h2>
					<button
						className=""
						onClick={() => setIsEditDeckModalOpen((prevState) => !prevState)}
					>
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
				<hr />
				{isDeleting ? (
					<div className="flex justify-between items-center p-4 md:p-6">
						<div className="">Are you sure?</div>
						<button
							onClick={deleteDeck}
							className="bg-red-400 py-2 px-4 md:px-5 rounded-md"
						>
							Delete
						</button>
						<button
							onClick={() => setIsDeleting(false)}
							className="bg-slate-700 py-2 px-4 md:px-5 rounded-md"
						>
							Cancel
						</button>
					</div>
				) : (
					<div className="flex justify-between items-center p-4 md:p-6">
						<div className="">Delete your deck</div>
						<button
							onClick={() => setIsDeleting(true)}
							className="bg-red-400 py-2 px-4 rounded-md"
						>
							Delete
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default Edit_Deck_Modal;
