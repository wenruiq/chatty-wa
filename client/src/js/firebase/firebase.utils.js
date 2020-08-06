import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyAOHpgA68_RocikhcCulH_tLuFZMbydUM8',
  authDomain: 'chatty-wa.firebaseapp.com',
  databaseURL: 'https://chatty-wa.firebaseio.com',
  projectId: 'chatty-wa',
  storageBucket: 'chatty-wa.appspot.com',
  messagingSenderId: '693027905253',
  appId: '1:693027905253:web:55fb22096e2a00bf817e0c',
};

// Create user doc in firestore if first time login with google
export const createUserDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  // Always get doc reference first
  const userRef = firestore.doc(`users/${userAuth.uid}`);

  // Then perform CRUD
  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (err) {
      console.log('error creating user', err.message);
    }
  }

  return userRef;
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
