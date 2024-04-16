import React, { useState } from "react";

function Mini_Card({ card, setSelectedCardId }) {
	// Controls where the card is being edited or not
	// const [editCardModalIsOpen, setEditCardModalIsOpen] = useState(false);

	return (
		<div
			className="flex flex-col h-80 w-full bg-slate-400 "
			onClick={() => setSelectedCardId(card.id)}
		>
			<div>{card.question}</div>
			<div>{card.answer}</div>
		</div>
	);
}

export default Mini_Card;
