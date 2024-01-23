"use client";

import Deck_Selector from "@/components/hud/Deck_Selector";
import Overview from "@/components/hud/Overview";
import Study from "@/components/hud/Study";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { SuperMemoGrade, SuperMemoItem, supermemo } from "supermemo";

export default function Home() {
	const [mode, setMode] = useState("overview");

	return (
		<main className="flex">
			<Deck_Selector />
			<div className=" flex w-full">
				{mode === "overview" ? <Overview /> : <Study />}
			</div>
		</main>
	);
}
