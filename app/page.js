"use client";

import Deck_Selector from "@/components/hud/Deck_Selector/Deck_Selector";
import Hud_Header from "@/components/hud/Hud_Header";
import Overview from "@/components/hud/Overview/Overview";
import Study from "@/components/hud/Study/Study";
import { useEffect, useState } from "react";

export default function Home() {
	const [mode, setMode] = useState("overview");
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [isSmallScreen, setIsSmallScreen] = useState(
		typeof window === "undefined" ? false : window.innerWidth <= 820
	);
	const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
	const [isEditDeckModalOpen, setIsEditDeckModalOpen] = useState(false);
	let timeout = false;
	const [decks, setDecks] = useState(null);
	const [selectedDeck, setSelectedDeck] = useState(null);

	console.group("page.js");

	console.log("1 Decks Page DECK: ", decks);
	// console.log("Selected Deck PAGE: ", selectedDeck);
	// Handle updating decks when selectedDeck is modified
	useEffect(() => {
		console.log("2 useEffect SD: ", selectedDeck);

		function updateDecks() {
			if (decks) {
				decks.forEach((deck) => {
					// Update deck's only if selectedDeck's card length is different or if reviews_due is different
					if (
						(deck.id === selectedDeck.id &&
							deck.cards.length !== selectedDeck.cards.length) ||
						(deck.id === selectedDeck.id &&
							deck.reviews_due !== selectedDeck.reviews_due)
					) {
						// Update the correct deck
						const updatedDecks = decks.map((deck) => {
							if (deck.id === selectedDeck.id) {
								return {
									...deck,
									cards: updateReviewsDue([], selectedDeck),
									reviews_due: selectedDeck.reviews_due,
								};
							} else {
								return deck;
							}
						});
						console.log("3 UPDATED DECKS: ", updatedDecks);
						// Return here, only 1 if statement can be trigger at a time

						sortDecksByReviewsDue(updatedDecks);
						return setDecks(updatedDecks);
					}
				});
			}
		}
		updateDecks();
		console.log("4 decks: DID decks UPDATE? ", decks);
	}, [selectedDeck]);

	console.groupEnd();

	/**
	 * Sorts all decks so the decks with the most reviews_due come first
	 * @param {object[]} decks - decks object
	 */
	function sortDecksByReviewsDue(decks) {
		decks.sort((a, b) => b.reviews_due - a.reviews_due);
	}

	//TODO: potential issue: DIRECTLY modifying deck("selectedDeck")'s state!
	/**
	 * Update deck.reviews_due & card.review_due
	 * @param {object[]} [decks] -  represents an array of decks
	 * @param {object} [deck] - represents 1 deck
	 * @returns {object[]} - if a deck is passed in, returns the updated deck's cards, otherwise returns the the full updated decks'
	 */
	function updateReviewsDue(decks = [], deck) {
		// Unix Epoch time - milliseconds
		const nowInMilliseconds = Date.now();

		if (deck) {
			// Reset reviews to 0 to avoid over counting
			deck.reviews_due = 0;

			const cards = deck.cards;

			if (!cards.length) {
				return cards;
			}

			for (const card of cards) {
				if (card.due_date < nowInMilliseconds) {
					card.review_due = true;
					// need to accept deck, instead of deck.cards
					deck.reviews_due += 1; //todo - is okay because of the ...deck?
				} else if (card.due_date > nowInMilliseconds) {
					card.review_due = false;
					// deck.reviews_due -= 1; //todo ""
				}
			}
			return cards;
		}

		for (const deck of decks) {
			// Reset reviews to 0 to avoid over counting
			deck.reviews_due = 0;

			const cards = deck.cards;

			if (!cards.length) {
				break;
			}

			for (const card of cards) {
				if (card.due_date < nowInMilliseconds) {
					card.review_due = true;
					deck.reviews_due += 1;
				}
			}
		}
		return sortDecksByReviewsDue(decks);
	}

	// Set decks and selectedDeck on page load from LS
	useEffect(() => {
		const localStorageDecks = JSON.parse(localStorage.getItem("decks"));

		if (localStorageDecks) {
			updateReviewsDue(localStorageDecks);
			setDecks(localStorageDecks);
			// Set selectedDeck to first deck
			setSelectedDeck(localStorageDecks[0]);
		}
	}, []);

	// Update decks in LS whenever decks state changes
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
				setMode={setMode}
				setIsEditDeckModalOpen={setIsEditDeckModalOpen}
			/>
			<div className="flex flex-col w-full p-4 bg-white dark:bg-black overflow-y-auto">
				<Hud_Header
					setMode={setMode}
					mode={mode}
					isAddCardModalOpen={isAddCardModalOpen}
					setIsAddCardModalOpen={setIsAddCardModalOpen}
					selectedDeck={selectedDeck}
					isEditDeckModalOpen={isEditDeckModalOpen}
					setIsEditDeckModalOpen={setIsEditDeckModalOpen}
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
						isEditDeckModalOpen={isEditDeckModalOpen}
						setIsEditDeckModalOpen={setIsEditDeckModalOpen}
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
//Todo: break out useEffects functions into a folder and render inside here?

const deckss = [
	{
		name: "Test Deck",
		id: 1,
		reviews_due: 1,
		is_public: false,
		author: "anonymous",
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
				last_answer: null,
			},
		],
	},
	{
		name: "Test Deck2",
		id: 2,
		reviews_due: 2,
		is_public: false,
		author: "anonymous",
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
				last_answer: null,
			},
		],
	},
	{
		name: "Test Deck3",
		id: 3,
		reviews_due: 3,
		is_public: false,
		author: "anonymous",
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
				last_answer: null,
			},
		],
	},
	{
		name: "Test Deck4",
		id: 4,
		reviews_due: 4,
		is_public: false,
		author: "anonymous",
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
				last_answer: null,
			},
		],
	},
];
