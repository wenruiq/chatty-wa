import { firestore } from '../firebase/firebase.utils';

export default class Add {
  constructor(myID, hisID, hisData, myData) {
    this.myID = myID;
    this.hisID = hisID;
    this.hisData = hisData;
    this.myData = myData;
  }

  async addFriend() {
    const myContactsRef = firestore.collection(
      `users/${this.myID}/contacts`
    );
    const hisContactsRef = firestore.collection(
      `users/${this.hisID}/contacts`
    );
    try {
      var { displayName, email, photoURL } = this.hisData;
      var latestMsg = {
        msgContent: ''
      }
      await myContactsRef.doc(this.hisID).set(
        {
          displayName,
          email,
          photoURL,
          latestMsg
        }
      );
      var { displayName, email, photoURL } = this.myData;
      await hisContactsRef.doc(this.myID).set(
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
