// Translations Management
let translations = window.__translations || {};
const html = document.documentElement;
let currentLang = window.__currentLang || 'en';

// Load translations if not already loaded
if (!window.__translations) {
    fetch('./translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            window.__translations = data;
            const savedLang = localStorage.getItem('language') || 'en';
            initLanguage(savedLang);
        })
        .catch(error => console.error('Failed to load translations:', error));
} else {
    currentLang = window.__currentLang;
}

// Initialize language
function initLanguage(lang) {
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    currentLang = lang;
    updateContent(lang);
}

// Update all content based on language
function updateContent(lang) {
    const data = translations[lang];
    if (!data) return;
    
    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = key.split('.').reduce((current, k) => current?.[k], data);
        if (value) {
            el.textContent = value;
        }
    });
    
    // Update page title
    document.title = data.title;
}

// Loading Animation
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main');
    const wipeCircle = document.querySelector('.wipe-circle');
    
    // Create timeline for loader exit and hero entrance
    const loaderTl = gsap.timeline({
        onComplete: () => {
            loader.style.display = 'none';
        }
    });
    
    // Radial unwrap animation
    loaderTl
        .to(wipeCircle, {
            attr: { r: 150 },
            duration: 1,
            ease: "power3.inOut",
            delay: 0.5 // Wait for marquee to play
        })
        .to(loader, {
            opacity: 0,
            duration: 0.4,
            ease: "power2.out"
        }, "-=0.4")
        .set(mainContent, { opacity: 1 })
        .add(() => {
            mainContent.classList.add('loaded');
        })
        // Hero image entrance animations
        .from('.almond-img', {
            scale: 0.6,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        }, "-=0.2")
        .from('.ice-cream-img', {
            y: 100,
            x: -100,
            rotation: -45,
            opacity: 0,
            scale: 0.5,
            duration: 1.4,
            ease: "elastic.out(1, 0.6)"
        }, "-=0.9")
        .from('#hero-text h1 img:nth-child(1)', {
            x: -150,
            rotation: -180,
            opacity: 0,
            duration: 1,
            ease: "back.out(2)"
        }, "-=1.2")
        .from('#hero-text h1 span', {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(2)"
        }, "-=0.7")
        .from('#hero-text h1 img:nth-child(3)', {
            x: 150,
            rotation: 180,
            opacity: 0,
            duration: 1,
            ease: "back.out(2)"
        }, "-=0.9");
});

// Ice cream scroll animation
const tl = gsap.timeline({ 
    scrollTrigger: {
        trigger: "#product",
        start: "-70% 50%",
        end: "50% 50%",
        // markers: true,
        scrub: true
    }
});

// Check if RTL for ice cream animation
const isRTL = () => document.documentElement.getAttribute('lang') === 'ar';

tl.to(".ice-cream-img",{
    top: "125%",
    left: isRTL() ? "auto" : "50%",
    // right: isRTL() ? "50%" : "auto",
    // transform: isRTL() ? "rotate(0deg) translateX(50%)" : "rotate(0deg) translateX(-50%)",
    left: "50%",
    transform: "rotate(0deg) translateX(-50%)",
    width: "17rem",
    height: "70%",
    ease: "none",
    duration: 3
})

// Language Toggle Functionality
const langToggle = document.getElementById('lang-toggle');

// Check for saved language preference and set language toggle
langToggle.addEventListener('click', () => {
    const currentLang = html.getAttribute('lang');
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    initLanguage(newLang);
    localStorage.setItem('language', newLang);
    
    // Update button text
    langToggle.querySelector('.lang-text').textContent = newLang === 'en' ? 'AR' : 'EN';
    
    // Refresh ScrollTrigger to recalculate for RTL
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});
