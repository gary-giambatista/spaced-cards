"use client";

import Deck_Selector from "@/components/hud/Deck_Selector";
import Overview from "@/components/hud/Overview";
import Study from "@/components/hud/Study";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { SuperMemoGrade, SuperMemoItem, supermemo } from "supermemo";

export default function Home() {
	const [mode, setMode] = useState("overview");
	const [drawerOpen, setDrawerOpen] = useState(true);
	return (
		<main className="flex">
			<div className="flex w-full" onClick={() => setDrawerOpen(!drawerOpen)}>
				<Deck_Selector drawerOpen={drawerOpen} />
				{mode === "overview" ? <Overview /> : <Study />}
			</div>
		</main>
	);
}
