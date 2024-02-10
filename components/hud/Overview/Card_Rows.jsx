import React from "react";

function Card_Rows({ selectedDeck }) {
	return (
		<div className="grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5 @7xl:grid-cols-6 @[1921px]:grid-cols-8 gap-4">
			{selectedDeck.cards.map((card) => {
				return (
					<div
						key={card.id}
						className="flex flex-col h-80 w-full bg-slate-400 "
					>
						<div>{card.question}</div>
						<div>{card.answer}</div>
					</div>
				);
			})}
		</div>
	);
}

export default Card_Rows;
