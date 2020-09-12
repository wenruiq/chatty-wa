import { firestore } from '../firebase/firebase.utils';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const searchRef = firestore.collection(`users`);
    const query = searchRef.where('searchTerms', 'array-contains', this.query);
    try {
      const snapShot = await query.get();
      snapShot.forEach(doc => {
        console.log(doc.id, ' => ', doc.data());
      });
      this.data = snapShot.docs.map(doc => {
        return { userID: doc.id, ...doc.data() }
      });
    } catch (error) {
      console.error(error);
    }
  }
}
