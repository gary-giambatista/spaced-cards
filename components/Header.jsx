"use client";

import Logo from "@/public/Logo.png";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
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
		<header className="min-h-16 bg-white dark:bg-black flex justify-between items-center px-4 ">
			<Link className="flex justify-center items-center gap-x-2" href={"/"}>
				<Image height={60} width={60} src={Logo} priority alt="Logo Image" />
				<h2>Space Cards</h2>
			</Link>

			<div className="flex gap-4">
				{/* Theme Toggler */}
				<div
					onClick={() =>
						theme === "dark" ? setTheme("light") : setTheme("dark")
					}
					className="hover:cursor-pointer"
				>
					{theme === "dark" ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
							/>
						</svg>
					)}
				</div>
				{/* Clerk User Management */}
				<SignedOut>
					<SignInButton mode="modal" />
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</header>
	);
}

export default Header;
