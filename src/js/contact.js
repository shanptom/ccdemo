/**
 * Coffee Shop Contact Form
 * Handles form submission and validation
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Form validation
            if (validateForm()) {
                // Show success message
                showSuccessMessage();

                // In a real implementation, this would send data to a server
                // For MVP, we'll just show a success message
                console.log('Form submitted:', {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    message: document.getElementById('message').value
                });

                // Reset form
                contactForm.reset();
            }
        });
    }

    function validateForm() {
        let isValid = true;

        // Validate name
        const name = document.getElementById('name');
        if (!name.value.trim() || name.value.length < 2) {
            showError(name, 'Please enter a valid name');
            isValid = false;
        } else {
            clearError(name);
        }

        // Validate email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(email);
        }

        // Validate message
        const message = document.getElementById('message');
        if (!message.value.trim() || message.value.length < 10) {
            showError(message, 'Please enter a message (minimum 10 characters)');
            isValid = false;
        } else {
            clearError(message);
        }

        return isValid;
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }

        errorElement.textContent = message;
        input.style.borderColor = 'var(--error-color)';
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        if (errorElement) {
            formGroup.removeChild(errorElement);
        }

        input.style.borderColor = '';
    }

    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        successMessage.style.color = 'var(--success-color)';
        successMessage.style.marginTop = '1rem';
        successMessage.style.fontWeight = 'bold';

        contactForm.parentNode.insertBefore(successMessage, contactForm);

        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 5000);
    }

    // Add form group styling
    const style = document.createElement('style');
    style.textContent = `
        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--primary-color);
            outline: none;
        }

        .error-message {
            color: var(--error-color);
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }

        .success-message {
            padding: 1rem;
            background-color: rgba(76, 175, 80, 0.1);
            border: 1px solid var(--success-color);
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);
});
