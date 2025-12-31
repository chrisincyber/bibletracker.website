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

        const formData = {
            name: document.getElementById('name').value || 'Anonymous',
            email: document.getElementById('email').value || 'No email provided',
            category: document.getElementById('category').value,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            priority: document.getElementById('priority').value,
            timestamp: new Date().toISOString()
        };

        // For now, just show success message
        // In production, you'd send this to a backend service or email
        console.log('Feature Request Submitted:', formData);

        // You can integrate with services like:
        // - Formspree (https://formspree.io/)
        // - EmailJS (https://www.emailjs.com/)
        // - Google Forms
        // - Your own backend

        // Example with EmailJS (you'd need to set this up):
        /*
        emailjs.send('service_id', 'template_id', formData)
            .then(function(response) {
                showSuccessMessage();
            }, function(error) {
                alert('Error submitting request. Please email us directly.');
            });
        */

        // For now, just show success
        showSuccessMessage();
        featureForm.reset();
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
