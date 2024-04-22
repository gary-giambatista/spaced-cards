import React, { useEffect, useState } from "react";
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
}) {
	const [selectedCardId, setSelectedCardId] = useState(0);
	const [selectedCard, setSelectedCard] = useState(null);

	// Re-render optimization Note -- these set states can be moved to children nodes to reduce the number of re-renders, but I don't believe this is necessary, and state flow is more manageable with his design
	// console.log("Overview -- SELECTED CARD ID: ", selectedCardId);
	// console.log("Overview -- SELECTED CARD: ", selectedCard);

	// setSelectedCard when edit is clicked
	useEffect(() => {
		// 0 falsy -- short circuit if nothing to set
		if (!selectedCardId) return;
		setSelectedCard(
			selectedDeck.cards[
				selectedDeck.cards.findIndex((card) => card.id === selectedCardId)
			]
		);
	}, [selectedCardId]);

	// Reset selectedCardId to 0 (undefined) when a card is clicked (this allows the same card's Edit_Card_Modal to be opened more than once in a row since otherwise, selectedCardId doesn't change in state)
	useEffect(() => {
		setSelectedCardId(0);
	}, [selectedCard]);

	// Handle user with no created decks
	if (!decks) {
		return <No_Decks />;
	}
	return (
		<section className={`@container flex-grow bg-slate-600 p-4`}>
			{isEditDeckModalOpen ? (
				<Edit_Deck_Modal setIsEditDeckModalOpen={setIsEditDeckModalOpen} />
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
			{selectedCard ? (
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
					setSelectedCardId={setSelectedCardId}
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
