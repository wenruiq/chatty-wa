import { signInWithGoogle } from './firebase/firebase.utils';
import { auth, createUserDocument } from './firebase/firebase.utils';

import { elements, clearSpinner } from './views/base';

import * as loginView from './views/loginView';

const state = {};

// *Control login (initializes retrieval of data)
const controlLogin = () => {
  // todo: get user data from state
  // todo: load nav col top bar
  if (state.currentUser) {
    loginView.loadTopBar(state.currentUser);
  }

  // todo: get list of contacts
  // todo: load contacts
};

// *Control contacts
const controlContacts = () => {};

// *Control search
const controlSearch = async () => {};

// *Handle firebase sign in authentications
auth.onAuthStateChanged(async userAuth => {
  if (userAuth) {
    console.log({ userAuth });
    // *Check if this was a sign up
    const displayName = localStorage.getItem('displayName');
    if (displayName) {
      // *Sign up process
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
      clearSpinner();
      controlLogin();
    });
  }

  // *If not logged in/signed out, redirects to login page
  if (!userAuth) {
    state.currentUser = userAuth;
    window.location.replace('login.html');
  }
});

elements.signOutBtn.addEventListener('click', e => {
  auth.signOut();
});
