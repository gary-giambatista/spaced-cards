import React, { useMemo, useState } from "react";

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

	//Todo: Clean up and optimize
	function createDeck() {
		console.log("deck created!");

		// Reset component state
		setIsAddingDeck(false);
		setNewDeckName("");
		// LS get decks in page.js - useEffect on page mount
		// const existingDecks = JSON.parse(localStorage.getItem("decks"));

		// LS set and update decks
		if (decks) {
			const updatedDeck = [];
			// setDecks(decks.unshift(newDeck));
			// console.log("Decks (Creating): ", decks);
			for (const deck of decks) {
				updatedDeck.push(deck);
			}
			updatedDeck.unshift(newDeck);
			localStorage.setItem("decks", JSON.stringify(updatedDeck));
			setDecks(updatedDeck);
			setSelectedDeck(updatedDeck[0]);
		} else {
			localStorage.setItem("decks", JSON.stringify([newDeck]));
			setDecks([newDeck]);
			setSelectedDeck(newDeck[0]);
		}

		//Update state in page.js re-rendering everything
		//setSelectedDeck() -> prioritizing index 0, but this will have the be updated with better logic, and perhaps switching to using a Map instead of object
	}

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
					<button onClick={() => setIsAddingDeck((prevState) => !prevState)}>
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
