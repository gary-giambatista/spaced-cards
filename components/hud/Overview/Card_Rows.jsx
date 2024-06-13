import React, { useEffect, useState } from "react";
import Edit_Card_Modal from "./Edit_Card_Modal";
import Mini_Card from "./Mini_Card";

function Card_Rows({
	selectedDeck,
	setSelectedDeck,
	selectedCard,
	setSelectedCard,
	setSelectedCardId,
	setIsEditDeckModalOpen,
	setIsAddCardModalOpen,
}) {
	const [cards, setCards] = useState(selectedDeck.cards);
	const [filterText, setFilterText] = useState("");
	const [sortOption, setSortOption] = useState("");
	const [isInputFocused, setIsInputFocused] = useState(false);

	// Handles setting state for Filtering by input text
	const handleFilterChange = (e) => {
		setFilterText(e.target.value);
	};

	// State used for cards when there is input text to be used as a filter
	const filteredCards = selectedDeck.cards.filter((card) =>
		card.question.toLowerCase().includes(filterText.toLowerCase())
	);

	// Handles setting state for Sorting by select option
	const handleSortChange = (e) => {
		setSortOption(e.target.value);
	};

	/**
	 * Handle sorting cards via the option select, and/or filtering via the text input
	 * @param {object[]} cards
	 * @param {boolean} removeDueCards - to remove due cards or not
	 * @returns sorted cards, or sorted + filtered cards if there is filterText
	 */
	function sortAndFilterCards(cards, filterDueCards) {
		// Filter cards ONLY if there is input text in the filter input
		if (filterText) cards = filteredCards;

		// Remove due cards if desired
		if (filterDueCards) cards = removeDueCards(cards);

		const sortedAndFilteredCards = [...cards].sort((a, b) => {
			if (sortOption === "by-easiest") {
				return b.last_answer - a.last_answer;
			} else if (sortOption === "by-hardest") {
				return a.last_answer - b.last_answer;
			} else {
				return 0;
			}
		});

		return sortedAndFilteredCards;
	}

	/**
	 * Remove cards without last_answer property
	 * @param {object[]} cards
	 * @returns {object[]} cards without any due cards
	 */
	function removeDueCards(cards) {
		return cards.filter((card) => card.last_answer !== null);
	}

	/**
	 * Returns ONLY cards that are due for review
	 * @param {object[]} cards - selectedDeck.cards
	 * @returns {object[]}
	 */
	function showOnlyDueCards(cards) {
		if (filterText) cards = filteredCards;
		return cards.filter((card) => card.review_due === true);
	}

	// Handles setting cards, when is used to render the Mini_Card's into rows
	useEffect(() => {
		// No filter input text or sort by select options: no sorting/filtering
		if (!filterText && !sortOption) {
			console.log("NO sorting/filters applied to cards");
			return setCards(selectedDeck.cards);
		}

		// Sort and filtering happens here
		if (sortOption === "is-due") {
			return setCards(() => showOnlyDueCards(selectedDeck.cards));
		}
		if (sortOption && !filterText) {
			console.log("Filtering by SELECT");
			return setCards(() => sortAndFilterCards(selectedDeck.cards, true));
		} else if (sortOption && filterText) {
			console.log("Filtering by INPUT and SELECT");
			return setCards(() => sortAndFilterCards(selectedDeck.cards, true));
		} else if (filterText && !sortOption) {
			console.log("Filtering by INPUT");
			return setCards(() => sortAndFilterCards(selectedDeck.cards, false));
		}
	}, [filterText, sortOption, selectedDeck.cards]);

	// Colors array for repeating background colors on just created cards
	const colors = ["bg-[#5FB55D]", "bg-[#CBD748]", "bg-[#D74848]"];

	// Background color for cards based upon their last practice score
	// 5 = easy, 3 = medium, 1 = hard
	const reviewedColors = {
		5: "bg-[#5FB55D]",
		3: "bg-[#CBD748]",
		1: "bg-[#D74848]",
	};

	return (
		<div className="w-full">
			{/* Search Filter(s) */}
			<section className="w-full sm:w-3/4 xl:w-1/2 flex relative justify-center items-center gap-2 pb-4 mx-auto">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-4 absolute left-2"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>
				<input
					onFocus={() => setIsInputFocused(true)}
					onBlur={() => setIsInputFocused(false)}
					onChange={handleFilterChange}
					value={filterText}
					className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-md p-2 pl-8"
					placeholder="Find card..."
				/>
				{/* Add filter/sort dropdown select here */}
				{/* Dropdown for sorting */}
				<select
					onChange={handleSortChange}
					value={sortOption}
					className={`bg-neutral-100 dark:bg-neutral-900 rounded-md  transition-all ${
						isInputFocused && window.innerWidth < 480
							? "w-0 opacity-0 p-0"
							: "w-fit opacity-100 p-2 pl-2"
					}`}
				>
					<option value="">Sort by</option>
					<option value="by-easiest">By Easiest</option>
					<option value="by-hardest">By Hardest</option>
					<option value="is-due">Is Due</option>
				</select>
				{/* Manage/Add Card Buttons */}
				<div
					className={` justify-end items-center gap-2 ${
						!selectedDeck ? "hidden" : "flex"
					}`}
				>
					<button
						disabled={!selectedDeck}
						onClick={() => setIsEditDeckModalOpen((prevState) => !prevState)}
						className="h-9 w-10 lg:w-36 flex justify-center items-center gap-1 dark:bg-neutral-800 bg-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-900 rounded-md disabled:cursor-not-allowed"
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
						className="h-9 w-10 lg:w-36  flex justify-center items-center gap-1 bg-green-800 text-white dark:bg-green-800 rounded-md dark:hover:bg-green-900 disabled:cursor-not-allowed"
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
			</section>

			<section className="grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5 @7xl:grid-cols-6 @[1921px]:grid-cols-8 gap-4">
				{cards.map((card, index) => {
					const colorClass = colors[index % colors.length];
					return (
						<div className="relative" key={card.id}>
							{/* Edit Card Modal for Mobile */}
							{selectedCard?.id === card?.id && window.innerWidth < 449 ? (
								<Edit_Card_Modal
									selectedDeck={selectedDeck}
									setSelectedDeck={setSelectedDeck}
									selectedCard={selectedCard}
									setSelectedCard={setSelectedCard}
									lastIndex={selectedDeck.cards.length - 1 === index}
								/>
							) : null}
							<Mini_Card
								card={card}
								setSelectedCardId={setSelectedCardId}
								color={
									reviewedColors[card?.last_answer]
										? reviewedColors[card?.last_answer]
										: colorClass
								}
								selectedDeck={selectedDeck}
								setSelectedDeck={setSelectedDeck}
								selectedCard={selectedCard}
								setSelectedCard={setSelectedCard}
							/>
						</div>
					);
				})}
			</section>
		</div>
	);
}

export default Card_Rows;
