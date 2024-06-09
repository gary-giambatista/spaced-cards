import React from "react";
import Edit_Card_Modal from "./Edit_Card_Modal";
import Mini_Card from "./Mini_Card";

function Card_Rows({
	selectedDeck,
	setSelectedDeck,
	selectedCard,
	setSelectedCard,
	setSelectedCardId,
}) {
	// const colors = ["bg-red-500", "bg-green-500", "bg-blue-500"];
	const colors = ["bg-[#5FB55D]", "bg-[#CBD748]", "bg-[#D74848]"];

	// 5 = easy, 3 = medium, 1 = hard
	const reviewedColors = {
		5: "bg-[#5FB55D]",
		3: "bg-[#CBD748]",
		1: "bg-[#D74848]",
	};

	return (
		<div className="grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5 @7xl:grid-cols-6 @[1921px]:grid-cols-8 gap-4">
			{selectedDeck.cards.map((card, index) => {
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
		</div>
	);
}

export default Card_Rows;
