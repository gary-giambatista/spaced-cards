import React, { useEffect, useRef, useState } from "react";
import Edit_Card_Modal from "./Edit_Card_Modal";
import Mini_Card from "./Mini_Card";

function Card_Rows({
	selectedDeck,
	setSelectedDeck,
	selectedCard,
	setSelectedCard,
	setSelectedCardId,
}) {
	const [cards, setCards] = useState(selectedDeck.cards);
	const [filterText, setFilterText] = useState("");

	const handleFilterChange = (e) => {
		setFilterText(e.target.value);
	};

	const filteredCards = selectedDeck.cards.filter((card) =>
		card.question.toLowerCase().includes(filterText.toLowerCase())
	);

	useEffect(() => {
		if (filterText.length < 1) {
			setCards(selectedDeck.cards);
		} else {
			setCards(filteredCards);
		}
	}, [filterText]);

	// Colors array for repeating background colors on just created cards
	const colors = ["bg-[#5FB55D]", "bg-[#CBD748]", "bg-[#D74848]"];

	// Background color for cards based upon their last practice score
	// 5 = easy, 3 = medium, 1 = hard
	const reviewedColors = {
		5: "bg-[#5FB55D]",
		3: "bg-[#CBD748]",
		1: "bg-[#D74848]",
	};

	return (
		<div className="w-full">
			{/* Search Filter(s) */}
			<section className="w-full sm:w-2/5 lg:w-2/6 flex relative justify-center items-center pb-4 mx-auto">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-4 absolute left-2"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>
				<input
					onChange={handleFilterChange}
					value={filterText}
					className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-md p-2 pl-8"
					placeholder="Find card..."
				/>
			</section>

			<section className="grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5 @7xl:grid-cols-6 @[1921px]:grid-cols-8 gap-4">
				{cards.map((card, index) => {
					const colorClass = colors[index % colors.length];
					return (
						<div className="relative" key={card.id}>
							{/* Edit Card Modal for Mobile */}
							{selectedCard?.id === card?.id && window.innerWidth < 449 ? (
								<Edit_Card_Modal
									selectedDeck={selectedDeck}
									setSelectedDeck={setSelectedDeck}
									selectedCard={selectedCard}
									setSelectedCard={setSelectedCard}
									lastIndex={selectedDeck.cards.length - 1 === index}
								/>
							) : null}
							<Mini_Card
								card={card}
								setSelectedCardId={setSelectedCardId}
								color={
									reviewedColors[card?.last_answer]
										? reviewedColors[card?.last_answer]
										: colorClass
								}
								selectedDeck={selectedDeck}
								setSelectedDeck={setSelectedDeck}
								selectedCard={selectedCard}
								setSelectedCard={setSelectedCard}
							/>
						</div>
					);
				})}
			</section>
		</div>
	);
}

export default Card_Rows;
