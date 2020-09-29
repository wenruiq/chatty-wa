import { firestore } from '../firebase/firebase.utils';

export default class Message {
  constructor(hisUserID, myUserID, msg) {
    this.myUserID = myUserID;
    this.hisUserID = hisUserID;
    this.msg = msg;
  }

  async sendMessageToDB() {
    // todo: need to update latest message for both users
    // *Need to update both mine and his
    const myMessagesRef = firestore.collection(
      `users/${this.myUserID}/contacts/${this.hisUserID}/messages`
    );
    const hisMessagesRef = firestore.collection(
      `users/${this.hisUserID}/contacts/${this.myUserID}/messages`
    );
    const myLatestMsgRef = firestore.doc(`users/${this.myUserID}/contacts/${this.hisUserID}`);
    const hisLatestMsgRef = firestore.doc(`users/${this.hisUserID}/contacts/${this.myUserID}`);

    try {
      const collectionSnapShot1 = await myMessagesRef.add({
        ...this.msg,
      });
      const collectionSnapShot2 = await hisMessagesRef.add({
        ...this.msg,
      });
      await myLatestMsgRef.update({
        latestMsg:{
          ...this.msg
        }
      });
      await hisLatestMsgRef.update({
        latestMsg:{
          ...this.msg
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getSocketID() {
    const hisUserRef = firestore.collection('users').doc(`${this.hisUserID}`);
    try {
      const docSnapShot = await hisUserRef.get();
      this.hisSocketID = docSnapShot.data().socketID;
    } catch (err) {
      console.error(err);
    }
  }
}
