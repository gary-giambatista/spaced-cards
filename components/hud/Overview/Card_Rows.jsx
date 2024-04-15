import React from "react";
import Mini_Card from "./Mini_Card";

function Card_Rows({ selectedDeck, setSelectedCardId }) {
	//TODO: Implement Edit Card Modal and functionality (and delete)
	// 1. Create state for selectedCard / or use Mini_Card instead
	// 2. Create a modal similar to Add_Card_Modal to edit -- how to handle the tree / display absolute issue
	// 3. Pass selectedCard's info to Edit_Card_Modal
	// 4. Render selectedCard's info in Edit_Card_Modal
	// 5. Write a function similar to practice() to update that specific card in selectedDeck
	return (
		<div className="grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5 @7xl:grid-cols-6 @[1921px]:grid-cols-8 gap-4">
			{selectedDeck.cards.map((card) => {
				return (
					<>
						<Mini_Card card={card} setSelectedCardId={setSelectedCardId} />
					</>
				);
			})}
		</div>
	);
}

export default Card_Rows;
