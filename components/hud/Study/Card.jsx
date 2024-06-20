import React, { useState } from "react";

function Card({
	isHintOpen,
	setIsHintOpen,
	isQuestionShowing,
	setIsQuestionShowing,
	selectedCard,
	selectedDeck,
}) {
	return (
		<div
			className={`h-full sm:h-3/4 flex flex-col justify-evenly items-center bg-neutral-200 dark:bg-neutral-800 rounded-2xl overflow-y-auto relative p-10 [perspective:1000px] transition-all duration-500 [transform-style:preserve-3d] ${
				!isQuestionShowing ? `[transform:rotateY(180deg)]` : ``
			}`}
		>
			{/* <div
				className={`absolute flex justify-end top-3 right-3 transition-transform duration-500 ${
					!isQuestionShowing
						? "[transform:rotateY(180deg)] "
						: "[transform:revert!important] "
				}`}
			> */}
			{/* Reviews Remaining */}
			<div
				className={`absolute top-3 right-3 py-1 px-3 rounded-full bg-neutral-200 dark:bg-neutral-900 transition-transform duration-500 ${
					!isQuestionShowing
						? "[transform:rotateY(180deg)] "
						: "[transform:revert!important] "
				}`}
			>
				{selectedDeck.reviews_due}
			</div>
			{/* </div> */}

			{/* Question/Answer Section */}
			<div
				className={`transition-transform duration-500 ${
					!isQuestionShowing
						? "[transform:rotateY(180deg)] "
						: "[transform:revert!important] "
				}`}
			>
				{isQuestionShowing ? selectedCard.question : selectedCard.answer}
			</div>

			{/* Hint Section */}
			<div
				className={`flex flex-col gap-1 justify-center items-center transition-transform duration-500 ${
					!isQuestionShowing
						? "[transform:rotateY(180deg)] "
						: "[transform:revert!important] "
				}`}
			>
				<div
					onClick={() => setIsHintOpen((prevState) => !prevState)}
					className="flex w-full gap-1 justify-center items-center"
				>
					<div>Hint</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className={`w-5 h-5 transition-transform ${
							isHintOpen ? "rotate-180" : "rotate-0"
						}`}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m19.5 8.25-7.5 7.5-7.5-7.5"
						/>
					</svg>
				</div>
				{isHintOpen ? <div>{selectedCard.hint}!</div> : null}
			</div>

			{/* Flip Button */}
			<button
				onClick={() => setIsQuestionShowing((prevState) => !prevState)}
				className={`bg-neutral-100 dark:bg-neutral-900 py-1 px-6 rounded-md transition-transform duration-500 ${
					!isQuestionShowing
						? "[transform:rotateY(180deg)] "
						: "[transform:revert!important] "
				}`}
			>
				Flip
			</button>
		</div>
	);
}
// @lg:w-3/4 @lg:mx-auto @5xl:max-w-screen-sm
export default Card;
