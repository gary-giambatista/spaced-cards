import React from "react";
import Mini_Card from "./Mini_Card";

function Card_Rows({ selectedDeck, setSelectedCardId }) {
	// const colors = ["bg-red-500", "bg-green-500", "bg-blue-500"];
	const colors = ["bg-[#5FB55D]", "bg-[#CBD748]", "bg-[#D74848]"];

	return (
		<div className="grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5 @7xl:grid-cols-6 @[1921px]:grid-cols-8 gap-4">
			{selectedDeck.cards.map((card, index) => {
				const colorClass = colors[index % colors.length];
				return (
					<React.Fragment key={card.id}>
						<Mini_Card
							card={card}
							setSelectedCardId={setSelectedCardId}
							color={colorClass}
						/>
					</React.Fragment>
				);
			})}
		</div>
	);
}

export default Card_Rows;
