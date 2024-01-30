"use client";

import Deck_Selector from "@/components/hud/Deck_Selector";
import Hud_Header from "@/components/hud/Hud_Header";
import Overview from "@/components/hud/Overview";
import Study from "@/components/hud/Study";
import debounce from "@/library/debounce";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { SuperMemoGrade, SuperMemoItem, supermemo } from "supermemo";

export default function Home() {
	const [mode, setMode] = useState("overview");
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [isSmallScreen, setIsSmallScreen] = useState(
		typeof window === "undefined" ? false : window.innerWidth <= 820
	);
	const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
	let timeout = false;

	//1.
	useEffect(() => {
		window.addEventListener("resize", () => {
			clearTimeout(timeout);
			setTimeout(handleWindowSizeChange, 500);
		});
		// window.addEventListener("resize", debounce(handleWindowSizeChange, 500));

		return () => {
			window.removeEventListener("resize", handleWindowSizeChange);
		};
	}, []);
	//2.
	function handleWindowSizeChange() {
		setIsSmallScreen(window.innerWidth <= 820);
	}
	//3.
	useEffect(() => {
		// If the screen size is above 820px
		if (!isSmallScreen) {
			setDrawerOpen(true);
		} else {
			setDrawerOpen(false);
		}
	}, [isSmallScreen]);

	return (
		<main className="flex h-full">
			<Deck_Selector drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
			<div className="flex flex-col w-full p-4 gap-4 bg-slate-300 overflow-y-auto">
				<Hud_Header
					setMode={setMode}
					mode={mode}
					isAddCardModalOpen={isAddCardModalOpen}
					setIsAddCardModalOpen={setIsAddCardModalOpen}
				/>
				{mode === "overview" ? (
					<Overview setMode={setMode} isAddCardModalOpen={isAddCardModalOpen} />
				) : (
					<Study setMode={setMode} />
				)}
			</div>
		</main>
	);
}

// Notes
// JS logic to hide drawer not necessary, because using media query to set the drawer to absolute fixes display issues
