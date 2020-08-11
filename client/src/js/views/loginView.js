import { elements } from './base';

export const renderTopBar = currentUser => {
  const { displayName, email, photoURL } = currentUser;

  const markup = `
  <img src="${photoURL}" alt="" class="profile-image-sm"/>
  <div class="user-info">
    <div class="user-displayname">
      ${displayName}
    </div>
    <div class="user-email">
      ${email}
    </div>
  </div>
  `;
  
  elements.navColTopBar.insertAdjacentHTML('afterbegin', markup);
};
