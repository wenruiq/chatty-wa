import { elements } from './base';

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
