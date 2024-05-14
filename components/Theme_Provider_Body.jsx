"use client";

import React, { createContext, useState } from "react";

const ThemeContext = createContext();

/**
 * @typedef {"dark" | "light"} theme
 */

function Theme_Provider_Body({ children }) {
	const [theme, setTheme] = useState("dark");

	const value = { state: { theme }, actions: { setTheme } };

	/**
	 * Sets theme to dark or light
	 * @returns {theme}
	 */
	function setThemeState() {
		/**@type {theme} */
		let theme = window.localStorage.getItem("theme");

		if (!theme) {
			theme = window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";

			window.localStorage.setItem("theme", theme);
		}
		return theme;
	}

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export default Theme_Provider_Body;
