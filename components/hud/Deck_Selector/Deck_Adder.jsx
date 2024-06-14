import React, { useMemo, useRef, useState } from "react";

/**
 * @typedef {import('@/typedefs.js').deck} deck
 */

function Deck_Adder({ drawerOpen, setSelectedDeck, decks, setDecks }) {
	const [isAddingDeck, setIsAddingDeck] = useState(false);
	const [newDeckName, setNewDeckName] = useState("");

	const randomNumber = useMemo(() => {
		return Math.floor(Math.random() * (100000 - 1) + 1);
	}, [isAddingDeck]);

	const lastModified = useMemo(() => {
		return Date.now();
	}, [isAddingDeck]);

	const newDeck = {
		name: newDeckName,
		id: randomNumber,
		last_modified: lastModified,
		// is_shared: false,
		// author: userName ? userName : "anonymous",
		reviews_due: 0,
		cards: [],
	};

	//Todo: Optimize newDeck with Map?
	function createDeck() {
		console.log("deck created!");

		// Reset component state
		setIsAddingDeck(false);
		setNewDeckName("");

		// Update decks
		if (decks) {
			// Set the new deck as the last index
			const updatedDeck = [...decks, newDeck];

			// Update state in page.js re-rendering everything
			// Sort updatedDecks so that the MOST reviews come first
			setDecks(updatedDeck.sort((a, b) => b.reviews_due - a.reviews_due));

			// Set selectedDeck to the last index (newest)
			// Potential bug? with multiple decks at reviews_due: 0;
			setSelectedDeck(updatedDeck[updatedDeck.length - 1]);
		} else {
			// Update state in page.js re-rendering everything
			setDecks([newDeck]);
			setSelectedDeck(newDeck);
		}
	}

	const inputRef = useRef(null);

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			// Trigger button click
			inputRef.current.nextElementSibling.click();
		}
	};

	return (
		<div
			className={`flex items-center py-2 gap-2 overflow-hidden mx-2 ${
				drawerOpen ? "opacity-100" : "opacity-0"
			}`}
		>
			{/* Show Text with Create button or Input */}
			{isAddingDeck ? (
				<>
					<input
						className="w-full p-2 rounded-md ml-1"
						ref={inputRef}
						onKeyUp={handleKeyPress}
						name="deck_name"
						placeholder="Your deck name"
						value={newDeckName}
						onChange={(e) => setNewDeckName(e.target.value)}
					/>
					{/* Show Cancel or Create button Ternary*/}
					{newDeckName ? (
						<button onClick={() => createDeck()}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								className="w-7 h-7 bg-white dark:bg-green-800 rounded-md dark:stroke-white dark:border-green-800 stroke-green-500 border border-green-500"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 4.5v15m7.5-7.5h-15"
								/>
							</svg>
						</button>
					) : (
						<button onClick={() => setIsAddingDeck((prevState) => !prevState)}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								className="w-7 h-7 bg-white dark:bg-red-600 rounded-md stroke-red-600 border border-red-600  dark:stroke-white "
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18 18 6M6 6l12 12"
								/>
							</svg>
						</button>
					)}
				</>
			) : (
				// Show When not adding a deck
				<>
					<div
						aria-description="Click to create a new deck"
						onClick={() => {
							setIsAddingDeck((prevState) => !prevState);
							setTimeout(() => {
								inputRef.current.focus();
							}, 0);
						}}
						className="flex items-center group w-full line-clamp-1 leading-10 text-lg hover:cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-900 rounded-xl "
					>
						<div className="flex-grow mx-2">Create Deck</div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="w-7 h-7 bg-neutral-100 dark:bg-transparent rounded-md fill-black dark:fill-white mr-2 group-hover:scale-105"
						>
							<path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
							<path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
						</svg>
					</div>
				</>
			)}
		</div>
	);
}

export default Deck_Adder;

const testObject = {
	id: 1,
	obj2: {
		id: 2,
		obj3: {
			id: 3,
		},
	},
};
