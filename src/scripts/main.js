document.addEventListener("DOMContentLoaded", function () {
    // Ensure lightbox is hidden and background is not blurred on page load
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightboxImg) lightboxImg.setAttribute('src', '');
    }
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.style.filter = '';

    // Collapsible project cards
    document.querySelectorAll('.project-toggle').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const card = btn.closest('.project-card');
            const details = card.querySelector('.project-details');
            const icon = btn.querySelector('i');
            details.classList.toggle('open');
            icon.classList.toggle('rotate');
        });
    });

    // Smooth scroll for in-page links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
            document.querySelectorAll('.tab-panel').forEach(function(panel) { panel.classList.remove('active'); });
            btn.classList.add('active');
            const tabID = btn.getAttribute('data-tab');
            document.getElementById(tabID).classList.add('active');
        });
    });

    // Tab switching for Skills & Coding Profiles (card tabs)
    document.querySelectorAll('.tab-card').forEach(function(card) {
        card.addEventListener('click', function() {
            document.querySelectorAll('.tab-card').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            card.classList.add('active');
            const tabID = card.getAttribute('data-tab');
            document.getElementById(tabID).classList.add('active');
        });
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') card.click();
        });
    });

    // Back to Top Button
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Dark Mode Toggle
    const darkToggle = document.getElementById('dark-mode-toggle');
    darkToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const icon = darkToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // Minimal, unified fade-in for scroll-reveal
    const revealEls = document.querySelectorAll('.scroll-reveal');
    const revealOnScroll = () => {
        const trigger = window.innerHeight * 0.92;
        revealEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < trigger) {
                el.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Inline lightbox modal for certificates (large, blurred background)
    document.querySelectorAll('.cert-gallery-item img').forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            if (!img.src) return;
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            lightboxImg.src = img.src;
            lightbox.style.display = 'block';
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.filter = 'blur(8px)';
            const closeBtn = lightbox.querySelector('.close');
            if (closeBtn) closeBtn.focus();
        });
    });

    // Close lightbox logic
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                lightbox.style.display = 'none';
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                const mainContent = document.getElementById('main-content');
                if (mainContent) mainContent.style.filter = '';
                const lightboxImg = document.getElementById('lightbox-img');
                if (lightboxImg) lightboxImg.setAttribute('src', '');
            });
        }
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                const mainContent = document.getElementById('main-content');
                if (mainContent) mainContent.style.filter = '';
                const lightboxImg = document.getElementById('lightbox-img');
                if (lightboxImg) lightboxImg.setAttribute('src', '');
            }
        });
    }

    // Prevent right-click and long-press save on certificate images (gallery and lightbox)
    document.querySelectorAll('.cert-gallery-item img, #lightbox-img').forEach(img => {
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
        img.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
        // Prevent long-press save on mobile
        img.addEventListener('touchstart', function(e) {
            if (e.touches && e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        img.addEventListener('touchend', function(e) {
            if (e.touches && e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        img.addEventListener('touchmove', function(e) {
            if (e.touches && e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    });

    // Organic cascade fade-up: randomize --card-delay and --card-rot for each card in minimal sections
    function organicCascade(sectionSelector, cardSelector) {
      const section = document.querySelector(sectionSelector);
      if (!section) return;
      const cards = section.querySelectorAll(cardSelector);
      cards.forEach((card, i) => {
        const rot = (Math.random() * 4 - 2).toFixed(2) + 'deg';
        const delay = (0.08 * i + Math.random() * 0.07).toFixed(2) + 's';
        card.style.setProperty('--card-rot', rot);
        card.style.setProperty('--card-delay', delay);
      });
    }
    organicCascade('.minimal-skills', '.skill-card');
    organicCascade('.minimal-profiles', '.profile-card');
    organicCascade('.minimal-edu', '.edu-item');

    // Animate heading underline on scroll into view
    function animateSectionHeading(sectionSelector) {
      const section = document.querySelector(sectionSelector);
      if (!section) return;
      const heading = section.querySelector('h2');
      if (!heading) return;
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            section.classList.add('visible');
            observer.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      observer.observe(section);
    }
    animateSectionHeading('.skills-coding-section');
    animateSectionHeading('.education');

    // Project dropdown/collapsible logic
    function setupProjectDropdowns() {
      const cards = document.querySelectorAll('.project-card.collapsible');
      cards.forEach(card => {
        const btn = card.querySelector('.project-toggle');
        const details = card.querySelector('.project-details');
        const icon = btn.querySelector('i');
        if (!btn || !details) return;
        card.addEventListener('click', (e) => {
          if (e.target.closest('.project-details')) return;
          const expanded = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', !expanded);
          if (expanded) {
            details.classList.remove('open');
            details.style.display = 'none';
            card.classList.remove('open');
            if (icon) icon.classList.remove('rotate');
          } else {
            details.classList.add('open');
            details.style.display = 'block';
            card.classList.add('open');
            if (icon) icon.classList.add('rotate');
          }
        });
      });
    }
    setupProjectDropdowns();

    // Initial setup for project cards: close all details
    document.querySelectorAll('.project-card.collapsible').forEach(card => {
      const details = card.querySelector('.project-details');
      if (details) {
        details.classList.remove('open');
        details.style.display = 'none';
      }
    });

    // Form submission handling (contact form)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        // Basic client-side validation
        let valid = true;
        Object.keys(data).forEach(key => {
          const input = contactForm.querySelector(`[name="${key}"]`);
          if (!data[key].trim()) {
            valid = false;
            input.classList.add('error');
          } else {
            input.classList.remove('error');
          }
        });
        if (!valid) return;
        // Simulate server response and reset form
        setTimeout(() => {
          alert('Message sent! We will get back to you soon.');
          contactForm.reset();
        }, 1000);
      });
    }

    // Input field focus and blur effects
    document.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('focus', function() {
        this.parentNode.classList.add('focused');
      });
      input.addEventListener('blur', function() {
        if (!this.value.trim()) {
          this.parentNode.classList.remove('focused');
        }
      });
    });

    // Custom select dropdowns
    document.querySelectorAll('.custom-select').forEach(select => {
      const options = select.querySelectorAll('option');
      const selected = select.querySelector('option[selected]');
      if (selected) {
        const placeholder = document.createElement('div');
        placeholder.classList.add('select-placeholder');
        placeholder.innerText = selected.innerText;
        select.insertAdjacentElement('beforebegin', placeholder);
        placeholder.addEventListener('click', function() {
          this.nextElementSibling.classList.toggle('open');
        });
      }
      options.forEach(option => {
        if (option.value) {
          const div = document.createElement('div');
          div.classList.add('select-option');
          div.innerText = option.innerText;
          div.addEventListener('click', function() {
            const placeholder = this.parentNode.previousElementSibling;
            placeholder.innerText = this.innerText;
            this.parentNode.classList.remove('open');
            options.forEach(opt => opt.removeAttribute('selected'));
            option.setAttribute('selected', 'selected');
          });
          select.insertAdjacentElement('afterend', div);
        }
      });
      select.addEventListener('change', function() {
        const placeholder = this.previousElementSibling;
        const selectedOption = Array.from(this.querySelectorAll('option')).find(opt => opt.selected);
        if (selectedOption) {
          placeholder.innerText = selectedOption.innerText;
        }
      });
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.mobile-nav a').forEach(link => {
      link.addEventListener('click', function() {
        const menu = document.getElementById('mobile-menu');
        if (menu) {
          menu.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    // Keyboard navigation for custom select dropdowns
    document.querySelectorAll('.custom-select').forEach(select => {
      const options = select.querySelectorAll('.select-option');
      const placeholder = select.previousElementSibling;
      let focusedOption = null;
      placeholder.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (!focusedOption) {
            focusedOption = 0;
          } else if (focusedOption < options.length - 1) {
            focusedOption++;
          }
          options[focusedOption].classList.add('focused');
          options[focusedOption].scrollIntoView({ block: "nearest" });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (focusedOption > 0) {
            options[focusedOption].classList.remove('focused');
            focusedOption--;
            options[focusedOption].classList.add('focused');
            options[focusedOption].scrollIntoView({ block: "nearest" });
          }
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (focusedOption !== null) {
            options[focusedOption].click();
          }
        }
      });
    });

    // Accessibility improvements: ARIA attributes and keyboard navigation
    document.querySelectorAll('.project-card').forEach(card => {
      const toggle = card.querySelector('.project-toggle');
      const details = card.querySelector('.project-details');
      if (toggle && details) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');
        toggle.addEventListener('click', function() {
          const expanded = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', !expanded);
          if (expanded) {
            details.classList.remove('open');
            details.style.display = 'none';
          } else {
            details.classList.add('open');
            details.style.display = 'block';
          }
        });
        toggle.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle.click();
          }
        });
      }
    });

    // Form validation styles
    const style = document.createElement('style');
    style.innerHTML = `
      .error {
        border-color: red;
      }
      .error:focus {
        outline: none;
        box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
      }
    `;
    document.head.appendChild(style);
  });