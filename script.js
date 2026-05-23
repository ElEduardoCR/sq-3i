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
// Slideshow de instalaciones
// ============================================

const slideshow = document.getElementById('facilitySlideshow');

if (slideshow) {
    const slides = slideshow.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('slideshowDots');
    let current = 0;
    let timer = null;
    const INTERVAL = 3000;

    // Crea los indicadores (dots)
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Imagen ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('button');

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current]?.classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current]?.classList.add('active');
        restart();
    }

    function next() {
        goTo(current + 1);
    }

    function start() {
        stop();
        timer = setInterval(next, INTERVAL);
    }

    function stop() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    function restart() {
        if (timer) start();
    }

    // Inicia / pausa según la visibilidad de la sección
    const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                start();
            } else {
                stop();
            }
        });
    }, { threshold: 0.25 });

    visibilityObserver.observe(slideshow);

    // Pausa al hacer hover
    slideshow.addEventListener('mouseenter', stop);
    slideshow.addEventListener('mouseleave', start);
}

// ============================================
// Slideshows de productos (genérico)
// ============================================

document.querySelectorAll('.product-slideshow').forEach((slideshow, index) => {
    const slides = slideshow.querySelectorAll('.slide');
    if (slides.length <= 1) return;

    let current = 0;
    let timer = null;
    const INTERVAL = 3000;

    function next() {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }

    function start() {
        if (timer) return;
        // Pequeño offset escalonado para que no cambien todos al mismo tiempo
        const offset = (index % 6) * 350;
        timer = setTimeout(function tick() {
            next();
            timer = setTimeout(tick, INTERVAL);
        }, INTERVAL + offset);
    }

    function stop() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    }

    const visObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) start();
            else stop();
        });
    }, { threshold: 0.2 });

    visObserver.observe(slideshow);

    slideshow.addEventListener('mouseenter', stop);
    slideshow.addEventListener('mouseleave', start);
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

        'products.p5Eyebrow': 'Maquinado de precisión',
        'products.p5Title': 'Maquinado CNC con tolerancias controladas.',
        'products.p5Desc': 'Servicios de maquinado CNC para piezas y componentes industriales con acabados consistentes y tolerancias verificadas por dimensión, listos para integrarse a su proceso productivo.',
        'products.p5F1': 'Maquinado CNC en aceros, aluminio y plásticos técnicos',
        'products.p5F2': 'Tolerancias dimensionales según especificación',
        'products.p5F3': 'Acabados superficiales a medida',
        'products.p5F4': 'Producción de prototipo a serie corta',
        'products.p5F5': 'Verificación dimensional pieza por pieza',

        'products.p6Eyebrow': 'Corte láser',
        'products.p6Title': 'Corte láser de alta precisión.',
        'products.p6Desc': 'Corte y grabado láser con bordes limpios y trazos finos sobre madera, acrílico, MDF y materiales técnicos, ideal para detalles que demandan exactitud y repetibilidad.',
        'products.p6F1': 'Corte láser en madera, acrílico y MDF',
        'products.p6F2': 'Grabado fino sobre superficies planas',
        'products.p6F3': 'Trazos sin rebabas ni quemado',
        'products.p6F4': 'Personalización de logotipos y patrones',
        'products.p6F5': 'Repetibilidad para producción en serie',

        'products.p7Eyebrow': 'Router CNC industrial',
        'products.p7Title': 'Router CNC para piezas de gran formato.',
        'products.p7Desc': 'Router CNC capaz de trabajar hasta 4 pulgadas de grosor sobre madera, foam, cartón, acrílico y aluminio. La opción ideal cuando el proyecto demanda área de trabajo amplia y operaciones combinadas de corte, ranurado y grabado.',
        'products.p7F1': 'Capacidad hasta 4" de grosor máximo',
        'products.p7F2': 'Madera, foam, cartón, acrílico y aluminio',
        'products.p7F3': 'Mesa de gran formato para piezas extensas',
        'products.p7F4': 'Trazos 2D y 3D según diseño CAD',
        'products.p7F5': 'Operaciones de corte, ranurado y grabado',

        'sectors.title': 'Adaptamos cada solución<br><span class="text-gradient">a la industria que lo exige.</span>',
        'sectors.s1Title': 'Aeroespacial',
        'sectors.s1Desc': 'Embalajes especializados que cumplen con los estándares de la industria aeronáutica.',
        'sectors.s2Title': 'Gubernamental',
        'sectors.s2Desc': 'Cumplimiento de especificaciones y entrega confiable para proyectos institucionales.',
        'sectors.s3Title': 'Automotriz',
        'sectors.s3Desc': 'Soluciones de empaque y estructuras para la cadena de suministro del sector automotriz.',
        'sectors.s4Title': 'Maquiladora',
        'sectors.s4Desc': 'Soluciones integrales de empaque, etiquetado y estructuras para operaciones de manufactura de exportación.',
        'sectors.s5Title': 'Electrónica',
        'sectors.s5Desc': 'Cajas de cartón con espuma antiestática (ESD) y cavidades a medida para proteger componentes electrónicos sensibles.',

        'culture.full': '<span class="culture-accent">Orden, compromiso y sentido común</span><br><span class="culture-rest">son nuestra cultura de trabajo.</span>',

        'clients.title': 'Empresas líderes<br><span class="text-gradient">confían en SQ-3I.</span>',

        'contact.title': 'Hablemos de tu<br><span class="text-gradient">próximo proyecto.</span>',
        'contact.phone': 'Teléfono',
        'contact.email': 'Email',
        'contact.location': 'Ubicación',
        'contact.address': 'Av. Terrazas 12815<br>Col. Las Ánimas, Sector 18<br>C.P. 31415, Chihuahua, Chih.',

        'facility.title': 'Nuestras instalaciones',
        'facility.copy': 'Conoce nuestra planta en Chihuahua, donde cada embalaje, etiqueta y estructura toma forma con la calidad que distingue a SQ-3I.',
        'facility.cta': 'Ver en Google Maps →',

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

        'products.p5Eyebrow': 'Precision machining',
        'products.p5Title': 'CNC machining with controlled tolerances.',
        'products.p5Desc': 'CNC machining services for industrial parts and components with consistent finishes and dimensionally verified tolerances, ready to drop into your production process.',
        'products.p5F1': 'CNC machining on steels, aluminum, and engineering plastics',
        'products.p5F2': 'Dimensional tolerances per specification',
        'products.p5F3': 'Custom surface finishes',
        'products.p5F4': 'Prototype to short-run production',
        'products.p5F5': 'Part-by-part dimensional verification',

        'products.p6Eyebrow': 'Laser cutting',
        'products.p6Title': 'High-precision laser cutting.',
        'products.p6Desc': 'Laser cutting and engraving with clean edges and fine detail on wood, acrylic, MDF, and engineering materials — ideal for work that demands accuracy and repeatability.',
        'products.p6F1': 'Laser cutting on wood, acrylic, and MDF',
        'products.p6F2': 'Fine engraving on flat surfaces',
        'products.p6F3': 'Burn- and burr-free edges',
        'products.p6F4': 'Custom logos and patterns',
        'products.p6F5': 'Repeatability for serial production',

        'products.p7Eyebrow': 'Industrial CNC router',
        'products.p7Title': 'CNC router for large-format parts.',
        'products.p7Desc': 'CNC router capable of working up to 4 inches thick on wood, foam, cardboard, acrylic, and aluminum. The right tool when your project calls for a large work area and combined cutting, grooving, and engraving operations.',
        'products.p7F1': 'Up to 4" maximum thickness',
        'products.p7F2': 'Wood, foam, cardboard, acrylic, and aluminum',
        'products.p7F3': 'Large-format table for extended parts',
        'products.p7F4': '2D and 3D toolpaths from CAD',
        'products.p7F5': 'Cutting, grooving, and engraving operations',

        'sectors.title': 'Every solution tailored<br><span class="text-gradient">to the industry that demands it.</span>',
        'sectors.s1Title': 'Aerospace',
        'sectors.s1Desc': 'Specialized packaging that meets aerospace industry standards.',
        'sectors.s2Title': 'Government',
        'sectors.s2Desc': 'Specification compliance and reliable delivery for institutional projects.',
        'sectors.s3Title': 'Automotive',
        'sectors.s3Desc': 'Packaging and structural solutions for the automotive supply chain.',
        'sectors.s4Title': 'Maquiladora',
        'sectors.s4Desc': 'End-to-end packaging, labeling, and structural solutions for export manufacturing operations.',
        'sectors.s5Title': 'Electronics',
        'sectors.s5Desc': 'Cardboard boxes with antistatic (ESD) foam and custom cavities engineered to protect sensitive electronic components.',

        'culture.full': '<span class="culture-accent">Order, commitment, and common sense</span><br><span class="culture-rest">are our work culture.</span>',

        'clients.title': 'Industry leaders<br><span class="text-gradient">trust SQ-3I.</span>',

        'contact.title': 'Let\'s talk about<br><span class="text-gradient">your next project.</span>',
        'contact.phone': 'Phone',
        'contact.email': 'Email',
        'contact.location': 'Location',
        'contact.address': 'Av. Terrazas 12815<br>Col. Las Ánimas, Sector 18<br>ZIP 31415, Chihuahua, Mexico',

        'facility.title': 'Our facilities',
        'facility.copy': 'Visit our plant in Chihuahua, where every package, label, and structure takes shape with the quality that defines SQ-3I.',
        'facility.cta': 'Open in Google Maps →',

        'footer.tagline': 'Engineering & Industrial Supplies',
        'footer.copy': '© 2026 SQ-3I. All rights reserved.',
        'footer.location': 'Chihuahua, Mexico'
    }
};

const langToggle = document.getElementById('langToggle');
const langFlag = document.getElementById('langFlag');
let currentLang = localStorage.getItem('sq3i-lang') || 'es';

// Bandera del idioma DESTINO (la que verías al hacer click)
const FLAGS = {
    es: '🇺🇸', // 🇺🇸 — actualmente ES, click → EN
    en: '🇲🇽'  // 🇲🇽 — actualmente EN, click → ES
};

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

    if (langFlag) {
        langFlag.textContent = FLAGS[lang];
        langFlag.classList.remove('flip');
        void langFlag.offsetWidth; // reflow para reiniciar animación
        langFlag.classList.add('flip');
    }

    if (langToggle) {
        langToggle.setAttribute(
            'aria-label',
            lang === 'es' ? 'Switch to English' : 'Cambiar a español'
        );
    }

    localStorage.setItem('sq3i-lang', lang);
    currentLang = lang;
}

langToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = currentLang === 'es' ? 'en' : 'es';
    applyLang(next);
});

// Aplica idioma inicial
applyLang(currentLang);
