import React, { useState } from "react";

function Mini_Card({ card, setSelectedCardId, color }) {
	const [isFlipped, setIsFlipped] = useState(false);

	const handleFlip = (e) => {
		e.stopPropagation();
		setIsFlipped(!isFlipped);
	};
	return (
		<div
			className={`h-80 w-full hover:cursor-pointer [perspective:1000px] group transition-all duration-500 [transform-style:preserve-3d] p-4 rounded-md ${
				isFlipped
					? `[transform:rotateY(180deg)] bg-neutral-100 dark:bg-neutral-800`
					: `${color}`
			}`}
		>
			<div
				className={`relative h-full w-full flex flex-col justify-center items-center  `}
				onClick={() => setSelectedCardId(card.id)}
			>
				<div
					className={`absolute inset-0 m-auto w-fit h-fit transition-opacity duration-500 font-extrabold ${
						isFlipped ? "opacity-0" : "opacity-100"
					}`}
				>
					{card.question}
				</div>

				<div
					className={`[transform:rotateY(180deg)] absolute inset-0 m-auto w-fit h-fit transition-opacity duration-500 font-extrabold ${
						isFlipped ? "opacity-100" : "opacity-0 "
					}`}
				>
					{card.answer}
				</div>
				<div
					className={`absolute inset-0 transition-transform duration-500 [transform:rotateY(180deg)] ${
						isFlipped
							? "[transform:rotateY(180deg)] "
							: "[transform:revert!important] "
					}`}
				>
					<svg
						onClick={handleFlip}
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6 hover:scale-105"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
						/>
					</svg>
				</div>
			</div>
		</div>
	);
}

export default Mini_Card;
