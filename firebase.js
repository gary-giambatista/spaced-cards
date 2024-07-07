// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDIr8gQvQYGrnvD3rcmPkFO2Llc27Kox8o",
	authDomain: "spaced-cards.firebaseapp.com",
	projectId: "spaced-cards",
	storageBucket: "spaced-cards.appspot.com",
	messagingSenderId: "749655616578",
	appId: "1:749655616578:web:4b52fcf1d55e398ccf51db",
	measurementId: "G-1MB43KK5P3",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };
