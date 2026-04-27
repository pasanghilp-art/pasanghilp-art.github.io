/* ─────────────────────────────────────────
   PASANG TAMANG — PORTFOLIO
   script.js
───────────────────────────────────────── */

/* ═══════════════════════════════════════
   1. NAVBAR — scroll shadow + active link
═══════════════════════════════════════ */
const navbar      = document.getElementById('navbar');
const progressBar = document.getElementById('progressBar');
const sections    = ['home', 'about', 'projects', 'contact'];

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;

  // Shadow on scroll
  navbar.classList.toggle('scrolled', scrolled > 10);

  // Scroll progress bar
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = Math.round((scrolled / total) * 100) + '%';

  // Active nav link highlight
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && scrolled + 80 >= el.offsetTop) current = id;
  });

  document.querySelectorAll('[data-target]').forEach(link => {
    link.classList.toggle('active', link.dataset.target === current);
  });
});


/* ═══════════════════════════════════════
   2. SMOOTH SCROLL — all anchor links
═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"], [data-target]').forEach(link => {
  link.addEventListener('click', e => {
    const href   = link.getAttribute('href') || '#' + link.dataset.target;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });

    // Close mobile menu if open
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});


/* ═══════════════════════════════════════
   3. HAMBURGER — mobile menu toggle
═══════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close menu when clicking outside
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
});


/* ═══════════════════════════════════════
   4. TYPED TEXT — hero section
═══════════════════════════════════════ */
const phrases = [
  'Aspiring web developer.',
  'Turning ideas into real products.',
  'Fresh +2 graduate from Kathmandu.',
  'Open to internship opportunities.',
  'Learning every single day.',
];

let phraseIndex = 0;
let charIndex   = 0;
let deleting    = false;
const typedEl   = document.getElementById('typed-text');

function type() {
  const phrase = phrases[phraseIndex];

  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++charIndex);
    if (charIndex === phrase.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = phrase.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting    = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(type, deleting ? 36 : 65);
}

// Start after hero entrance animation settles
setTimeout(type, 1000);


/* ═══════════════════════════════════════
   5. SKILL BARS — animate on scroll into view
═══════════════════════════════════════ */
const aboutSection = document.getElementById('about');
const skillFills   = document.querySelectorAll('.skill-fill');
let skillsAnimated = false;

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !skillsAnimated) {
      skillsAnimated = true;
      skillFills.forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.3 });

if (aboutSection) skillObserver.observe(aboutSection);


/* ═══════════════════════════════════════
   6. SECTION ENTRANCE — fade up on scroll
═══════════════════════════════════════ */
const revealEls = document.querySelectorAll('.proj-card, .info-card, .stat-card');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger cards slightly
      setTimeout(() => {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});


/* ═══════════════════════════════════════
   7. CONTACT FORM — validation + submit
═══════════════════════════════════════ */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

function validateField(inputId, fieldId, testFn) {
  const input   = document.getElementById(inputId);
  const fieldEl = document.getElementById(fieldId);
  const valid   = testFn(input.value);
  fieldEl.classList.toggle('has-error', !valid);
  input.classList.toggle('error', !valid);
  return valid;
}

function validateAll() {
  const n = validateField('fname',    'field-name',    v => v.trim().length > 0);
  const e = validateField('femail',   'field-email',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  const s = validateField('fsubject', 'field-subject', v => v.trim().length > 0);
  const m = validateField('fmsg',     'field-msg',     v => v.trim().length > 0);
  return n && e && s && m;
}

// Clear error as user types
['fname', 'femail', 'fsubject', 'fmsg'].forEach(id => {
  const map = {
    fname:    'field-name',
    femail:   'field-email',
    fsubject: 'field-subject',
    fmsg:     'field-msg',
  };
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener('input', () => {
      document.getElementById(map[id]).classList.remove('has-error');
      input.classList.remove('error');
    });
  }
});

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateAll()) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      const res = await fetch(contactForm.action, {
        method:  'POST',
        body:    new FormData(contactForm),
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        contactForm.classList.add('sent');
        document.getElementById('successMsg').classList.add('show');
      } else {
        submitBtn.querySelector('.btn-label').textContent = 'Something went wrong — try again';
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    } catch {
      submitBtn.querySelector('.btn-label').textContent = 'Network error — try again';
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}


/* ═══════════════════════════════════════
   8. BACK TO TOP BUTTON
═══════════════════════════════════════ */
const backTop = document.getElementById('backTop');

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}