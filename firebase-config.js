const firebaseConfig = {
    apiKey: "AIzaSyBGHmPtH1oTmW01ITph978UIrRiJxhpQrc",
    authDomain: "yourbibletracker-dbe0a.firebaseapp.com",
    databaseURL: "https://yourbibletracker-dbe0a-default-rtdb.firebaseio.com",
    projectId: "yourbibletracker-dbe0a",
    storageBucket: "yourbibletracker-dbe0a.firebasestorage.app",
    messagingSenderId: "701452014266",
    appId: "1:701452014266:web:9c0b65bdbdc3a4757f6883"
};

let app, db;
let firebaseReady = false;

function initFirebase() {
    try {
        if (typeof firebase !== 'undefined') {
            app = firebase.initializeApp(firebaseConfig);
            db = firebase.database();
            firebaseReady = true;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Firebase error:', error);
        return false;
    }
}

function isFirebaseReady() {
    return firebaseReady;
}

function getDatabase() {
    return db;
}
