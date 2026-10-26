"use client";

import Deck_Selector from "@/components/hud/Deck_Selector/Deck_Selector";
import Hud_Header from "@/components/hud/Hud_Header";
import Overview from "@/components/hud/Overview/Overview";
import Study from "@/components/hud/Study/Study";
import { fetchDecks, setDecksInDB } from "@/library/database_functions";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { refreshDeck, refreshDecks } from "@/library/srs";

export default function Home() {
	const [mode, setMode] = useState("overview");
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [isSmallScreen, setIsSmallScreen] = useState(
		typeof window === "undefined" ? false : window.innerWidth <= 820
	);
	const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
	const [isEditDeckModalOpen, setIsEditDeckModalOpen] = useState(false);
	const [decks, setDecks] = useState(null);
	const [storageReady, setStorageReady] = useState(false);
	const [rawSelectedDeck, setSelectedDeck] = useState(null);
	const [now, setNow] = useState(Date.now);
	const selectedDeck = useMemo(() => rawSelectedDeck ? refreshDeck(rawSelectedDeck, now) : null, [rawSelectedDeck, now]);
	useEffect(() => {
		const tick = () => setNow(Date.now());
		const timer = setInterval(tick, 1000);
		window.addEventListener("focus", tick);
		return () => { clearInterval(timer); window.removeEventListener("focus", tick); };
	}, []);
	useEffect(() => {
		if (storageReady && decks !== null) localStorage.setItem("decks", JSON.stringify(decks));
	}, [decks, storageReady]);
	let timeout = false;

	// Clerk user data
	const { isLoaded, userId, sessionId, emailAddresses, getToken } = useAuth();

	//Todo: push to production!
	//Todo: make sure create user flow works -> should be 👍
	//Todo: clean up code - > functions
	//Todo: turn on createUser() ?
	//Todo: basic form validation for decks/cards -> just make sure there is a question and answer
	//Todo: Bug -> dark mode state -> seems good 👍
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
					noChangesToLastReviewed &&
                    deck.name === selectedDeck.name &&
                    deck.reviews_due === selectedDeck.reviews_due &&
                    JSON.stringify(deck.cards) === JSON.stringify(selectedDeck.cards)
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
						cards: selectedDeck.cards,
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
			return setDecks(refreshDecks(updatedDecks));

			//4. setSelectedDeck in fetchDecks()
		}
		updateDecks();
		console.log("4 decks: DID decks UPDATE? ", decks);
	}, [selectedDeck, decks, userId]);

	function updateReviewsDue(decks) { return refreshDecks(decks); }

	// Set decks and selectedDeck on page load from LS
	useEffect(() => {
		const localStorageDecks = JSON.parse(localStorage.getItem("decks"));

		// Only Set decks from LS if no user -> DB state takes priority
		if (localStorageDecks) {
			console.log("Decks set from LS 📰");
			const refreshed = updateReviewsDue(localStorageDecks);
			setDecks(refreshed);
			// Set selectedDeck to first deck
			setSelectedDeck(refreshed[0]);
		}
		setStorageReady(true);
	}, []);

	// Todo: validate updateReviewsDue/setSelectedDeck doesn't need to be called via the DB flow -> delete LS and login (add new card signed out > delete LS > sign in) -> represents logging into a new device for the first time or having no LS, solution: could move to fetchDecks db function -> should be 👍
	// Fetch decks from DB, ONLY if there is a userId
	// Only happens 1 TIME on page mount, thereafter, State is local via React/LS
	const { isFetching } = useQuery({
		queryKey: ["decks", userId],
		queryFn: () =>
			fetchDecks(userId, decks, setDecks, setSelectedDeck, updateReviewsDue),
		enabled: !!userId && storageReady,
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
				decks={refreshDecks(decks, now)}
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
