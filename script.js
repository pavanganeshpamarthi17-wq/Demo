/* ============================================
   ALEX CARTER — PORTFOLIO JS
   Interactions, Animations, & Functionality
   ============================================ */

'use strict';

/* ── Loader ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('hidden');
  }, 1900);
});

/* ── Navbar ── */
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('back-top').classList.toggle('visible', window.scrollY > 500);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

/* Close mobile menu on link click */
document.querySelectorAll('#mobile-menu a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── Active Nav Tracking ── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a, #mobile-menu a');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  let current  = '';
  sections.forEach(s => {
    if (scrollY >= s.offsetTop) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}
window.addEventListener('scroll', updateActiveNav);

/* ── Scroll Reveal ── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

/* ── Animated Counters ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const update = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  };
  update();
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(animateCounter);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.achievements-grid, .hero-stats').forEach(el => counterObs.observe(el));

/* ── Testimonial Carousel ── */
(function() {
  const track  = document.querySelector('.testimonials-track');
  const dots   = document.querySelectorAll('.t-dot');
  const total  = document.querySelectorAll('.testimonial-slide').length;
  let current  = 0;
  let autoTimer;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.getElementById('t-prev').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  document.getElementById('t-next').addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  resetAuto();
})();

/* ── Contact Form Validation ── */
(function() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('show'); }
  }
  function clearError(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    clearError('err-name'); clearError('err-email');
    clearError('err-subject'); clearError('err-message');

    if (name.length < 2)  { showError('err-name', 'Please enter your full name.'); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('err-email', 'Enter a valid email address.'); valid = false; }
    if (subject.length < 4) { showError('err-subject', 'Please enter a subject.'); valid = false; }
    if (message.length < 20) { showError('err-message', 'Message must be at least 20 characters.'); valid = false; }

    if (valid) {
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        form.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
        document.getElementById('form-success').classList.add('show');
        setTimeout(() => document.getElementById('form-success').classList.remove('show'), 4000);
      }, 1400);
    }
  });
})();

/* ── Back to Top ── */
document.getElementById('back-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Parallax Hero ── */
window.addEventListener('scroll', () => {
  const orbs = document.querySelectorAll('.hero-orb');
  const sy   = window.scrollY;
  orbs.forEach((o, i) => {
    o.style.transform = `translateY(${sy * (i % 2 === 0 ? 0.12 : -0.08)}px)`;
  });
});

/* ── Cursor glow (desktop only) ── */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;width:320px;height:320px;border-radius:50%;pointer-events:none;z-index:0;
    background:radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
    transition:transform 0.08s linear;top:-160px;left:-160px;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
  });
}
