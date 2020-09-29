import {
  elements,
  convertStringHHMM,
  convertFireHHMM,
  convertStandardHHMM,
} from './base';

export const getInput = () => elements.typedMsgInput.value;

export const clearInput = () => (elements.typedMsgInput.value = '');

export const clearMessages = () => (elements.chatColMessages.innerHTML = '');

//* Removes default page (it is a cover on top)
export const removeCover = () => {
  const cover = elements.chatColCover;
  if (cover.parentElement) {
    cover.parentElement.removeChild(cover);
  }
};

//* Remove cover after remove friend
export const removeCoverAfterRemoveFriend = () => {
  const cover = elements.chatColCover;
  elements.chatCol.removeChild(elements.chatCol.childNodes[1]);
}

//* Add cover
export const addCover = () => {
  const markup = `
  <div class="chat-col-cover">
    <div class="welcome-message">
      Select a chat on the left to begin messaging!
    </div>
  </div>
  `;
  elements.chatCol.insertAdjacentHTML('afterbegin', markup);
};

export const highlightSelectedContact = contactSelected => {
  const listBars = Array.from(document.querySelectorAll('.list-bar'));
  listBars.forEach(listBar => {
    listBar.classList.remove('list-bar-selected');
    let id = listBar.getAttribute('contactid');
    if (id === contactSelected) {
      listBar.classList.add('list-bar-selected');
    }
  });
};

export const renderTopBar = (contactID, allContacts) => {
  const contactData = allContacts.find(
    contact => contact.contactID == contactID
  );
  if (contactData) {
    const { photoURL, displayName, email } = contactData;
    const markup = `
    <div class="chat-col-top-photo-and-info">
      <img
        src="${photoURL}"
        alt=""
        class="profile-image-sm"
      />
      <div class="chat-info">
        <div class="chat-name">${displayName}</div>
        <div class="chat-data">${email}</div>
      </div>
    </div>
    <i class="material-icons sign-out-icon" id="remove-friend-btn" contactid="${contactID}">person_remove</i>
    `;
    elements.chatColTop.innerHTML = '';
    elements.chatColTop.insertAdjacentHTML('afterbegin', markup);
  }
};

// *Render all messages (Done when fetching from firestore)
export const renderMessages = ({ currentUserID, data }) => {
  data.forEach(message => {
    renderMessage(message, currentUserID);
  });
};

// *Render one message (Used both as a helper method for the function above and to render latest msg at socket
export const renderMessage = (msg, currentUserID) => {
  const { senderID, senderName, msgTime, msgContent, receiverID } = msg;

  // *Check if msg is from socket or from database
  if (typeof msgTime == 'string') {
    var formattedTime = convertStringHHMM(msgTime);
  } else if (msgTime.seconds) {
    var formattedTime = convertFireHHMM(msgTime);
  } else {
    var formattedTime = convertStandardHHMM(msgTime);
  }

  if (senderID === currentUserID) {
    var markup = `
    <div class="bubble-outgoing">
      <div class="message-content">
        ${msgContent}
      </div>
      <div class="message-time">${formattedTime}</div>
      <div class="tail-out"></div>
    </div>
    `;
  } else {
    var markup = `
    <div class="bubble-incoming">
      <div class="message-sender">${senderName}</div>
      <div class="message-content">
        ${msgContent}
      </div>
      <div class="message-time">${formattedTime}</div>
      <div class="tail-in"></div>
    </div> 
    `;
  }
  elements.chatColMessages.insertAdjacentHTML('beforeend', markup);
  elements.chatColMessages.scrollTop = elements.chatColMessages.scrollHeight;
};
