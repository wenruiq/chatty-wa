import { signInWithGoogle } from './firebase/firebase.utils';
import { auth, createUserDocument } from './firebase/firebase.utils';
import io from 'socket.io-client';

import {
  elements,
  clearSpinner,
  renderLoader,
  clearLoader,
} from './views/base';

import Search from './models/Search';
import Contacts from './models/Contacts';
import Chat from './models/Chat';
import SocketUpdate from './models/SocketUpdate';

import * as loginView from './views/loginView';
import * as searchView from './views/searchView';
import * as contactsView from './views/contactsView';
import * as chatView from './views/chatView';

const state = { contactSelected: null };
// !Console log TBR
console.log('%cCurrent state:', 'color:purple; font-weight: bold');
console.log({ state });



// *Control login (render nav-col-top, load contacts, connect to socket endpoint)
const controlLogin = () => {

  // *Connect to socket endpoint
  //! how to reach this socket? might need to put above controlLogin again...
  const ENDPOINT = 'localhost:5000';
  state.socket = io(ENDPOINT);

  // *Load nav col top bar
  if (state.currentUser) {
    loginView.renderTopBar(state.currentUser);
  }
  // *Get contacts
  controlContacts();

  // *Sockets
  controlSocket();

};

// todo: finish control search
// *Control search
const controlSearch = async () => {
  // *Get input from search input
  const query = searchView.getInput();

  if (query) {
    // *Add to state
    state.search = new Search(query.toLowerCase());

    try {
      await state.search.getResults();
    } catch (error) {
      console.log(
        '%c search.getResults() error...',
        'color: red; font-weight: bold'
      );
      console.error(error);
    }
  }
};
// *Event listener for search
elements.searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    controlSearch();
  }
});

// *Control contacts
const controlContacts = async () => {
  // *Render loader in nav-col-list
  renderLoader(elements.navColList, '40px');

  // *Get current user id from state
  const currentUserID = state.currentUser.id;

  if (currentUserID) {
    // *Add to state
    state.contacts = new Contacts(currentUserID);
    try {
      // *Get all contacts from firestore
      await state.contacts.getContacts();

      // !Console log TBR
      console.log('%cAll my contacts:', 'color: blue; font-weight: bold;');
      console.log(state.contacts.data);

      // *Clear loader from nav-col-list
      clearLoader(elements.navColList);

      // *Render contacts
      contactsView.renderContacts(state.contacts);
    } catch (error) {
      console.log(
        '%c contacts.getContacts() error...',
        'color: red; font-weight: bold'
      );
      console.error(error);
    }
  }
};

// *Control chat
const controlChat = async contactID => {
  state.chat = new Chat(contactID, state.currentUser.id);

  // *Highlight selected chat & de-select previous chat
  chatView.highlightSelectedContact(state.contactSelected);

  // *Render chat-col-top
  chatView.renderTopBar(state.chat.contactID, state.contacts.data);

  // *Remove startup cover
  chatView.removeCover();

  // todo: make better looking loader?
  renderLoader(elements.chatColMessages, '100px');

  try {
    // *Get all messages pertaining this contact
    await state.chat.getMessages();
    console.log({ stateChatData: state.chat.data });
    // *Remove loader
    clearLoader(elements.chatColMessages);
    // *Render messages
    chatView.renderMessages(state.chat);
  } catch (error) {
    console.log(
      '%c contacts.getMessages() error...',
      'color: red; font-weight: bold'
    );
    console.error(error);
  }
};

// *Event listener for click on contact
elements.navColList.addEventListener('click', e => {
  // todo: state should be aware when the list rendered is search results
  // todo: only perform controlChat if !state.isSearch

  // *Get contactID of selected chat room
  const contactClicked = e.target.closest('.list-bar');
  if (contactClicked) {
    const contactID = contactClicked.getAttribute('contactid');
    // *Prevent fetching data twice
    if (state.contactSelected !== contactID) {
      state.contactSelected = contactID;
      controlChat(contactID);
    }
  }
});

// *Control message
const controlMessage = () => {
  const msg = chatView.getInput();
  // todo: get chat selected id from state
  // todo: get his socket id
  // todo: emit to "message", pass in his socket id, my msg

}

elements.typedMsgInput.addEventListener('keypress', e => {
  if (e.key === "Enter") {
    controlMessage();
  }
})

// todo: Control socket (configure sockets stuff...)
const controlSocket = async () => {
  // todo: update firestore with my newest socket id
  // *Update firestore with my latest socketID (socket ID changes with page reload)
  if (state.currentUser) {
    const myUserID = state.currentUser.id;
    state.socketUpdate = new SocketUpdate(myUserID, state.socket.id);
    try {
      await state.socketUpdate.updateSocketID();
    } catch (error) {
      console.log(
        '%c state.socketUpdate.updateSocketID() error...',
        'color: red; font-weight: bold'
      );
      console.error(error);
    }
  }

};

// ! Have to think of a way to trigger this safely whenever data is updated in firestore.
// *Handle firebase sign in authentications
auth.onAuthStateChanged(async userAuth => {
  // !this if statement is probably not good, can revert everything back to Socket instead of SocketUpdate model
  if (!state.socket) {
    if (userAuth) {
      // !Console log TBR
      console.log('%cUserAuth object:', 'color: DarkCyan; font-weight:bold');
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
        console.log("on snapshot leh...");
        clearSpinner();
        controlLogin();
      });
    }

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
