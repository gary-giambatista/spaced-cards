import Link from "next/link";
import React from "react";

function Footer() {
	return (
		<footer className="bg-white dark:bg-black min-h-10 flex items-center gap-4 px-2 justify-center lg:justify-start">
			<a href="https://gary-giambatista.com/">Author</a>
			<Link href="/terms-of-service">Terms of Service</Link>
			<Link href="/privacy-policy">Privacy Policy</Link>
		</footer>
	);
}

export default Footer;
