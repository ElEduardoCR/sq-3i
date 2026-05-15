// ============================================
// SQ-3I — interacciones
// ============================================

const nav = document.getElementById('topNav');
const sideNav = document.getElementById('sideNav');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const hero = document.querySelector('.hero');

const topLinks = nav.querySelectorAll('.nav-menu a');
const sideLinks = sideNav.querySelectorAll('a');
const sections = document.querySelectorAll('section[id]');

// ============================================
// Comportamiento de scroll: nav superior vs lateral
// ============================================

function onScroll() {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;

    // Estilo del nav superior cuando se desplaza
    if (scrollY > 20) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Cuando pasa el hero, oculta el top nav y muestra el side nav
    if (scrollY > heroHeight * 0.7) {
        nav.classList.add('hidden');
        sideNav.classList.add('visible');
    } else {
        nav.classList.remove('hidden');
        sideNav.classList.remove('visible');
    }

    // Parallax sutil del hero
    if (scrollY <= window.innerHeight) {
        document.querySelectorAll('.hero-shape').forEach((shape, i) => {
            const speed = (i + 1) * 0.15;
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ============================================
// Menú móvil
// ============================================

navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
    });
});

// ============================================
// Scroll reveal
// ============================================

const revealElements = document.querySelectorAll('.reveal, .reveal-scale');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ============================================
// Sección activa: highlight + animación pulse
// ============================================

let activeSection = '';

function setActiveSection(sectionId) {
    if (activeSection === sectionId) return;
    activeSection = sectionId;

    // Top nav
    topLinks.forEach(link => {
        const isActive = link.dataset.section === sectionId;
        if (isActive) {
            link.classList.add('active', 'pulse');
            setTimeout(() => link.classList.remove('pulse'), 600);
        } else {
            link.classList.remove('active', 'pulse');
        }
    });

    // Side nav
    sideLinks.forEach(link => {
        const isActive = link.dataset.section === sectionId;
        if (isActive) {
            link.classList.add('active', 'pulse');
            setTimeout(() => link.classList.remove('pulse'), 600);
        } else {
            link.classList.remove('active', 'pulse');
        }
    });
}

const sectionObserver = new IntersectionObserver((entries) => {
    // Encuentra la sección más visible
    let mostVisible = null;
    let maxRatio = 0;

    entries.forEach(entry => {
        if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisible = entry.target;
        }
    });

    if (mostVisible && maxRatio > 0.2) {
        setActiveSection(mostVisible.id);
    }
}, {
    threshold: [0.2, 0.4, 0.6, 0.8],
    rootMargin: '-15% 0px -40% 0px'
});

sections.forEach(section => sectionObserver.observe(section));

// ============================================
// Smooth scroll a anclas
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
