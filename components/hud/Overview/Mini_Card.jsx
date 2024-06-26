import React, { useState } from "react";

function Mini_Card({ card, setSelectedCardId }) {
	// Controls where the card is being edited or not
	// const [editCardModalIsOpen, setEditCardModalIsOpen] = useState(false);

	return (
		<div
			className="flex flex-col h-80 w-full bg-slate-400 hover:opacity-50 hover:cursor-pointer rounded-md p-4"
			onClick={() => setSelectedCardId(card.id)}
		>
			<div>Question:</div>
			<div className="pb-4">{card.question}</div>
			<div>Answer:</div>
			<div>{card.answer}</div>
		</div>
	);
}

export default Mini_Card;
