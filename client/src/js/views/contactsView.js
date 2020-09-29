import { elements, convertFireHHMM } from './base';

export const clearList = () => (elements.navColList.innerHTML = '');

export const renderContacts = ({ data, currentUserID }) => {
  if (!data.length) {
    const markup = `
    <div class="empty-contacts-notice">
      Use the search bar above to add your friends!
    </div>
    `;
    elements.navColList.insertAdjacentHTML('beforeend', markup);
  }
  data.forEach(contact => {
    var {
      photoURL,
      displayName,
      latestMsg: { msgContent, msgTime, senderID, senderName },
      contactID,
    } = contact;
    const formattedTime = msgContent ? convertFireHHMM(msgTime) : '';
    if (!msgContent) {
      msgContent = `<div style="color: #1b5c9b">Start a conversation now!</div>`;
    }
    const msgPrefix = senderID === currentUserID ? 'You: ' : '';
    const markup = `
    <div class="list-bar" contactid=${contactID}>
      <div class="bar-img">
        <img
          src="${photoURL}"
          alt=""
          class="profile-image"
        />
      </div>
      <div class="bar-info">
        <div class="bar-info-left">
          <div class="bar-name">${displayName}</div>
          <div class="bar-latest-msg" id="latest-msg-${contactID}">
            <span class="bar-latest-msg-prefix" id="latest-msg-prefix-${contactID}">${msgPrefix}</span>
            ${msgContent}
          </div>
        </div>
        <div class="bar-info-right">
        <div class="latest-msg-time">${formattedTime}</div>
        <div class="unread-msg-badge" id="unread-msg-badge-${contactID}"></div>
        </div>
      </div>
    </div>
    `;

    elements.navColList.insertAdjacentHTML('beforeend', markup);
  });
};

export const renderNewContact = () => {
  console.log("rendering new contact to the left haha")
};

// todo: render latest msg
export const renderLatestMsg = (msg, currentUserID, contactSelectedID) => {
  const { msgContent, msgTime, receiverID, senderID, senderName } = msg;

  // *Received a msg
  if (senderID != currentUserID) {
    document.getElementById(`latest-msg-${senderID}`).innerHTML = msgContent;
    console.log({ contactSelectedID });
    if (senderID != contactSelectedID) {
      document
        .getElementById(`unread-msg-badge-${senderID}`)
        .classList.add('show-badge');
    }
  } else {
    // *Sent a message
    const markup = `
      <span class="bar-latest-msg-prefix" id="latest-msg-prefix-${receiverID}">You: </span>
      ${msgContent}
    `;
    document.getElementById(`latest-msg-${receiverID}`).innerHTML = '';
    document
      .getElementById(`latest-msg-${receiverID}`)
      .insertAdjacentHTML(`beforeend`, markup);
  }
};
