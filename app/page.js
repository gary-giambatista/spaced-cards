"use client";

import Deck_Selector from "@/components/hud/Deck_Selector";
import Hud_Header from "@/components/hud/Hud_Header";
import Overview from "@/components/hud/Overview";
import Study from "@/components/hud/Study";
import dayjs from "dayjs";
import { useState } from "react";
import { SuperMemoGrade, SuperMemoItem, supermemo } from "supermemo";

export default function Home() {
	const [mode, setMode] = useState("overview");
	const [drawerOpen, setDrawerOpen] = useState(true);
	return (
		<main className="flex h-full">
			<Deck_Selector drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
			<div className="flex flex-col w-full p-4 gap-4 bg-slate-300">
				<Hud_Header setMode={setMode} />
				{mode === "overview" ? (
					<Overview setMode={setMode} />
				) : (
					<Study setMode={setMode} />
				)}
			</div>
		</main>
	);
}
