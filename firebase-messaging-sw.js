// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Firebase configuration
firebase.initializeApp({
    apiKey: "AIzaSyBGHmPtH1oTmW01ITph978UIrRiJxhpQrc",
    authDomain: "yourbibletracker-dbe0a.firebaseapp.com",
    databaseURL: "https://yourbibletracker-dbe0a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "yourbibletracker-dbe0a",
    storageBucket: "yourbibletracker-dbe0a.firebasestorage.app",
    messagingSenderId: "701452014266",
    appId: "1:701452014266:web:9c0b65bdbdc3a4757f6883"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || payload.data?.title || 'YourBibleTracker';
    const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || '',
        icon: '/logo.png',
        badge: '/logo.png',
        tag: 'yourbibletracker-notification',
        data: payload.data || {},
        actions: [
            { action: 'open', title: 'Open' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event);
    event.notification.close();

    const urlToOpen = event.notification.data?.url || 'https://yourbibletracker.com';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check if there's already a window open
            for (const client of clientList) {
                if (client.url.includes('yourbibletracker.com') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open a new window if none found
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
