/**
 * Firebase Cloud Functions for sending push notifications
 *
 * SETUP INSTRUCTIONS:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Login to Firebase: firebase login
 * 3. Initialize functions: firebase init functions (select JavaScript)
 * 4. Replace functions/index.js with this file
 * 5. Deploy: firebase deploy --only functions
 *
 * Make sure to install the required dependencies:
 * cd functions && npm install firebase-admin firebase-functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Cloud Function triggered when a new notification is added to the pushQueue
 * Sends push notifications to all subscribed devices
 */
exports.sendPushNotification = functions.database
    .ref('/pushQueue/{pushId}')
    .onCreate(async (snapshot, context) => {
        const notificationData = snapshot.val();
        const pushId = context.params.pushId;

        console.log('Processing push notification:', pushId);

        if (!notificationData || !notificationData.tokens || notificationData.tokens.length === 0) {
            console.log('No tokens to send to');
            await snapshot.ref.update({ status: 'failed', error: 'No tokens' });
            return null;
        }

        const message = {
            notification: {
                title: notificationData.title,
                body: notificationData.body,
            },
            webpush: {
                notification: {
                    icon: notificationData.icon || '/logo.png',
                    badge: '/logo.png',
                    tag: 'yourbibletracker-notification',
                    requireInteraction: true,
                },
                fcmOptions: {
                    link: notificationData.url || 'https://yourbibletracker.com'
                }
            },
            data: {
                url: notificationData.url || 'https://yourbibletracker.com',
                notificationId: notificationData.notificationId || pushId
            }
        };

        const tokens = notificationData.tokens;
        let successCount = 0;
        let failureCount = 0;
        const failedTokens = [];

        // Send to each token individually to track failures
        for (const token of tokens) {
            try {
                await admin.messaging().send({
                    ...message,
                    token: token
                });
                successCount++;
            } catch (error) {
                console.error('Error sending to token:', token, error.message);
                failureCount++;
                failedTokens.push(token);

                // If token is invalid, mark it as unsubscribed
                if (error.code === 'messaging/invalid-registration-token' ||
                    error.code === 'messaging/registration-token-not-registered') {
                    // Find and update the token in the database
                    const tokensRef = admin.database().ref('pushTokens');
                    const tokensSnapshot = await tokensRef.orderByChild('token').equalTo(token).once('value');
                    tokensSnapshot.forEach((childSnapshot) => {
                        childSnapshot.ref.update({ subscribed: false, invalidatedAt: Date.now() });
                    });
                }
            }
        }

        // Update the queue item status
        await snapshot.ref.update({
            status: 'completed',
            successCount: successCount,
            failureCount: failureCount,
            processedAt: Date.now()
        });

        // Update the notification record
        if (notificationData.notificationId) {
            await admin.database().ref(`pushNotifications/${notificationData.notificationId}`).update({
                sent: true,
                successCount: successCount,
                failureCount: failureCount
            });
        }

        console.log(`Push notification sent: ${successCount} success, ${failureCount} failures`);
        return null;
    });

/**
 * HTTP endpoint to manually trigger a push notification (for testing)
 */
exports.testPushNotification = functions.https.onRequest(async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    // Simple auth check (you should implement proper authentication)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).send('Unauthorized');
        return;
    }

    const { title, body, url } = req.body;

    if (!title || !body) {
        res.status(400).send('Title and body are required');
        return;
    }

    try {
        // Get all subscribed tokens
        const tokensSnapshot = await admin.database().ref('pushTokens')
            .orderByChild('subscribed')
            .equalTo(true)
            .once('value');

        const tokens = [];
        tokensSnapshot.forEach((child) => {
            if (child.val().token) {
                tokens.push(child.val().token);
            }
        });

        if (tokens.length === 0) {
            res.status(200).json({ success: false, message: 'No subscribers' });
            return;
        }

        // Add to push queue
        await admin.database().ref('pushQueue').push({
            title,
            body,
            url: url || 'https://yourbibletracker.com',
            icon: '/logo.png',
            tokens,
            timestamp: Date.now(),
            status: 'pending'
        });

        res.status(200).json({ success: true, recipientCount: tokens.length });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Cleanup old notifications from the queue (runs daily)
 */
exports.cleanupOldNotifications = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async (context) => {
        const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days ago

        const oldNotifications = await admin.database().ref('pushQueue')
            .orderByChild('timestamp')
            .endAt(cutoff)
            .once('value');

        const deletePromises = [];
        oldNotifications.forEach((child) => {
            deletePromises.push(child.ref.remove());
        });

        await Promise.all(deletePromises);
        console.log(`Cleaned up ${deletePromises.length} old notifications`);
        return null;
    });
