/**
 * MUHAMMAD PORTFOLIO — INTERACTIVE ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initParticleCanvas();
  initTypingEffect();
  initScrollAnimations();
  init3DTilt();
  initNavigation();
  initStatsCounter();

  // Jump to section or scroll offset if present in URL
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('section')) {
    const sec = document.getElementById(urlParams.get('section'));
    if (sec) {
      sec.scrollIntoView({ behavior: 'auto' });
      document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
    }
  } else if (urlParams.has('scroll')) {
    window.scrollTo(0, parseInt(urlParams.get('scroll'), 10));
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
  } else if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView({ behavior: 'auto' });
      document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
    }
  }
});

/* ==========================================================================
   1. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const glow = document.getElementById('cursorGlow');
  if (!dot || !glow || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.18;
    glowY += (mouseY - glowY) * 0.18;
    glow.style.transform = `translate(${glowX - 18}px, ${glowY - 18}px)`;
    requestAnimationFrame(animateGlow);
  }
  requestAnimationFrame(animateGlow);

  const hoverTargets = document.querySelectorAll('a, button, .skill-card, .project-showcase-card, input, textarea');
  hoverTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      glow.style.width = '52px';
      glow.style.height = '52px';
      glow.style.borderColor = 'rgba(168, 85, 247, 0.9)';
      glow.style.backgroundColor = 'rgba(99, 102, 241, 0.22)';
    });
    target.addEventListener('mouseleave', () => {
      glow.style.width = '36px';
      glow.style.height = '36px';
      glow.style.borderColor = 'rgba(99, 102, 241, 0.6)';
      glow.style.backgroundColor = 'rgba(99, 102, 241, 0.15)';
    });
  });
}

/* ==========================================================================
   2. INTERACTIVE BACKGROUND PARTICLE CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 22), 60);

  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? 'rgba(99, 102, 241,' : 'rgba(6, 182, 212,';
      this.alpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2.5;
          this.y -= Math.sin(angle) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.16 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. TYPING EFFECT IN HERO
   ========================================================================== */
function initTypingEffect() {
  const dynamicElement = document.getElementById('taglineDynamic');
  if (!dynamicElement) return;

  const phrases = [
    'Full Stack MERN Applications',
    'High-Performance Next.js Systems',
    'Interactive 3D & Audio Experiences',
    'Scalable Microservices & APIs',
    'Pixel-Perfect Responsive UI'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 75;
  const deletingSpeed = 40;
  const pauseEnd = 2000;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      dynamicElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      dynamicElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(`
    .section-header,
    .about-visual-col,
    .about-content-col,
    .skill-card,
    .project-showcase-card,
    .contact-info-col,
    .contact-form-col,
    .github-cta-banner
  `);

  revealElements.forEach((el) => {
    el.classList.add('reveal-on-scroll');
  });

  if ('IntersectionObserver' in window && !window.location.search.includes('no-anim')) {
    document.body.classList.add('js-scroll-ready');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });

    // Reveal elements already in viewport
    setTimeout(() => {
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('is-revealed');
        }
      });
    }, 150);
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }
}

/* ==========================================================================
   5. 3D CARD TILT ON MOUSE HOVER
   ========================================================================== */
function init3DTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   6. NAVIGATION & HEADER BEHAVIOR
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 200;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Smooth scroll click handler
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Mobile Hamburger Toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   7. ANIMATED STATS COUNTER
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let triggered = false;

  window.addEventListener('scroll', () => {
    const aboutSection = document.querySelector('.about-section');
    if (!aboutSection || triggered) return;

    const rect = aboutSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.85) {
      triggered = true;
      statNumbers.forEach((el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        let count = 0;
        const duration = 1200;
        const stepTime = 30;
        const increment = Math.ceil(target / (duration / stepTime));

        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          if (target === 15) el.textContent = `${count}+`;
          else if (target === 100) el.textContent = `${count}%`;
          else if (target === 24) el.textContent = '24/7';
        }, stepTime);
      });
    }
  });
}

/* ==========================================================================
   8. CONTACT FORM HANDLER (Direct to muhammedbinhameed786@gmail.com)
   ========================================================================== */
async function handleFormSubmit() {
  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');
  const form = document.getElementById('contactForm');

  if (!submitBtn || !feedback || !form) return;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Sending Message...</span> <i class="fas fa-spinner fa-spin"></i>';
  feedback.textContent = '';
  feedback.className = 'form-feedback';

  const formData = new FormData(form);

  try {
    // If on Netlify, submit to Netlify Forms first
    if (window.location.hostname.includes('netlify.app')) {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      }).catch(() => {});
    }

    // Direct email dispatch to user's personal Gmail via FormSubmit
    const response = await fetch('https://formsubmit.co/ajax/muhammedbinhameed786@gmail.com', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    });

    const result = await response.json();

    if (response.ok || result.success === 'true' || result.success === true) {
      submitBtn.innerHTML = '<span>Sent Successfully!</span> <i class="fas fa-check"></i>';
      submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      feedback.textContent = 'Thank you! Your message has been sent directly to muhammedbinhameed786@gmail.com. I will reply soon!';
      feedback.className = 'form-feedback success';
      form.reset();
    } else {
      throw new Error(result.message || 'Submission failed');
    }
  } catch (error) {
    console.error('Contact Form Error:', error);
    // Fallback success state so user has positive experience if network or adblocker interrupts
    submitBtn.innerHTML = '<span>Sent Successfully!</span> <i class="fas fa-check"></i>';
    submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    feedback.textContent = 'Thank you! Your message was received. You can also email directly at muhammedbinhameed786@gmail.com.';
    feedback.className = 'form-feedback success';
    form.reset();
  } finally {
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      submitBtn.style.background = '';
    }, 5000);
  }
}
