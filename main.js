const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealEls = document.querySelectorAll('.reveal');
const yearEl = document.getElementById('year');
const bracketUpdatedEl = document.getElementById('bracket-updated');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => observer.observe(el));

const sections = document.querySelectorAll('main section[id]');
const setActiveNav = () => {
  const scrollY = window.scrollY + 120;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const match = document.querySelector(`.site-nav a[href="#${id}"]`);

    if (!match) return;

    if (scrollY >= top && scrollY < bottom) {
      match.setAttribute('aria-current', 'true');
    } else {
      match.removeAttribute('aria-current');
    }
  });
};

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

fetch('./bracket.json')
  .then((res) => (res.ok ? res.json() : null))
  .then((data) => {
    if (!data || !bracketUpdatedEl || !data.meta || !data.meta.updated_at) return;

    const date = new Date(data.meta.updated_at);
    if (Number.isNaN(date.getTime())) return;

    const formatted = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(date);

    bracketUpdatedEl.textContent = `Bracket updated: ${formatted}`;
  })
  .catch(() => {
    if (bracketUpdatedEl) {
      bracketUpdatedEl.textContent = 'Bracket data currently unavailable.';
    }
  });
