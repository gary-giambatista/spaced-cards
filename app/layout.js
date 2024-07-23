import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Query_Provider from "@/providers/Query_Provider";
import Theme_Provider from "@/providers/Theme_Provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
	title: "Create and Study Flashcards",
	description: "Use spaced repetition to study efficiently",
};

export default function RootLayout({ children }) {
	return (
		<ClerkProvider afterSignOutUrl="/loggedout">
			<html lang="en">
				<body className={`${nunito.className} flex flex-col h-dvh`}>
					<Theme_Provider>
						<Header />
						<Query_Provider>{children}</Query_Provider>
						<Footer />
					</Theme_Provider>
				</body>
			</html>
		</ClerkProvider>
	);
}
