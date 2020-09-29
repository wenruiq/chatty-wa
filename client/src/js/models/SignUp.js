import { auth, createUserDocument } from '../firebase/firebase.utils';

export default class SignUp {
  constructor(displayName, email, password) {
    this.displayName = displayName;
    this.email = email;
    this.password = password;
  }

  async processSignUp() {
    try {
      // Userauth object is on the key "user" so have to destructure
      const { user } = await auth.createUserWithEmailAndPassword(
        this.email,
        this.password
      );
      // Passing data required to index.html for creation of user document upon sign up
      localStorage.setItem('displayName', this.displayName);
      localStorage.setItem('is-sign-up', "1337");
    } catch (err) {
      console.error(err);
    }
  }
}
