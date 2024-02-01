import React from "react";

function Add_Card_Modal({ isAddCardModalOpen, setIsAddCardModalOpen }) {
	function handleSubmit(e) {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);
		const formJson = Object.fromEntries(formData.entries());
		console.log(formJson);
		//Consider modifying the local decks object to avoid refetching after each card is added to the deck
	}
	return (
		<div className="@container absolute h-full w-full left-0 top-0 bg-black bg-opacity-10 flex items-start justify-center  @lg:items-center backdrop-blur-sm p-2">
			<div className="bg-green-700 relative rounded-md">
				<div className="w-full flex justify-between p-4 @lg:p-6">
					<h2 className="text-xl text-center">Create a new card</h2>
					<button
						className=""
						onClick={() => setIsAddCardModalOpen((prevState) => !prevState)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6 "
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18 18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<form
					className="w-full h-full flex flex-col gap-4 p-4 @lg:p-6 pt-0 @lg:pt-0"
					method="post"
					onSubmit={handleSubmit}
				>
					<label className="flex flex-col">
						Question:{" "}
						<input
							className="w-full p-2 rounded-md text-black"
							name="question_input"
							placeholder="Your question here"
							defaultValue=""
						/>
					</label>
					<label className="flex flex-col">
						Answer:{" "}
						<input
							className="w-full p-2 rounded-md text-black"
							name="answer_input"
							placeholder="Your answer here"
							defaultValue=""
						/>
					</label>
					<label className="flex flex-col">
						Hint:{" "}
						<input
							className="w-full p-2 rounded-md text-black"
							name="hint_input"
							placeholder="Your hint here"
							defaultValue=""
						/>
					</label>
					<label className="flex flex-col">
						Notes:{" "}
						<textarea
							type="textarea"
							className="w-full p-2 rounded-md text-black resize-none"
							name="notes_input"
							placeholder="Your notes here"
							defaultValue=""
							rows={2}
							cols={40}
						/>
					</label>
					<hr />
					<label className="flex items-center gap-4">
						Create mirrored duplicate card:{" "}
						<input
							className="appearance-none bg-white rounded-sm border-2 border-green-500 checked:bg-green-800 w-4 h-4 "
							type="checkbox"
							name="mirror_or_not"
							defaultChecked={true}
						/>
					</label>

					<hr />
					<div className="flex justify-evenly items-center">
						<button className="bg-red-400 py-3 px-5 rounded-md" type="reset">
							Reset
						</button>
						<button className="bg-green-400 py-3 px-5 rounded-md" type="submit">
							Create
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Add_Card_Modal;

//Todo: Disable Add Card button after click or change to cancel
//Todo: fix the checkbox with custom SVG
