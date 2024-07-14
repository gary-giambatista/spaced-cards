"use client";

import Deck_Selector from "@/components/hud/Deck_Selector/Deck_Selector";
import Hud_Header from "@/components/hud/Hud_Header";
import Overview from "@/components/hud/Overview/Overview";
import Study from "@/components/hud/Study/Study";
import { db } from "@/firebase";
import { useAuth } from "@clerk/nextjs";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
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

	// Clerk user data
	const { isLoaded, userId, sessionId, emailAddresses, getToken } = useAuth();
	// Auth user State
	const [userRef, setUserRef] = useState(null);
	const [deckRef, setDeckRef] = useState(null);

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
					//TODO: optimize and make this logic concise: break into smaller functions for optimization and reduce if checks
					if (
						(deck.id === selectedDeck.id &&
							deck.cards.length !== selectedDeck.cards.length) ||
						(deck.id === selectedDeck.id &&
							deck.reviews_due !== selectedDeck.reviews_due) ||
						(deck.id === selectedDeck.id &&
							deck.last_modified !== selectedDeck.last_modified) ||
						(deck.id === selectedDeck.id &&
							deck.last_reviewed !== selectedDeck.last_reviewed)
					) {
						// Update the correct deck
						const updatedDecks = decks.map((deck) => {
							if (deck.id === selectedDeck.id) {
								return {
									...deck,
									cards: updateReviewsDue([], selectedDeck),
									reviews_due: selectedDeck.reviews_due,
									last_modified: selectedDeck.last_modified,
									last_reviewed: selectedDeck.last_reviewed,
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

	console.log("userRef: ", userRef);
	console.log("deckRef(parsed): ", deckRef);

	// User just is created
	// 1. create a user entry in the DB users collection
	// 2. if the user has decks, set the users user document (userId) > decks to decks stringified (ONLY needs to happen immediately after creating an account or signing in, as update to the decks will happen whenever decks changes)

	// User exists and comes back to the site
	// 1.

	// Set decks and selectedDeck on page load from LS or DB
	useEffect(() => {
		// Local Storage section
		if (!userId) {
			const localStorageDecks = JSON.parse(localStorage.getItem("decks"));

			if (localStorageDecks) {
				updateReviewsDue(localStorageDecks);
				setDecks(localStorageDecks);
				// Set selectedDeck to first deck
				setSelectedDeck(localStorageDecks[0]);
			}
		}

		// DB section
		console.log("User ID: ", userId);

		if (userId) {
			// Can probably remove 1, and go to 2
			// Just try to fetch the decks sub-collection for this user
			// May be better to keep it for logic in creating a user entry in DB

			//1. Check if user exists in DB, if so save in state as userRef
			const fetchUser = async () => {
				try {
					// Create a reference to the user's document using the userId
					const userDocRef = doc(db, "users", userId);
					// Fetch the document
					const userDoc = await getDoc(userDocRef);
					// Check if the document exists and set the state with the document data
					if (userDoc.exists()) {
						setUserRef(userDoc.data());
					} else {
						console.log("No such document!");
					}
				} catch (error) {
					console.error("Error fetching user:", error);
				}
			};
			fetchUser();

			//0. if userId
			//1. fetch user's decks, if decks return decksRef
			//2. -> if no deckRef, fetchUser()
			//3. --> if no userRef, createUser()
			//4. ---> if selectedDeck() -> create decks in DB
		}
	}, []);

	//2. If user exists in the DB => check if this user has a decks
	//   sub-collection in the DB
	useEffect(() => {
		if (userRef) {
			//TODO: turn this into a single document fetch?
			// Check if decks exists in DB, if so make a ref for it
			const fetchDecks = async () => {
				try {
					const querySnapshot = await getDocs(
						collection(db, "users", userId, "decks")
					);
					const decksList = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					console.log("Deck ref here: ", decksList);
					setDeckRef(JSON.parse(decksList[0].decks));
				} catch (error) {
					console.error("Error fetching users:", error);
				}
			};
			fetchDecks();
		}
		//-- Create a user in the DB ---
		// User authenticated         ✔
		// No user document in the DB ❌
		// if (userId && !userRef) {
		// 	async function createUser() {
		// 		try {
		// 			const docRef = await addDoc(collection(db, "users", userId), {
		// 				emails: emailAddresses,
		// 			});

		// 			console.log("User Created! Document written with ID: ", docRef.id);
		// 		} catch (e) {
		// 			console.error("Error adding document: ", e);
		// 		}
		// 	}
		// 	// Create user in DB
		// 	createUser();
		// }
	}, [userRef]);

	//3. If userRef and NO deckRef (no decks sub-collection), and selectedDeck
	//   create a decks entry in the DB
	useEffect(() => {
		if (userRef && !deckRef && selectedDeck) {
		}
	}, [deckRef]);

	// Update decks in LS whenever decks state changes
	useEffect(() => {
		localStorage.setItem("decks", JSON.stringify(decks));

		// Whenever decks changes, set() the DB for this users decks sub-collection
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
