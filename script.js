document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('mainHeader');
    const burgerToggle = document.getElementById('burgerToggle');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const body = document.body;

    // 1. Поведение шапки при прокрутке (Scroll effect)
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // 2. Открытие / Закрытие мобильного меню
    if (burgerToggle && mobileOverlay) {
        const toggleMobileMenu = () => {
            burgerToggle.classList.toggle('active');
            mobileOverlay.classList.toggle('active');

            if (mobileOverlay.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        };

        burgerToggle.addEventListener('click', toggleMobileMenu);

        // Закрытие мобильного меню при клике на ссылки
        const mobileLinks = document.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerToggle.classList.remove('active');
                mobileOverlay.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // 3. Активный пункт меню при прокрутке (Scroll Spy)
    const sections = document.querySelectorAll('main > section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobLinks = document.querySelectorAll('.mobile-link');

    const updateActiveLink = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
            currentSectionId = 'contact';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        mobLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    /* ==========================================================================
       4. Логика Модального окна Регистрации и Выбора уровня
       ========================================================================== */
    const authModal = document.getElementById('authModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const ctaBtns = document.querySelectorAll('a[href="physics_page/"], .btn-cta, .btn-mobile-cta');

    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step1Indicator = document.getElementById('step1Indicator');
    const step2Indicator = document.getElementById('step2Indicator');

    const toStep2Btn = document.getElementById('toStep2Btn');
    const backToStep1Btn = document.getElementById('backToStep1Btn');
    const finishRegBtn = document.getElementById('finishRegBtn');

    const regName = document.getElementById('regName');
    const regEmail = document.getElementById('regEmail');
    const regGrade = document.getElementById('regGrade');
    const levelCards = document.querySelectorAll('.level-card');

    const openModal = () => {
        if (authModal) {
            authModal.classList.add('active');
            body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        if (authModal) {
            authModal.classList.remove('active');
            body.style.overflow = '';
        }
    };

    // Перехват клика по кнопкам "Начать обучение"
    ctaBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const existingUser = localStorage.getItem('phystech_user');
            if (!existingUser) {
                e.preventDefault();
                openModal();
            }
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) closeModal();
        });
    }

    // Выбор карточки уровня
    levelCards.forEach(card => {
        card.addEventListener('click', () => {
            levelCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // Переход с Шага 1 на Шаг 2
    if (toStep2Btn) {
        toStep2Btn.addEventListener('click', () => {
            if (!regName.value.trim()) {
                alert('Пожалуйста, введите ваше имя.');
                regName.focus();
                return;
            }
            if (!regEmail.value.trim() || !regEmail.value.includes('@')) {
                alert('Пожалуйста, введите корректный email.');
                regEmail.focus();
                return;
            }

            step1.classList.remove('active');
            step2.classList.add('active');
            step1Indicator.classList.remove('active');
            step2Indicator.classList.add('active');
        });
    }

    // Возврат с Шага 2 на Шаг 1
    if (backToStep1Btn) {
        backToStep1Btn.addEventListener('click', () => {
            step2.classList.remove('active');
            step1.classList.add('active');
            step2Indicator.classList.remove('active');
            step1Indicator.classList.add('active');
        });
    }

    // Завершение регистрации
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
                createdAt: new Date().toISOString()
            };

            localStorage.setItem('phystech_user', JSON.stringify(userData));
            closeModal();
            window.location.href = 'physics_page/';
        });
    }

    // 67
    const practiceCard = document.getElementById("practice-card");
    let clickCount = 0;
    let resetTimer = null;

    if (practiceCard) {
        practiceCard.addEventListener("click", function () {
            if (resetTimer) clearTimeout(resetTimer);

            clickCount++;

            if (clickCount === 5) {
                window.location.href = "67.html";
            } else {
                // Сброс счетчика при простое в 3 секунды (тихо)
                resetTimer = setTimeout(() => {
                    clickCount = 0;
                }, 3000);
            }
        });
    }
});

