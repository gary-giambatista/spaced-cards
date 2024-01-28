import React from "react";
import Hud_Header from "./Hud_Header";

function Overview({ setMode }) {
	return (
		<section className={`flex-grow bg-slate-600 p-4`}>
			{/* <Hud_Header setMode={setMode} /> */}
			<div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-5 gap-4">
				{cards.map((card) => {
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
