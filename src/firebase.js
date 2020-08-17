import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyAqjS4xL3LgJ0JaEcun0G5J5zIJZpo2zb0",
  authDomain: "viro-ar-card.firebaseapp.com",
  databaseURL: "https://viro-ar-card.firebaseio.com",
  projectId: "viro-ar-card",
  storageBucket: "viro-ar-card.appspot.com",
  messagingSenderId: "802923014813",
  appId: "1:802923014813:web:0dd357e62b4a8563048274",
};

firebase.initializeApp(firebaseConfig);
export default firebase;
