import firebase from 'firebase/app';
import 'firebase/firestore';

var config = {
    apiKey: "AIzaSyCPStqxcPsPyizC8PUUiyv66Uz99Djj3gM",
    authDomain: "time-left-on-stuff.firebaseapp.com",
    databaseURL: "https://time-left-on-stuff.firebaseio.com",
    projectId: "time-left-on-stuff",
    storageBucket: "time-left-on-stuff.appspot.com",
    messagingSenderId: "984522414547",
    appId: "1:984522414547:web:4e56214eda18163e7ff726",
    measurementId: "G-SG97NW5LBM"
};
firebase.initializeApp(config);

export default firebase