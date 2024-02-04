import React from "react";

function Card({
	isHintOpen,
	setIsHintOpen,
	isQuestionShowing,
	setIsQuestionShowing,
}) {
	return (
		<div className="h-3/4 flex flex-col justify-evenly items-center  bg-slate-400">
			{isQuestionShowing ? <div>Question</div> : <div>Answer</div>}
			<div className="flex flex-col gap-1 justify-center items-center">
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
				{isHintOpen ? <div>Hint here!</div> : null}
			</div>
			<button
				onClick={() => setIsQuestionShowing((prevState) => !prevState)}
				className="bg-blue-500 py-1 px-6 rounded-md"
			>
				Flip
			</button>
		</div>
	);
}

export default Card;
