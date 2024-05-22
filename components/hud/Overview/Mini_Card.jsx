import React, { useState } from "react";

function Mini_Card({ card, setSelectedCardId, color }) {
	// Controls where the card is being edited or not
	// const [editCardModalIsOpen, setEditCardModalIsOpen] = useState(false);

	return (
		<div
			className={`flex flex-col h-80 w-full ${color} hover:opacity-50 hover:cursor-pointer rounded-md p-4  justify-center items-center  `}
			onClick={() => setSelectedCardId(card.id)}
		>
			<div className="font-extrabold">Question:</div>
			<div className="">{card.question}</div>
			{/* <div>Answer:</div>
			<div>{card.answer}</div> */}
		</div>
	);
}
// bg-neutral-100
// dark:bg-neutral-800 dark:border-neutral-600
// border-8 border-white shadow-md
export default Mini_Card;
