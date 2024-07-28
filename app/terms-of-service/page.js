import Link from "next/link";

function page() {
	const domainName = "Space Cards";
	const adminEmail = "gary.giambatista@gmail.com";
	const jurisdiction = "United States of America";
	const privacyDetails =
		"your: name, email address, profile picture, and any other information you have chosen to share with your sign in provider, such as Google";

	return (
		<main className="h-full w-full flex flex-col gap-6 max-w-6xl mx-auto overflow-y-auto p-6 scrollbar-thin">
			<h1 className="self-center py-6 text-2xl font-extrabold">
				Terms of Service and Use
			</h1>

			<section>
				<h3 className="font-extrabold pb-2">Introduction</h3>
				<p>
					Welcome to {domainName}, a platform designed to help users create and
					use flashcards for studying. By accessing and using our website, you
					agree to comply with and be bound by the following terms and
					conditions.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Acceptance of Terms</h3>
				<p>
					By using {domainName}, you accept and agree to be bound by these Terms
					of Service. If you do not agree to these terms, please do not use our
					website.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">User Accounts</h3>
				<p>
					To access certain features of our website, you may be required to
					create an account using an OAuth provider such as Google. You are
					responsible for maintaining the confidentiality of your account
					credentials and for all activities that occur under your account.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">User-Generated Content</h3>
				<p>
					You retain ownership of the content you create on {domainName}, such
					as flashcards. By submitting content, you grant {domainName} a
					non-exclusive, royalty-free, worldwide license to use, store, edit,
					and delete your content as necessary to provide our services. You
					agree not to create or share content that is illegal, offensive, or
					violates any third-party rights.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Privacy Policy</h3>
				<p>
					We collect certain information from OAuth providers (the service
					provider used to sign in) to create and manage your account. This
					includes {privacyDetails}. We are committed to protecting your privacy
					and will only use your information as described in our{" "}
					<Link href="/privacy-policy" className="underline">
						Privacy Policy
					</Link>
					. You have the right to access, modify, and delete your data. Please
					refer to our Privacy Policy for more details.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Usage Rules</h3>
				<p>
					You agree to use {domainName} in a manner consistent with all
					applicable laws and regulations. You are prohibited from: Engaging in
					illegal activities Harassing or threatening other users Spamming or
					sending unsolicited messages
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Intellectual Property</h3>
				<p>
					All content and materials on {domainName}, except for user-generated
					content, are the intellectual property of {domainName}. You may use
					our content for personal, non-commercial purposes only.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Termination of Accounts</h3>
				<p>
					We reserve the right to suspend or terminate your account if you
					violate these terms or engage in any behavior that we deem harmful to
					our platform or other users.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Limitation of Liability</h3>
				<p>
					{domainName} is provided &quot;as is&quot; without warranties of any
					kind. We do not guarantee the accuracy, reliability, or availability
					of our website. To the maximum extent permitted by law, we are not
					liable for any damages arising from your use of our website.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Changes to Terms</h3>
				<p>
					We may update these terms from time to time. We will notify you of any
					changes by posting the new terms on our website. Your continued use of{" "}
					{domainName} after any changes indicates your acceptance of the new
					terms.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Changes to Terms</h3>
				<p>
					If you have any questions or concerns about these terms, please
					contact us at {adminEmail}.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Governing Law</h3>
				<p>
					These terms are governed by the laws of {jurisdiction}. Any disputes
					arising from these terms or your use of our website will be resolved
					in the courts of {jurisdiction}.
				</p>
			</section>
		</main>
	);
}

export default page;
