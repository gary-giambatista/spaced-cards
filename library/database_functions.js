import { db } from "@/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

//1. fetch user's decks, if decks, return decksRef and STOP here
//   Check if decks exists in DB, if so make a ref for it using React
//   state and stop any further logic
export const fetchDecks = async (
	userId,
	decks,
	setDecks,
	setSelectedDeck,
	updateReviewsDue
) => {
	console.log("FETCHING DECKS ⚡");
	try {
		const querySnapshot = await getDocs(
			collection(db, "users", userId, "decks")
		);
		// array of objects each a document with decks: "string"
		// left as an array in case of adding folders in the future
		const decksList = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		if (decksList.length > 0) {
			console.log("decksFromDB Fetched Here: ", decksList);
			// Set DB version of decks into LS -> will override LS with DB ***
			localStorage.setItem("decks", decksList[0].decks);
			// Hardcoded to deck1 -> will need to be updated for folders
			const parsedDecks = JSON.parse(decksList[0].decks);
			console.log("parsedDecks Fetched Here: ", parsedDecks);
			const sortedAndParsedDecks = updateReviewsDue(parsedDecks);
			console.log("sortedAndParsedDecks: ", sortedAndParsedDecks);
			console.log("Decks set from DB ⭐");
			setDecks(sortedAndParsedDecks);
			setSelectedDeck(sortedAndParsedDecks[0]);
		} else {
			//2. -> if no decksFromDb, todo: -> add fetchUser() + createUser() flow
			//Todo: 🔑 may need to setDecks because of first login
			setDecksInDB(userId, decks);
		}
	} catch (error) {
		console.error("Error fetching users:", error);
	}
};

export const fetchUser = async (userId, decks, setUserRef) => {
	console.log("FETCHING USER ⚡");
	try {
		const userDocRef = doc(db, "users", userId);
		const userDoc = await getDoc(userDocRef);
		if (userDoc.exists()) {
			setUserRef(userDoc.data());
			if (decks && decks.length > 0) {
				setDecksInDB(userId, decks);
			}
		} else {
			//3. --> if no userRef, createUser() using userId (Clerk State) as the document Id in the users collection
			createUser(userId, decks, setUserRef);
		}
	} catch (error) {
		console.error("Error fetching user:", error);
	}
};

// Todo: can probably remove createUser unless I want to store user info here instead of clerk
export const createUser = async (userId, decks, setUserRef) => {
	console.log("CREATING USER ⚡");
	try {
		const userDocRef = doc(db, "users", userId);
		await setDoc(userDocRef, { created: new Date() });
		setUserRef({ created: new Date() });
		if (decks?.length > 0) {
			//4. ---> if decks (local React State) -> create decks in DB for this new user
			console.log("Call setDecksInDB via createUser!!! ✍");
			setDecksInDB(userId, decks);
		}
	} catch (error) {
		console.error("Error creating user:", error);
	}
};

export const setDecksInDB = async (userId, decks) => {
	console.log("Setting Doc for decks in DB ⚡");

	// Don't Set a null doc in FB, throws error (save DB write too)
	if (!decks) return;

	//Todo: change "deck1", to deck.name for less heavy data writes

	try {
		const userDocRef = doc(db, "users", userId);
		const decksCollectionRef = collection(userDocRef, "decks");
		const newDeckDocRef = doc(decksCollectionRef, "deck1"); // or use a different ID if you prefer
		const stringifiedDecks = JSON.stringify(decks);
		await setDoc(newDeckDocRef, { decks: stringifiedDecks });
		console.log("Decks set in DB! 💽");
		// fetchDecks(); --> ❌ everything is in React State
		// TODO: 🔒 may need to add setDecks here at some point
	} catch (error) {
		console.error("Error creating decks:", error);
	}
};
