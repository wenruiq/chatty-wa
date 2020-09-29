import { signInWithGoogle } from './firebase/firebase.utils';
import { auth, createUserDocument } from './firebase/firebase.utils';

import SignIn from './models/SignIn';
import SignUp from './models/SignUp';
import * as formsView from './views/formsView';
import * as signUpView from './views/signUpView';
import * as signInView from './views/signInView';
import { elements } from './views/base';

const state = {};

// *Logged in user are redirected to index.html
auth.onAuthStateChanged(user => {
  if (user) {
    window.location.replace('index.html');
  }
});

// *Perform actions after page has loaded
window.addEventListener('load', () => {
  // Control form shrinks label when input.value.length > 0
  controlForms();
});

// *Control forms
const controlForms = () => {
  // Labels stay shrinked if there is form input in that field
  formsView.shrinkLabels();
};

// *Control sign in
const controlSignIn = async () => {
  const email = signInView.getEmail();
  const password = signInView.getPassword();
  if (signInView.formValidation({ email, password })) {
    state.signIn = new SignIn(email, password);
    try {
      state.signIn.processSignIn();
    } catch (err) {
      console.log('Something went wrong with sign in...');
    }
  }
};

elements.signInBtn.addEventListener('click', e => {
  e.preventDefault();
  controlSignIn();
});

elements.googleSignInBtn.addEventListener('click', e => {
  e.preventDefault();
  signInWithGoogle();
});

// *Control sign up
const controlSignUp = async () => {
  const displayName = signUpView.getDisplayName();
  const email = signUpView.getEmail();
  const password = signUpView.getPassword();
  const passwordCfm = signUpView.getPasswordCfm();
  // Validate form inputs
  if (
    signUpView.signUpFormValidation({
      displayName,
      email,
      password,
      passwordCfm,
    })
  ) {
    // Sign up if form validations passed
    state.signUp = new SignUp(displayName, email, password);
    try {
      await state.signUp.processSignUp();
    } catch (err) {
      console.log('Something went wrong with sign up...');
    }
  }
};

elements.signUpBtn.addEventListener('click', e => {
  e.preventDefault();
  controlSignUp();
});
