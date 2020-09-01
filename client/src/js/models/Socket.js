import { firestore } from '../firebase/firebase.utils';

export default class Socket {
  constructor(myUserID, mySocketID) {
    this.myUserID = myUserID;
    this.mySocketID = mySocketID;
  }

  async updateSocketID() {
    const userRef = firestore.collection('users').doc(this.myUserID);
    try {
      await userRef.update(
        {
          socketID: this.mySocketID,
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}
