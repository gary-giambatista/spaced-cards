"use client";

function page() {
	// Clear LS to avoid syncing issues between LS and DB on next login
	localStorage.setItem("decks", null);

	return (
		<div className="h-full w-full flex flex-col justify-center items-center gap-4">
			<div>Thank you for using Space Cards!</div>
			<div>Please sign in again to pick up where you left</div>
		</div>
	);
}

export default page;
