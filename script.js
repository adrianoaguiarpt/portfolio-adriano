// ===== SCRIPT.JS - PORTFÓLIO EM EVOLUÇÃO =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== 1. MENU MOBILE =====
    function createMobileMenu() {
        if (window.innerWidth > 768) return;
        
        const nav = document.querySelector('nav');
        const ul = document.querySelector('nav ul');
        
        if (document.querySelector('.menu-hamburger')) return;
        
        const hamburger = document.createElement('div');
        hamburger.className = 'menu-hamburger';
        hamburger.innerHTML = '☰';
        hamburger.style.cssText = `
            font-size: 2rem;
            cursor: pointer;
            color: var(--primary-blue);
            display: block;
            position: absolute;
            right: 1.5rem;
            top: 1rem;
        `;
        
        ul.style.display = 'none';
        ul.style.flexDirection = 'column';
        ul.style.width = '100%';
        ul.style.textAlign = 'center';
        ul.style.padding = '1rem 0';
        ul.style.background = 'rgba(15, 23, 42, 0.98)';
        ul.style.backdropFilter = 'blur(10px)';
        ul.style.position = 'absolute';
        ul.style.top = '100%';
        ul.style.left = '0';
        ul.style.right = '0';
        ul.style.zIndex = '999';
        
        nav.style.position = 'relative';
        nav.insertBefore(hamburger, nav.firstChild);
        
        hamburger.addEventListener('click', function() {
            const isVisible = ul.style.display === 'flex';
            ul.style.display = isVisible ? 'none' : 'flex';
            hamburger.innerHTML = isVisible ? '☰' : '✕';
        });
        
        ul.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                ul.style.display = 'none';
                hamburger.innerHTML = '☰';
            });
        });
    }
    
    // ===== 2. SCROLL SUAVE COM OFFSET =====
    function smoothScrollWithOffset() {
        const headerHeight = document.querySelector('header').offsetHeight;
        
        document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    history.pushState(null, null, targetId);
                }
            });
        });
    }
    
    // ===== 3. LINK ATIVO NO SCROLL =====
    function activeLinkOnScroll() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav ul li a');
        const headerHeight = document.querySelector('header').offsetHeight;
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + headerHeight + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href').substring(1);
                if (href === current) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    // ===== 4. ANIMAÇÃO DE DIGITAÇÃO =====
    function typingAnimation() {
        const subtitleElement = document.querySelector('.banner-subtitle');
        if (!subtitleElement) return;
        
        const originalText = "Desenvolvedor Full Stack | Em evolução constante";
        subtitleElement.innerHTML = '';
        
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                subtitleElement.innerHTML += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            } else {
                // Adiciona o cursor piscante
                const cursor = document.createElement('span');
                cursor.className = 'cursor';
                cursor.innerHTML = '|';
                subtitleElement.appendChild(cursor);
            }
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.disconnect();
                }
            });
        });
        
        observer.observe(subtitleElement);
    }
    
    // ===== 5. ANIMAÇÃO DE ENTRADA (SCROLL REVEAL) =====
    function scrollReveal() {
        const elements = document.querySelectorAll('.skill-card, .project-card, .experiencia-card, .certificacao-card, .roadmap-phase');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    // ===== 6. BARRA DE PROGRESSO DE LEITURA =====
    function readingProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-blue), var(--accent-gold));
            z-index: 1001;
            transition: width 0.3s;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
            progressBar.style.width = progress + '%';
        });
    }
    
    // ===== 7. BOTÃO "VOLTAR AO TOPO" =====
    function addBackToTopButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'back-to-top';
        button.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-blue);
            color: var(--bg-dark);
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: 0.3s;
            z-index: 999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(button);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        });
        
        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    }
    
    // ===== 8. ANIMAÇÃO DAS BARRAS DE PROGRESSO =====
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    // ===== 9. MENSAGEM DE BOAS-VINDAS NO CONSOLE =====
    function consoleWelcome() {
        console.log('%c🚀 Portfólio de Adriano Aguiar', 'color: #38bdf8; font-size: 16px; font-weight: bold;');
        console.log('%cEste portfólio está em constante evolução!', 'color: #fbbf24; font-size: 12px;');
        console.log('%cTecnologias que domino: HTML, CSS, JavaScript, Git', 'color: #10b981; font-size: 12px;');
        console.log('%cTecnologias em estudo: React, Node.js, TypeScript e muito mais!', 'color: #f59e0b; font-size: 12px;');
        console.log('%c📚 Acompanhe minha jornada!', 'color: #94a3b8; font-size: 12px;');
    }
    
    // ===== 10. DATA DINÂMICA NO FOOTER =====
    function updateFooterYear() {
        const currentYear = new Date().getFullYear();
        const footerYear = document.querySelector('.footer-info p:first-child');
        if (footerYear) {
            footerYear.innerHTML = `&copy; ${currentYear} - Adriano Aguiar`;
        }
    }
    
    // ===== INICIALIZAR TODAS AS FUNÇÕES =====
    function init() {
        createMobileMenu();
        smoothScrollWithOffset();
        activeLinkOnScroll();
        typingAnimation();
        scrollReveal();
        readingProgressBar();
        addBackToTopButton();
        animateProgressBars();
        consoleWelcome();
        updateFooterYear();
        
        // Estilo para link ativo
        const style = document.createElement('style');
        style.textContent = `
            nav ul li a.active {
                color: var(--primary-blue);
                border-bottom: 2px solid var(--primary-blue);
                padding-bottom: 5px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            
            @media (min-width: 769px) {
                .menu-hamburger {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    init();
});