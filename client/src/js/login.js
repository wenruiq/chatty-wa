import { signInWithGoogle } from './firebase/firebase.utils';

import { auth } from './firebase/firebase.utils';


document.querySelector('#google-sign-in').addEventListener('click', e => {
  e.preventDefault();
  signInWithGoogle();
});

auth.onAuthStateChanged(user => {
  if (user) {
    window.location.replace('index.html');
  }
});
