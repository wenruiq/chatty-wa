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
import Add from './models/Add';
import Remove from './models/Remove';
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
const state = { contactSelected: null, latestMsgTime: null };
// !Console log TBR (To Be Removed)
// console.log('%cCurrent state:', 'color:purple; font-weight: bold');
// console.log({ state });

// *Connect to socket endpoint
const ENDPOINT = 'https://chatty-wa.herokuapp.com/';
var socket = io(ENDPOINT);

// !Console log TBR (To Be Removed)
// console.log('%cCurrent socket:', 'color:maroon; font-weight: bold');
// console.log({ socket });

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

// *Control search
const controlSearch = async () => {
  // *Get input from search input
  const query = searchView.getInput();
  searchView.clearInput();
  contactsView.clearList();
  searchView.showSearchExit();

  if (query) {
    // *Render loader in nav-col-list
    renderLoader(elements.navColList, '40px');
    // *Add to state
    state.search = new Search(query.toLowerCase());
    state.isSearch = true;
    try {
      await state.search.getResults();
      clearLoader(elements.navColList);
      searchView.renderSearchResults(
        state.search.data,
        state.currentUser.id,
        state.contacts.data
      );
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
// *Event listener for exiting search
elements.clearSearchBtn.addEventListener('click', e => {
  contactsView.clearList();
  contactsView.renderContacts(state.contacts);
  searchView.hideSearchExit();
});

//* Control Add
const controlAdd = async hisID => {
  contactsView.clearList();
  renderLoader(elements.navColList, '40px');
  const myID = state.currentUser.id;
  try {
    const hisData = await state.contacts.getContact(hisID);
    const myData = await state.contacts.getContact(myID);
    state.add = new Add(myID, hisID, hisData, myData);
    try {
      await state.add.addFriend();
      clearLoader(elements.navColList);
      searchView.hideSearchExit();
      controlContacts();
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};
// *Event listener for click to add friend
elements.navColList.addEventListener('click', e => {
  // *Get contactID of selected user
  const userClicked = e.target.closest('.add-friend-btn');
  if (userClicked) {
    const hisID = userClicked.getAttribute('contactid');
    controlAdd(hisID);
  }
});

// *Control contacts (Get contacts)
const controlContacts = async () => {
  contactsView.clearList();

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
      // console.log('%cAll my contacts:', 'color: blue; font-weight: bold;');
      // console.log(state.contacts.data);

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
  // *Trigger controlSocket here
  setTimeout(controlSocket, 3000);
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

  // *Clear Messages
  chatView.clearMessages();

  // *Render Loader
  renderLoader(elements.chatColMessages, '100px');

  try {
    // *Get all messages pertaining this contact
    await state.chat.getMessages();
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
  // *Get contactID of selected chat room
  const contactClicked = e.target.closest('.list-bar');
  if (contactClicked) {
    const contactID = contactClicked.getAttribute('contactid');
    // *Prevent fetching data twice
    if (state.contactSelected !== contactID) {
      state.contactSelected = contactID;
      controlChat(contactID);
      // chatView.removeCoverAfterRemoveFriend();
      // *Remove unread message badge
      if (
        document
          .querySelector(`#unread-msg-badge-${contactID}`)
          .classList.contains('show-badge')
      ) {
        document
          .querySelector(`#unread-msg-badge-${contactID}`)
          .classList.remove('show-badge');
      }
    }
  }
});

//* Control Remove
const controlRemove = async hisID => {
  const myID = state.currentUser.id;
  try {
    state.remove = new Remove(myID, hisID);
    try {
      await state.remove.removeFriend();
      controlContacts();
      // chatView.addCover();
      state.contactSelected = null;
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};
// *Event listener for click to remove friend
elements.chatColTop.addEventListener('click', e => {
  // *Get contactID of selected user
  const userClicked = e.target.closest('#remove-friend-btn');
  if (
    userClicked &&
    confirm('Are you sure you want to remove this friend from your contacts?')
  ) {
    const hisID = userClicked.getAttribute('contactid');
    controlRemove(hisID);
  }
});

// *Control message
const controlMessage = async () => {
  const hisUserID = state.contactSelected;
  const msgContent = chatView.getInput();
  const msgTime = new Date();
  const senderID = state.currentUser.id;
  const senderName = state.currentUser.displayName;
  const receiverID = hisUserID;
  const msg = { msgContent, msgTime, senderID, senderName, receiverID };
  state.message = new Message(hisUserID, senderID, msg);
  // *Render message sent instantly
  chatView.renderMessage(msg, state.currentUser.id);
  contactsView.renderLatestMsg(
    msg,
    state.currentUser.id,
    state.contactSelected
  );

  try {
    await state.message.sendMessageToDB();
  } catch (err) {
    console.log(err);
  }

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
    if (chatView.getInput()) {
      controlMessage();
      chatView.clearInput();
    }
  }
});

elements.sendMessageBtn.addEventListener('click', e => {
  if (chatView.getInput()) {
    controlMessage();
    chatView.clearInput();
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

    // *Message receiver appends msg to UI accordingly
    socket.on('message receiver', msg => {
      // !Console log TBR
      // console.log('%c Message received at socket:', 'color: green');
      // console.log(msg);
      const contactSelectedID = state.contactSelected;
      const msgSenderID = msg.senderID;
      const contactIDList = state.contacts.dataIDList;
      if (!contactIDList.includes(msgSenderID)) {
        // *This guy added me but my contacts not refreshed yet
        controlContacts();
      } else {
        if (msg.msgTime != state.latestMsgTime) {
          if (msg.senderID == contactSelectedID) {
            chatView.renderMessage(msg, state.currentUser.id);
            contactsView.renderLatestMsg(msg, myUserID, contactSelectedID);
            state.latestMsgTime = msg.msgTime;
          } else {
            contactsView.renderLatestMsg(msg, myUserID, contactSelectedID);
            state.latestMsgTime = msg.msgTime;
          }
        }
      }
    });
  }
};

// *Handle firebase sign in authentications
auth.onAuthStateChanged(async userAuth => {
  if (userAuth) {
    // !Console log TBR
    // console.log('%cUserAuth object:', 'color: DarkCyan; font-weight:bold');
    // console.log({ userAuth });
    // *Check if this was a sign up
    const displayName = localStorage.getItem('displayName');
    const isSignUp = localStorage.getItem('is-sign-up');
    if (isSignUp == '1337') {
      // *Sign up process
      const userRef = await createUserDocument(userAuth, { displayName });
      localStorage.setItem('displayName', null);
      localStorage.setItem('is-sign-up', null);
    }

    // *Create user document in firestore if user doesn't exist yet
    const userRef = await createUserDocument(userAuth);
    // ?Is it necessary to controlLogin() everytime userRef changes?
    userRef.onSnapshot(snapShot => {
      state.currentUser = {
        id: snapShot.id,
        ...snapShot.data(),
      };
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
