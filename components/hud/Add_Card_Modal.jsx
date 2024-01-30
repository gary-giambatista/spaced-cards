import React from "react";

function Add_Card_Modal() {
	return (
		<div className="absolute h-full w-full left-0 top-0 bg-black bg-opacity-10 flex items-start justify-center md:items-center backdrop-blur-sm">
			<div className="w-80 h-1/3 md:h-1/2 md:w-1/2 bg-green-700"></div>
		</div>
	);
}

export default Add_Card_Modal;

//Todo: Disable Add Card button after click or change to cancel
//Todo: build this modal component
