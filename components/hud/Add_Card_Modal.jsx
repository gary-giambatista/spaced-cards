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
		<div className="absolute h-full w-full left-0 top-0 bg-black bg-opacity-10 flex items-start justify-center md:items-center backdrop-blur-sm">
			<div className="w-80 h-1/3 md:h-1/2 md:w-1/2 bg-green-700 relative">
				<div className="w-full flex justify-between p-4">
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
					className="w-full h-full flex flex-col"
					method="post"
					onSubmit={handleSubmit}
				>
					<label className="w-full flex flex-col md:flex-row gap-2">
						Question:{" "}
						<input
							className="w-full text-black"
							name="question_input"
							placeholder="Your question here"
							defaultValue=""
						/>
					</label>
					<label>
						Answer:{" "}
						<input
							className="text-black"
							name="answer_input"
							placeholder="Your answer here"
							defaultValue=""
						/>
					</label>
					<label>
						Hint:{" "}
						<input
							className="text-black"
							name="hint_input"
							placeholder="Your hint here"
							defaultValue=""
						/>
					</label>
					<label>
						Notes:{" "}
						<textarea
							type="textarea"
							className="text-black"
							name="notes_input"
							placeholder="Your notes here"
							defaultValue=""
							rows={4}
							cols={40}
						/>
					</label>
					<hr />
					<label>
						Create mirrored duplicate card:{" "}
						<input type="checkbox" name="mirror_or_not" defaultChecked={true} />
					</label>

					<hr />
					<button type="reset">Reset form</button>
					<button type="submit">Submit form</button>
				</form>
			</div>
		</div>
	);
}

export default Add_Card_Modal;

//Todo: Disable Add Card button after click or change to cancel
//Todo: build/style this modal component
