document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const reveals = document.querySelectorAll('.reveal');

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If the entry is the experience number, start counter only if it's a number
                if (entry.target.classList.contains('exp-number')) {
                    const count = parseInt(entry.target.dataset.count);
                    if (!isNaN(count)) {
                        startCounter(entry.target);
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(el => revealObserver.observe(el));

    // Experience Number Counter
    function startCounter(el) {
        const target = parseInt(el.dataset.count);
        let current = 0;
        const duration = 1500;
        const step = (target / duration) * 10;
        
        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                el.innerText = target;
                clearInterval(counter);
            } else {
                el.innerText = Math.floor(current);
            }
        }, 10);
    }

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add staggered delay to reveal elements in grids
    const grids = document.querySelectorAll('.qual-grid, .skills-grid');
    grids.forEach(grid => {
        const children = grid.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${(index + 1) * 0.1}s`;
        });
    });

    // Supabase Form Handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const { supabase } = await import('./supabase.js');
            
            const formData = new FormData(contactForm);
            const data = {
                full_name: formData.get('full_name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            formStatus.innerText = '';

            try {
                const { error } = await supabase.from('contacts').insert([data]);
                
                if (error) throw error;

                // Success
                formStatus.style.color = '#10b981';
                formStatus.innerText = 'Message sent successfully! Thank you.';
                contactForm.reset();
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Sent!';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right: 10px;"></i> Send Message';
                    formStatus.innerText = '';
                }, 5000);

            } catch (err) {
                console.error('Submission Error:', err);
                formStatus.style.color = '#ef4444';
                formStatus.innerText = 'Something went wrong. Please try again.';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right: 10px;"></i> Send Message';
            }
        });
    }
});
