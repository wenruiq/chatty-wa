import { firestore } from '../firebase/firebase.utils';

export default class Add {
  constructor(myID, hisID, hisData) {
    this.myID = myID;
    this.hisID = hisID;
    this.hisData = hisData;
  }

  async addFriend() {
    const contactsRef = firestore.collection(
      `users/${this.myID}/contacts`
    );
    try {
      const { displayName, email, photoURL } = this.hisData;
      const latestMsg = {
        msgContent: ''
      }
      await contactsRef.doc(this.hisID).set(
        {
          displayName,
          email,
          photoURL,
          latestMsg
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}
