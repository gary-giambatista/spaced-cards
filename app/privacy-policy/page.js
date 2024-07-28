function page() {
	const domainName = "Space Cards";
	const adminEmail = "gary.giambatista@gmail.com";
	const jurisdiction = "United States of America";

	return (
		<main className="h-full w-full flex flex-col gap-6 max-w-6xl mx-auto overflow-y-auto p-6 scrollbar-thin">
			<h1 className="self-center py-6 text-2xl font-extrabold">
				Privacy Policy
			</h1>

			<section>
				<h3 className="font-extrabold pb-2">Introduction</h3>
				<p>
					At {domainName}, we are committed to protecting your privacy. This
					Privacy Policy outlines the types of information we collect, how we
					use it, and the measures we take to safeguard your information.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Information We Collect</h3>
				<p>We collect the following information:</p>
				<ul className="list-disc pl-5">
					<li>
						<strong>OAuth Provider Information:</strong> When you create an
						account using an OAuth provider such as Google, we collect the
						information provided by the OAuth provider. This may include:
						<ul className="list-disc pl-5">
							<li>Your name</li>
							<li>Your email address</li>
							<li>Your profile picture</li>
							<li>
								Any other information you have chosen to share with the OAuth
								provider
							</li>
						</ul>
					</li>
					<li>
						<strong>User-Generated Content:</strong> We collect the content you
						create and submit on {domainName}, such as flashcards. This includes
						any text, images, or other data you input into the flashcards.
					</li>
				</ul>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">How We Use Your Information</h3>
				<p>We use the information we collect for the following purposes:</p>
				<ul className="list-disc pl-5">
					<li>
						<strong>Account Management:</strong> To create and manage your
						account on {domainName}.
					</li>
					<li>
						<strong>Service Provision:</strong> To provide, maintain, and
						improve our services, including the creation and management of
						flashcards.
					</li>
					<li>
						<strong>Communication:</strong> To send you updates, notifications,
						and other information related to your use of our website.
					</li>
					<li>
						<strong>Analytics:</strong> To analyze usage patterns and improve
						our website&apos;s functionality and user experience.
					</li>
				</ul>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Sharing Your Information</h3>
				<p>
					We do not sell, trade, or otherwise transfer your personal information
					to outside parties. We may share your information in the following
					circumstances:
				</p>
				<ul className="list-disc pl-5">
					<li>
						<strong>Service Providers:</strong> We may share your information
						with third-party service providers who assist us in operating our
						website and providing our services, as long as those parties agree
						to keep your information confidential.
					</li>
					<li>
						<strong>Legal Requirements:</strong> We may disclose your
						information if required by law or in response to a legal request,
						such as a subpoena or court order.
					</li>
				</ul>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Data Security</h3>
				<p>
					We implement a variety of security measures to protect your personal
					information. These measures include encryption, access controls, and
					secure servers to safeguard your data from unauthorized access,
					alteration, or disclosure.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Data Retention</h3>
				<p>
					We retain your information for as long as necessary to provide our
					services and fulfill the purposes outlined in this Privacy Policy. You
					may request the deletion of your data at any time by contacting us at{" "}
					{adminEmail}.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Your Rights</h3>
				<p>
					You have the following rights regarding your personal information:
				</p>
				<ul className="list-disc pl-5">
					<li>
						<strong>Access:</strong> You have the right to access the personal
						information we hold about you.
					</li>
					<li>
						<strong>Correction:</strong> You have the right to request
						correction of any inaccurate or incomplete information.
					</li>
					<li>
						<strong>Deletion:</strong> You have the right to request the
						deletion of your personal information.
					</li>
					<li>
						<strong>Objection:</strong> You have the right to object to the
						processing of your personal information.
					</li>
				</ul>
				<p>
					To exercise any of these rights, please contact us at {adminEmail}.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Changes to This Privacy Policy</h3>
				<p>
					We may update this Privacy Policy from time to time. We will notify
					you of any changes by posting the new Privacy Policy on our website.
					Your continued use of {domainName} after any changes indicates your
					acceptance of the new Privacy Policy.
				</p>
			</section>

			<section>
				<h3 className="font-extrabold pb-2">Contact Us</h3>
				<p>
					If you have any questions or concerns about this Privacy Policy,
					please contact us at:
				</p>
				<p>
					{domainName}
					<br />
					{adminEmail}
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
