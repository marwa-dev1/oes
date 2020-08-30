import * as firebase from 'firebase'

export const config = {
    apiKey: "AIzaSyB69YnfGF35XrVrG0COLnRtfVfSAkEoaSU",
    authDomain: "oes-2020.firebaseapp.com",
    databaseURL: "https://oes-2020.firebaseio.com",
    projectId: "oes-2020",
    storageBucket: "oes-2020.appspot.com",
    messagingSenderId: "437644200200"
};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();