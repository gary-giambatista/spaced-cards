import React from "react";

const sampleDecks = [
	{
		title: "test deck 1",
		reviews_due: 15,
		id: 1,
	},
	{
		title: "test deck 2",
		reviews_due: 21,
		id: 2,
	},
	{
		title: "test deck 3",
		reviews_due: 31,
		id: 3,
	},
	{
		title: "test deck 4",
		reviews_due: 5,
		id: 4,
	},
	{
		title: "test deck 5",
		reviews_due: 1,
		id: 5,
	},
];

function Deck_Selector({ drawerOpen }) {
	return (
		<div
			className={`flex-shrink h-dvh bg-slate-400 transition-all ${
				drawerOpen ? "w-80" : "w-0"
			} `}
		>
			<div className="delay-75">Deck_Selector</div>
			{sampleDecks.map((deck) => {
				return (
					<div
						className={`flex justify-between px-2 overflow-hidden ${
							drawerOpen ? "opacity-100" : "opacity-0"
						}`}
						key={deck.id}
					>
						<div className="line-clamp-1">{deck.title}</div>
						<div className="">{deck.reviews_due}</div>
					</div>
				);
			})}
		</div>
	);
}

export default Deck_Selector;
