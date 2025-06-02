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
        btn.style.pointerEvents = 'none';
      });
    }
    setupProjectDropdowns();

    // Defensive: forcibly hide lightbox if visible on page load (safety net)
    setTimeout(() => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.style.display !== 'none') {
            lightbox.style.display = 'none';
            const lightboxImg = document.getElementById('lightbox-img');
            if (lightboxImg) lightboxImg.setAttribute('src', '');
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.filter = '';
        }
    }, 100);
});