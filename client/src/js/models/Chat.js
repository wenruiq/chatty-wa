import { firestore } from '../firebase/firebase.utils';

export default class Chat {
  constructor(contactID) {
    this.contactID = contactID;
  }

  getMessages() {}
}
