import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = '';

export const showSearchExit = () => elements.clearSearchBtn.classList.remove("hide-this");

export const hideSearchExit = () => elements.clearSearchBtn.classList.add("hide-this");

// *Render Search Results
export const renderSearchResults = (data, currentUserID, contacts) => {
  // todo: if the only searchr result is someone that's your friend, it shouldnt render nth
  if (data.length == 0 ) {
    const markup = `
    <div class="empty-search-notice">
      Your search did not match any users
    </div>
    `;
    elements.navColList.insertAdjacentHTML('beforeend', markup);
  }
  const allContacts = contacts.map(contact => contact.contactID);
  data.forEach(user => {
    const { userID, displayName, photoURL, email } = user;
    const isFriend = allContacts.includes(userID);
    if (userID != currentUserID && !isFriend) {
      const markup = `
      <div class="results-bar" contactid="321321d3egj34ruogf">
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
            <div class="bar-latest-msg">
              ${email}
            </div>
          </div>
          <div class="bar-info-right"><button class="add-friend-btn" contactid=${userID}>Add Friend</button></div>
        </div>
      </div>
      `;
      elements.navColList.insertAdjacentHTML('beforeend', markup);
    }
  })
};

