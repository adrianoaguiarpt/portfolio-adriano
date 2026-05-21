document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MENU MOBILE
    const btnMenu = document.querySelector('.menu-hamburger');
    const menuUl = document.querySelector('nav ul');

    btnMenu.addEventListener('click', () => {
        menuUl.classList.toggle('open');
    });

    // 2. INTERSECTION OBSERVER (O "Maestro" do site)
    // Pega as cores do CSS para usar no Canvas se precisar
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor = rootStyles.getPropertyValue('--clr-primary').trim();

    const observerOptions = { threshold: 0.15 };

    const globalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ativa a animação de revelação
                entry.target.classList.add('active');

                // Se houver uma barra de progresso dentro, ela anima
                const bar = entry.target.querySelector('.progress');
                if (bar) {
                    bar.style.width = bar.getAttribute('data-width');
                }
                
                // Para de observar depois que animou (performance!)
                globalObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleciona todos os itens que devem "aparecer" ao scroll
    document.querySelectorAll('.reveal-item').forEach(el => globalObserver.observe(el));

    // 3. CANVAS (Fundo interativo estilo Antigravity)
    const canvas = document.getElementById('interactive-bg');
    const ctx = canvas.getContext('2d');
    const particleColors = [
        { r: 66, g: 165, b: 245 },
        { r: 156, g: 39, b: 176 },
        { r: 255, g: 152, b: 0 },
        { r: 76, g: 175, b: 80 },
        { r: 0, g: 188, b: 212 },
        { r: 244, g: 67, b: 54 }
    ];
    let particles = [];
    let mouse = { x: null, y: null, radius: 200 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createParticles();
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 40 + 20;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
            this.targetVx = this.vx;
            this.targetVy = this.vy;
        }

        update() {
            // Suaviza o movimento (easing)
            this.vx += (this.targetVx - this.vx) * 0.05;
            this.vy += (this.targetVy - this.vy) * 0.05;

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < -this.radius) this.x = canvas.width + this.radius;
            if (this.x > canvas.width + this.radius) this.x = -this.radius;
            if (this.y < -this.radius) this.y = canvas.height + this.radius;
            if (this.y > canvas.height + this.radius) this.y = -this.radius;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius && dist > 0) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.targetVx = Math.cos(angle) * force * 3;
                    this.targetVy = Math.sin(angle) * force * 3;
                }
            }

            // Reduz a velocidade gradualmente quando longe do mouse
            if (mouse.x === null) {
                this.targetVx = (Math.random() - 0.5) * 0.4;
                this.targetVy = (Math.random() - 0.5) * 0.4;
            }
        }

        draw() {
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            const c = this.color;
            gradient.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.5)`);
            gradient.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, 0.25)`);
            gradient.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.filter = 'blur(35px)';
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function createParticles() {
        particles = [];
        const count = Math.max(25, Math.round(canvas.width / 35));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        const connectionDist = 150;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < connectionDist) {
                    const alpha = (1 - dist / connectionDist) * 0.25;
                    ctx.save();
                    ctx.strokeStyle = `rgba(200, 200, 200, ${alpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(10, 15, 35, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    animate();

    console.log('%c Cláudia: "Código limpo é código feliz! Bons estudos, Adriano!" ', 'background: #3279f9; color: #fff; padding: 5px;');
});