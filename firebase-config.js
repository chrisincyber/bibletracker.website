const firebaseConfig = {
    apiKey: "AIzaSyBGHmPtH1oTmW01ITph978UIrRiJxhpQrc",
    authDomain: "yourbibletracker-dbe0a.firebaseapp.com",
    databaseURL: "https://yourbibletracker-dbe0a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "yourbibletracker-dbe0a",
    storageBucket: "yourbibletracker-dbe0a.firebasestorage.app",
    messagingSenderId: "701452014266",
    appId: "1:701452014266:web:9c0b65bdbdc3a4757f6883"
};

// VAPID key for web push (from Firebase Console > Cloud Messaging > Web Push certificates)
const VAPID_KEY = 'BLqtoQ7_eBe3ZxugxAJCay0LEsqF9J03_s-5QgeLITDWJE4xizCWkefCH2rnwX0K6FWcXsjVH6qhQOdhmCpXgdQ';

let app, db, messaging;
let firebaseReady = false;
let messagingReady = false;

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

function initMessaging() {
    if (messagingReady) return true;
    try {
        if (typeof firebase !== 'undefined' && firebase.messaging) {
            messaging = firebase.messaging();
            messagingReady = true;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Firebase Messaging error:', error);
        return false;
    }
}

function isFirebaseReady() {
    return firebaseReady;
}

function isMessagingReady() {
    return messagingReady;
}

function getDatabase() {
    return db;
}

function getMessaging() {
    return messaging;
}

// Register service worker and get push token
async function registerForPushNotifications() {
    try {
        // Check if browser supports notifications
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return null;
        }

        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Notification permission denied');
            return null;
        }

        // Register service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered:', registration);

        // Initialize messaging if not already done
        if (!messagingReady) {
            initMessaging();
        }

        // Get the token
        const token = await messaging.getToken({
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration
        });

        if (token) {
            console.log('Push token:', token);
            // Save token to database
            await savePushToken(token);
            return token;
        }
        return null;
    } catch (error) {
        console.error('Error registering for push notifications:', error);
        return null;
    }
}

// Save push token to Firebase
async function savePushToken(token) {
    if (!isFirebaseReady()) {
        initFirebase();
    }

    const tokenData = {
        token: token,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        subscribed: true
    };

    // Use token as key (hashed for shorter ID)
    const tokenId = btoa(token).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);

    try {
        await db.ref(`pushTokens/${tokenId}`).set(tokenData);
        localStorage.setItem('pushTokenId', tokenId);
        localStorage.setItem('pushSubscribed', 'true');
        console.log('Push token saved to database');
        return true;
    } catch (error) {
        console.error('Error saving push token:', error);
        return false;
    }
}

// Unsubscribe from push notifications
async function unsubscribeFromPush() {
    try {
        const tokenId = localStorage.getItem('pushTokenId');
        if (tokenId && isFirebaseReady()) {
            await db.ref(`pushTokens/${tokenId}`).update({ subscribed: false });
        }
        localStorage.removeItem('pushSubscribed');
        console.log('Unsubscribed from push notifications');
        return true;
    } catch (error) {
        console.error('Error unsubscribing:', error);
        return false;
    }
}

// Check if user is subscribed
function isPushSubscribed() {
    return localStorage.getItem('pushSubscribed') === 'true';
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', function() {
    initFirebase();
});
