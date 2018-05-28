
import * as firebase from 'firebase';

// Initialize Firebase
const config = {
    apiKey: 'AIzaSyBTdsF7d-v6_9Jb3qQtOWwfvO7B25Q5Eu4',
    authDomain: 'art-collage.firebaseapp.com',
    databaseURL: 'https://art-collage.firebaseio.com',
    projectId: 'art-collage',
    storageBucket: 'art-collage.appspot.com',
    messagingSenderId: '268068287389'
};

firebase.initializeApp(config);

// export auth and database objects
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();