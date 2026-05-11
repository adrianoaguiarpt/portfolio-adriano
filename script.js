// ===== SCRIPT.JS - PORTFÓLIO PREMIUM =====

document.addEventListener('DOMContentLoaded', () => {
    
    // ===== 1. MENU MOBILE (Modernizado) =====
    const nav = document.querySelector('nav');
    const ul = document.querySelector('nav ul');
    
    // Create hamburger button if it doesn't exist
    if (!document.querySelector('.menu-hamburger')) {
        const hamburger = document.createElement('div');
        hamburger.className = 'menu-hamburger';
        hamburger.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;
        hamburger.style.cssText = `
            cursor: pointer;
            color: var(--primary-blue);
            display: none;
            z-index: 1001;
        `;
        
        nav.insertBefore(hamburger, nav.firstChild);
        
        // Media query check for display
        const checkMobile = () => {
            if (window.innerWidth <= 768) {
                hamburger.style.display = 'block';
                ul.style.display = 'none';
            } else {
                hamburger.style.display = 'none';
                ul.style.display = 'flex';
            }
        };
        
        window.addEventListener('resize', checkMobile);
        checkMobile();
        
        hamburger.addEventListener('click', () => {
            const isVisible = ul.style.display === 'flex';
            if (isVisible) {
                ul.style.display = 'none';
                hamburger.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                `;
            } else {
                ul.style.display = 'flex';
                hamburger.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                `;
            }
        });
        
        ul.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    ul.style.display = 'none';
                    hamburger.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    `;
                }
            });
        });
    }
    
    // ===== 2. LINK ATIVO NO SCROLL =====
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
    
    // ===== 3. ANIMAÇÃO DE ENTRADA (Intersection Observer Premium) =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.skill-card, .project-card, .experiencia-card, .certificacao-card, .roadmap-phase, .sobre-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
        observer.observe(el);
    });
    
    // ===== 4. ANIMAÇÃO DAS BARRAS DE PROGRESSO =====
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                // Get original width from parent inline style or custom data attribute
                // Since inline style is on the element itself, we can use it
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 200);
                
                progressObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.progress, .cert-progress-bar').forEach(bar => {
        progressObserver.observe(bar);
    });
    
    // ===== 5. BARRA DE PROGRESSO DE LEITURA =====
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-blue), var(--primary-purple));
        z-index: 9999;
        transition: width 0.1s;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
        progressBar.style.width = progress + '%';
    });
    
    // ===== 6. CONSOLE WELCOME =====
    console.log('%c🚀 Portfólio de Adriano Aguiar', 'color: #00f0ff; font-size: 18px; font-weight: bold;');
    console.log('%cConstruído com tecnologias nativas (HTML/CSS/JS) e focado em performance e estética premium.', 'color: #a1a1aa; font-size: 14px;');
    console.log('%c💻 Aberto a oportunidades como Desenvolvedor Full Stack Júnior.', 'color: #00e676; font-size: 14px;');
});