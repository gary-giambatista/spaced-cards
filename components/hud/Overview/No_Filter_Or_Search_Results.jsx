import React from "react";

function No_Filter_Or_Search_Results() {
	return (
		<div className="h-80 w-full p-4 rounded-md bg-neutral-100 dark:bg-neutral-800 flex flex-col justify-center items-center gap-2">
			<div className="font-extrabold">No cards!</div>
			<div className="">Please try again!</div>
		</div>
	);
}

export default No_Filter_Or_Search_Results;
