 import firebase from "firebase";
  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDyTpOLG1XDd1hBmNyLoVjOfDJnioblfwQ",
    authDomain: "instagram-clone-dab85.firebaseapp.com",
    databaseURL: "https://instagram-clone-dab85-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-dab85",
    storageBucket: "instagram-clone-dab85.appspot.com",
    messagingSenderId: "153718479621",
    appId: "1:153718479621:web:07e05ecf76d26f395db56c",
    measurementId: "G-QHE714X3SL"
  });
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  export {db, auth, storage};