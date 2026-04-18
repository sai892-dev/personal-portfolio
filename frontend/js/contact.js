/* =========================================================
   CONTACT.JS — Form validation & submission
   ========================================================= */

const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset errors
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
    if (formMessage) {
      formMessage.className = 'form-message';
      formMessage.style.display = 'none';
    }

    // Get values
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Validate
    let hasError = false;

    if (!name) {
      showFieldError('contact-name', 'Please enter your name');
      hasError = true;
    }

    if (!email) {
      showFieldError('contact-email', 'Please enter your email');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError('contact-email', 'Please enter a valid email address');
      hasError = true;
    }

    if (!message) {
      showFieldError('contact-message', 'Please enter a message');
      hasError = true;
    }

    if (hasError) return;

    // Submit
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(API_BASE + '/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const result = await response.json();

      if (result.success) {
        showFormMessage('success', '✅ ' + result.message);
        contactForm.reset();
      } else {
        showFormMessage('error', '❌ ' + (result.message || 'Something went wrong'));
      }
    } catch (error) {
      showFormMessage('error', '❌ Failed to send message. Make sure the server is running.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  const group = field.closest('.form-group');
  if (group) {
    group.classList.add('error');
    const errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.textContent = message;
  }
}

function showFormMessage(type, message) {
  if (!formMessage) return;
  formMessage.className = 'form-message ' + type;
  formMessage.textContent = message;
  formMessage.style.display = 'block';

  // Auto hide after 5 seconds
  setTimeout(() => {
    formMessage.style.display = 'none';
  }, 5000);
}
