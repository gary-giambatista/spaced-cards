import React from "react";

function Hud_Header({ setMode }) {
	return (
		<div className="flex justify-center items-center h-12 w-fit mx-auto">
			<button
				onClick={() => setMode("overview")}
				className="h-full px-4 w-36 rounded-l-md border-r-2 bg-slate-800 hover:bg-slate-500"
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
	);
}

export default Hud_Header;
