import { db } from "@/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

//1. fetch user's decks, if decks, return decksRef and STOP here
//   Check if decks exists in DB, if so make a ref for it using React
//   state and stop any further logic
export const fetchDecks = async (userId, decks, setDeckRef, setUserRef) => {
	console.log("FETCHING DECKS ⚡");
	try {
		const querySnapshot = await getDocs(
			collection(db, "users", userId, "decks")
		);
		// array of objects each a document with decks: "string"
		const decksList = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		if (decksList.length > 0) {
			console.log("Deck ref here: ", decksList);
			setDeckRef(JSON.parse(decksList[0].decks));
		} else {
			//2. -> if no deckRef, fetchUser()
			fetchUser(userId, decks, setDeckRef, setUserRef);
		}
	} catch (error) {
		console.error("Error fetching users:", error);
	}
};

export const fetchUser = async (
	userId,
	decks,
	setDeckRef,
	setUserRef,
	setDecksInDB
) => {
	console.log("FETCHING USER ⚡");
	try {
		const userDocRef = doc(db, "users", userId);
		const userDoc = await getDoc(userDocRef);
		if (userDoc.exists()) {
			setUserRef(userDoc.data());
			if (decks && decks.length > 0) {
				setDecksInDB(userId, decks, setDeckRef);
			}
		} else {
			//3. --> if no userRef, createUser() using userId (Clerk State) as the document Id in the users collection
			createUser(userId, decks, setDeckRef, setUserRef);
		}
	} catch (error) {
		console.error("Error fetching user:", error);
	}
};

export const createUser = async (userId, decks, setDeckRef, setUserRef) => {
	console.log("CREATING USER ⚡");
	try {
		const userDocRef = doc(db, "users", userId);
		await setDoc(userDocRef, { created: new Date() });
		setUserRef({ created: new Date() });
		if (decks?.length > 0) {
			//4. ---> if decks (local React State) -> create decks in DB for this new user
			console.log("Call setDecksInDB via createUser!!! ✍");
			setDecksInDB(userId, decks, setDeckRef);
		}
	} catch (error) {
		console.error("Error creating user:", error);
	}
};

export const setDecksInDB = async (userId, decks, setDeckRef) => {
	console.log("Setting Doc for decks in DB ⚡");
	try {
		const userDocRef = doc(db, "users", userId);
		const decksCollectionRef = collection(userDocRef, "decks");
		const newDeckDocRef = doc(decksCollectionRef, "deck1"); // or use a different ID if you prefer
		const stringifiedDecks = JSON.stringify(decks);
		await setDoc(newDeckDocRef, { decks: stringifiedDecks });
		console.log("Decks set in DB! 💽");
		// fetchDecks(); --> ❌ everything is in React State
		setDeckRef(decks);
	} catch (error) {
		console.error("Error creating decks:", error);
	}
};
