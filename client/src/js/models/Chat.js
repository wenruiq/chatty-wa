import { firestore, collectionToMapsArray } from '../firebase/firebase.utils';

export default class Chat {
  constructor(contactID, currentUserID) {
    this.contactID = contactID;
    this.currentUserID = currentUserID;
  }

  async getMessages() {
    const messagesRef = firestore.collection(
      `users/${this.currentUserID}/contacts/${this.contactID}/messages`
    ).orderBy("msgTime");
    try {
      const collectionSnapShot = await messagesRef.get();
      this.data = collectionToMapsArray(collectionSnapShot);
    } catch (error) {
      console.error(error);
    }
  }
}
