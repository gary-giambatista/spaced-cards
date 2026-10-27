import { useTheme } from "next-themes";
import React, { useState } from "react";
import { HashLoader } from "react-spinners";
import Add_Card_Modal from "./Add_Card_Modal";
import Card_Rows from "./Card_Rows";
import Edit_Card_Modal from "./Edit_Card_Modal";
import Edit_Deck_Modal from "./Edit_Deck_Modal";
import Empty_Deck from "./Empty_Deck";
import No_Decks from "./No_Decks";

function Overview({
	setMode,
	isAddCardModalOpen,
	setIsAddCardModalOpen,
	selectedDeck,
	setSelectedDeck,
	decks,
	setDecks,
	isEditDeckModalOpen,
	setIsEditDeckModalOpen,
	isFetching,
}) {
	const [selectedCard, setSelectedCard] = useState(null);
	const { theme } = useTheme();

	const color = theme === "light" ? "#000" : "#ffffff";

	function setSelectedCardId(id) {
    setSelectedCard(selectedDeck?.cards.find(card => card.id === id) || null);
  }

	// Handle fetching decks in DB
	if (isFetching) {
		return (
			<div className="h-full w-full flex justify-center items-center">
				<HashLoader color={color} />
			</div>
		);
	}

	// Handle user with no created decks
	if (!decks || decks.length === 0) {
		return <No_Decks />;
	}

	return (
		<section className={`@container flex-grow bg-white dark:bg-black p-4`}>
			{isEditDeckModalOpen ? (
				<Edit_Deck_Modal
					selectedDeck={selectedDeck}
					setSelectedDeck={setSelectedDeck}
					decks={decks}
					setDecks={setDecks}
					setIsEditDeckModalOpen={setIsEditDeckModalOpen}
				/>
			) : null}
			{isAddCardModalOpen ? (
				<Add_Card_Modal
					isAddCardModalOpen={isAddCardModalOpen}
					setIsAddCardModalOpen={setIsAddCardModalOpen}
					selectedDeck={selectedDeck}
					setSelectedDeck={setSelectedDeck}
					decks={decks}
					setDecks={setDecks}
				/>
			) : null}
			{/* Edit Card Modal for Desktop */}
			{selectedCard && window.innerWidth > 449 ? (
				<Edit_Card_Modal
					selectedDeck={selectedDeck}
					setSelectedDeck={setSelectedDeck}
					selectedCard={selectedCard}
					setSelectedCard={setSelectedCard}
				/>
			) : null}
			{selectedDeck?.cards?.length > 0 ? (
				<Card_Rows
					selectedDeck={selectedDeck}
					setSelectedDeck={setSelectedDeck}
					selectedCard={selectedCard}
					setSelectedCard={setSelectedCard}
					setSelectedCardId={setSelectedCardId}
					setIsEditDeckModalOpen={setIsEditDeckModalOpen}
					setIsAddCardModalOpen={setIsAddCardModalOpen}
				/>
			) : (
				<Empty_Deck
					isAddCardModalOpen={isAddCardModalOpen}
					setIsAddCardModalOpen={setIsAddCardModalOpen}
				/>
			)}
		</section>
	);
}

export default Overview;

//old screen CSS grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-5 gap-4
