import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Theme_Provider from "@/providers/Theme_Provider";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
	title: "Create and Study Flashcards",
	description: "Use spaced repetition to study efficiently",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<Theme_Provider>
				<body className={`${nunito.className} flex flex-col h-dvh`}>
					<Header />
					{children}
					<Footer />
				</body>
			</Theme_Provider>
		</html>
	);
}
