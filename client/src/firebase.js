import firebase from 'firebase';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
   apiKey: 'AIzaSyACmWUfGEC2BzgKaw5d2dB1udhCHkomdVM',
   authDomain: 'gqlmern-ec8f1.firebaseapp.com',
   projectId: 'gqlmern-ec8f1',
   storageBucket: 'gqlmern-ec8f1.appspot.com',
   // messagingSenderId: '988516248723',
   appId: '1:988516248723:web:d26ec13fa86befc21c3166',
   measurementId: 'G-58WN4TK23Z',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
