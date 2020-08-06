import { elements } from './base';

export const getDisplayName = () => elements.signUpDisplayNameInput.value;
export const getEmail = () => elements.signUpEmailInput.value;
export const getPassword = () => elements.signUpPasswordInput.value;
export const getPasswordCfm = () => elements.signUpPasswordCfmInput.value;

// Sign up form validations (Could be improved)
export const signUpFormValidation = signUpInputs => {
  let errors = 0;

  // Mutliple fields are empty
  let emptyCount = 0;
  for (const value of Object.values(signUpInputs)) {
    if (!value) {
      emptyCount += 1;
    }
  }
  if (emptyCount > 1) {
    alert('Sign up fields incomplete, please check.');
    errors += 1;
    return;
  }

  // Singular field empty
  const { displayName, email, password, passwordCfm } = signUpInputs;
  if (!displayName) {
    alert('Display name is required for sign up.');
    elements.signUpDisplayNameInput.focus();
    errors += 1;
    return;
  } else if (!email) {
    alert('Email is required for sign up.');
    elements.signUpEmailInput.focus();
    errors += 1;
    return;
  } else if (!password) {
    alert('Password is required for sign up.');
    elements.signUpPasswordInput.focus();
    errors += 1;
    return;
  } else if (!passwordCfm) {
    alert('Confirm password is required for sign up.');
    elements.signUpPasswordCfmInput.focus();
    errors += 1;
    return;
  }

  // Invalid Email
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    alert('Email is invalid.');
    elements.signUpEmailInput.value = '';
    elements.signUpEmailInput.focus();
    errors += 1;
    return;
  }

  // Passwords don't match
  if (password !== passwordCfm) {
    alert("Passwords don't match.");
    elements.signUpPasswordInput.value = '';
    elements.signUpPasswordCfmInput.value = '';
    elements.signUpPasswordInput.focus();
    errors += 1;
    return;
  }
  
  if (errors) {
    return false;
  }
  return true;
};
