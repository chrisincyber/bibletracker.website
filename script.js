// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Feature Request Form Handling
const featureForm = document.getElementById('featureRequestForm');
if (featureForm) {
    featureForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = featureForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        const resetButton = () => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        };

        const ideaData = {
            name: document.getElementById('name').value || 'Anonymous',
            email: document.getElementById('email').value || '',
            category: document.getElementById('category').value,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            priority: document.getElementById('priority').value,
            votes: 0,
            timestamp: Date.now(),
            status: 'pending',
            approved: false
        };

        // Try to submit to Firebase
        if (typeof isFirebaseReady === 'function' && isFirebaseReady() && typeof getDatabase === 'function' && getDatabase()) {
            try {
                // Add timeout to prevent hanging forever
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timed out')), 10000)
                );

                const newIdeaRef = getDatabase().ref('ideas').push();
                await Promise.race([newIdeaRef.set(ideaData), timeoutPromise]);
                showSuccessMessage();
                featureForm.reset();
            } catch (error) {
                console.error('Error submitting idea:', error);
                alert('There was an error submitting your idea. Please try again or email us directly at yourbibletracker@gmail.com');
            } finally {
                resetButton();
            }
        } else {
            // Fallback to email if Firebase not configured
            const subject = encodeURIComponent(`Feature Request: ${ideaData.title}`);
            const body = encodeURIComponent(
`Feature Request for YourBibleTracker

Title: ${ideaData.title}
Category: ${ideaData.category}
Priority: ${ideaData.priority}

Description:
${ideaData.description}

---
Submitted by: ${ideaData.name}
Contact email: ${ideaData.email || 'Not provided'}
Date: ${new Date().toLocaleDateString()}`
            );
            window.location.href = `mailto:yourbibletracker@gmail.com?subject=${subject}&body=${body}`;
            showSuccessMessage();
            featureForm.reset();
            resetButton();
        }
    });
}

function showSuccessMessage() {
    const successMsg = document.getElementById('successMessage');
    if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 5000);
    }
}

// Mobile menu toggle
const initMobileMenu = () => {
    const menuButton = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (menuButton && navMenu) {
        menuButton.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
            menuButton.classList.toggle('active');
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-open');
                menuButton.classList.remove('active');
            });
        });
    }
};

// Add subtle scroll animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s, transform 0.6s';
        observer.observe(card);
    });
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    observeElements();
});
