"use client";

import Deck_Selector from "@/components/hud/Deck_Selector/Deck_Selector";
import Hud_Header from "@/components/hud/Hud_Header";
import Overview from "@/components/hud/Overview/Overview";
import Study from "@/components/hud/Study/Study";
import { useEffect, useState } from "react";
import { SuperMemoGrade, SuperMemoItem, supermemo } from "supermemo";

export default function Home() {
	const [mode, setMode] = useState("overview");
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [isSmallScreen, setIsSmallScreen] = useState(
		typeof window === "undefined" ? false : window.innerWidth <= 820
	);
	const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
	let timeout = false;
	const [decks, setDecks] = useState(null);
	const [selectedDeck, setSelectedDeck] = useState(null);

	console.log("1 Decks Page DECK: ", decks);
	// console.log("Selected Deck PAGE: ", selectedDeck);

	// Handle updating decks when selectedDeck is modified
	useEffect(() => {
		console.log("2 useEffect SD: ", selectedDeck);

		if (decks) {
			decks.forEach((deck) => {
				// Update deck's only if selectedDeck's card length is different
				if (
					(deck.id === selectedDeck.id &&
						deck.cards.length !== selectedDeck.cards.length) ||
					(deck.id === selectedDeck.id &&
						deck.reviews_due !== selectedDeck.reviews_due)
				) {
					// Copy decks to avoid mutating state directly
					let updatedDecks = [...decks];
					console.log("3 UPDATED DECKS: ", updatedDecks);

					// Update the correct deck
					updatedDecks.forEach((deck) => {
						if (deck.id === selectedDeck.id) {
							deck.cards = selectedDeck.cards;
							deck.reviews_due = selectedDeck.reviews_due;
						}
					});
					setDecks(updatedDecks);
				}
			});
		}
		console.log("4 decks: DID decks UPDATE? ", decks);
	}, [selectedDeck]);

	// Set decks and selectedDeck on page load from LS
	useEffect(() => {
		// If decks exist in Local Storage
		if (JSON.parse(localStorage.getItem("decks"))) {
			setDecks(JSON.parse(localStorage.getItem("decks")));
			// Set selectedDeck to first deck
			setSelectedDeck(JSON.parse(localStorage.getItem("decks"))[0]);
		}
		// const deckOrNull = JSON.parse(localStorage.getItem("decks"))
		// 	? JSON.parse(localStorage.getItem("decks"))[0]
		// 	: null;
		// setSelectedDeck(deckOrNull);
	}, []);

	//Update decks in LS whenever decks state changes
	useEffect(() => {
		localStorage.setItem("decks", JSON.stringify(decks));
	}, [decks]);

	//1.
	useEffect(() => {
		window.addEventListener("resize", () => {
			clearTimeout(timeout);
			setTimeout(handleWindowSizeChange, 500);
		});
		// window.addEventListener("resize", debounce(handleWindowSizeChange, 500));

		return () => {
			window.removeEventListener("resize", handleWindowSizeChange);
		};
	}, []);
	//2.
	function handleWindowSizeChange() {
		setIsSmallScreen(window.innerWidth <= 820);
	}
	//3.
	useEffect(() => {
		// If the screen size is above 820px
		if (!isSmallScreen) {
			setDrawerOpen(true);
		} else {
			setDrawerOpen(false);
		}
	}, [isSmallScreen]);

	return (
		<main className="flex h-full relative">
			<Deck_Selector
				drawerOpen={drawerOpen}
				setDrawerOpen={setDrawerOpen}
				decks={decks}
				setDecks={setDecks}
				selectedDeck={selectedDeck}
				setSelectedDeck={setSelectedDeck}
			/>
			<div className="flex flex-col w-full p-4 gap-4 bg-slate-300 overflow-y-auto">
				<Hud_Header
					setMode={setMode}
					mode={mode}
					isAddCardModalOpen={isAddCardModalOpen}
					setIsAddCardModalOpen={setIsAddCardModalOpen}
					selectedDeck={selectedDeck}
				/>
				{mode === "overview" ? (
					<Overview
						setMode={setMode}
						isAddCardModalOpen={isAddCardModalOpen}
						setIsAddCardModalOpen={setIsAddCardModalOpen}
						selectedDeck={selectedDeck}
						setSelectedDeck={setSelectedDeck}
						decks={decks}
						setDecks={setDecks}
					/>
				) : (
					<Study
						setMode={setMode}
						selectedDeck={selectedDeck}
						setSelectedDeck={setSelectedDeck}
					/>
				)}
			</div>
		</main>
	);
}

// Notes
// JS logic to hide drawer not necessary, because using media query to set the drawer to absolute fixes display issues
//Todo: Connect Hud_Header, Overview, and Card and their child components to selectedDeck
//Todo: break out useEffects functions into a folder and render inside here?

//Experiment state setter
// decks.forEach((deck) => {
// 	if (deck.id === selectedDeck.id) {
// 		setDecks((prevState) => {
// 			return {
// 				...prevState,
// 				deck: {
// 					cards: selectedDeck.cards,
// 				},
// 			};
// 		});
// 	}
// });

const deckss = [
	{
		name: "Test Deck",
		id: 1,
		reviews_due: 1,
		cards: [
			{
				id: 1,
				question: "Question 1",
				answer: "Answer 1",
				hint: "Hint 1",
				note: "Note 1",
				interval: 0,
				repetition: 0,
				efactor: 2.5,
				due_date: "ISO date",
				review_due: true,
			},
		],
	},
	{
		name: "Test Deck2",
		id: 2,
		reviews_due: 2,
		cards: [
			{
				id: 1,
				question: "Question 1",
				answer: "Answer 1",
				hint: "Hint 1",
				note: "Note 1",
				interval: 0,
				repetition: 0,
				efactor: 2.5,
				due_date: "ISO date",
				review_due: true,
			},
		],
	},
	{
		name: "Test Deck3",
		id: 3,
		reviews_due: 3,
		cards: [
			{
				id: 1,
				question: "Question 1",
				answer: "Answer 1",
				hint: "Hint 1",
				note: "Note 1",
				interval: 0,
				repetition: 0,
				efactor: 2.5,
				due_date: "ISO date",
				review_due: true,
			},
		],
	},
	{
		name: "Test Deck4",
		id: 4,
		reviews_due: 4,
		cards: [
			{
				id: 1,
				question: "Question 1",
				answer: "Answer 1",
				hint: "Hint 1",
				note: "Note 1",
				interval: 0,
				repetition: 0,
				efactor: 2.5,
				due_date: "ISO date",
				review_due: true,
			},
		],
	},
];
