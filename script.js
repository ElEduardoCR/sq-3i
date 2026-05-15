// ============================================
// SQ-3I — interacciones
// ============================================

const nav = document.getElementById('topNav');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const topLinks = nav.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('section[id]');

// ============================================
// Comportamiento de scroll del nav
// ============================================

function onScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 20) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
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

    topLinks.forEach(link => {
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
            const offset = 90;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ============================================
// i18n — traducción ES / EN
// ============================================

const translations = {
    es: {
        'nav.about': 'Nosotros',
        'nav.services': 'Servicios',
        'nav.products': 'Productos',
        'nav.sectors': 'Sectores',
        'nav.clients': 'Clientes',
        'nav.contact': 'Contacto',

        'hero.line1': 'Ingeniería',
        'hero.line2': 'e Insumos Industriales',
        'hero.subtitle': 'Embalajes industriales, estructuras metálicas y soluciones de precisión.',
        'hero.cta1': 'Conoce nuestros productos',
        'hero.cta2': 'Solicitar cotización →',
        'hero.scroll': 'Desplazar',

        'about.title': 'Diseñamos y fabricamos<br><span class="text-gradient">soluciones industriales</span><br>cimentadas en experiencia<br>y control de calidad.',
        'about.card1': 'Años de experiencia en el sector industrial.',
        'about.card2': 'Sectores especializados que atendemos con precisión.',
        'about.card3': 'Compromiso con la calidad de cada entrega.',

        'services.title': 'Nos apasiona lo que hacemos<br><span class="text-muted">y se nota en los resultados.</span>',
        'services.card1Title': 'Fabricación',
        'services.card1Desc': 'Embalajes de madera, cartón, estructuras metálicas y etiquetas adaptados a cada necesidad.',
        'services.card2Title': 'Corte y grabado CNC',
        'services.card2Desc': 'Precisión en madera, aluminio, acrílico, foam y cartón. Router, plasma y navaja hasta 4" de grosor.',
        'services.card3Title': 'Suministro',
        'services.card3Desc': 'Madera, cartón, espuma de poliuretano, lámina y artículos para transformación industrial.',

        'products.title': 'Productos diseñados<br><span class="text-gradient">bajo estándares industriales.</span>',
        'products.p1Eyebrow': 'Embalaje para exportación',
        'products.p1Title': 'Embalajes de madera certificados NIMF-15.',
        'products.p1Desc': 'Embalajes con tratamiento térmico HT que cumplen la Norma Internacional de Medidas Fitosanitarias NIMF-15, garantizando el ingreso de su mercancía en cualquier destino de exportación.',
        'products.p1F1': 'Tratamiento térmico HT certificado IPPC',
        'products.p1F2': 'Estructura en pino cepillado y estufado de 1"',
        'products.p1F3': 'Triplay de 3/4" de primera calidad',
        'products.p1F4': 'Herrajes industriales reforzados',
        'products.p1F5': 'Marcado fitosanitario y estarcido a medida',

        'products.p2Eyebrow': 'Empaque de protección técnica',
        'products.p2Title': 'Soluciones de empaque para componentes críticos.',
        'products.p2Desc': 'Diseño de empaques internos con espumas técnicas y cavidades a medida que protegen componentes electrónicos, mecánicos y de alto valor durante todo el ciclo logístico.',
        'products.p2F1': 'Espumas antiestáticas (ESD) certificadas',
        'products.p2F2': 'Polietileno y poliuretano de alta densidad',
        'products.p2F3': 'Cavidades CNC según geometría de la pieza',
        'products.p2F4': 'Cartón corrugado de doble y triple pared',
        'products.p2F5': 'Diseño verificado con primera pieza aprobada',

        'products.p3Eyebrow': 'Estructuras metálicas',
        'products.p3Title': 'Fabricación metalmecánica a la medida.',
        'products.p3Desc': 'Diseñamos y fabricamos estructuras metálicas que se integran a la línea de producción del cliente: bases de carga, soportes técnicos y mobiliario industrial en acero estructural.',
        'products.p3F1': 'Bases de carga y soportes especializados',
        'products.p3F2': 'Mesas de trabajo en acero industrial',
        'products.p3F3': 'Ingeniería de diseño según especificación',
        'products.p3F4': 'Soldadura MIG y TIG bajo norma',
        'products.p3F5': 'Recubrimiento anticorrosivo de alta durabilidad',

        'products.p4Eyebrow': 'Etiquetado e identificación',
        'products.p4Title': 'Etiquetas para trazabilidad y logística.',
        'products.p4Desc': 'Producción de etiquetas térmicas y de empaque con la consistencia y resistencia que exigen los procesos industriales y la cadena de suministro moderna.',
        'products.p4F1': 'Impresión térmica directa y transferencia térmica',
        'products.p4F2': 'Códigos de barras, QR y datos variables',
        'products.p4F3': 'Adhesivos para ambientes industriales',
        'products.p4F4': 'Sustratos en poliéster, vinilo y papel',
        'products.p4F5': 'Tirajes cortos y de alto volumen',

        'sectors.title': 'Adaptamos cada solución<br><span class="text-gradient">a la industria que lo exige.</span>',
        'sectors.s1Title': 'Aeroespacial',
        'sectors.s1Desc': 'Embalajes especializados que cumplen con los estándares de la industria aeronáutica.',
        'sectors.s2Title': 'Gubernamental',
        'sectors.s2Desc': 'Cumplimiento de especificaciones y entrega confiable para proyectos institucionales.',
        'sectors.s3Title': 'Automotriz',
        'sectors.s3Desc': 'Soluciones de empaque y estructuras para la cadena de suministro del sector automotriz.',

        'culture.full': '<span class="culture-accent">Orden, compromiso y sentido común</span><br><span class="culture-rest">son nuestra cultura de trabajo.</span>',

        'clients.title': 'Empresas líderes<br><span class="text-gradient">confían en SQ-3I.</span>',

        'contact.title': 'Hablemos de tu<br><span class="text-gradient">próximo proyecto.</span>',
        'contact.phone': 'Teléfono',
        'contact.email': 'Email',
        'contact.location': 'Ubicación',
        'contact.address': 'C. Villa Santa Lucía #12807<br>Chihuahua, Chih.',

        'footer.tagline': 'Ingeniería e Insumos Industriales',
        'footer.copy': '© 2026 SQ-3I. Todos los derechos reservados.',
        'footer.location': 'Chihuahua, México'
    },
    en: {
        'nav.about': 'About',
        'nav.services': 'Services',
        'nav.products': 'Products',
        'nav.sectors': 'Industries',
        'nav.clients': 'Clients',
        'nav.contact': 'Contact',

        'hero.line1': 'Engineering',
        'hero.line2': '& Industrial Supplies',
        'hero.subtitle': 'Industrial packaging, metal structures, and precision solutions.',
        'hero.cta1': 'Explore our products',
        'hero.cta2': 'Request a quote →',
        'hero.scroll': 'Scroll',

        'about.title': 'We design and manufacture<br><span class="text-gradient">industrial solutions</span><br>built on experience<br>and quality control.',
        'about.card1': 'Years of experience in the industrial sector.',
        'about.card2': 'Specialized industries we serve with precision.',
        'about.card3': 'Commitment to the quality of every delivery.',

        'services.title': 'We\'re passionate about what we do<br><span class="text-muted">and it shows in the results.</span>',
        'services.card1Title': 'Manufacturing',
        'services.card1Desc': 'Wood and cardboard packaging, metal structures, and labels tailored to every need.',
        'services.card2Title': 'CNC cutting & engraving',
        'services.card2Desc': 'Precision on wood, aluminum, acrylic, foam, and cardboard. Router, plasma, and blade up to 4" thick.',
        'services.card3Title': 'Supply',
        'services.card3Desc': 'Wood, cardboard, polyurethane foam, sheet metal, and items for industrial transformation.',

        'products.title': 'Products built to<br><span class="text-gradient">industrial standards.</span>',
        'products.p1Eyebrow': 'Export packaging',
        'products.p1Title': 'ISPM-15 certified wooden packaging.',
        'products.p1Desc': 'Heat-treated (HT) wooden packaging compliant with the ISPM-15 International Standard for Phytosanitary Measures, ensuring your shipment clears customs at any export destination.',
        'products.p1F1': 'IPPC-certified HT heat treatment',
        'products.p1F2': '1" planed and kiln-dried pine structure',
        'products.p1F3': 'Premium 3/4" plywood',
        'products.p1F4': 'Heavy-duty industrial hardware',
        'products.p1F5': 'Phytosanitary marking and custom stencil',

        'products.p2Eyebrow': 'Technical protective packaging',
        'products.p2Title': 'Packaging solutions for critical components.',
        'products.p2Desc': 'Custom-cut technical foams and inner packaging that protect electronic, mechanical, and high-value components across the entire logistics cycle.',
        'products.p2F1': 'Certified anti-static (ESD) foams',
        'products.p2F2': 'High-density polyethylene and polyurethane',
        'products.p2F3': 'CNC cavities matched to part geometry',
        'products.p2F4': 'Double and triple-wall corrugated cardboard',
        'products.p2F5': 'Verified design with first-article approval',

        'products.p3Eyebrow': 'Metal structures',
        'products.p3Title': 'Custom metalworking and fabrication.',
        'products.p3Desc': 'We design and build metal structures that integrate seamlessly into your production line: load bases, technical supports, and industrial furniture in structural steel.',
        'products.p3F1': 'Load bases and specialized supports',
        'products.p3F2': 'Industrial-grade steel work tables',
        'products.p3F3': 'Engineering design to specification',
        'products.p3F4': 'MIG and TIG welding to standard',
        'products.p3F5': 'Long-lasting anti-corrosion coating',

        'products.p4Eyebrow': 'Labeling & identification',
        'products.p4Title': 'Labels for traceability and logistics.',
        'products.p4Desc': 'Thermal and packaging labels with the consistency and durability required by modern industrial processes and supply chains.',
        'products.p4F1': 'Direct thermal and thermal transfer printing',
        'products.p4F2': 'Barcodes, QR codes, and variable data',
        'products.p4F3': 'Adhesives for industrial environments',
        'products.p4F4': 'Polyester, vinyl, and paper substrates',
        'products.p4F5': 'Short and high-volume runs',

        'sectors.title': 'Every solution tailored<br><span class="text-gradient">to the industry that demands it.</span>',
        'sectors.s1Title': 'Aerospace',
        'sectors.s1Desc': 'Specialized packaging that meets aerospace industry standards.',
        'sectors.s2Title': 'Government',
        'sectors.s2Desc': 'Specification compliance and reliable delivery for institutional projects.',
        'sectors.s3Title': 'Automotive',
        'sectors.s3Desc': 'Packaging and structural solutions for the automotive supply chain.',

        'culture.full': '<span class="culture-accent">Order, commitment, and common sense</span><br><span class="culture-rest">are our work culture.</span>',

        'clients.title': 'Industry leaders<br><span class="text-gradient">trust SQ-3I.</span>',

        'contact.title': 'Let\'s talk about<br><span class="text-gradient">your next project.</span>',
        'contact.phone': 'Phone',
        'contact.email': 'Email',
        'contact.location': 'Location',
        'contact.address': 'C. Villa Santa Lucía #12807<br>Chihuahua, Mexico',

        'footer.tagline': 'Engineering & Industrial Supplies',
        'footer.copy': '© 2026 SQ-3I. All rights reserved.',
        'footer.location': 'Chihuahua, Mexico'
    }
};

const langToggle = document.getElementById('langToggle');
const langLabel = document.getElementById('langLabel');
let currentLang = localStorage.getItem('sq3i-lang') || 'es';

function applyLang(lang) {
    document.documentElement.lang = lang;
    const dict = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = dict[key];
        if (value === undefined) return;

        if (el.hasAttribute('data-i18n-html')) {
            el.innerHTML = value;
        } else {
            el.textContent = value;
        }
    });

    // Etiqueta del botón: muestra el idioma al que cambiarías
    langLabel.textContent = lang === 'es' ? 'EN' : 'ES';
    langLabel.classList.remove('flip');
    void langLabel.offsetWidth; // reflow para reiniciar animación
    langLabel.classList.add('flip');

    localStorage.setItem('sq3i-lang', lang);
    currentLang = lang;
}

langToggle.addEventListener('click', () => {
    const next = currentLang === 'es' ? 'en' : 'es';
    applyLang(next);
});

// Aplica idioma inicial
applyLang(currentLang);
