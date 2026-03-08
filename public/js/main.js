/**
 * Softmaster Main JS (Vanilla Version)
 */

let turnstileWidgetId = null;

// --- Helper Functions ---
function moveSlide(sliderId, direction) {
    const slider = document.querySelector(`#slider-${sliderId}`);
    if (!slider) return;
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dots = Array.from(slider.querySelectorAll('.dot'));
    const activeSlide = slider.querySelector('.slide.active');
    let index = slides.indexOf(activeSlide);

    index += direction;
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    updateSlider(slides, dots, index);
}

function setSlide(sliderId, index) {
    const slider = document.querySelector(`#slider-${sliderId}`);
    if (!slider) return;
    updateSlider(Array.from(slider.querySelectorAll('.slide')), Array.from(slider.querySelectorAll('.dot')), index);
}

function updateSlider(slides, dots, index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
}

function openProject(url, title) {
    const modal = document.querySelector('#project-modal');
    const iframe = document.querySelector('#project-iframe');
    const modalTitle = document.querySelector('#modal-title');
    
    if (!modal || !iframe) return;

    iframe.style.transform = "";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.transformOrigin = "";
    
    modal.style.display = 'block'; // fadeIn Ersatz via CSS empfohlen
    modal.style.opacity = '1';
    
    iframe.src = url;
    if (modalTitle) modalTitle.textContent = title;
    document.body.classList.add('modal-open');

    iframe.onload = function() {
        const containerWidth = document.querySelector('.modal-body').clientWidth;
        try {
            const contentWidth = iframe.contentWindow.document.body.scrollWidth;
            if (contentWidth > containerWidth && containerWidth < 768) {
                const scale = containerWidth / contentWidth;
                Object.assign(iframe.style, {
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    width: (100 / scale) + "%",
                    height: (100 / scale) + "%"
                });
            }
        } catch (e) { console.log("Skalierung nicht möglich: ", e); }
    };
}

// --- Turnstile Logic ---
function initTurnstile() {
    const container = document.querySelector('#captcha-container');
    if (container && window.turnstile) {
        renderMyTurnstile();
    } else if (container) {
        setTimeout(initTurnstile, 100);
    }
}

function renderMyTurnstile() {
    const container = document.querySelector('#captcha-container');
    if (!container || !window.turnstile) return;

    const isDark = document.body.classList.contains('dark-mode') || localStorage.getItem('theme') === 'dark';
    const theme = isDark ? "dark" : "light";
    const lang = document.documentElement.getAttribute('lang') || "de";

    if (turnstileWidgetId !== null) {
        try { turnstile.remove(turnstileWidgetId); } catch (e) {}
    }

    try {
        turnstileWidgetId = turnstile.render("#captcha-container", {
            sitekey: "0x4AAAAAACjFe0YA3lTjSE_j",
            theme: theme,
            language: lang,
            callback: function(token) {
                const status = document.querySelector('#captcha-status');
                if (status && typeof lang_captcha_success !== 'undefined') status.textContent = lang_captcha_success;
            }
        });
    } catch (e) {
        console.warn("Turnstile Render-Fehler...");
        setTimeout(renderMyTurnstile, 200);
    }
}

function onloadTurnstileCallback() { initTurnstile(); }

// --- DOM Ready Logic ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Google Analytics Helper
    function gtagInit() {
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-H1MZ3S6W9E', { anonymize_ip: true });
    }

    // 2. Cookie Banner
    const cookieBanner = document.querySelector('#cookie-banner');
    const cookieConsent = localStorage.getItem('cookie_consent');

    // 1. Initialer Check beim Laden
    if (!cookieConsent && cookieBanner) {
        // Banner einblenden (Ersatz für fadeIn)
        cookieBanner.classList.remove('hidden');
        setTimeout(() => {
            cookieBanner.classList.add('opacity-100', 'translate-y-0');
        }, 100);
    } else if (cookieConsent === 'accepted') {
        enableGoogleTracking();
    }

    // 2. Event Listener für Akzeptieren
    document.querySelector('#cookie-accept')?.addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'accepted');
        hideCookieBanner();
        enableGoogleTracking();
    });

    // 3. Event Listener für Ablehnen
    document.querySelector('#cookie-decline')?.addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'declined');
        hideCookieBanner();
    });

    // Hilfsfunktion zum Ausblenden (Ersatz für fadeOut)
    function hideCookieBanner() {
        if (!cookieBanner) return;
        cookieBanner.classList.replace('opacity-100', 'opacity-0');
        cookieBanner.classList.add('translate-y-10');
        setTimeout(() => cookieBanner.classList.add('hidden'), 500);
    }

    // 4. Google Tracking Funktion (Eins zu eins übernommen)
    function enableGoogleTracking() {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-H1MZ3S6W9E', { 'anonymize_ip': true });
    }

    initTurnstile();

    // 3. Theme / Dark-Mode Icon Initialisierung
    const themeIcon = document.querySelector('#theme-icon');
    const updateIcon = (isDark, animate = true) => {
        if (!themeIcon) return;
        const icon = isDark ? "🌙" : "☀️";
        if (animate) {
            themeIcon.classList.add('icon-exit');
            setTimeout(() => {
                themeIcon.textContent = icon;
                themeIcon.classList.replace('icon-exit', 'icon-enter');
                setTimeout(() => themeIcon.classList.remove('icon-enter'), 150);
            }, 150);
        } else {
            themeIcon.textContent = icon;
        }
    };
    updateIcon(document.body.classList.contains('dark-mode'), false);

    // 4. Header & Scroll Animationen
    const header = document.querySelector('header');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Optional: Stoppt Beobachtung nach Animation
            }
        });
    }, { threshold: 0.15 });

    // Alle Elemente einmalig registrieren
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    const handleScroll = () => {
        const scrollPos = window.scrollY;
        if (header) {
            if (scrollPos > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }
        // Hier KEINE Schleife und KEIN Observer mehr!
    };
    let ticking = false;

    window.addEventListener('scroll', () => {

        if(!ticking){
            requestAnimationFrame(()=>{
                handleScroll();
                ticking = false;
            });

            ticking = true;
        }

    });
    handleScroll();

    // Auto-Slider Initialisierung
    const sliders = document.querySelectorAll('.service-slider, .project-slider');

    sliders.forEach(slider => {
        // Die ID holen und "slider-" entfernen (wie in deinem PHP-Script)
        const id = slider.id.replace('slider-', '');

        // Intervall starten (alle 5000ms = 5 Sekunden)
        setInterval(() => {
            // Wir prüfen, ob die Funktion moveSlide global verfügbar ist
            if (typeof moveSlide === 'function') {
                moveSlide(id, 1);
            }
        }, 5000);
    });

    // 5. Hero Highlights Slider
    let highlightIndex = 0;
    const hSlides = document.querySelectorAll('.h-slide');
    const hDots = document.querySelectorAll('.h-dot');
    let hInterval;

    const moveHighlight = (idx) => {
        if (hSlides.length === 0) return;
        highlightIndex = idx;
        if (highlightIndex >= hSlides.length) highlightIndex = 0;
        if (highlightIndex < 0) highlightIndex = hSlides.length - 1;
        
        hSlides.forEach(s => s.classList.remove('active'));
        hDots.forEach(d => d.classList.remove('active'));
        hSlides[highlightIndex].classList.add('active');
        hDots[highlightIndex].classList.add('active');
        
        clearInterval(hInterval);
        startHInterval();
    };

    const startHInterval = () => {
        hInterval = setInterval(() => moveHighlight(highlightIndex + 1), 6000);
    };

    if (hSlides.length > 0) startHInterval();
    window.moveHighlight = moveHighlight;

    // Swipe Support for Hero
    const heroContainer = document.getElementById('main-hero-highlights');
    if (heroContainer) {
        let startX, startY;
        heroContainer.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, {passive: true});
        heroContainer.addEventListener('touchend', e => {
            const diffX = startX - e.changedTouches[0].clientX;
            const diffY = startY - e.changedTouches[0].clientY;
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                moveHighlight(diffX > 0 ? highlightIndex + 1 : highlightIndex - 1);
            }
        }, {passive: true});
    }

    // 6. Theme Toggle Click
    document.querySelector('#theme-toggle')?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        updateIcon(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (typeof turnstile !== 'undefined') renderMyTurnstile();
    });

    // 7. Burger Menu
    const burger = document.querySelector('#burger-menu');
    const nav = document.querySelector('#main-nav');
    burger?.addEventListener('click', () => {
        burger.classList.toggle('open');
        nav?.classList.toggle('open');
    });
    nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        burger?.classList.remove('open');
        nav.classList.remove('open');
    }));

    // 8. Canvas Background
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const mouse = { x: null, y: null, radius: 150 };

        const resizeCanvas = () => {
            canvas.width = window.offsetWidth;
            canvas.height = window.offsetHeight;
            initParticles();
        };

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = 2;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
            }
            draw() {
                ctx.fillStyle = document.body.classList.contains('dark-mode') ? "#38bdf8" : "#22c55e";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < mouse.radius) {
                    ctx.strokeStyle = document.body.classList.contains('dark-mode') ? "rgba(56, 189, 248, 0.3)" : "rgba(34, 197, 94, 0.3)";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }

        function initParticles() {
            particles = [];
            let count = (canvas.width * canvas.height) / 15000;
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.update();
                p.draw();
                for (let j = i; j < particles.length; j++) {
                    let dx = p.x - particles[j].x;
                    let dy = p.y - particles[j].y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 120) {
                        ctx.strokeStyle = document.body.classList.contains('dark-mode') ? "rgba(56, 189, 248, 0.1)" : "rgba(34, 197, 94, 0.1)";
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animateCanvas);
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateCanvas();
    }

    // 9. Contact Form AJAX (Fetch)
    document.querySelector('#contact-form')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const responseDiv = document.querySelector('#form-response');
        const formData = new FormData(this);
        
        try {
            const res = await fetch(this.action, {
                method: 'POST',
                body: new URLSearchParams(formData)
            });
            const text = (await res.text()).trim();
            
            if (text === 'success') {
                responseDiv.style.color = 'var(--accent)';
                responseDiv.textContent = typeof lang_success !== 'undefined' ? lang_success : "Success";
                this.reset();
                if (typeof turnstile !== 'undefined') turnstile.reset();
            } else {
                responseDiv.style.color = '#ef4444';
                responseDiv.textContent = text === 'captcha_error' ? lang_captcha_error : (text === 'validation_error' ? lang_error : text);
            }
        } catch (err) { responseDiv.textContent = "Error"; }
    });

    // 10. Modal Close
    const closeModal = () => {
        const modal = document.querySelector('#project-modal');
        if (modal) {
            modal.style.display = 'none';
            document.querySelector('#project-iframe').src = "";
            document.body.classList.remove('modal-open');
        }
    };
    document.querySelectorAll('.close-modal, .modal-overlay').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keyup', e => { if (e.key === "Escape") closeModal(); });

});

// 11. Project Slider Touch Support
let tStartX = 0;
document.addEventListener('touchstart', e => {
    if (e.target.closest('.project-slider')) tStartX = e.changedTouches[0].screenX;
}, {passive: true});

document.addEventListener('touchend', e => {
    const slider = e.target.closest('.project-slider');
    if (slider) {
        const diff = tStartX - e.changedTouches[0].screenX;
        const id = slider.id.replace('slider-', '');
        if (Math.abs(diff) > 50) moveSlide(id, diff > 0 ? 1 : -1);
    }
}, {passive: true});

// 11. service Slider Touch Support
document.addEventListener('touchstart', e => {
    if (e.target.closest('.service-slider')) tStartX = e.changedTouches[0].screenX;
}, {passive: true});

document.addEventListener('touchend', e => {
    const slider = e.target.closest('.service-slider');
    if (slider) {
        const diff = tStartX - e.changedTouches[0].screenX;
        const id = slider.id.replace('slider-', '');
        if (Math.abs(diff) > 50) moveSlide(id, diff > 0 ? 1 : -1);
    }
}, {passive: true});

