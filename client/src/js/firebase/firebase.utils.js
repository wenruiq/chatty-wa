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

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
