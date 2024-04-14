import React from "react";

function Hud_Header({
	setMode,
	mode,
	isCardModalOpen,
	setIsAddCardModalOpen,
	selectedDeck,
}) {
	return (
		<section className="flex justify-between items-center h-9 md:h-12 w-full relative">
			<div className="flex justify-center items-center md:mx-auto gap-2">
				<button
					onClick={() => setMode("overview")}
					className={`h-9 w-36 px-4 rounded-l-md bg-slate-800 hover:bg-slate-500 outline ${
						mode === "overview" ? " outline-slate-400" : "outline-slate-200"
					}`}
				>
					Overview
				</button>
				<button
					disabled={
						selectedDeck?.cards?.length === 0 ||
						!selectedDeck ||
						selectedDeck.reviews_due === 0
					}
					onClick={() => setMode("study")}
					className={`h-9 w-36 px-4 rounded-r-md bg-slate-800 hover:bg-slate-500 outline disabled:cursor-not-allowed ${
						mode === "study" ? "outline-slate-400" : "outline-slate-200"
					}`}
				>
					Study
				</button>
			</div>
			{mode === "overview" ? (
				<button
					onClick={() => setIsAddCardModalOpen((prevState) => !prevState)}
					className="h-9 w-10 lg:w-36 absolute right-0 flex justify-center items-center gap-1 bg-green-800 rounded-md hover:bg-green-900"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 4.5v15m7.5-7.5h-15"
						/>
					</svg>
					<div className="hidden lg:block">Add Card</div>
				</button>
			) : (
				<div className="absolute right-0">{selectedDeck.reviews_due}</div>
			)}
		</section>
	);
}

export default Hud_Header;

//Todo: make sure the remainingReviews logic works
//Todo: Is this design with the + button okay? Or go with the column design? column design deleted
