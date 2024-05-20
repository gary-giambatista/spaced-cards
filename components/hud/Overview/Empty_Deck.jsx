import React from "react";

function Empty_Deck({ isAddCardModalOpen, setIsAddCardModalOpen }) {
	return (
		<div className="flex flex-col gap-2 justify-center items-center h-full">
			<button
				onClick={() => setIsAddCardModalOpen((prevState) => !prevState)}
				className="h-9 w-36 flex justify-center items-center gap-1 bg-green-800 rounded-md hover:bg-green-900 text-white"
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
				<div className="">Add Card</div>
			</button>
			<div>Add a card to get started</div>
		</div>
	);
}

export default Empty_Deck;
