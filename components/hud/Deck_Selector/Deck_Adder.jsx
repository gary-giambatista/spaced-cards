import React, { useMemo, useRef, useState } from "react";

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
			className={`flex items-center py-2 gap-2 overflow-hidden px-2 ${
				drawerOpen ? "opacity-100" : "opacity-0"
			}`}
		>
			{/* Show Text with Create button or Input */}
			{isAddingDeck ? (
				<>
					<input
						className="w-full p-2 rounded-md text-black"
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
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-7 h-7 p-1 bg-green-800 rounded-md"
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
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-7 h-7 bg-red-800 rounded-md"
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
					<div className="line-clamp-1">Add Deck</div>
					<button
						onClick={() => {
							setIsAddingDeck((prevState) => !prevState);
							setTimeout(() => {
								inputRef.current.focus();
							}, 0);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-7 h-7 p-1 bg-green-800 rounded-md"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 4.5v15m7.5-7.5h-15"
							/>
						</svg>
					</button>
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
