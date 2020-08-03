import { signInWithGoogle } from './firebase/firebase.utils';

import { auth } from './firebase/firebase.utils';

const state = {};

// Handle Google Sign In
auth.onAuthStateChanged(user => {
  state.currentUser = user;
  console.log(user);
  // If not logged in redirects to login page
  if (!user) {
    window.location.replace('login.html');
  }
});

document.querySelector('#signout').addEventListener('click', e => {
  auth.signOut();
  state.currentUser = null;
});
