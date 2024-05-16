"use client";

import Logo from "@/public/Logo.png";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";

function Header() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	// Prevent Hydration Mismatch Error
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}
	// END Prevent Hydration Mismatch Error

	return (
		<header className="min-h-16 bg-slate-800 flex justify-between items-center px-4 ">
			<div className="flex justify-center items-center gap-x-2 ">
				<Image height={60} width={60} src={Logo} alt="Logo Image" />
				<h2>Spaced Cards</h2>
			</div>
			{/* Username button Component Clerk here  */}
			<div
				onClick={() =>
					theme === "dark" ? setTheme("light") : setTheme("dark")
				}
				className="dark:text-blue-600"
			>
				{theme === "dark" ? "Dark" : "Light"}
			</div>
		</header>
	);
}

export default Header;
