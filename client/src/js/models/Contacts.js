import { firestore, collectionToMapsArray } from '../firebase/firebase.utils';

export default class Contacts {
  constructor(currentUserID) {
    this.currentUserID = currentUserID;
  }

  async getContacts() {
    const contactsRef = firestore.collection(
      `users/${this.currentUserID}/contacts`
    );
    try {
      const collectionSnapShot = await contactsRef.get();
      this.data = collectionToMapsArray(collectionSnapShot);
    } catch (error) {
      console.error(error);
    }
  }
  
  async getContact(hisID){
    const userRef = firestore.collection("users").doc(hisID);
    try {
      const documentSnapShot = await userRef.get();
      return documentSnapShot.data();
    } catch (error) {
      console.error(error);
    }
  }
}
