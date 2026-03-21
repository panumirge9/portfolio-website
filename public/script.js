document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const statusText = document.getElementById('formStatus');

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });

        if (response.ok) {
            statusText.style.display = 'block';
            statusText.style.color = '#4ade80'; // Success green
            statusText.innerText = "Message sent successfully! I'll be in touch soon.";
            document.getElementById('contactForm').reset();
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        statusText.style.display = 'block';
        statusText.style.color = '#f87171'; // Error red
        statusText.innerText = "Oops! Something went wrong. Please try again.";
    }
});
const revealElements = document.querySelectorAll('.reveal');
const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: Stop observing once revealed so it doesn't animate every time you scroll up and down
            observer.unobserve(entry.target); 
        }
    });
};

const revealOptions = {
    threshold: 0.15, // Triggers when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Trigger reveal on load for elements already in view (like the Hero section)
window.addEventListener('load', () => {
    document.querySelector('.hero-content').classList.add('active');
});

// --- CONTACT FORM LOGIC ---
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const statusText = document.getElementById('formStatus');
    const submitBtn = document.querySelector('.btn-submit');

    // Simple loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });

        if (response.ok) {
            statusText.style.display = 'block';
            statusText.style.color = '#10b981'; // Emerald green
            statusText.innerText = "Message transmitted successfully. I will be in touch.";
            document.getElementById('contactForm').reset();
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        statusText.style.display = 'block';
        statusText.style.color = '#ef4444'; // Red
        statusText.innerText = "Connection failed. Please try again.";
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});