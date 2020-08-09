export const elements = {
  signInEmailInput: document.querySelector('.sign-in-email-input'),
  signInPasswordInput: document.querySelector('.sign-in-password-input'),
  signInBtn: document.querySelector('#sign-in'),
  googleSignInBtn: document.querySelector('#google-sign-in'),
  signUpDisplayNameInput: document.querySelector('.sign-up-display-name-input'),
  signUpEmailInput: document.querySelector('.sign-up-email-input'),
  signUpPasswordInput: document.querySelector('.sign-up-password-input'),
  signUpPasswordCfmInput: document.querySelector('.sign-up-password-cfm-input'),
  signUpBtn: document.querySelector('#sign-up'),
  spinner: document.querySelector('.spinner-wrapper'),
  loader: document.querySelector('.loader'),
  signOutBtn: document.querySelector('.sign-out-icon'),
  navColTopBar: document.querySelector('.nav-col-top-photo-and-info'),
};

// * Reusable loaders and spinners

// *parent is the container, top is pixels to position loader from top of container
export const renderLoader = (parent, top = false) => {
  const loader = `            
  <div class="loader">
    <div class="loader-inner">
      <div class="loader-spinner"></div>
    </div>
  </div>`;
  parent.insertAdjacentHTML('afterbegin', loader);
  if (top) {
    parent.childNodes[0].style.top = top;
  }
};

export const clearLoader = parent => {
  if (parent.childNodes[0].className == 'loader') {
    parent.removeChild(parent.childNodes[0]);
  }
};

export const clearSpinner = () => {
  if (elements.spinner)
    elements.spinner.parentElement.removeChild(elements.spinner);
};
