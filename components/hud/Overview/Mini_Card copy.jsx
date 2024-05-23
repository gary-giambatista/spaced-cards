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

// Rotating cards on hover
// function Mini_Card({ card, setSelectedCardId, color }) {
// 	const ref = useRef(null);
// 	// Controls where the card is being edited or not
// 	// const [editCardModalIsOpen, setEditCardModalIsOpen] = useState(false);

// 	return (
// 		<div
// 			onClick={() => console.log(ref)}
// 			ref={ref}
// 			className={`h-80 w-full ${color} hover:cursor-pointer [perspective:1000px] group transition-all duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)] p-4 rounded-md`}
// 		>
// 			<div
// 				className={`relative h-full w-full flex flex-col justify-center items-center  `}
// 				onClick={() => setSelectedCardId(card.id)}
// 			>
// 				{/* <div className="absolute inset-0 m-auto w-fit h-fit font-extrabold transition-all duration-500 group-hover:opacity-0">
// 					Question:
// 				</div> */}
// 				<div className="absolute inset-0 m-auto w-fit h-fit transition-all duration-500 group-hover:opacity-0 font-extrabold">
// 					{card.question}
// 				</div>
// 				{/* <div className="font-extrabold [transform:rotateY(180deg)] absolute inset-0 m-auto w-fit h-fit transition-all duration-500 opacity-0 group-hover:opacity-100">
// 					Answer:
// 				</div> */}
// 				<div className="[transform:rotateY(180deg)] absolute inset-0 m-auto w-fit h-fit transition-all duration-500 opacity-0 group-hover:opacity-100 font-extrabold">
// 					{card.answer}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
