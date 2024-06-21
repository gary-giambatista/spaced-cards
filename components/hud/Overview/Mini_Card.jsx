import dayjs from "dayjs";
import React, { useState } from "react";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

function Mini_Card({ card, setSelectedCardId, color }) {
	const [isFlipped, setIsFlipped] = useState(false);
	const isDue = card.due_date < Date.now();

	const handleFlip = (e) => {
		e.stopPropagation();
		setIsFlipped(!isFlipped);
	};

	const handleEdit = (e) => {
		e.stopPropagation();
		setSelectedCardId(card.id);
	};
	return (
		<div
			className={`h-80 w-full hover:cursor-pointer [perspective:1000px] group transition-all duration-500 [transform-style:preserve-3d] p-4 rounded-md ${
				isFlipped
					? `[transform:rotateY(180deg)] bg-neutral-100 dark:bg-neutral-800`
					: `${color}`
			}`}
		>
			{/* Container */}
			<div
				className={`relative h-full w-full flex flex-col justify-center items-center`}
				onClick={handleFlip}
			>
				{/* Question and Answer */}
				<div className="w-full h-full pt-10">
					<div
						className={`h-full w-full text-center content-center overflow-y-auto transition-opacity duration-250 font-extrabold scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-800 scrollbar-track-white dark:scrollbar-track-black ${
							isFlipped ? "opacity-0 hidden" : "opacity-100 block"
						}`}
					>
						{card.question}
					</div>
					{/* absolute inset-0 m-auto w-fit h-fit max-h-[calc(100%-32px)] vs: h-full w-full text-center content-center*/}
					<div
						className={`h-full w-full text-center content-center overflow-y-auto transition-opacity duration-250 font-extrabold scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-white dark:scrollbar-track-black [transform:rotateY(180deg)] ${
							isFlipped ? "opacity-100 block" : "opacity-0 hidden"
						}`}
					>
						{card.answer}
					</div>
				</div>

				{/* Due Badge */}
				<div
					className={`absolute m-auto top-0 w-fit h-fit transition-transform duration-500 font-extrabold px-2 rounded-md bg-white dark:bg-black ${
						isFlipped
							? "[transform:rotateY(180deg)]"
							: "[transform:revert!important]"
					} ${isDue ? "text-red-400" : ""}`}
				>
					{/* ${isDue ? "bg-red-800" : "bg-white dark:bg-black"} */}
					{isDue ? "Due" : dayjs().to(dayjs(card.due_date), true)}
				</div>

				{/* SVGs */}
				<div
					className={`absolute flex justify-between top-0 w-full transition-transform duration-500 ${
						isFlipped
							? "[transform:rotateY(180deg)] "
							: "[transform:revert!important] "
					}`}
				>
					{/* Flip SVG */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="opacity-100 lg:opacity-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 group-hover:pointer-events-auto size-6 hover:scale-105 peer-hover:opacity-0"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
						/>
					</svg>

					{/* Edit SVG */}
					<svg
						onClick={handleEdit}
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6 opacity-100 lg:opacity-0 transition-opacity duration-500 group-hover:opacity-100 hover:scale-105 peer"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
						/>
					</svg>
				</div>
			</div>
		</div>
	);
}

export default Mini_Card;
