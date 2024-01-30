import React from "react";

function Hud_Header({ setMode, mode, isCardModalOpen, setIsAddCardModalOpen }) {
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
					onClick={() => setMode("study")}
					className={`h-9 w-36 px-4 rounded-r-md bg-slate-800 hover:bg-slate-500 outline ${
						mode === "study" ? "outline-slate-400" : "outline-slate-200"
					}`}
				>
					Study
				</button>
			</div>
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
		</section>
	);
}

export default Hud_Header;

//Todo: Is this design with the + button okay? Or go with the column design?
//Todo: Add state to check if modal is open, use that to render AddCardModal component

{
	/* <section className="flex flex-col gap-4 justify-center items-center h-32 md:flex-row md:gap-0 w-full md:h-12">
<div className="flex justify-center items-center w-fit mx-auto">
	<button
		onClick={() => setMode("overview")}
		className="h-9 md:h-full px-4 w-36 rounded-l-md border-r-2 bg-slate-800 hover:bg-slate-500"
	>
		Overview
	</button>
	<button
		onClick={() => setMode("study")}
		className="h-full px-4 w-36 rounded-r-md bg-slate-800 hover:bg-slate-500"
	>
		Study
	</button>
</div>
<button className="h-9 w-36 bg-green-800 rounded-md hover:bg-green-900">
	Add Card
</button>
</section> */
}
