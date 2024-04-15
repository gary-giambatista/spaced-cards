import React, { useMemo } from "react";

function Edit_Card_Modal({
	selectedDeck,
	setSelectedDeck,
	selectedCard,
	setSelectedCard,
}) {
	//TODO: finish editCard function by updating only the selectedDeck's selectedCard
	// TODO: find the cause of the unclickable (uneditable) cards after clicking create a card
	function editCard(e) {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);
		const formJson = Object.fromEntries(formData.entries());
		console.log(formJson);

		// const newCard = {
		// 	id: Math.floor(Math.random() * (100000 - 1) + 1),
		// 	question: formJson.question_input,
		// 	answer: formJson.answer_input,
		// 	hint: formJson.hint_input,
		// 	note: formJson.notes_input,
		// 	interval: 0,
		// 	repetition: 0,
		// 	efactor: 2.5,
		// 	due_date: Date.now(),
		// 	review_due: false,
		// };

		const editedCard = selectedCard;
		// Update the card
		editedCard.question = formJson.question_input;
		editedCard.answer = formJson.answer_input;
		editedCard.hinter = formJson.hint_input;
		editedCard.note = formJson.notes_input;

		setSelectedDeck((prevState) => ({
			...prevState,
			cards: [...prevState.cards, newCard],
			// reviews_due: prevState.reviews_due + 1,
		}));
		console.log("EDITED selected DECK: ", selectedDeck);
		// Cannot update decks here because selectedDeck is not yet updated

		setSelectedCard(null);
	}

	return (
		<div className="@container absolute h-full w-full left-0 top-0 bg-black bg-opacity-10 flex items-start justify-center  @lg:items-center backdrop-blur-sm p-2">
			<div className="bg-green-700 relative rounded-md">
				<div className="w-full flex justify-between p-4 @lg:p-6">
					<h2 className="text-xl text-center">Edit your card</h2>
					<button className="" onClick={() => setSelectedCard(null)}>
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
					onSubmit={editCard}
				>
					<label className="flex flex-col">
						Question:{" "}
						<input
							className="w-full p-2 rounded-md text-black"
							name="question_input"
							placeholder="Your question here"
							defaultValue={selectedCard.question}
						/>
					</label>
					<label className="flex flex-col">
						Answer:{" "}
						<input
							className="w-full p-2 rounded-md text-black"
							name="answer_input"
							placeholder="Your answer here"
							defaultValue={selectedCard.answer}
						/>
					</label>
					<label className="flex flex-col">
						Hint:{" "}
						<input
							className="w-full p-2 rounded-md text-black"
							name="hint_input"
							placeholder="Your hint here"
							defaultValue={selectedCard.hint}
						/>
					</label>
					<label className="flex flex-col">
						Notes:{" "}
						<textarea
							type="textarea"
							className="w-full p-2 rounded-md text-black resize-none"
							name="notes_input"
							placeholder="Your notes here"
							defaultValue={selectedCard.note}
							rows={2}
							cols={40}
						/>
					</label>
					<hr />
					<div className="flex justify-evenly items-center">
						<button className="bg-red-400 py-3 px-5 rounded-md" type="reset">
							Delete
						</button>
						<button className="bg-green-400 py-3 px-5 rounded-md" type="submit">
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Edit_Card_Modal;
