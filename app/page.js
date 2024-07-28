"use client";

import Deck_Selector from "@/components/hud/Deck_Selector/Deck_Selector";
import Hud_Header from "@/components/hud/Hud_Header";
import Overview from "@/components/hud/Overview/Overview";
import Study from "@/components/hud/Study/Study";
import { fetchDecks, setDecksInDB } from "@/library/database_functions";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Home() {
	const [mode, setMode] = useState("overview");
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [isSmallScreen, setIsSmallScreen] = useState(
		typeof window === "undefined" ? false : window.innerWidth <= 820
	);
	const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
	const [isEditDeckModalOpen, setIsEditDeckModalOpen] = useState(false);
	const [decks, setDecks] = useState(() => {
		return JSON.parse(localStorage.getItem("decks"));
	});
	const [selectedDeck, setSelectedDeck] = useState(null);
	let timeout = false;

	// Clerk user data
	const { isLoaded, userId, sessionId, emailAddresses, getToken } = useAuth();

	//Todo: make sure create user flow works -> should be 👍
	//Todo: clean up code - > functions
	//Todo: turn on createUser() ?
	//Todo: basic form validation for decks/cards -> just make sure there is a question and answer
	//Todo: Bug -> dark mode state
	//Todo: 7.24 -> create deck doesn't add to DB unless card is made. DEV made decision

	console.group("page.js");

	// console.log("1 Decks Page DECK: ", decks);

	// Handle updating decks when selectedDeck is modified
	useEffect(() => {
		// console.log("2 useEffect -> updateDecks -> selectedDeck: ", selectedDeck);

		function updateDecks() {
			// Updating decks requires both variables, return if undefined
			if (!decks || !selectedDeck) {
				return;
			}

			// Todo: remove this check? Only preventing when deck_selector is changed?
			// Check if changes are needed -> all update functions update 1 of
			// these 2 properties on selectedDeck
			for (const deck of decks) {
				const isSelectedDeck = deck.id === selectedDeck.id;
				const noChangesToLastModified =
					deck.last_modified === selectedDeck.last_modified;
				const noChangesToLastReviewed =
					deck.last_reviewed === selectedDeck.last_reviewed;
				if (
					isSelectedDeck &&
					noChangesToLastModified &&
					noChangesToLastReviewed
				) {
					return;
				}
			}

			// Updates are required -> update the correct deck and fields
			// * updateReviewsDue updates selectedDeck, so it's important
			// to call it before replacing the necessary properties
			const updatedDecks = decks.map((deck) => {
				if (deck.id === selectedDeck.id) {
					return {
						...deck,
						cards: updateReviewsDue([], selectedDeck),
						reviews_due: selectedDeck.reviews_due,
						last_modified: selectedDeck.last_modified,
						last_reviewed: selectedDeck.last_reviewed,
						name: selectedDeck.name,
					};
				} else {
					return deck;
				}
			});
			// console.log("3 UPDATED DECKS: ", updatedDecks);

			sortDecksByReviewsDue(updatedDecks);
			// console.log("CONFIRMED DECKS UPDATED VIA UE");
			// TODO: create an update decks function here for LS/DB and get rid of end useEffect for when decks changes << 0

			//1. Set LS
			console.log("Decks being saved in LS and DB via selectedDeck useEffect");
			localStorage.setItem("decks", JSON.stringify(updatedDecks));

			//2. Update DB if user
			if (userId) {
				console.log("UPDATING DECKS IN DB 💾, via selectedDeck useEffect");
				setDecksInDB(userId, updatedDecks);
			}
			//TODO: 🔑 possibly need to pass in setDecks to setDecksInDB in case of user logging in for the firs time. I'm betting LS will keep accurate state and just set in DB for parody
			//3. setDecks
			console.log("Setting updatedDecks in React State");
			return setDecks(updatedDecks);

			//4. setSelectedDeck in fetchDecks()
		}
		updateDecks();
		console.log("4 decks: DID decks UPDATE? ", decks);
	}, [selectedDeck]);

	/**
	 * Sorts all decks so the decks with the most reviews_due come first
	 * @param {object[]} decks - decks object
	 * @returns {object[]} - sorted decks object
	 */
	function sortDecksByReviewsDue(decks) {
		// decks.sort((a, b) => b.reviews_due - a.reviews_due);
		if (!Array.isArray(decks)) {
			console.error("Invalid input: decks must be an array");
			return [];
		}
		return [...decks].sort((a, b) => {
			if (
				typeof a.reviews_due !== "number" ||
				typeof b.reviews_due !== "number"
			) {
				console.error("Invalid reviews_due value: must be a number");
				return 0;
			}
			return b.reviews_due - a.reviews_due;
		});
	}

	//TODO: potential issue: DIRECTLY modifying deck("selectedDeck")'s state!
	/**
	 * Update deck.reviews_due & card.review_due
	 * @param {object[]} [decks] -  represents an array of decks
	 * @param {object} [deck] - represents 1 deck
	 * @returns {object[]} - if a deck is passed in, returns the updated deck's cards, otherwise returns the the full updated decks'
	 */
	function updateReviewsDue(decks = [], deck) {
		console.log("UPDATE DECKS CALLED, DECKS: ", decks);
		// Unix Epoch time - milliseconds
		const nowInMilliseconds = Date.now();

		// Handle updating ONLY a deck -> if deck is passed in
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
					// Needed for after practicing a card
					card.review_due = false;
					// deck.reviews_due -= 1; //todo ""
				}
			}
			return cards;
		}

		// Handle Updating every deck of decks
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
		console.log("How are the decks?", sortDecksByReviewsDue(decks));
		return sortDecksByReviewsDue(decks);
	}

	// Set decks and selectedDeck on page load from LS
	useEffect(() => {
		const localStorageDecks = JSON.parse(localStorage.getItem("decks"));

		// Only Set decks from LS if no user -> DB state takes priority
		if (localStorageDecks && !userId) {
			console.log("Decks set from LS 📰");
			updateReviewsDue(localStorageDecks);
			setDecks(localStorageDecks);
			// Set selectedDeck to first deck
			setSelectedDeck(localStorageDecks[0]);
		}
	}, []);

	// Todo: validate updateReviewsDue/setSelectedDeck doesn't need to be called via the DB flow -> delete LS and login (add new card signed out > delete LS > sign in) -> represents logging into a new device for the first time or having no LS, solution: could move to fetchDecks db function -> should be 👍
	// Fetch decks from DB, ONLY if there is a userId
	// Only happens 1 TIME on page mount, thereafter, State is local via React/LS
	const { isFetching } = useQuery({
		queryKey: ["decks"],
		queryFn: () =>
			fetchDecks(userId, decks, setDecks, setSelectedDeck, updateReviewsDue),
		enabled: !!userId,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
	});
	console.groupEnd();

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
				isFetching={isFetching}
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
						isFetching={isFetching}
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

const decksType = [
	{
		name: "Test Deck",
		id: 1,
		reviews_due: 1,
		is_shared: false,
		author: "anonymous",
		last_reviewed: 123213123,
		last_modified: 123123213,
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
				last_practiced: 1235123213,
			},
		],
	},
	{
		name: "Test Deck2",
		id: 2,
		reviews_due: 2,
		is_shared: false,
		author: "anonymous",
		last_reviewed: 123213123,
		last_modified: 123123213,
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
				last_practiced: 1235123213,
			},
		],
	},
	{
		name: "Test Deck3",
		id: 3,
		reviews_due: 3,
		is_shared: false,
		author: "anonymous",
		last_reviewed: 123213123,
		last_modified: 123123213,
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
				last_practiced: 1235123213,
			},
		],
	},
	{
		name: "Test Deck4",
		id: 4,
		reviews_due: 4,
		is_shared: false,
		author: "anonymous",
		last_reviewed: 123213123,
		last_modified: 123123213,
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
				last_practiced: 1235123213,
			},
		],
	},
];
