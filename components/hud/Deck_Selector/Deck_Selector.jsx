import React, { useState } from "react";
import Deck_Adder from "./Deck_Adder";

function Deck_Selector({
	drawerOpen,
	setDrawerOpen,
	decks,
	setDecks,
	selectedDeck,
	setSelectedDeck,
	setMode,
}) {
	return (
		<section
			className={`absolute h-full sm:relative flex-shrink bg-slate-400 transition-all z-10 ${
				drawerOpen ? "w-80 min-w-80" : "w-0 min-w-0"
			} `}
		>
			{/* Chevron */}
			<div
				onClick={() => setDrawerOpen(!drawerOpen)}
				className="absolute flex justify-center items-center bg-slate-800 h-14 w-8 -right-8 top-1/2 transform -translate-y-1/2 cursor-pointer"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
					className={`w-6 h-6 transition-transform ${
						drawerOpen ? "rotate-180" : ""
					}`}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="m8.25 4.5 7.5 7.5-7.5 7.5"
					/>
				</svg>
			</div>
			{/* Deck Rows */}
			{/* <div className="overflow-hidden delay-75">Deck_Selector</div> */}
			{decks?.map((deck) => {
				return (
					<div
						onClick={() => {
							setSelectedDeck(deck);
							setMode("overview");
						}}
						className={`flex justify-between overflow-hidden py-1 px-2 hover:cursor-pointer hover:bg-slate-600 ${
							drawerOpen ? "opacity-100" : "opacity-0"
						} ${
							deck?.id === selectedDeck?.id ? "bg-slate-500" : "bg-transparent"
						}`}
						key={deck?.id}
					>
						<div className="line-clamp-1">{deck?.name}</div>
						<div className="">{deck?.reviews_due}</div>
					</div>
				);
			})}
			{/* Create new deck */}
			<Deck_Adder
				drawerOpen={drawerOpen}
				setSelectedDeck={setSelectedDeck}
				decks={decks}
				setDecks={setDecks}
			/>
		</section>
	);
}

export default Deck_Selector;

//todo: sorting/search for decks?
