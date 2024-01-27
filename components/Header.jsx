import React from "react";

function Header() {
	return (
		<header className="min-h-16 bg-slate-800 flex justify-between items-center px-4">
			<div className="flex gap-x-2 ">
				<div>Image Placeholder</div>
				<h2>Spaced Cards</h2>
			</div>
			{/* Username button Component Clerk here  */}
			<div>Username</div>
		</header>
	);
}

export default Header;
