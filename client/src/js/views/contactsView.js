import { elements, convertFireHHMM } from './base';

export const renderContacts = ({ data, currentUserID }) => {
  data.forEach(contact => {
    const {
      photoURL,
      displayName,
      latestMsg: { msgContent, msgTime, senderID, senderName },
      contactID,
    } = contact;

    const formattedTime = convertFireHHMM(msgTime);
    const msgPrefix =
      senderID === currentUserID ? 'You: ' : '';

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
          <div class="bar-latest-msg"><span class="bar-latest-msg-prefix">${msgPrefix}</span>${msgContent}</div>
        </div>
        <div class="bar-info-right">${formattedTime}</div>
      </div>
    </div>
    `;

    elements.navColList.insertAdjacentHTML('beforeend', markup);
  });
};

// todo: render latest msg
