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

        const ideaData = {
            name: document.getElementById('name').value || 'Anonymous',
            email: document.getElementById('email').value || '',
            category: document.getElementById('category').value,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            priority: document.getElementById('priority').value,
            votes: 0,
            timestamp: Date.now()
        };

        // Try to submit to Firebase
        if (typeof isFirebaseReady === 'function' && isFirebaseReady()) {
            try {
                const newIdeaRef = getDatabase().ref('ideas').push();
                await newIdeaRef.set(ideaData);
                showSuccessMessage();
                featureForm.reset();
            } catch (error) {
                console.error('Error submitting idea:', error);
                alert('There was an error submitting your idea. Please try again or email us directly at yourbibletracker@gmail.com');
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
        }

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
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

// Mobile menu toggle (for future enhancement)
const createMobileMenu = () => {
    const nav = document.querySelector('.nav-links');
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-toggle';
    menuButton.innerHTML = '☰';
    menuButton.style.display = 'none';

    if (window.innerWidth <= 768) {
        menuButton.style.display = 'block';
    }

    menuButton.addEventListener('click', () => {
        nav.classList.toggle('mobile-open');
    });

    document.querySelector('.nav-container').appendChild(menuButton);
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
    observeElements();
});
