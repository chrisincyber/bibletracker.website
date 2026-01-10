/**
 * GDPR Cookie Consent Banner
 * Handles cookie consent for GDPR compliance
 */

(function() {
    'use strict';

    const COOKIE_CONSENT_KEY = 'cookie_consent';
    const COOKIE_CONSENT_EXPIRY_DAYS = 365;

    // Check if user has already made a choice
    function hasConsentChoice() {
        return localStorage.getItem(COOKIE_CONSENT_KEY) !== null;
    }

    // Get the current consent status
    function getConsentStatus() {
        return localStorage.getItem(COOKIE_CONSENT_KEY);
    }

    // Save consent choice
    function saveConsentChoice(accepted) {
        localStorage.setItem(COOKIE_CONSENT_KEY, accepted ? 'accepted' : 'declined');
    }

    // Create and inject the cookie banner HTML
    function createBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <p>
                        We use cookies to enhance your browsing experience and analyze site traffic.
                        By clicking "Accept", you consent to our use of cookies.
                        <a href="privacy.html">Learn more in our Privacy Policy</a>.
                    </p>
                </div>
                <div class="cookie-banner-buttons">
                    <button id="cookie-decline" class="cookie-btn cookie-btn-decline">Decline</button>
                    <button id="cookie-accept" class="cookie-btn cookie-btn-accept">Accept</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
        return banner;
    }

    // Show the banner with animation
    function showBanner(banner) {
        // Force reflow before adding visible class for animation
        banner.offsetHeight;
        banner.classList.add('cookie-banner-visible');
    }

    // Hide the banner with animation
    function hideBanner(banner) {
        banner.classList.remove('cookie-banner-visible');
        banner.classList.add('cookie-banner-hidden');

        // Remove from DOM after animation completes
        setTimeout(function() {
            if (banner.parentNode) {
                banner.parentNode.removeChild(banner);
            }
        }, 300);
    }

    // Handle accept button click
    function handleAccept(banner) {
        saveConsentChoice(true);
        hideBanner(banner);
        // Enable analytics or other cookie-dependent features here if needed
        enableCookies();
    }

    // Handle decline button click
    function handleDecline(banner) {
        saveConsentChoice(false);
        hideBanner(banner);
        // Disable or remove non-essential cookies here if needed
        disableCookies();
    }

    // Enable cookies/analytics (customize as needed)
    function enableCookies() {
        // Analytics or other cookie-dependent features can be initialized here
        console.log('Cookies accepted');
    }

    // Disable/remove non-essential cookies (customize as needed)
    function disableCookies() {
        // Remove any non-essential cookies here
        console.log('Cookies declined');
    }

    // Initialize the cookie consent banner
    function init() {
        // Don't show banner if user has already made a choice
        if (hasConsentChoice()) {
            // Apply previous choice
            if (getConsentStatus() === 'accepted') {
                enableCookies();
            }
            return;
        }

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initBanner();
            });
        } else {
            initBanner();
        }
    }

    function initBanner() {
        const banner = createBanner();

        // Add event listeners
        document.getElementById('cookie-accept').addEventListener('click', function() {
            handleAccept(banner);
        });

        document.getElementById('cookie-decline').addEventListener('click', function() {
            handleDecline(banner);
        });

        // Show banner with slight delay for better UX
        setTimeout(function() {
            showBanner(banner);
        }, 500);
    }

    // Start the initialization
    init();
})();
