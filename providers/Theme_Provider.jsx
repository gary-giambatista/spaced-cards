"use client";

import { ThemeProvider } from "next-themes";
import React, { useEffect, useState } from "react";

function Theme_Provider({ children }) {
	const [mounted, setMounted] = useState(false);

	// Prevent Hydration Mismatch Error
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}
	// END Prevent Hydration Mismatch Error

	return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}

export default Theme_Provider;
