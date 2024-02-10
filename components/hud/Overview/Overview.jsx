import React from "react";
import Hud_Header from "../Hud_Header";
import Add_Card_Modal from "./Add_Card_Modal";
import Card_Rows from "./Card_Rows";
import Empty_Deck from "./Empty_Deck";

function Overview({
	setMode,
	isAddCardModalOpen,
	setIsAddCardModalOpen,
	selectedDeck,
}) {
	return (
		<section className={`@container flex-grow bg-slate-600 p-4`}>
			{isAddCardModalOpen ? (
				<Add_Card_Modal
					isAddCardModalOpen={isAddCardModalOpen}
					setIsAddCardModalOpen={setIsAddCardModalOpen}
				/>
			) : null}
			{selectedDeck.cards.length > 0 ? (
				<Card_Rows selectedDeck={selectedDeck} />
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
