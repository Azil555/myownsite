document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.subtopic-card').forEach((card) => {
        const titleEl = card.querySelector('.subtopic-title');
        if (!titleEl) return;

        const group = card.getAttribute('data-topic-group') || 'topic';
        const rawTitle = titleEl.textContent.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').trim();
        const title = rawTitle.replace(/^🔹\s*/, '').trim();
        if (!title) return;

        const topicId = `${group}-${title.toLowerCase().replace(/[^а-яa-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
        card.style.cursor = 'pointer';

        card.addEventListener('click', (event) => {
            if (event.target.closest('a, button, input, textarea, select, label')) return;

            const fromPage = window.location.pathname.split('/').pop() || 'index.html';
            const topicPage = group.startsWith('8-') ? 'topic-grade8.html' : 'topic.html';
            const url = `${topicPage}?id=${encodeURIComponent(topicId)}&title=${encodeURIComponent(title)}&group=${encodeURIComponent(group)}&from=${encodeURIComponent(fromPage)}`;
            window.location.href = url;
        });
    });

    /* ==========================================================================
       1. Логика Сайдбара и Перенаправления страниц (Navigation)
       ========================================================================== */
    const sidebar = document.querySelector('.sidebar');
    const mobMenuToggle = document.getElementById('mobMenuToggle');

    if (mobMenuToggle && sidebar) {
        mobMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close menu on mobile when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && sidebar && mobMenuToggle) {
            if (!sidebar.contains(e.target) && !mobMenuToggle.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });

    /* ==========================================================================
       2. Профиль пользователя
       ========================================================================== */
    const authModal = document.getElementById('authModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const editProfileBtn = document.getElementById('editProfileBtn');

    const regName = document.getElementById('regName');
    const regEmail = document.getElementById('regEmail');
    const regGrade = document.getElementById('regGrade');
    const levelCards = document.querySelectorAll('.level-card');

    const userNameDisplay = document.getElementById('userNameDisplay');
    const userLevelPill = document.getElementById('userLevelPill');

    const loadUserProfile = () => {
        const stored = localStorage.getItem('phystech_user');
        if (!stored) {
            if (authModal) authModal.classList.add('active');
            return;
        }

        try {
            const user = JSON.parse(stored);
            if (userNameDisplay) userNameDisplay.textContent = user.name || 'Ученик';
            if (userLevelPill) {
                if (user.level === 'olympiad') {
                    userLevelPill.textContent = '🏆 Олимпиадный уровень';
                    userLevelPill.className = 'level-pill olympiad';
                } else {
                    userLevelPill.textContent = '🎓 Базовый уровень';
                    userLevelPill.className = 'level-pill basic';
                }
            }

            if (regName) regName.value = user.name || '';
            if (regEmail) regEmail.value = user.email || '';
            if (regGrade) regGrade.value = user.grade || '10';

            levelCards.forEach(card => {
                const radio = card.querySelector('input[type="radio"]');
                if (radio) {
                    if (radio.value === user.level) {
                        radio.checked = true;
                        card.classList.add('active');
                    } else {
                        card.classList.remove('active');
                    }
                }
            });

            renderDynamicSidebar(user);

        } catch (e) {
            console.error('Ошибка чтения профиля', e);
        }
    };

    /* ==========================================================================
       3. Логика Динамического Сайдбара (Real HTML links)
       ========================================================================== */
    const renderDynamicSidebar = (user) => {
        const sidebarNavList = document.getElementById('sidebarNavList');
        if (!sidebarNavList) return;

        const isOlympiad = user.level === 'olympiad';

        const menuItems = isOlympiad ? [
            { id: 'dashboard', label: 'Панель управления', url: 'index.html', icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>' },
            { id: 'topic-mechanics', label: '⚙️ Механика', url: 'topic-mechanics.html', icon: '' },
            { id: 'topic-thermo', label: '⚡ Термодинамика & МКТ', url: 'topic-thermo.html', icon: '' },
            { id: 'topic-electro', label: '🧲 Электродинамика', url: 'topic-electro.html', icon: '' },
            { id: 'topic-quantum', label: '⚛️ Кванты & Оптика', url: 'topic-quantum.html', icon: '' },
            { id: 'tasks', label: '🎯 База задач', url: 'tasks.html', icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' }
        ] : [
            { id: 'dashboard', label: 'Панель управления', url: 'index.html', icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>' },
            { id: 'grade-7', label: '📗 7 класс', url: 'grade-7.html', icon: '' },
            { id: 'grade-8', label: '📘 8 класс', url: 'grade-8.html', icon: '' },
            { id: 'grade-9', label: '📙 9 класс', url: 'grade-9.html', icon: '' },
            { id: 'grade-10', label: '📕 10 класс', url: 'grade-10.html', icon: '' },
            { id: 'grade-11', label: '📓 11 класс', url: 'grade-11.html', icon: '' },
            { id: 'tasks', label: '🎯 База задач', url: 'tasks.html', icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' }
        ];

        sidebarNavList.innerHTML = '';

        // Get current page filename
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        menuItems.forEach((item) => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            
            // Determine if active
            const isLinkActive = (currentPage === item.url) || (currentPage === '' && item.url === 'index.html');
            link.className = `nav-btn ${isLinkActive ? 'active' : ''}`;
            link.href = item.url;

            let iconSVG = item.icon ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${item.icon}</svg>` : '';
            link.innerHTML = `${iconSVG}<span>${item.label}</span>`;

            li.appendChild(link);
            sidebarNavList.appendChild(li);
        });

        // Populate dashboard cards with real URLs if we are on dashboard (index.html)
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (dashboardGrid && currentPage === 'index.html') {
            if (isOlympiad) {
                dashboardGrid.innerHTML = `
                    <a href="topic-mechanics.html" class="dashboard-card-link">
                        <div class="dashboard-card">
                            <div class="card-icon">⚙️</div>
                            <h3>Механика & Статика</h3>
                            <p>Олимпиадная теория, неинерциальные СО и задачи повышенной сложности.</p>
                        </div>
                    </a>
                    <a href="topic-thermo.html" class="dashboard-card-link">
                        <div class="dashboard-card">
                            <div class="card-icon">⚡</div>
                            <h3>Термодинамика & МКТ</h3>
                            <p>Сложные политропические циклы, фазовые переходы и капилляры.</p>
                        </div>
                    </a>
                    <a href="tasks.html" class="dashboard-card-link">
                        <div class="dashboard-card">
                            <div class="card-icon">🎯</div>
                            <h3>База задач</h3>
                            <p>Интерактивные тесты олимпиадного уровня с моментальной проверкой.</p>
                        </div>
                    </a>
                `;
            } else {
                const userGrade = user.grade || '10';
                dashboardGrid.innerHTML = `
                    <a href="grade-${userGrade}.html" class="dashboard-card-link">
                        <div class="dashboard-card">
                            <div class="card-icon">📚</div>
                            <h3>Ваш ${userGrade} класс</h3>
                            <p>Темы и практические симуляторы вашего текущего класса.</p>
                        </div>
                    </a>
                    <a href="tasks.html" class="dashboard-card-link">
                        <div class="dashboard-card">
                            <div class="card-icon">🎯</div>
                            <h3>База задач</h3>
                            <p>Интерактивные тесты разного уровня сложности с мгновенной проверкой.</p>
                        </div>
                    </a>
                `;
            }
        }
    };

    const openModal = () => {
        if (authModal) authModal.classList.add('active');
    };

    const closeModal = () => {
        if (authModal) authModal.classList.remove('active');
    };

    document.querySelectorAll('.back-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('data-back-target') || link.getAttribute('href') || '';
            if (!target || target === '#') {
                e.preventDefault();
                if (window.history.length > 1 && document.referrer) {
                    window.history.back();
                } else {
                    window.location.assign('../index.html');
                }
                return;
            }

            e.preventDefault();
            const resolvedTarget = target.startsWith('http') || target.startsWith('mailto:') || target.startsWith('javascript:')
                ? target
                : new URL(target, window.location.href).toString();
            window.location.assign(resolvedTarget);
        });
    });

    if (editProfileBtn) editProfileBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) closeModal();
        });
    }

    levelCards.forEach(card => {
        card.addEventListener('click', () => {
            levelCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // Step navigation inside registration
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step1Indicator = document.getElementById('step1Indicator');
    const step2Indicator = document.getElementById('step2Indicator');
    const toStep2Btn = document.getElementById('toStep2Btn');
    const backToStep1Btn = document.getElementById('backToStep1Btn');
    const finishRegBtn = document.getElementById('finishRegBtn');

    if (toStep2Btn) {
        toStep2Btn.addEventListener('click', () => {
            if (!regName.value.trim()) {
                alert('Пожалуйста, введите имя.');
                return;
            }
            if (!regEmail.value.trim() || !regEmail.value.includes('@')) {
                alert('Пожалуйста, введите корректный email.');
                return;
            }
            if (step1) step1.classList.remove('active');
            if (step2) step2.classList.add('active');
            if (step1Indicator) step1Indicator.classList.remove('active');
            if (step2Indicator) step2Indicator.classList.add('active');
        });
    }

    if (backToStep1Btn) {
        backToStep1Btn.addEventListener('click', () => {
            if (step2) step2.classList.remove('active');
            if (step1) step1.classList.add('active');
            if (step2Indicator) step2Indicator.classList.remove('active');
            if (step1Indicator) step1Indicator.classList.add('active');
        });
    }

    if (finishRegBtn) {
        finishRegBtn.addEventListener('click', () => {
            const selectedRadio = document.querySelector('input[name="learningLevel"]:checked');
            const selectedLevel = selectedRadio ? selectedRadio.value : 'basic';

            const userData = {
                name: regName.value.trim(),
                email: regEmail.value.trim(),
                grade: regGrade.value,
                level: selectedLevel,
                registered: true,
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem('phystech_user', JSON.stringify(userData));
            closeModal();
            loadUserProfile();
            
            // Redirect to appropriate grade or mechanics page
            const targetUrl = userData.level === 'olympiad' ? 'topic-mechanics.html' : `grade-${userData.grade || '10'}.html`;
            window.location.href = targetUrl;
        });
    }

    // Start learning button redirects
    const startLearningBtn = document.querySelector('.start-learning-btn');
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', () => {
            const stored = localStorage.getItem('phystech_user');
            if (stored) {
                try {
                    const user = JSON.parse(stored);
                    const targetUrl = user.level === 'olympiad' ? 'topic-mechanics.html' : `grade-${user.grade || '10'}.html`;
                    window.location.href = targetUrl;
                    return;
                } catch(e){}
            }
            window.location.href = 'grade-10.html';
        });
    }

    /* ==========================================================================
       4. Управление темами и подтемами (Filters & Subtopic redirects)
       ========================================================================== */
    // Клик по главной теме - раскрывает подтемы (маленькие темы) внутри текущего класса
    document.addEventListener('click', (e) => {
        const filterBtn = e.target.closest('[data-topic-filter]');
        if (filterBtn) {
            e.preventDefault();
            const filterValue = filterBtn.getAttribute('data-topic-filter');
            const parentSection = filterBtn.closest('.tab-content');
            if (!parentSection) return;

            const isAlreadyActive = filterBtn.classList.contains('active');

            // Убираем активный класс у всех карточек тем в этой вкладке
            parentSection.querySelectorAll('[data-topic-filter]').forEach(b => b.classList.remove('active'));

            const subtopicCards = parentSection.querySelectorAll('.subtopic-card');

            if (isAlreadyActive) {
                // Если кликнули на уже открытую тему — сворачиваем её подтемы
                subtopicCards.forEach(card => {
                    card.style.display = 'none';
                });
            } else {
                // Открываем подтемы кликнутой темы
                filterBtn.classList.add('active');

                subtopicCards.forEach(card => {
                    const group = card.getAttribute('data-topic-group');
                    if (group === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Плавная прокрутка к блоку подтем
                const firstVisibleCard = parentSection.querySelector(`.subtopic-card[data-topic-group="${filterValue}"]`);
                if (firstVisibleCard) {
                    firstVisibleCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        }
    });

    const slugifyTopic = (value) => {
        return String(value || '')
            .toLowerCase()
            .trim()
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const getTopicPagePath = (group) => {
        return String(group || '').startsWith('8-') ? 'topic-grade8.html' : 'topic.html';
    };

    // Клик по конкретной маленькой теме (карточке подтемы) - открывает её в отдельном файле темы
    document.addEventListener('click', (e) => {
        const subtopicCard = e.target.closest('.subtopic-card');
        if (subtopicCard) {
            e.preventDefault();
            const group = subtopicCard.getAttribute('data-topic-group') || 'unknown';
            const titleEl = subtopicCard.querySelector('.subtopic-title');
            const title = titleEl ? titleEl.textContent.trim() : subtopicCard.textContent.trim();
            const topicKey = `${group}-${slugifyTopic(title)}`;
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const topicPage = getTopicPagePath(group, title);
            const backTarget = currentPage;
            
            window.location.href = `${topicPage}?id=${encodeURIComponent(topicKey)}&title=${encodeURIComponent(title)}&group=${encodeURIComponent(group)}&from=${encodeURIComponent(backTarget)}`;
        }
    });

    /* ==========================================================================
       5. Логика Квиза (только на странице tasks.html)
       ========================================================================== */
    const tasksQuizContainer = document.querySelector('#tasks .quiz-container');
    if (tasksQuizContainer) {
        let currentQuestion = 1;
        let score = 0;
        const tasksCards = tasksQuizContainer.querySelectorAll('.quiz-card');
        const totalQuestions = tasksCards.length;
        const nextBtn = document.getElementById('nextQuestionBtn');
        const restartBtn = document.getElementById('restartQuizBtn');
        const scoreText = document.getElementById('quizScoreText');

        tasksCards.forEach((card) => {
            const options = card.querySelectorAll('.quiz-option');
            const feedback = card.querySelector('.quiz-feedback');
            options.forEach(opt => {
                opt.addEventListener('click', () => {
                    const optionsContainer = opt.parentElement;
                    if (optionsContainer.classList.contains('answered')) return;
                    optionsContainer.classList.add('answered');

                    const isCorrect = opt.getAttribute('data-correct') === 'true';
                    if (isCorrect) {
                        opt.classList.add('correct');
                        score++;
                        if (feedback) {
                            feedback.textContent = 'Правильно! Отличная работа.';
                            feedback.className = 'quiz-feedback correct';
                        }
                    } else {
                        opt.classList.add('incorrect');
                        if (feedback) {
                            feedback.textContent = 'Неверно.';
                            feedback.className = 'quiz-feedback incorrect';
                        }
                        const correctOption = optionsContainer.querySelector('[data-correct="true"]');
                        if (correctOption) correctOption.classList.add('correct');
                    }

                    if (currentQuestion < totalQuestions) {
                        if (nextBtn) nextBtn.style.display = 'inline-block';
                    } else {
                        if (scoreText) scoreText.textContent = `Ваш результат: ${score} из ${totalQuestions}`;
                        if (restartBtn) restartBtn.style.display = 'inline-block';
                    }
                });
            });
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const currentCard = tasksQuizContainer.querySelector(`.quiz-card[data-question="${currentQuestion}"]`);
                if (currentCard) currentCard.classList.add('hidden');

                currentQuestion++;

                const nextCard = tasksQuizContainer.querySelector(`.quiz-card[data-question="${currentQuestion}"]`);
                if (nextCard) nextCard.classList.remove('hidden');

                nextBtn.style.display = 'none';
            });
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                currentQuestion = 1;
                score = 0;
                if (scoreText) scoreText.textContent = '';
                if (nextBtn) nextBtn.style.display = 'none';
                if (restartBtn) restartBtn.style.display = 'none';

                tasksCards.forEach((card, idx) => {
                    if (idx === 0) card.classList.remove('hidden');
                    else card.classList.add('hidden');

                    const feedback = card.querySelector('.quiz-feedback');
                    if (feedback) {
                        feedback.textContent = '';
                        feedback.className = 'quiz-feedback';
                    }

                    const options = card.querySelector('.quiz-options');
                    if (options) {
                        options.classList.remove('answered');
                        options.querySelectorAll('.quiz-option').forEach(btn => {
                            btn.classList.remove('correct', 'incorrect');
                        });
                    }
                });
            });
        }
    }

    loadUserProfile();
});
