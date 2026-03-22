const revealElements = document.querySelectorAll('.reveal');
const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); 
        }
    });
};

const revealOptions = {
    threshold: 0.15, 
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));


window.addEventListener('load', () => {
    document.querySelector('.hero-content').classList.add('active');
});


document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const statusText = document.getElementById('formStatus');
    const submitBtn = document.querySelector('.btn-submit');

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
            statusText.style.color = '#10b981'; 
            statusText.innerText = "Message transmitted successfully. I will be in touch.";
            document.getElementById('contactForm').reset();
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        statusText.style.display = 'block';
        statusText.style.color = '#ef4444'; 
        statusText.innerText = "Connection failed. Please try again.";
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});