import { elements, convertHHMM } from './base';

export const getInput = () => elements.typedMsgInput.value;

export const removeCover = () => {
  const cover = elements.chatColCover;
  if (cover.parentElement) {
    cover.parentElement.removeChild(cover);
  }
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
    const { photoURL, displayName, groupMembers, isGroup, email } = contactData;
    const chatInfo = isGroup ? groupMembers.join(', ') : email;
    const markup = `
    <div class="chat-col-top-photo-and-info">
      <img
        src="${photoURL}"
        alt=""
        class="profile-image-sm"
      />
      <div class="chat-info">
        <div class="chat-name">${displayName}</div>
        <div class="chat-data">${chatInfo}</div>
      </div>
    </div>
    `;
    elements.chatColTop.innerHTML = '';
    elements.chatColTop.insertAdjacentHTML('afterbegin', markup);
  }
};

export const renderMessages = ({ currentUserID, data }) => {
  data.forEach(message => {
    const { senderID, senderName, msgTime, msgContent } = message;
    const formattedTime = convertHHMM(msgTime);
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
  });
};
