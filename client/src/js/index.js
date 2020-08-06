import { signInWithGoogle } from './firebase/firebase.utils';
import { auth, createUserDocument } from './firebase/firebase.utils';

const state = {};

// Handle firebase sign in authentications
auth.onAuthStateChanged(async userAuth => {
  if (userAuth) {
    // Check if this was a sign up
    const displayName = localStorage.getItem('displayName');
    if (displayName) {
      // Sign up process
      const userRef = await createUserDocument(userAuth, { displayName });
      localStorage.setItem('displayName', null);
    }
  
    const userRef = await createUserDocument(userAuth);
    userRef.onSnapshot(snapShot => {
      state.currentUser = {
        id: snapShot.id,
        ...snapShot.data(),
      };
      console.log({ state });
    });
  }

  // If not logged in/signed out, redirects to login page
  if (!userAuth) {
    state.currentUser = userAuth;
    window.location.replace('login.html');
  }
});

document.querySelector('#signout').addEventListener('click', e => {
  auth.signOut();
});
