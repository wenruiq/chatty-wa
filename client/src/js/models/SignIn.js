import { auth } from '../firebase/firebase.utils';
import { signInFailureMsg } from '../views/signInView';

export default class SignIn {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  async processSignIn() {
    try {
      await auth.signInWithEmailAndPassword(this.email, this.password);
    } catch (err) {
      console.error(err);
      signInFailureMsg();
    }
  }
}
