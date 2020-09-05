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
  searchInput: document.querySelector('.search-input'),
  navColList: document.querySelector('.nav-col-list'),
  chatColCover: document.querySelector('.chat-col-cover'),
  chatCol: document.querySelector('.chat-col'),
  chatColTop: document.querySelector('.chat-col-top'),
  chatColMessages: document.querySelector('.chat-col-messages'),
  typedMsgInput: document.querySelector('.typed-message-input'),
};

// *Reusable loaders and spinners
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
    parent.childNodes[1].firstElementChild.style.top = top;
  }
};

// *Loader is for smaller containers
export const clearLoader = parent => {
  if (parent.childNodes[1].className == 'loader') {
    parent.removeChild(parent.childNodes[1]);
  }
};

// *Spinner handles loading at page start
export const clearSpinner = () => {
  // *Only clear if spinner exists
  if (elements.spinner && elements.spinner.parentElement) {
    elements.spinner.parentElement.removeChild(elements.spinner);
  }
};

// *Converters
export const convertHHMM = firetime => {
  const hours = firetime.toDate().getHours();
  const minutes = firetime.toDate().getMinutes().toString().length == 2 ? firetime.toDate().getMinutes() : `0${firetime.toDate().getMinutes()}`;
  return `${hours}:${minutes}`;
};
