// *Firebase and socketio imports
import { signInWithGoogle } from './firebase/firebase.utils';
import { auth, createUserDocument } from './firebase/firebase.utils';
import io from 'socket.io-client';

// *Utilities import
import {
  elements,
  clearSpinner,
  renderLoader,
  clearLoader,
} from './views/base';

// *Models import
import Search from './models/Search';
import Contacts from './models/Contacts';
import Chat from './models/Chat';
import Socket from './models/Socket';

// *Views import
import * as loginView from './views/loginView';
import * as searchView from './views/searchView';
import * as contactsView from './views/contactsView';
import * as chatView from './views/chatView';
import Message from './models/Message';

// *Initiate state
const state = { contactSelected: null };
// !Console log TBR (To Be Removed)
console.log('%cCurrent state:', 'color:purple; font-weight: bold');
console.log({ state });

// *Connect to socket endpoint
const ENDPOINT = 'localhost:5000';
var socket = io(ENDPOINT);

// !Console log TBR (To Be Removed)
console.log('%cCurrent socket:', 'color:maroon; font-weight: bold');
console.log({ socket });

// *Control login (render nav-col-top, load contacts, connect to socket endpoint)
const controlLogin = () => {
  // *Load nav col top bar
  if (state.currentUser) {
    loginView.renderTopBar(state.currentUser);
  }
  // *Get contacts once (when socket hasn't been updated)
  if (!state.socket) {
    controlContacts();
  }
};

// todo: Control search & adding contacts
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
// todo: when adding contact, need to create the subcollections
// todo: users/contacts/messages

// *Control contacts (Get contacts)
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
  //
  controlSocket();
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
const controlMessage = async () => {
  // todo: get chat selected id from state
  const hisUserID = state.contactSelected;
  const msgContent = chatView.getInput();
  const msgTime = new Date();
  const senderID = state.currentUser.id;
  const senderName = state.currentUser.displayName;
  const receiverID = hisUserID;
  const msg = { msgContent, msgTime, senderID, senderName, receiverID };
  console.log({ msg });
  state.message = new Message(hisUserID, senderID, msg);
  try {
    await state.message.sendMessageToDB();
  } catch (err) {
    console.log(err);
  }

  // todo: Get his socket ID and emit message via socket
  try {
    await state.message.getSocketID();
    const hisSocketID = state.message.hisSocketID;
    socket.emit('message', hisSocketID, msg);
  } catch (err) {
    console.log(err);
  }
};
elements.typedMsgInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    controlMessage();
  }
});

// *Control socket
const controlSocket = async () => {
  // *Update firestore with my latest socketID (socket ID changes with page reload)
  if (state.currentUser) {
    const myUserID = state.currentUser.id;
    state.socket = new Socket(myUserID, socket.id);
    try {
      await state.socket.updateSocketID();
    } catch (error) {
      console.log(
        '%c state.socketUpdate.updateSocketID() error...',
        'color: red; font-weight: bold'
      );
      console.error(error);
    }
    
    // todo: set up msg receiver
    socket.on('message receiver', msg => {
      console.log('%c Message received at socket:', 'color: green');
      console.log(msg);
    })
  }
};

// *Handle firebase sign in authentications
auth.onAuthStateChanged(async userAuth => {
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

    // *Create user document in firestore if user doesn't exist yet
    const userRef = await createUserDocument(userAuth);
    // ?Is it necessary to controlLogin() everytime userRef changes?
    userRef.onSnapshot(snapShot => {
      state.currentUser = {
        id: snapShot.id,
        ...snapShot.data(),
      };
      console.log('%c userRef.onSnapshot fired.', 'color:cyan');
      // *Clear main spinner after getting current user data
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
