import React, { useEffect, useState } from "react";
import Add_Card_Modal from "./Add_Card_Modal";
import Card_Rows from "./Card_Rows";
import Edit_Card_Modal from "./Edit_Card_Modal";
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
}) {
	const [selectedCardId, setSelectedCardId] = useState(0);
	const [selectedCard, setSelectedCard] = useState(null);

	console.log("Overview -- SELECTED CARD ID: ", selectedCardId);
	console.log("Overview -- SELECTED CARD: ", selectedCard);

	useEffect(() => {
		setSelectedCard(
			selectedDeck.cards[
				selectedDeck.cards.findIndex((card) => {
					return card.id === selectedCardId;
				})
			]
		);
	}, [selectedCardId]);

	// Handle user with no created decks
	if (!decks) {
		return <No_Decks />;
	}
	return (
		<section className={`@container flex-grow bg-slate-600 p-4`}>
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
			{/* {selectedCard ? (
				<Edit_Card_Modal
					setSelectedDeck={setSelectedDeck}
					selectedCard={selectedCard}
					setSelectedCard={setSelectedCard}
				/>
			) : null} */}
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

const cards = [
	{
		question: "test deck 1",
		answer: 15,
		id: 1,
	},
	{
		question: "test deck 2",
		answer: 21,
		id: 2,
	},
	{
		question: "test deck 3",
		answer: 31,
		id: 3,
	},
	{
		question: "test deck 4",
		answer: 5,
		id: 4,
	},
	{
		question: "test deck 5",
		answer: 1,
		id: 5,
	},
];
//old screen CSS grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-5 gap-4
