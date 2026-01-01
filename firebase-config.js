// Firebase Configuration for YourBibleTracker
//
// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com
// 2. Click "Create a project" (or use existing)
// 3. Name it "yourbibletracker" (or whatever you prefer)
// 4. Disable Google Analytics (optional, not needed)
// 5. Once created, click the web icon </> to add a web app
// 6. Name it "website" and click Register
// 7. Copy the firebaseConfig values below
// 8. Go to "Build" > "Realtime Database" in the sidebar
// 9. Click "Create Database"
// 10. Choose your region and click "Next"
// 11. Select "Start in test mode" and click "Enable"
// 12. Go to "Rules" tab and paste these rules:
//
//     {
//       "rules": {
//         "ideas": {
//           ".read": true,
//           ".write": true,
//           "$ideaId": {
//             "votes": {
//               ".write": true
//             }
//           }
//         }
//       }
//     }
//
// 13. Click "Publish"
// 14. Replace the values below with your Firebase config

const firebaseConfig = {
    apiKey: "AIzaSyBGHmPtH1oTmW01ITph978UIrRiJxhpQrc",
    authDomain: "yourbibletracker-dbe0a.firebaseapp.com",
    databaseURL: "https://yourbibletracker-dbe0a-default-rtdb.firebaseio.com",
    projectId: "yourbibletracker-dbe0a",
    storageBucket: "yourbibletracker-dbe0a.firebasestorage.app",
    messagingSenderId: "701452014266",
    appId: "1:701452014266:web:9c0b65bdbdc3a4757f6883"
};

// Initialize Firebase
let app, db;
let firebaseReady = false;

function initFirebase() {
    try {
        if (firebaseConfig.apiKey !== "YOUR_API_KEY" && typeof firebase !== 'undefined') {
            app = firebase.initializeApp(firebaseConfig);
            db = firebase.database();
            firebaseReady = true;
            console.log('Firebase initialized successfully');
            return true;
        } else {
            console.log('Firebase not configured - using demo mode');
            return false;
        }
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// Check if Firebase is ready
function isFirebaseReady() {
    return firebaseReady;
}

// Get database reference
function getDatabase() {
    return db;
}
