import ArrowBlack from "@/public/ArrowBlack.png";
import ArrowWhite from "@/public/ArrowWhite.png";
import { useTheme } from "next-themes";
import Image from "next/image";
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
	setIsEditDeckModalOpen,
}) {
	const { theme, setTheme } = useTheme();
	return (
		<section
			className={`absolute h-full lg:relative flex-shrink bg-neutral-100 dark:bg-neutral-800 transition-all z-10 ${
				drawerOpen ? "w-80 min-w-80" : "w-0 min-w-0"
			} `}
		>
			{/* Chevron */}
			<div
				onClick={() => setDrawerOpen(!drawerOpen)}
				className="absolute group flex justify-center items-center bg-transparent h-14 w-8 -right-8 top-1/2 transform -translate-y-1/2 cursor-pointer"
			>
				<Image
					src={theme === "light" ? ArrowBlack : ArrowWhite}
					alt={"Toggle Drawer"}
					height={18}
					width={18}
					className={`transition-transform group-hover:scale-110	 ${
						drawerOpen ? "" : "rotate-180"
					}`}
				/>
			</div>

			{/* Create new deck */}
			<Deck_Adder
				drawerOpen={drawerOpen}
				setSelectedDeck={setSelectedDeck}
				decks={decks}
				setDecks={setDecks}
			/>

			{/* Deck Rows */}
			{/* <div className="overflow-hidden delay-75">Deck_Selector</div> */}
			{decks?.map((deck) => {
				return (
					<div
						onClick={() => {
							setSelectedDeck(deck);
							setMode("overview");
						}}
						className={`flex group justify-between overflow-hidden py-2 mx-2 hover:cursor-pointer rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-900 ${
							drawerOpen ? "opacity-100" : "opacity-0"
						} ${
							deck?.id === selectedDeck?.id
								? "bg-white dark:bg-black font-extrabold"
								: "bg-transparent font-medium"
						}`}
						key={deck?.id}
					>
						<div className="line-clamp-1 mx-3">{deck?.name}</div>

						<div className="flex relative gap-2">
							{/* Hover Dots Effect */}
							<svg
								onClick={() => {
									setSelectedDeck(deck);
									setMode("overview");
									setIsEditDeckModalOpen(true);
								}}
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								strokeWidth={5.5}
								className="w-6 h-6 scale-150 hidden group-hover:block dark:fill-white rounded-full hover:scale-110 transition-all hover:bg-neutral-300 dark:hover:bg-neutral-800"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6.75 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM12.75 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.75 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
								/>
							</svg>
							<div
								className={`rounded-full px-2 mr-2 ${
									deck?.id === selectedDeck?.id
										? "bg-neutral-100 dark:bg-neutral-800"
										: "bg-white dark:bg-black"
								}`}
							>
								{deck?.reviews_due}
							</div>
						</div>
					</div>
				);
			})}
		</section>
	);
}

export default Deck_Selector;

//todo: sorting/search for decks?
