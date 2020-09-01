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

firebase.initializeApp(config);

// *Main exports
export const auth = firebase.auth();
export const firestore = firebase.firestore();

// *Authentication related stuff
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

// *Create user doc in firestore if first time login with google
export const createUserDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();
  // ! This must be "if(!snapShot.exists)", we only do "if(snapShot.exists)" for testing purpose
  if (!snapShot.exists) {
    const { displayName, email, photoURL } = userAuth;
    const createdAt = new Date();
    // *Populate search terms
    const searchTerms = [];
    searchTerms.push(email.split('@')[0]);
    const nameChunks = displayName.split(' ');
    for (var chunk of nameChunks) {
      searchTerms.push(chunk.toLowerCase());
      if (chunk.length > 3) {
        for (var i = 3; i < chunk.length + 1; i++) {
          searchTerms.push(chunk.substring(0, i).toLowerCase());
        }
      }
    }
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        photoURL,
        searchTerms,
        ...additionalData,
      });
    } catch (err) {
      console.log('error creating user', err.message);
    }
  }
  return userRef;
};

// *Convert collectionSnapShot to array of maps
export const collectionToMapsArray = collectionSnapShot => {
  return collectionSnapShot.docs.map(doc => {
    return { contactID: doc.id, ...doc.data() };
  });
};

export default firebase;
