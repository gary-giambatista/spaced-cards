import React from "react";

function Deck_Selector({ drawerOpen }) {
	return (
		<div
			className={`flex-shrink w-0 h-dvh bg-slate-400 transition-all ${
				drawerOpen ? "w-80" : "w-0"
			} `}
		>
			<div className="">Deck_Selector</div>
		</div>
	);
}

export default Deck_Selector;
