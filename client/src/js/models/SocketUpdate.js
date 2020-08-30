import { firestore } from '../firebase/firebase.utils';

export default class SocketUpdate {
  constructor(myUserID, mySocketID) {
    this.myUserID = myUserID;
    this.mySocketID = mySocketID;
  }

  async updateSocketID() {
    const userRef = firestore.collection('users').doc(this.myUserID);
    try {
      await userRef.set({
        'socketID': this.mySocketID
      }, { merge: true })
    } catch (error) {
      console.error(error);
    }
  }
}