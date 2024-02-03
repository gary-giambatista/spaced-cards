import React, { useState } from "react";
import Hud_Header from "./Hud_Header";

function Study({ setMode }) {
	const [isNoteOpen, setIsNoteOpen] = useState(false);
	return (
		<section
			className={`flex flex-col gap-4 flex-grow bg-slate-600 p-4 overflow-y-auto`}
		>
			<div className="h-3/4 flex justify-center items-center  bg-slate-400">
				Card here
			</div>
			<div className="flex justify-between items-center">
				<button className="basis-1/3 bg-red-400">Hard</button>
				<button className="basis-1/3 bg-yellow-400">Medium</button>
				<button className="basis-1/3 bg-green-400">Easy</button>
			</div>

			<div className="flex flex-col gap-1 justify-center items-center bg-slate-500">
				<div
					onClick={() => setIsNoteOpen((prevState) => !prevState)}
					className="flex w-full gap-1 justify-center items-center"
				>
					<div>Notes</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className={`w-5 h-5 transition-transform ${
							isNoteOpen ? "rotate-180" : "rotate-0"
						}`}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m19.5 8.25-7.5 7.5-7.5-7.5"
						/>
					</svg>
				</div>
				{isNoteOpen ? (
					<textarea
						type="textarea"
						className="w-full p-2 rounded-md text-black resize-none"
						name="notes_input"
						placeholder="Your notes here"
						defaultValue=""
						rows={2}
						cols={40}
					/>
				) : null}
			</div>
		</section>
	);
}

export default Study;
