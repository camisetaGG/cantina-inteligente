/* ============================================================
   script.js - Alimentação Saudável nas Escolas Brasileiras
   Inclui: Login, Cadastro, Recomendações, IA, Toast, etc.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ============ ELEMENTOS GLOBAIS ============
    const authOverlay = document.getElementById('authOverlay');
    const loginPanel = document.getElementById('loginPanel');
    const registerPanel = document.getElementById('registerPanel');
    const authLoading = document.getElementById('authLoading');
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBar');
    const mainContent = document.getElementById('mainContent');

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const forgotPassword = document.getElementById('forgotPassword');
    const btnLogout = document.getElementById('btnLogout');
    const btnLogoutFooter = document.getElementById('btnLogoutFooter');

    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
    const toggleRegisterConfirmPassword = document.getElementById('toggleRegisterConfirmPassword');

    // ============ FUNÇÕES AUXILIARES ============
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    function togglePasswordVisibility(inputId, button) {
        const input = document.getElementById(inputId);
        const icon = button.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    function showAuthLoading(callback, delay = 1500) {
        authLoading.classList.add('active');
        setTimeout(() => {
            authLoading.classList.remove('active');
            if (callback) callback();
        }, delay);
    }

    // ============ TOGGLE LOGIN/CADASTRO ============
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginPanel.classList.add('auth-panel-hidden');
        registerPanel.classList.remove('auth-panel-hidden');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerPanel.classList.add('auth-panel-hidden');
        loginPanel.classList.remove('auth-panel-hidden');
    });

    // ============ TOGGLE SENHA ============
    toggleLoginPassword.addEventListener('click', () => togglePasswordVisibility('loginPassword', toggleLoginPassword));
    toggleRegisterPassword.addEventListener('click', () => togglePasswordVisibility('registerPassword', toggleRegisterPassword));
    toggleRegisterConfirmPassword.addEventListener('click', () => togglePasswordVisibility('registerConfirmPassword',
        toggleRegisterConfirmPassword));

    // ============ ESQUECI MINHA SENHA ============
    forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Um link de recuperação foi enviado para o email cadastrado.', 'success');
    });

    // ============ VALIDAÇÃO E LOGIN ============
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        let valid = true;

        // Reset
        [email, password].forEach(el => el.classList.remove('error'));

        // Validação email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            email.classList.add('error');
            valid = false;
        }

        // Validação senha (mínimo 6)
        if (!password.value.trim() || password.value.trim().length < 6) {
            password.classList.add('error');
            valid = false;
        }

        if (valid) {
            const btn = loginForm.querySelector('.auth-btn');
            btn.classList.add('loading');
            btn.disabled = true;

            showAuthLoading(() => {
                btn.classList.remove('loading');
                btn.disabled = false;
                // Login bem-sucedido: esconder overlay de auth
                authOverlay.classList.add('hidden');
                // Mostrar loading screen do site
                loadingScreen.classList.remove('hidden');
                simulateSiteLoading();
            }, 1500);
        }
    });

    // ============ VALIDAÇÃO E CADASTRO ============
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName');
        const email = document.getElementById('registerEmail');
        const password = document.getElementById('registerPassword');
        const confirmPassword = document.getElementById('registerConfirmPassword');
        let valid = true;

        [name, email, password, confirmPassword].forEach(el => el.classList.remove('error'));

        if (!name.value.trim()) {
            name.classList.add('error');
            valid = false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            email.classList.add('error');
            valid = false;
        }
        if (!password.value.trim() || password.value.trim().length < 6) {
            password.classList.add('error');
            valid = false;
        }
        if (password.value.trim() !== confirmPassword.value.trim()) {
            confirmPassword.classList.add('error');
            valid = false;
        }

        if (valid) {
            const btn = registerForm.querySelector('.auth-btn');
            btn.classList.add('loading');
            btn.disabled = true;

            showAuthLoading(() => {
                btn.classList.remove('loading');
                btn.disabled = false;
                showToast('Cadastro realizado com sucesso! Faça login para continuar.', 'success');
                // Voltar para tela de login
                registerPanel.classList.add('auth-panel-hidden');
                loginPanel.classList.remove('auth-panel-hidden');
                registerForm.reset();
            }, 1200);
        }
    });

    // ============ SIMULAR LOADING DO SITE ============
    function simulateSiteLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                loadingBar.style.width = '100%';
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    mainContent.classList.add('visible');
                    // Inicializar tudo que depende do DOM visível
                    initAfterLogin();
                }, 400);
            } else {
                loadingBar.style.width = progress + '%';
            }
        }, 300);
    }

    // ============ INICIALIZAÇÃO PÓS-LOGIN ============
    function initAfterLogin() {
        initNavbar();
        initScrollReveal();
        initCounters();
        initCharts();
        initAccordion();
        initModal();
        initContactForm();
        initTooltip();
        initSmoothScroll();
        initBackToTop();
        initRecommendations();
        initIA();
        updateNavbar();
        updateActiveLink();
        console.log('%c🥗 Alimentação Saudável nas Escolas Brasileiras %c🚀',
            'font-size: 1.2em; font-weight: bold; color: #16a34a;', 'font-size: 1em;');
        console.log('%cCantina Inteligente - Projeto de Ciência de Dados 2026', 'color: #3b82f6;');
    }

    // ============ LOGOUT ============
    function handleLogout() {
        mainContent.classList.remove('visible');
        authOverlay.classList.remove('hidden');
        loginPanel.classList.remove('auth-panel-hidden');
        registerPanel.classList.add('auth-panel-hidden');
        loginForm.reset();
        registerForm.reset();
        window.scrollTo(0, 0);
        // Reset loading
        loadingBar.style.width = '0%';
        loadingScreen.classList.add('hidden');
    }
    btnLogout.addEventListener('click', handleLogout);
    btnLogoutFooter.addEventListener('click', handleLogout);

    // ============ NAVBAR ============
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTopBtn = document.getElementById('backToTop');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    function initNavbar() {
        window.addEventListener('scroll', updateNavbar, { passive: true });
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
        window.addEventListener('scroll', updateActiveLink, { passive: true });
    }

    function updateNavbar() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        if (scrollY > 60) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
        if (scrollProgress) scrollProgress.style.width = scrollPercent + '%';
        if (scrollY > 500) backToTopBtn.classList.add('visible');
        else backToTopBtn.classList.remove('visible');
    }

    function updateActiveLink() {
        const scrollY = window.scrollY + 100;
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) link.classList.add('active');
        });
    }

    function initBackToTop() {
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offset = navbar ? navbar.offsetHeight + 10 : 80;
                    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
                }
            });
        });
    }

    // ============ SCROLL REVEAL ============
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('revealed'), idx % 3 * 60);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
        reveals.forEach(el => observer.observe(el));
    }

    // ============ COUNTERS ============
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        const first = document.querySelector('[data-count]');
        if (first) observer.observe(first.closest('section') || first);

        function animateCounters() {
            counters.forEach(el => {
                if (el.dataset.animated === 'true') return;
                el.dataset.animated = 'true';
                const target = parseInt(el.getAttribute('data-count'));
                const isDecimal = el.getAttribute('data-decimal') === 'true';
                const duration = 1800;
                const startTime = performance.now();

                function update(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 4);
                    const val = eased * target;
                    el.textContent = isDecimal ? val.toFixed(1).replace('.', ',') : Math.round(val);
                    if (progress < 1) requestAnimationFrame(update);
                    else el.textContent = isDecimal ? target.toFixed(1).replace('.', ',') : target;
                }
                requestAnimationFrame(update);
            });
        }
    }

    // ============ GRÁFICOS CHART.JS ============
    function initCharts() {
        const chartsSection = document.getElementById('graficos');
        if (!chartsSection) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    createCharts();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(chartsSection);
    }

    function createCharts() {
        const green = '#16a34a',
            yellow = '#eab308',
            orange = '#f97316',
            blue = '#3b82f6',
            purple = '#7c3aed',
            red = '#ef4444',
            amber = '#f59e0b';

        // Pizza
        const pizza = document.getElementById('pizzaChart');
        if (pizza && !pizza.chart) {
            pizza.chart = new Chart(pizza, {
                type: 'doughnut',
                data: {
                    labels: ['Nota 5 (3)', 'Nota 6 (7)', 'Nota 7 (10)'],
                    datasets: [{ data: [3, 7, 10], backgroundColor: [yellow, orange, green], borderColor: '#fff',
                        borderWidth: 3, borderRadius: 4 }]
                },
                options: {
                    cutout: '62%',
                    animation: { animateScale: true, duration: 1800 },
                    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b',
                            cornerRadius: 8 } }
                }
            });
        }
        // Barras
        const bar = document.getElementById('barChart');
        if (bar && !bar.chart) {
            bar.chart = new Chart(bar, {
                type: 'bar',
                data: {
                    labels: ['Variedade', 'Visibilidade', 'Organização', 'Qualidade'],
                    datasets: [{ data: [4.5, 5.0, 7.5, 7.0], backgroundColor: [red, amber, green, blue],
                        borderColor: [red, amber, green, blue], borderWidth: 2, borderRadius: 8,
                        borderSkipped: false, maxBarThickness: 60 }]
                },
                options: {
                    scales: { y: { max: 10, grid: { color: 'rgba(0,0,0,0.05)' } },
                    x: { grid: { display: false } } },
                    plugins: { legend: { display: false } },
                    animation: { duration: 1500 }
                }
            });
        }
        // Linha
        const line = document.getElementById('lineChart');
        if (line && !line.chart) {
            line.chart = new Chart(line, {
                type: 'line',
                data: {
                    labels: ['Atual', 'Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'],
                    datasets: [{ data: [7.0, 7.3, 7.8, 8.1, 8.5, 8.8, 9.2], borderColor: green,
                        backgroundColor: 'rgba(22,163,74,0.08)', borderWidth: 3, fill: true, tension: 0.4,
                        pointRadius: 6, pointBackgroundColor: '#fff', pointBorderColor: green, pointBorderWidth: 3 }]
                },
                options: {
                    scales: { y: { min: 5, max: 10 } },
                    plugins: { legend: { display: false } },
                    animation: { duration: 2000 }
                }
            });
        }
    }

    // ============ ACCORDION ============
    function initAccordion() {
        document.querySelectorAll('.accordion-button').forEach(btn => {
            btn.addEventListener('click', () => {
                const expanded = btn.getAttribute('aria-expanded') === 'true';
                document.querySelectorAll('.accordion-button').forEach(b => b.setAttribute(
                    'aria-expanded', 'false'));
                document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
                if (!expanded) {
                    btn.setAttribute('aria-expanded', 'true');
                    btn.nextElementSibling.classList.add('open');
                }
            });
        });
    }

    // ============ MODAL ============
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalOk = document.getElementById('modalOk');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    function openModal(title, message) {
        if (title) modalTitle.textContent = title;
        if (message) modalMessage.textContent = message;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function initModal() {
        modalClose.addEventListener('click', closeModal);
        modalOk.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && modalOverlay.classList.contains(
                'active')) closeModal(); });
    }

    // ============ CONTACT FORM ============
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let valid = true;
            form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            const nome = document.getElementById('nome');
            const email = document.getElementById('email');
            const mensagem = document.getElementById('mensagem');
            if (!nome.value.trim()) { nome.classList.add('error');
                valid = false; }
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !re.test(email.value.trim())) { email.classList.add('error');
                valid = false; }
            if (!mensagem.value.trim() || mensagem.value.trim().length < 5) { mensagem.classList.add('error');
                valid = false; }
            if (valid) {
                const btn = form.querySelector('.btn-submit');
                const orig = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
                btn.disabled = true;
                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.disabled = false;
                    form.reset();
                    openModal('Mensagem Enviada!', 'Obrigado pelo contato. Retornaremos em breve.');
                }, 1200);
            } else {
                const firstErr = form.querySelector('.error');
                if (firstErr) firstErr.focus();
            }
        });
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => field.classList.remove('error'));
        });
    }

    // ============ TOOLTIP ============
    function initTooltip() {
        const tooltip = document.getElementById('tooltip');
        document.querySelectorAll('[data-tooltip]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                tooltip.textContent = el.getAttribute('data-tooltip');
                tooltip.classList.add('visible');
            });
            el.addEventListener('mousemove', e => {
                tooltip.style.left = (e.clientX - tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = (e.clientY - tooltip.offsetHeight - 16) + 'px';
            });
            el.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
        });
    }

    // ============ RECOMENDAÇÕES ============
    function initRecommendations() {
        document.querySelectorAll('.btn-recomendar').forEach(btn => {
            btn.addEventListener('click', function() {
                const food = this.getAttribute('data-food');
                showToast(`Recomendação "${food}" enviada para análise da cantina.`);
                // Efeito visual
                this.style.transform = 'scale(0.95)';
                setTimeout(() => this.style.transform = '', 200);
            });
        });
    }

    // ============ IA ============
    function initIA() {
        const btnGerar = document.getElementById('btnGerarRecomendacao');
        const iaDisplay = document.getElementById('iaDisplay');
        const iaParticles = document.getElementById('iaParticles');
        if (!btnGerar || !iaDisplay) return;

        const foodPool = [
            { name: 'Arroz integral', icon: '🍚' },
            { name: 'Feijão', icon: '🫘' },
            { name: 'Frango grelhado', icon: '🍗' },
            { name: 'Salada', icon: '🥗' },
            { name: 'Suco natural', icon: '🧃' },
            { name: 'Peixe', icon: '🐟' },
            { name: 'Batata-doce', icon: '🍠' },
            { name: 'Ovos', icon: '🥚' },
            { name: 'Brócolis', icon: '🥦' },
            { name: 'Banana', icon: '🍌' },
            { name: 'Melancia', icon: '🍉' },
            { name: 'Laranja', icon: '🍊' },
            { name: 'Sanduíche natural', icon: '🥙' },
            { name: 'Leite', icon: '🥛' },
            { name: 'Milho', icon: '🌽' },
        ];

        btnGerar.addEventListener('click', () => {
            // Efeito de partículas
            createParticles(iaParticles);

            // Selecionar 5 aleatórios
            const shuffled = [...foodPool].sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, 5);

            // Construir HTML
            const itemsHTML = selected.map(item =>
                `<div class="ia-result-item">${item.icon} ${item.name}</div>`
            ).join('');

            iaDisplay.innerHTML = `
                <div class="ia-result">
                    <h4>🤖 Hoje recomendamos:</h4>
                    <div class="ia-result-list">${itemsHTML}</div>
                </div>
            `;
            iaDisplay.classList.add('has-result');

            // Reanimar itens
            iaDisplay.querySelectorAll('.ia-result-item').forEach((item, i) => {
                item.style.animation = 'none';
                item.offsetHeight;
                item.style.animation = `fadeInUp 0.5s ease forwards`;
                item.style.animationDelay = `${i * 0.1}s`;
            });
        });

        function createParticles(container) {
            const rect = container.getBoundingClientRect();
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'ia-particle';
                const angle = Math.random() * Math.PI * 2;
                const distance = 60 + Math.random() * 100;
                particle.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
                particle.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
                particle.style.left = (Math.random() * rect.width) + 'px';
                particle.style.top = (Math.random() * rect.height) + 'px';
                particle.style.animationDuration = (0.8 + Math.random() * 1.2) + 's';
                container.appendChild(particle);
                setTimeout(() => particle.remove(), 2000);
            }
        }
    }

    // ============ INICIALIZAÇÃO INICIAL (ANTES DO LOGIN) ============
    // O site já começa com a tela de login visível
    // O conteúdo principal está oculto (main-content display:none)
    // Após login bem-sucedido, main-content é exibido

    // Verificar se já está logado (simulação - sempre mostra login ao carregar)
    authOverlay.classList.remove('hidden');
    mainContent.classList.remove('visible');
    loadingScreen.classList.add('hidden');
});