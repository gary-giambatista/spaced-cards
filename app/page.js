"use client";

import Deck_Selector from "@/components/hud/Deck_Selector/Deck_Selector";
import Hud_Header from "@/components/hud/Hud_Header";
import Overview from "@/components/hud/Overview/Overview";
import Study from "@/components/hud/Study/Study";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { refreshDeck, refreshDecks } from "@/library/srs";
import useDeckStorage from "@/hooks/useDeckStorage";
import SaveStatus from "@/components/SaveStatus";

export default function Home() {
	const [mode, setMode] = useState("overview");
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [isSmallScreen, setIsSmallScreen] = useState(
		typeof window === "undefined" ? false : window.innerWidth <= 820
	);
	const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
	const [isEditDeckModalOpen, setIsEditDeckModalOpen] = useState(false);
	const { userId, isLoaded } = useAuth();
	const storage = useDeckStorage(userId, isLoaded);
	const { decks, setDecks } = storage;
	const [selection, setSelection] = useState({owner: userId, id: null});
	const [now, setNow] = useState(Date.now);
	const rawSelectedDeck = (selection.owner === userId && decks.find(deck => deck.id === selection.id)) || decks[0] || null;
	const selectedDeck = rawSelectedDeck ? refreshDeck(rawSelectedDeck, now) : null;
	const isFetching = !storage.ready;
	function setSelectedDeck(update) {
		if (typeof update === 'function') {
			setDecks(current => current.map(deck => deck.id === rawSelectedDeck?.id ? update(deck) : deck));
		} else {
			setSelection({owner: userId, id: update?.id ?? null});
		}
	}
	useEffect(() => {
		setMode('overview'); setIsAddCardModalOpen(false); setIsEditDeckModalOpen(false);
	}, [userId]);
	useEffect(() => {
		const tick = () => setNow(Date.now());
		const timer = setInterval(tick, 1000);
		window.addEventListener('focus', tick);
		return () => {clearInterval(timer); window.removeEventListener('focus', tick);};
	}, []);
	useEffect(() => {
		const resize = () => setIsSmallScreen(window.innerWidth <= 820);
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);

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
		<>
        <SaveStatus storage={storage} userId={userId}/>
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
                        key={`${userId || "guest"}:${selectedDeck?.id || "empty"}`}
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
				) : selectedDeck ? (
					<Study
						setMode={setMode}
						selectedDeck={selectedDeck}
						setSelectedDeck={setSelectedDeck}
					/>
				) : null}
			</div>
		</main></>
	);
}
