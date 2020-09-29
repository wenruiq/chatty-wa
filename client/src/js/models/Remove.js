import { firestore } from '../firebase/firebase.utils';

export default class Remove {
  constructor(myID, hisID, hisData, myData) {
    this.myID = myID;
    this.hisID = hisID;
  }

  async removeFriend() {
    const myContactsRef = firestore.doc(
      `users/${this.myID}/contacts/${this.hisID}`
    );
    const hisContactsRef = firestore.doc(
      `users/${this.hisID}/contacts/${this.myID}`
    );
    try {
      await myContactsRef.delete();
      await hisContactsRef.delete();
    } catch (error) {
      console.error(error);
    }
  }
}
