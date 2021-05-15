import React, { useState, useEffect } from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Button from './components/Button';
import Channel from './components/Channel';

firebase.initializeApp({
	apiKey: 'AIzaSyDPqx7_TLzP2hfcYG3iMxafgmn9S2TPpPE',
	authDomain: 'one-group-chat.firebaseapp.com',
	projectId: 'one-group-chat',
	storageBucket: 'one-group-chat.appspot.com',
	messagingSenderId: '39083857749',
	appId: '1:39083857749:web:0c3b2452aea8ab684d01dc',
	measurementId: 'G-1WPEK2LTKX',
});

const auth = firebase.auth();
const db = firebase.firestore();

function App() {
	const [user, setUser] = useState(() => auth.currentUser);
	const [initializing, setInitializing] = useState(true);

	useEffect(() => {
		const unSubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				setUser(user);
			} else setUser(null);

			if (initializing) {
				setInitializing(false);
			}
		});
		return unSubscribe;
	}, [initializing]);

	const signInWithGoogle = async () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.useDeviceLanguage();

		try {
			await auth.signInWithPopup(provider);
		} catch (error) {
			console.log(error);
		}
	};

	const signOut = async () => {
		try {
			await firebase.auth().signOut();
		} catch (error) {
			console.log(error.message);
		}
	};

	if (initializing) return 'Loading...';

	return (
		<div>
			{user ? (
				<>
					<Button onClick={signOut}>Sign out</Button>
					<Channel user={user} db={db} />
				</>
			) : (
				<Button onClick={signInWithGoogle}>Sign in with Google</Button>
			)}
		</div>
	);
}

export default App;
