const firebaseConfig = {
    apiKey: "AIzaSyBGHmPtH1oTmW01ITph978UIrRiJxhpQrc",
    authDomain: "yourbibletracker-dbe0a.firebaseapp.com",
    databaseURL: "https://yourbibletracker-dbe0a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "yourbibletracker-dbe0a",
    storageBucket: "yourbibletracker-dbe0a.firebasestorage.app",
    messagingSenderId: "701452014266",
    appId: "1:701452014266:web:9c0b65bdbdc3a4757f6883"
};

let app, db;
let firebaseReady = false;

function initFirebase() {
    if (firebaseReady) return true;
    try {
        if (typeof firebase !== 'undefined') {
            app = firebase.initializeApp(firebaseConfig);
            db = firebase.database();
            firebaseReady = true;
            return true;
        }
        return false;
    } catch (error) {
        if (error.code === 'app/duplicate-app') {
            db = firebase.database();
            firebaseReady = true;
            return true;
        }
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

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', function() {
    initFirebase();
});
