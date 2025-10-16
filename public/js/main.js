/**
 * Quake Community Website - Main JavaScript
 * Handles general website functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active') && !e.target.closest('.navbar')) {
      navMenu.classList.remove('active');
      if (navToggle) {
        navToggle.classList.remove('active');
      }
    }
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          if (navToggle) {
            navToggle.classList.remove('active');
          }
        }
        
        // Scroll to target
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Header scroll effect
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  
  // Initialize any interactive elements
  initializeTooltips();
  handleFormSubmissions();
});

/**
 * Initialize tooltips for elements with data-tooltip attribute
 */
function initializeTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', (e) => {
      const tooltipText = e.target.getAttribute('data-tooltip');
      
      const tooltip = document.createElement('div');
      tooltip.classList.add('tooltip');
      tooltip.textContent = tooltipText;
      
      document.body.appendChild(tooltip);
      
      const rect = e.target.getBoundingClientRect();
      tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
      tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
      
      setTimeout(() => {
        tooltip.classList.add('show');
      }, 10);
    });
    
    element.addEventListener('mouseleave', () => {
      const tooltip = document.querySelector('.tooltip');
      if (tooltip) {
        tooltip.classList.remove('show');
        setTimeout(() => {
          tooltip.remove();
        }, 300);
      }
    });
  });
}

/**
 * Handle form submissions
 */
function handleFormSubmissions() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      // Prevent default form submission
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(form);
      const formObject = {};
      
      formData.forEach((value, key) => {
        formObject[key] = value;
      });
      
      // Handle different form types
      if (form.id === 'registration-form') {
        handleRegistrationForm(formObject, form);
      } else if (form.id === 'contact-form') {
        handleContactForm(formObject, form);
      } else if (form.id === 'tournament-create-form') {
        handleTournamentCreateForm(formObject, form);
      }
    });
  });
}

/**
 * Handle tournament registration form submission
 */
function handleRegistrationForm(formData, form) {
  // Get tournament ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const tournamentId = urlParams.get('id');
  
  if (!tournamentId) {
    showNotification('Error: Tournament ID not found', 'error');
    return;
  }
  
  // Send registration data to API
  fetch(`/api/tournaments/${tournamentId}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'Registration successful') {
      showNotification('¡Registro exitoso! Te has inscrito al torneo.', 'success');
      form.reset();
      
      // Reload tournament details after successful registration
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      showNotification(`Error: ${data.message}`, 'error');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showNotification('Error al procesar tu registro. Inténtalo de nuevo.', 'error');
  });
}

/**
 * Handle contact form submission
 */
function handleContactForm(formData, form) {
  // In a real application, this would send data to a server
  console.log('Contact form data:', formData);
  
  // Simulate successful submission
  showNotification('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.', 'success');
  form.reset();
}

/**
 * Handle tournament creation form submission
 */
function handleTournamentCreateForm(formData, form) {
  // Send tournament data to API
  fetch('/api/tournaments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.id) {
      showNotification('¡Torneo creado exitosamente!', 'success');
      form.reset();
      
      // Redirect to tournament details page
      setTimeout(() => {
        window.location.href = `/tournament/${data.id}`;
      }, 2000);
    } else {
      showNotification(`Error: ${data.message}`, 'error');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showNotification('Error al crear el torneo. Inténtalo de nuevo.', 'error');
  });
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
  // Remove any existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.classList.add('notification', type);
  notification.textContent = message;
  
  // Add close button
  const closeButton = document.createElement('span');
  closeButton.classList.add('notification-close');
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  notification.appendChild(closeButton);
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}