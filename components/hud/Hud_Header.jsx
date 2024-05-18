import React from "react";

function Hud_Header({
	setMode,
	mode,
	isCardModalOpen,
	setIsAddCardModalOpen,
	selectedDeck,
	isEditDeckModalOpen,
	setIsEditDeckModalOpen,
}) {
	return (
		<section className="flex justify-between items-center h-9 md:h-12 w-full relative">
			<div
				className={`flex justify-center items-center ${
					selectedDeck ? "md:mx-auto" : "mx-auto"
				}`}
			>
				<button
					onClick={() => setMode("overview")}
					className={`h-9 w-28 sm:w-36 px-4 rounded-l-md  hover:bg-neutral-200 dark:hover:bg-neutral-900 outline outline-1 outline-black dark:outline-white ${
						mode === "overview"
							? "bg-neutral-100 dark:bg-neutral-800"
							: "bg-white dark:bg-black"
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
					className={`h-9 w-28 sm:w-36 px-4 rounded-r-md hover:bg-neutral-200 dark:hover:bg-neutral-900 outline outline-1 outline-black dark:outline-white disabled:cursor-not-allowed ${
						mode === "study"
							? "bg-neutral-100 dark:bg-neutral-800"
							: "bg-white dark:bg-black"
					}`}
				>
					Study
				</button>
			</div>
			{/* Manage/Add Card Buttons OR Review count remaining */}
			{mode === "overview" ? (
				<div
					className={` justify-end items-center gap-2 ${
						!selectedDeck ? "hidden" : "flex"
					}`}
				>
					<button
						disabled={!selectedDeck}
						onClick={() => setIsEditDeckModalOpen((prevState) => !prevState)}
						className="h-9 w-10 lg:w-36 flex justify-center items-center gap-1 bg-slate-800 rounded-md hover:bg-slate-500 disabled:cursor-not-allowed"
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
								d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
						</svg>

						<div className="hidden lg:block">Manage</div>
					</button>
					<button
						disabled={!selectedDeck}
						onClick={() => setIsAddCardModalOpen((prevState) => !prevState)}
						className="h-9 w-10 lg:w-36  flex justify-center items-center gap-1 bg-green-800 rounded-md hover:bg-green-900 disabled:cursor-not-allowed"
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
				</div>
			) : (
				<div className="h-9 bg-slate-500 aspect-square absolute right-0 flex items-center justify-center rounded-md p-2">
					{selectedDeck.reviews_due}
				</div>
			)}
		</section>
	);
}

export default Hud_Header;
