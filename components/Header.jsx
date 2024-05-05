import Logo from "@/public/Logo.png";
import Image from "next/image";
import React from "react";

function Header() {
	return (
		<header className="min-h-16 bg-slate-800 flex justify-between items-center px-4">
			<div className="flex justify-center items-center gap-x-2 ">
				<Image height={60} width={60} src={Logo} alt="Logo Image" />
				<h2>Spaced Cards</h2>
			</div>
			{/* Username button Component Clerk here  */}
			<div>Username</div>
		</header>
	);
}

export default Header;
