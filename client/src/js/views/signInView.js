import { elements } from './base';

export const getEmail = () => elements.signInEmailInput.value;
export const getPassword = () => elements.signInPasswordInput.value;

export const clearEmail = () => {
  elements.signInEmailInput.value = '';
};
export const clearPassword = () => {
  elements.signInPasswordInput.value = '';
};
export const clearInputs = () => {
  elements.signInEmailInput.value = '';
  elements.signInPasswordInput.value = '';
};

export const formValidation = ({ email, password }) => {
  let errors = 0;

  if (!email && !password) {
    errors += 1;
    elements.signInEmailInput.focus();
    alert('Email and password cannot be empty.');
  } else if (!email) {
    errors += 1;
    elements.signInEmailInput.focus();
    alert('Email cannot be empty.');
  } else if (!password) {
    errors += 1;
    elements.signInPasswordInput.focus();
    alert('Password cannot be empty.');
  }

  return !!!errors;
};

export const signInFailureMsg = () => {
  clearInputs();
  elements.signInEmailInput.focus();
  alert('Invalid email or password.');
};
