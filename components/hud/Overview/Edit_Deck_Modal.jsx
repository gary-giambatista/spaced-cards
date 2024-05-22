import React, { useRef, useState } from "react";

function Edit_Deck_Modal({
	selectedDeck,
	setSelectedDeck,
	decks,
	setDecks,
	setIsEditDeckModalOpen,
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEditingName, setIsEditingName] = useState(false);
	const newDeckName = useRef("");

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
	/**
	 * Update the name of the selectedDeck
	 */
	function editDeckName() {
		setDecks((prevDecks) => {
			// Only update the name of the selectedDeck
			const updatedDeck = prevDecks.map((deck) => {
				if (deck.id === selectedDeck.id) {
					deck.name = newDeckName.current.value;
					return deck;
				} else return deck;
			});
			return updatedDeck;
		});
		return setIsEditingName(false);
	}

	return (
		<div
			onClick={() => setIsEditDeckModalOpen((prevState) => !prevState)}
			className="@container absolute h-full w-full left-0 top-0 bg-black bg-opacity-10 flex items-start justify-center  @lg:items-center backdrop-blur-sm p-2"
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="bg-neutral-300 dark:bg-neutral-800 border border-white relative rounded-md min-w-80 min-h-80 md:min-w-96"
			>
				<div className="w-full flex justify-between p-4 @md:p-6">
					<h2 className="text-xl text-center font-extrabold">
						Manage Your Deck
					</h2>
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

				{isEditingName ? (
					// Change name input section
					<div className="flex flex-col gap-4 justify-between items-center p-4 @md:p-6 font-extrabold">
						<input
							ref={newDeckName}
							defaultValue={selectedDeck.name}
							className="w-full p-2 rounded-md"
						/>
						<div className="flex gap-4">
							<button
								onClick={() => setIsEditingName(false)}
								className="bg-white text-red-600 border border-red-600 dark:bg-red-600 dark:text-white py-2 px-4 md:px-5 rounded-md"
							>
								Cancel
							</button>
							<button
								onClick={() => editDeckName()}
								className="bg-green-800 hover:bg-green-900 text-white py-2 px-4 @md:px-5 rounded-md"
							>
								Save
							</button>
						</div>
					</div>
				) : (
					// Option to edit deck name section
					<div className="flex justify-between items-center p-4 @md:p-6 font-extrabold">
						<div className="w-1/2">{selectedDeck.name}</div>
						<button
							onClick={() => {
								setIsEditingName(true);
								setTimeout(() => {
									newDeckName.current.focus();
								}, 0);
							}}
							className=" bg-white hover:bg-neutral-200 dark:bg-black dark:hover:bg-neutral-900 border border-black dark:border-white py-2 px-4 @md:px-5 rounded-md w-1/2"
						>
							Change Name
						</button>
					</div>
				)}
				{isDeleting ? (
					<div className="flex justify-between items-center p-4 @md:p-6 font-extrabold">
						<div className="">Are you sure?</div>
						<button
							onClick={deleteDeck}
							className="bg-red-600 py-2 px-4 md:px-5 rounded-md text-white"
						>
							Delete
						</button>
						<button
							onClick={() => setIsDeleting(false)}
							className="bg-white hover:bg-neutral-200 dark:bg-black dark:hover:bg-neutral-900 border border-black dark:border-white py-2 px-4 @md:px-5 rounded-md"
						>
							Cancel
						</button>
					</div>
				) : (
					<div className="flex justify-between items-center p-4 @md:p-6 font-extrabold">
						<div className="">Delete your deck</div>
						<button
							onClick={() => setIsDeleting(true)}
							className="bg-red-600 py-2 px-4 rounded-md text-white"
						>
							Delete
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
// bg-white text-red-600 border border-red-600 dark:bg-red-600 py-2 px-4 rounded-md dark:text-white
export default Edit_Deck_Modal;
