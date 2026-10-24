// 1. Анимация для механического движения (поезд с ползунком)
window.initMotionAnimation = function (canvasId, sliderId, valueId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error("Холст не найден:", canvasId);
        return;
    }
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById(sliderId);
    const timeValue = document.getElementById(valueId);

    function draw(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Дорога
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(0, 130, canvas.width, 10);

        // Поезд, движущийся по времени
        let trainX = 50 + time * 4;
        if (trainX > canvas.width + 100) trainX = canvas.width + 100;

        ctx.fillStyle = '#8a2be2';
        ctx.fillRect(trainX, 60, 160, 60);

        ctx.fillStyle = '#00f2fe';
        ctx.fillRect(trainX + 20, 75, 30, 30);
        ctx.fillRect(trainX + 70, 75, 30, 30);
        ctx.fillRect(trainX + 120, 75, 30, 30);
    }

    draw(0);

    if (slider) {
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            if (timeValue) timeValue.textContent = val;
            draw(val);
        });
    }
};
function initTrajectoryAnimation(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Здесь код для рисования параболы или траектории баллистического движения
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(20, 150);
    ctx.quadraticCurveTo(150, 10, 280, 150);
    ctx.stroke();
};
window.initCustomOriginAnimation = function (canvasId, infoTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const infoText = document.getElementById(infoTextId);

    // Начальные координаты точки отсчета (по умолчанию в центре)
    let originX = canvas.width / 2;
    let objectX = 50; // Позиция движущегося объекта (машинки/точки)
    let speed = 1.5;

    // Клик мышкой устанавливает новую точку отсчета
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        // Вычисляем координаты клика относительно холста
        const scaleX = canvas.width / rect.width;
        originX = (event.clientX - rect.left) * scaleX;
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Двигаем объект
        objectX += speed;
        if (objectX > canvas.width - 30 || objectX < 30) {
            speed = -speed; // Меняем направление, чтобы не уезжал за границы
        }

        // 1. Рисуем сетку координат и шкалу
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        // 2. Рисуем движущееся тело
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath();
        ctx.arc(objectX, 90, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Outfit, sans-serif';
        ctx.fillText('Тело', objectX - 14, 65);

        // 3. Рисуем выбранную пользователем ТОЧКУ ОТСЧЕТА (Ноль)
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(originX, 130, 8, 0, Math.PI * 2);
        ctx.fill();

        // Линия отсчета (ноль)
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, canvas.height);
        ctx.stroke();

        ctx.fillStyle = '#f43f5e';
        ctx.fillText('0 (Начало отсчета)', originX + 5, 25);

        // 4. Считаем координату объекта относительно нашей точки отсчета
        // В физике координата x = положение тела минус положение начала отсчета
        let relativeCoord = Math.round(objectX - originX);

        if (infoText) {
            infoText.innerHTML = `Положение точки отсчета: <strong>${Math.round(originX)} px</strong> | Текущая координата тела ($x$): <strong style="color: ${relativeCoord >= 0 ? '#4ade80' : '#f43f5e'}">${relativeCoord} px</strong>`;
        }

        requestAnimationFrame(draw);
    }

    draw();
};
window.initReferenceSystemAnimation = function (canvasId, sliderId, valueId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById(sliderId);
    const timeValue = document.getElementById(valueId);

    function draw(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const originX = 60; // Начало координат (ноль)
        const scale = 4.5;  // Масштаб шкалы

        // Рисуем координатную ось OX
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, 90);
        ctx.lineTo(canvas.width - 30, 90);
        ctx.stroke();

        // Стрелка оси
        ctx.beginPath();
        ctx.moveTo(canvas.width - 40, 85);
        ctx.lineTo(canvas.width - 30, 90);
        ctx.lineTo(canvas.width - 40, 95);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Outfit, sans-serif';
        ctx.fillText('X', canvas.width - 25, 95);

        // Штрихи и деления на оси (координаты)
        ctx.font = '11px Outfit, sans-serif';
        for (let i = 0; i <= 100; i += 20) {
            let xPos = originX + i * scale;
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(xPos, 85);
            ctx.lineTo(xPos, 95);
            ctx.stroke();

            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.fillText(i, xPos - 6, 115);
        }

        // Тело отсчета (Ноль)
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(originX, 90, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('Тело отсчета (0)', originX - 35, 65);

        // Положение движущегося тела зависит от времени t (например, x = 2 * t)
        let bodyX = originX + (time * 1.2) * scale;
        if (bodyX > canvas.width - 40) bodyX = canvas.width - 40;

        // Рисуем само тело (машинку/точку)
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath();
        ctx.arc(bodyX, 90, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        let currentCoord = Math.round(time * 1.2);
        ctx.fillText(`Тело (x = ${currentCoord} м)`, bodyX - 30, 65);
    }

    draw(0);

    if (slider) {
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            if (timeValue) timeValue.textContent = val;
            draw(val);
        });
    }
};
window.initTrajectoryAnimation = function (canvasId, btnStraightId, btnCurvedId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const btnStraight = document.getElementById(btnStraightId);
    const btnCurved = document.getElementById(btnCurvedId);
    const statusText = document.getElementById(statusTextId);

    let mode = 'straight'; // 'straight' или 'curved'
    let progress = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        progress += 1.5;
        if (progress > canvas.width - 50) {
            progress = 50;
        }

        if (mode === 'straight') {
            // Линия траектории (прямая пунктирная)
            ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(50, 90);
            ctx.lineTo(canvas.width - 50, 90);
            ctx.stroke();
            ctx.setLineDash([]); // сбрасываем пунктир

            // Движущееся тело
            ctx.fillStyle = '#00f2fe';
            ctx.beginPath();
            ctx.arc(progress, 90, 10, 0, Math.PI * 2);
            ctx.fill();

            if (statusText) statusText.textContent = "Прямолинейная траектория: тело движется строго по прямой линии.";
        } else {
            // Криволинейная траектория (дуга)
            ctx.strokeStyle = 'rgba(138, 43, 226, 0.5)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(50, 130);
            ctx.quadraticCurveTo(canvas.width / 2, 20, canvas.width - 50, 130);
            ctx.stroke();
            ctx.setLineDash([]);

            // Вычисляем положение на параболе/дуге по прогрессу
            let t = (progress - 50) / (canvas.width - 100);
            if (t > 1) t = 1;
            let x = 50 + t * (canvas.width - 100);
            let y = (1 - t) * (1 - t) * 130 + 2 * (1 - t) * t * 20 + t * t * 130;

            // Движущееся тело
            ctx.fillStyle = '#8a2be2';
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fill();

            if (statusText) statusText.textContent = "Криволинейная траектория: тело движется по дуге (кривой линии).";
        }

        requestAnimationFrame(draw);
    }

    draw();

    // Переключение кнопок
    if (btnStraight && btnCurved) {
        btnStraight.addEventListener('click', () => {
            mode = 'straight';
            progress = 50;
            btnStraight.style.background = '#8a2be2';
            btnCurved.style.background = 'rgba(255,255,255,0.1)';
        });

        btnCurved.addEventListener('click', () => {
            mode = 'curved';
            progress = 50;
            btnCurved.style.background = '#8a2be2';
            btnStraight.style.background = 'rgba(255,255,255,0.1)';
        });
    }
};
window.initPathAnimation = function (canvasId, sliderId, valueId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById(sliderId);
    const pathValue = document.getElementById(valueId);

    function draw(val) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const startX = 50;
        const startY = 100;
        const maxDist = 100;
        let progress = val / maxDist; // от 0 до 1

        // Рисуем саму траекторию (дорожку, по которой идет точка)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(180, 50);
        ctx.lineTo(320, 130);
        ctx.lineTo(460, 50);
        ctx.lineTo(550, 100);
        ctx.stroke();

        // Рисуем пройденный путь (выделяем ярким цветом кусок траектории)
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        // Поэтапное заполнение пути в зависимости от ползунка
        let currentX, currentY;

        if (progress <= 0.33) {
            let t = progress / 0.33;
            currentX = startX + t * (180 - startX);
            currentY = startY + t * (50 - startY);
            ctx.lineTo(currentX, currentY);
        } else if (progress <= 0.66) {
            ctx.lineTo(180, 50);
            let t = (progress - 0.33) / 0.33;
            currentX = 180 + t * (320 - 180);
            currentY = 50 + t * (130 - 50);
            ctx.lineTo(currentX, currentY);
        } else if (progress < 1) {
            ctx.lineTo(180, 50);
            ctx.lineTo(320, 130);
            let t = (progress - 0.66) / 0.34;
            currentX = 320 + t * (460 - 320);
            currentY = 130 + t * (50 - 130);
            ctx.lineTo(currentX, currentY);
        } else {
            ctx.lineTo(180, 50);
            ctx.lineTo(320, 130);
            ctx.lineTo(460, 50);
            let t = (progress - 1) / 0.01; // хвостик до конца
            currentX = 460 + t * (550 - 460);
            currentY = 50 + t * (100 - 50);
            ctx.lineTo(currentX, currentY);
        }
        ctx.stroke();

        // Текущая позиция тела (машинки/точки)
        if (currentX === undefined) { currentX = startX; currentY = startY; }
        ctx.fillStyle = '#8a2be2';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 10, 0, Math.PI * 2);
        ctx.fill();

        // Подпись значения пути в метрах (например, умножаем на 5 для реалистичности шкалы)
        let meters = Math.round(val * 2.5);
        if (pathValue) pathValue.textContent = meters;
    }

    draw(0);

    if (slider) {
        slider.addEventListener('input', (e) => {
            draw(e.target.value);
        });
    }
};
window.initDisplacementAnimation = function (canvasId, sliderId, textInfoId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById(sliderId);
    const textInfo = document.getElementById(textInfoId);

    const startX = 80;
    const startY = 120;
    const endX = 520;
    const endY = 60;

    function draw(val) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let progress = val / 100; // от 0 до 1

        // 1. Рисуем вектор перемещения (прямая пунктирная линия от старта до финиша)
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Подпись вектора перемещения
        ctx.fillStyle = '#a78bfa';
        ctx.font = '12px Outfit, sans-serif';
        ctx.fillText('Вектор перемещения (s)', 240, 75);

        // 2. Рисуем извилистую траекторию пути
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(180, 10, 380, 180, endX, endY);
        ctx.stroke();

        // 3. Вычисляем текущую позицию тела на кривой Безье по прогрессу
        let t = progress;
        let u = 1 - t;
        let tt = t * t;
        let uu = u * u;
        let uuu = uu * u;
        let ttt = tt * t;

        // Формула кривой Безье 3-го порядка
        let currentX = uuu * startX + 3 * uu * t * 180 + 3 * u * tt * 380 + ttt * endX;
        let currentY = uuu * startY + 3 * uu * t * 10 + 3 * u * tt * 180 + ttt * endY;

        // Если ползунок в самом начале, ставим в стартовую точку
        if (progress === 0) {
            currentX = startX;
            currentY = startY;
        }

        // 4. Рисуем уже пройденный кусок пути (ярким цветом)
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        for (let step = 0; step <= progress; step += 0.01) {
            let st = step;
            let su = 1 - st;
            let sx = su * su * su * startX + 3 * su * su * st * 180 + 3 * su * st * st * 380 + st * st * st * endX;
            let sy = su * su * su * startY + 3 * su * su * st * 10 + 3 * su * st * st * 180 + st * st * st * endY;
            ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        // 5. Рисуем текущий вектор перемещения от старта до текущей точки тела
        if (progress > 0) {
            ctx.strokeStyle = '#a78bfa';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
        }

        // 6. Точки старта и финиша
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(startX, startY, 6, 0, Math.PI * 2);
        ctx.arc(endX, endY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('Старт', startX - 15, startY + 20);
        ctx.fillText('Финиш', endX - 15, endY - 15);

        // 7. Само тело
        ctx.fillStyle = '#8a2be2';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 10, 0, Math.PI * 2);
        ctx.fill();

        // 8. Расчет числовых значений для текста
        let pathLength = Math.round(val * 4.8); // Длина дуги условно больше
        let dispLength = Math.round(Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)) * 0.8);

        if (textInfo) {
            textInfo.innerHTML = `Пройденный путь ($s$): <strong style="color: #00f2fe">${pathLength} м</strong> | Модуль перемещения ($|\\vec{s}|$): <strong style="color: #a78bfa">${dispLength} м</strong>`;
        }
    }

    draw(0);

    if (slider) {
        slider.addEventListener('input', (e) => {
            draw(e.target.value);
        });
    }
};
function initUniformMotionAnimation(canvasId, sliderId, valueId, startBtnId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const slider = document.getElementById(sliderId); // ползунок скорости
    const valueSpan = document.getElementById(valueId); // текст скорости
    const startBtn = document.getElementById(startBtnId); // кнопка пуска

    let position = 50; // текущая позиция машинки
    let isRunning = false;
    let animationId = null;

    const roadY = 100;
    const finishLine = canvas.width - 70;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Рисуем дорогу
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(40, roadY);
        ctx.lineTo(canvas.width - 40, roadY);
        ctx.stroke();

        // Пунктир на дороге
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(40, roadY);
        ctx.lineTo(canvas.width - 40, roadY);
        ctx.stroke();
        ctx.setLineDash([]); // сброс пунктира

        // Финишная черта
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(finishLine, roadY - 25);
        ctx.lineTo(finishLine, roadY + 25);
        ctx.stroke();

        // Рисуем машинку (прямоугольник с колесами)
        ctx.fillStyle = "#8a2be2";
        ctx.fillRect(position - 25, roadY - 15, 50, 26);
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(position - 10, roadY - 12, 20, 10); // окна

        // Колеса
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(position - 15, roadY + 11, 5, 0, Math.PI * 2);
        ctx.arc(position + 15, roadY + 11, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    function animate() {
        if (!isRunning) return;

        // Скорость зависит от ползунка
        const speed = slider ? parseFloat(slider.value) : 2;
        position += speed;

        // Если доехали до финиша — останавливаемся
        if (position >= finishLine - 25) {
            position = finishLine - 25;
            isRunning = false;
            if (startBtn) startBtn.textContent = "Сбросить / Заново";
        }

        draw();
        animationId = requestAnimationFrame(animate);
    }

    // Обработчик ползунка скорости
    if (slider) {
        slider.addEventListener('input', (e) => {
            if (valueSpan) valueSpan.textContent = e.target.value;
        });
    }

    // Кнопка Старт / Сброс
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (position >= finishLine - 25) {
                // Сброс
                position = 50;
                isRunning = false;
                startBtn.textContent = "Старт движения";
                draw();
            } else if (!isRunning) {
                // Запуск
                isRunning = true;
                startBtn.textContent = "Пауза";
                animate();
            } else {
                // Пауза
                isRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.textContent = "Продолжить";
            }
        });
    }

    // Первый вызов для отрисовки исходного состояния
    draw();
}
function initSpeedAnimation(canvasId, startBtnId, timerTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const timerText = document.getElementById(timerTextId);

    let pos1 = 40; // позиция первого объекта (медленный)
    let pos2 = 40; // позиция второго объекта (быстрый)

    let time = 0;
    let isRunning = false;
    let animationId = null;

    const finishLine = canvas.width - 60;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Дорога 1 (Медленная)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 60);
        ctx.lineTo(canvas.width - 40, 60);
        ctx.stroke();

        // Дорога 2 (Быстрая)
        ctx.beginPath();
        ctx.moveTo(40, 130);
        ctx.lineTo(canvas.width - 40, 130);
        ctx.stroke();

        // Финишная черта
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(finishLine, 30);
        ctx.lineTo(finishLine, 160);
        ctx.stroke();

        // Объект 1 (v = 2 м/с)
        ctx.fillStyle = "#a78bfa";
        ctx.fillRect(pos1 - 15, 48, 30, 24);
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px 'Outfit', sans-serif";
        ctx.fillText("v₁ (медленно)", pos1 - 30, 35);

        // Объект 2 (v = 4.5 м/с)
        ctx.fillStyle = "#8a2be2";
        ctx.fillRect(pos2 - 15, 118, 30, 24);
        ctx.fillStyle = "#7dd3fc";
        ctx.fillText("v₂ (быстро)", pos2 - 25, 105);
    }

    function animate() {
        if (!isRunning) return;

        time += 0.05;
        if (timerText) timerText.textContent = `Время: ${time.toFixed(1)} с`;

        // Движение с разной скоростью
        pos1 += 1.2;
        pos2 += 2.8;

        if (pos1 >= finishLine - 15 || pos2 >= finishLine - 15) {
            pos1 = Math.min(pos1, finishLine - 15);
            pos2 = Math.min(pos2, finishLine - 15);
            isRunning = false;
            if (startBtn) startBtn.textContent = "Сбросить / Заново";
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (pos1 >= finishLine - 15 || pos2 >= finishLine - 15) {
                // Сброс
                pos1 = 40;
                pos2 = 40;
                time = 0;
                if (timerText) timerText.textContent = "Время: 0.0 с";
                isRunning = false;
                startBtn.textContent = "Старт гонки";
                draw();
            } else if (!isRunning) {
                // Старт
                isRunning = true;
                startBtn.textContent = "Пауза";
                animate();
            } else {
                // Пауза
                isRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.textContent = "Продолжить";
            }
        });
    }

    draw();
}
function initNonUniformMotionAnimation(canvasId, startBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const statusText = document.getElementById(statusTextId);

    let position = 40;
    let time = 0;
    let isRunning = false;
    let animationId = null;

    const finishLine = canvas.width - 60;
    const roadY = 100;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Дорога
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(40, roadY);
        ctx.lineTo(canvas.width - 40, roadY);
        ctx.stroke();

        // Пунктир
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(40, roadY);
        ctx.lineTo(canvas.width - 40, roadY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Финишная черта
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(finishLine, roadY - 25);
        ctx.lineTo(finishLine, roadY + 25);
        ctx.stroke();

        // Машинка
        ctx.fillStyle = "#8a2be2";
        ctx.fillRect(position - 25, roadY - 15, 50, 26);
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(position - 10, roadY - 12, 20, 10);

        // Колеса
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(position - 15, roadY + 11, 5, 0, Math.PI * 2);
        ctx.arc(position + 15, roadY + 11, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    function animate() {
        if (!isRunning) return;

        time += 0.03;

        // Неравномерная скорость: меняется со временем с помощью синусоиды (то быстрее, то медленнее)
        let currentSpeed = 2 + Math.sin(time * 3) * 1.8;
        if (currentSpeed < 0.5) currentSpeed = 0.5; // чтобы не останавливалась совсем

        position += currentSpeed;

        if (statusText) {
            statusText.textContent = `Текущая скорость: ${(currentSpeed * 10).toFixed(0)} км/ч (непостоянная)`;
        }

        if (position >= finishLine - 25) {
            position = finishLine - 25;
            isRunning = false;
            if (startBtn) startBtn.textContent = "Сбросить / Заново";
            if (statusText) statusText.textContent = "Движение завершено!";
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (position >= finishLine - 25) {
                position = 40;
                time = 0;
                isRunning = false;
                startBtn.textContent = "Старт движения";
                if (statusText) statusText.textContent = "Нажмите старт...";
                draw();
            } else if (!isRunning) {
                isRunning = true;
                startBtn.textContent = "Пауза";
                animate();
            } else {
                isRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.textContent = "Продолжить";
            }
        });
    }

    draw();
}
function initAverageSpeedAnimation(canvasId, startBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const statusText = document.getElementById(statusTextId);

    let position = 40;
    let stage = 1; // 1 участок или 2 участок
    let isRunning = false;
    let animationId = null;

    const roadY = 100;
    const halfPoint = 280; // середина пути (120 км условно)
    const finishLine = 520; // конец пути (300 км условно)

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Дорога
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(40, roadY);
        ctx.lineTo(canvas.width - 40, roadY);
        ctx.stroke();

        // Метка середины пути (граница участков)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(halfPoint, roadY - 20);
        ctx.lineTo(halfPoint, roadY + 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Финишная черта
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(finishLine, roadY - 25);
        ctx.lineTo(finishLine, roadY + 25);
        ctx.stroke();

        // Подписи над дорогой
        ctx.fillStyle = "#7dd3fc";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText("Участок 1: 120 км за 2ч", 80, 55);
        ctx.fillText("Участок 2: 180 км за 3ч", 320, 55);

        // Машинка
        ctx.fillStyle = "#8a2be2";
        ctx.fillRect(position - 25, roadY - 15, 50, 26);
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(position - 10, roadY - 12, 20, 10);

        // Колеса
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(position - 15, roadY + 11, 5, 0, Math.PI * 2);
        ctx.arc(position + 15, roadY + 11, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    function animate() {
        if (!isRunning) return;

        // На первом участке скорость одна, на втором — другая
        let currentSpeed = (stage === 1) ? 1.5 : 2.5;
        position += currentSpeed;

        if (stage === 1 && position >= halfPoint) {
            stage = 2;
            if (statusText) statusText.textContent = "Участок 1 пройден! Переходим на участок 2...";
        }

        if (position >= finishLine - 25) {
            position = finishLine - 25;
            isRunning = false;
            if (startBtn) startBtn.textContent = "Сбросить / Заново";
            if (statusText) {
                statusText.textContent = "Итог: Весь путь 300 км / 5 ч = Средняя скорость 60 км/ч";
            }
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (position >= finishLine - 25) {
                position = 40;
                stage = 1;
                isRunning = false;
                startBtn.textContent = "Запустить поездку";
                if (statusText) statusText.textContent = "Нажмите запуск...";
                draw();
            } else if (!isRunning) {
                isRunning = true;
                startBtn.textContent = "Пауза";
                if (statusText) statusText.textContent = "Едем первый участок...";
                animate();
            } else {
                isRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.textContent = "Продолжить";
            }
        });
    }

    draw();
}
function initInstantSpeedAnimation(canvasId, startBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const statusText = document.getElementById(statusTextId);

    let position = 40;
    let time = 0;
    let isRunning = false;
    let animationId = null;

    const finishLine = canvas.width - 60;
    const roadY = 100;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Дорога
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(40, roadY);
        ctx.lineTo(canvas.width - 40, roadY);
        ctx.stroke();

        // Финишная черта
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(finishLine, roadY - 25);
        ctx.lineTo(finishLine, roadY + 25);
        ctx.stroke();

        // Машинка
        ctx.fillStyle = "#8a2be2";
        ctx.fillRect(position - 25, roadY - 15, 50, 26);
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(position - 10, roadY - 12, 20, 10);

        // Колеса
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(position - 15, roadY + 11, 5, 0, Math.PI * 2);
        ctx.arc(position + 15, roadY + 11, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    function animate() {
        if (!isRunning) return;

        time += 0.03;

        // Расчет мгновенной скорости (меняется во времени)
        let instantSpeed = Math.round(40 + Math.sin(time * 3) * 35);
        if (instantSpeed < 5) instantSpeed = 5;

        let currentSpeedStep = instantSpeed / 30;
        position += currentSpeedStep;

        if (statusText) {
            statusText.textContent = `Мгновенная скорость на спидометре: ${instantSpeed} км/ч`;
        }

        if (position >= finishLine - 25) {
            position = finishLine - 25;
            isRunning = false;
            if (startBtn) startBtn.textContent = "Сбросить / Заново";
            if (statusText) statusText.textContent = "Полоса движения завершена. Скорость: 0 км/ч";
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (position >= finishLine - 25) {
                position = 40;
                time = 0;
                isRunning = false;
                startBtn.textContent = "Старт поездки";
                if (statusText) statusText.textContent = "Скорость: 0 км/ч";
                draw();
            } else if (!isRunning) {
                isRunning = true;
                startBtn.textContent = "Пауза";
                animate();
            } else {
                isRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.textContent = "Продолжить";
            }
        });
    }

    draw();
}
function initInertiaAnimation(canvasId, startBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const statusText = document.getElementById(statusTextId);

    let cartX = 80;
    let passengerX = 80; // позиция пассажира внутри тележки
    let state = 'driving'; // driving, braking, stopped
    let isRunning = false;
    let animationId = null;

    const roadY = 120;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Дорога
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(40, roadY);
        ctx.lineTo(canvas.width - 40, roadY);
        ctx.stroke();

        // Тележка (корпус)
        ctx.fillStyle = "#8a2be2";
        ctx.fillRect(cartX, roadY - 40, 90, 35);
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(cartX + 10, roadY - 35, 30, 20);

        // Колеса тележки
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(cartX + 20, roadY, 7, 0, Math.PI * 2);
        ctx.arc(cartX + 70, roadY, 7, 0, Math.PI * 2);
        ctx.fill();

        // Пассажир (шарик на палочке внутри тележки)
        ctx.fillStyle = "#ff79c6";
        ctx.beginPath();
        ctx.arc(passengerX + 45, roadY - 55, 12, 0, Math.PI * 2);
        ctx.fill();
        // Тело пассажира
        ctx.strokeStyle = "#ff79c6";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(passengerX + 45, roadY - 43);
        ctx.lineTo(passengerX + 45, roadY - 25);
        ctx.stroke();
    }

    function animate() {
        if (!isRunning) return;

        if (state === 'driving') {
            cartX += 2;
            passengerX = cartX; // пассажир едет вместе с тележкой

            if (cartX >= 280) {
                // Время торможения
                state = 'braking';
                if (statusText) statusText.textContent = "Резкое торможение! Тележка остановилась, а пассажир летит вперед по инерции!";
            }
        } else if (state === 'braking') {
            // Тележка остановилась, но пассажир продолжает двигаться по инерции вперед
            passengerX += 2.5;

            if (passengerX >= cartX + 35) {
                // Пассажир наклонился / качнулся вперед
                state = 'stopped';
                isRunning = false;
                if (statusText) statusText.textContent = "Инерция в действии: тележка встала, а пассажир сместился вперед.";
                if (startBtn) startBtn.textContent = "Сбросить / Заново";
            }
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (state === 'stopped') {
                // Сброс
                cartX = 80;
                passengerX = 80;
                state = 'driving';
                isRunning = false;
                startBtn.textContent = "Запустить тележку";
                if (statusText) statusText.textContent = "Тележка едет с постоянной скоростью...";
                draw();
            } else if (!isRunning) {
                // Старт
                isRunning = true;
                startBtn.textContent = "Пауза";
                animate();
            } else {
                // Пауза
                isRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.textContent = "Продолжить";
            }
        });
    }

    draw();
}
function initInertiaBodyAnimation(canvasId, startBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const statusText = document.getElementById(statusTextId);

    let x1 = 60; // легкое тело
    let x2 = 60; // тяжелое тело
    let isRunning = false;
    let animationId = null;

    const finishLine = 520;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Линии дорожек
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 60);
        ctx.lineTo(canvas.width - 40, 60);
        ctx.moveTo(40, 130);
        ctx.lineTo(canvas.width - 40, 130);
        ctx.stroke();

        // Финишные линии
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(finishLine, 35);
        ctx.lineTo(finishLine, 155);
        ctx.stroke();

        // Легкое тело (маленький кубик, мала масса -> высокая инертность меньше)
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(x1 - 15, 45, 30, 30);
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText("Легкое тело (малая масса)", 60, 32);

        // Тяжелое тело (большой кубик, большая масса -> высокая инертность)
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(x2 - 25, 105, 50, 50);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Тяжелое тело (большая масса)", 60, 102);
    }

    function animate() {
        if (!isRunning) return;

        // Легкое тело разгоняется быстрее (меньше инертность)
        x1 += 3.5;
        // Тяжелое тело разгоняется медленнее (больше инертность)
        x2 += 1.2;

        if (x1 >= finishLine - 15) {
            x1 = finishLine - 15;
        }
        if (x2 >= finishLine - 25) {
            x2 = finishLine - 25;
        }

        if (x1 >= finishLine - 15 && x2 >= finishLine - 25) {
            isRunning = false;
            if (startBtn) startBtn.textContent = "Сбросить / Заново";
            if (statusText) {
                statusText.textContent = "Итог: легкое тело быстрее меняет скорость, а тяжелое более инертно!";
            }
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (x1 >= finishLine - 15 && x2 >= finishLine - 25) {
                // Сброс
                x1 = 60;
                x2 = 60;
                isRunning = false;
                startBtn.textContent = "Толкнуть тела";
                if (statusText) statusText.textContent = "Нажмите кнопку для толчка...";
                draw();
            } else if (!isRunning) {
                // Старт
                isRunning = true;
                startBtn.textContent = "Пауза";
                if (statusText) statusText.textContent = "Приложена одинаковая сила. Тела набирают скорость...";
                animate();
            } else {
                // Пауза
                isRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.textContent = "Продолжить";
            }
        });
    }

    draw();
}
function initMassMeasureAnimation(canvasId, startBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const statusText = document.getElementById(statusTextId);

    let posSmall = 60; // малое тело (масса 1 кг)
    let posLarge = 60; // большое тело (масса 5 кг)
    let isRunning = false;
    let animationId = null;

    const finishLine = 520;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Направляющие линии
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 60);
        ctx.lineTo(canvas.width - 40, 60);
        ctx.moveTo(40, 130);
        ctx.lineTo(canvas.width - 40, 130);
        ctx.stroke();

        // Финишная черта
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(finishLine, 35);
        ctx.lineTo(finishLine, 155);
        ctx.stroke();

        // Малое тело (м = 1 кг, слабая инертность)
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(posSmall - 15, 45, 30, 30);
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText("Масса 1 кг (малая инертность)", 60, 32);

        // Большое тело (м = 5 кг, высокая инертность)
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(posLarge - 25, 105, 50, 50);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Масса 5 кг (большая инертность)", 60, 102);
    }

    function animate() {
        if (!isRunning) return;

        // Чем больше масса, тем меньше ускорение приобретает тело от той же силы
        posSmall += 4.0;
        posLarge += 1.0;

        if (posSmall >= finishLine - 15) {
            posSmall = finishLine - 15;
        }
        if (posLarge >= finishLine - 25) {
            posLarge = finishLine - 25;
        }

        if (posSmall >= finishLine - 15 && posLarge >= finishLine - 25) {
            isRunning = false;
            if (startBtn) startBtn.textContent = "Сбросить / Заново";
            if (statusText) {
                statusText.textContent = "Вывод: тело с большей массой приобрело меньшую скорость — оно более инертно!";
            }
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (posSmall >= finishLine - 15 && posLarge >= finishLine - 25) {
                // Сброс
                posSmall = 60;
                posLarge = 60;
                isRunning = false;
                startBtn.textContent = "Приложить силу";
                if (statusText) statusText.textContent = "Готово к эксперименту...";
                draw();
            } else if (!isRunning) {
                // Старт
                isRunning = true;
                startBtn.textContent = "Пауза";
                if (statusText) statusText.textContent = "Действует одинаковая сила. Тела разгоняются по-разному...";
                animate();
            } else {
                // Пауза
                isRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.textContent = "Продолжить";
            }
        });
    }

    draw();
}
function initDensityAnimation(canvasId, startBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const statusText = document.getElementById(statusTextId);

    let scaleAngle = 0; // наклон весов
    let isRunning = false;
    let animationId = null;
    let phase = 0; // 0 - покой, 1 - взвешивание

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Основание весов
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(285, 120, 30, 40);

        // Стрелка весов (коромысло)
        ctx.save();
        ctx.translate(300, 120);
        ctx.rotate(scaleAngle);

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-120, 0);
        ctx.lineTo(120, 0);
        ctx.stroke();

        // Чаши весов на подвесах
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 2;
        // Левая чаша (дерево)
        ctx.beginPath();
        ctx.moveTo(-120, 0);
        ctx.lineTo(-120, 40);
        ctx.moveTo(-150, 40);
        ctx.lineTo(-90, 40);
        ctx.stroke();

        // Правая чаша (железо)
        ctx.beginPath();
        ctx.moveTo(120, 0);
        ctx.lineTo(120, 40);
        ctx.moveTo(90, 40);
        ctx.lineTo(150, 40);
        ctx.stroke();

        // Кубик дерева на левой чаше
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(-135, 10, 30, 30);

        // Кубик железа на правой чаше (тяжелее, чаша перевешивает вниз)
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(105, 10, 30, 30);

        ctx.restore();

        // Подписи под чашами
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText("Дерево (меньшая масса)", 135, 170);
        ctx.fillText("Железо (большая масса)", 435, 170);
    }

    function animate() {
        if (!isRunning) return;

        // Плавный наклон весов в сторону железа
        if (scaleAngle < 0.25) {
            scaleAngle += 0.01;
        } else {
            isRunning = false;
            if (startBtn) startBtn.textContent = "Сбросить / Заново";
            if (statusText) {
                statusText.textContent = "Вывод: при равном объеме железо тяжелее дерева из-за большей плотности!";
            }
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (scaleAngle >= 0.25) {
                // Сброс
                scaleAngle = 0;
                isRunning = false;
                startBtn.textContent = "Сравнить кубики";
                if (statusText) statusText.textContent = "Кубики одинакового объема, но разной массы...";
                draw();
            } else if (!isRunning) {
                // Старт
                isRunning = true;
                startBtn.textContent = "Пауза";
                if (statusText) statusText.textContent = "Кладем кубики на весы...";
                animate();
            } else {
                // Пауза
                isRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.textContent = "Продолжить";
            }
        });
    }

    draw();
}
function initMassMeasureShopAnimation(canvasId, startBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const statusText = document.getElementById(statusTextId);

    // Параметры состояния весов
    let scaleTilt = 0.1; // Наклон весов (от -1 до 1)
    let targetTilt = 0.1; // Целевой наклон (изначально наклонены вправо)
    let weightOnRight = false; // Положили ли гирю
    let isRunning = false;
    let animationId = null;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = 300;
        const centerY = 110;
        const beamLength = 130;

        // 1. Основание весов
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(centerX - 20, centerY + 10, 40, 50);

        // Центральная стойка
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX, centerY + 15);
        ctx.stroke();

        // 2. Коромысло (балансир)
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(scaleTilt); // Вращаем коромысло

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-beamLength, 0);
        ctx.lineTo(beamLength, 0);
        ctx.stroke();

        // 3. Стрелка весов (указатель)
        ctx.strokeStyle = "#ff79c6"; // Яркий цвет для стрелки
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -50); // Стрелка вверх
        ctx.stroke();

        // Точка опоры (центральный нож)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        // 4. Подвесы чаш
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 2;
        // Левый подвес
        ctx.beginPath();
        ctx.moveTo(-beamLength, 0);
        ctx.lineTo(-beamLength, 30);
        ctx.moveTo(-beamLength - 20, 30);
        ctx.lineTo(-beamLength + 20, 30);
        ctx.stroke();

        // Правый подвес
        ctx.beginPath();
        ctx.moveTo(beamLength, 0);
        ctx.lineTo(beamLength, 30);
        ctx.moveTo(beamLength - 20, 30);
        ctx.lineTo(beamLength + 20, 30);
        ctx.stroke();

        // 5. Грузы на чашах
        // Левая чаша (неизвестный груз)
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(-beamLength - 15, -5, 30, 35);

        // Правая чаша (пустая или гиря)
        if (weightOnRight) {
            ctx.fillStyle = "#ff79c6";
            ctx.fillRect(beamLength - 15, 0, 30, 30); // Гиря
            ctx.fillStyle = "#ffffff";
            ctx.font = "Bold 12px 'Outfit', sans-serif";
            ctx.fillText("2 кг", beamLength - 10, 20);
        }

        ctx.restore(); // Восстанавливаем координаты после вращения

        // 6. Шкала равновесия (неподвижная)
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 50);
        ctx.lineTo(centerX, centerY - 65);
        ctx.stroke();
        // Маленькие деления шкалы
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY - 55);
        ctx.lineTo(centerX + 15, centerY - 55);
        ctx.stroke();

        // Подписи под чашами
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText("Измеряемое тело (Х)", centerX - beamLength - 50, centerY + 70);
        ctx.fillText("Гири для сравнения", centerX + beamLength - 50, centerY + 70);
    }

    function animate() {
        if (!isRunning) return;

        // Плавное изменение наклона весов к целевому значению
        scaleTilt += (targetTilt - scaleTilt) * 0.08;

        // Когда весы почти выровнялись
        if (Math.abs(scaleTilt - targetTilt) < 0.001 && !weightOnRight) {
            // Фаза 1: Весы в равновесии (пока пустые), ожидание действия
            isRunning = false;
            if (statusText) {
                statusText.textContent = "Весы пустые. Нажмите «Добавить гирю 2 кг» для измерения.";
            }
            if (startBtn) {
                startBtn.textContent = "Добавить гирю 2 кг";
                startBtn.style.display = "inline-block"; // Показываем кнопку
            }
        } else if (Math.abs(scaleTilt - targetTilt) < 0.001 && weightOnRight) {
            // Фаза 3: Весы уравновешены с гирей
            isRunning = false;
            if (statusText) {
                statusText.textContent = "Равновесие достигнуто! Стрелка указывает на центр. Масса тела равна 2 кг.";
            }
            if (startBtn) {
                startBtn.textContent = "Сбросить";
            }
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (startBtn.textContent === "Сбросить") {
                // Сброс эксперимента
                weightOnRight = false;
                scaleTilt = 0.1;
                targetTilt = 0.1;
                isRunning = false;
                startBtn.textContent = "Начать измерение";
                if (statusText) statusText.textContent = "Весы готовы к работе...";
                draw();
            } else if (startBtn.textContent === "Добавить гирю 2 кг") {
                // Действие: кладем гирю
                weightOnRight = true;
                targetTilt = -0.1; // Теперь перевешивает правая чаша
                isRunning = true;
                startBtn.style.display = "none"; // Скрываем кнопку
                if (statusText) statusText.textContent = "Кладем гирю 2 кг... Весы качнулись.";
                animate();
            } else {
                // Старт эксперимента
                isRunning = true;
                startBtn.style.display = "none"; // Скрываем кнопку
                if (statusText) statusText.textContent = "Весы пусты. Ожидают добавления гирь...";
                animate();
            }
        });
    }

    // Начальная отрисовка
    draw();
    if (statusText) statusText.textContent = "Нажмите «Начать измерение», чтобы увидеть работу весов.";
}
function initCalcVolumeAnimation(canvasId, startBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const statusText = document.getElementById(statusTextId);

    let foamWidth = 50; // визуальный размер пенопласта (малый)
    let ironWidth = 50; // визуальный размер железа (малый)
    let targetFoamWidth = 250; // конечный размер пенопласта (большой V)
    let targetIronWidth = 30;  // конечный размер железа (маленький V)

    let isRunning = false;
    let animationId = null;

    const centerY = 100;
    const foamY = 40;
    const ironY = 130;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Подписи масс
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText("Масса: 5 кг", 10, foamY + 20);
        ctx.fillText("Масса: 5 кг", 10, ironY + 25);

        // Тело 1: Пенопласт (большой объем)
        ctx.fillStyle = "#7dd3fc"; // голубой
        ctx.fillRect(100, foamY, foamWidth, 40);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`Пенопласт: р=25 кг/м³`, 100, foamY - 5);
        if (foamWidth > 60) {
            ctx.fillStyle = "#000";
            ctx.fillText(`V = ${((5 / 25).toFixed(2))} м³`, 110, foamY + 25);
        }

        // Тело 2: Железо (малый объем)
        ctx.fillStyle = "#ff79c6"; // розовый
        ctx.fillRect(100, ironY, ironWidth, 40);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`Железо: р=7800 кг/м³`, 100, ironY - 5);
        if (ironWidth > 25) {
            ctx.fillStyle = "#000";
            ctx.fillText(`V = ${((5 / 7800).toExponential(2))}`, 105, ironY + 25);
        }
    }

    function animate() {
        if (!isRunning) return;

        // Плавное изменение размеров тел
        if (foamWidth < targetFoamWidth) {
            foamWidth += (targetFoamWidth - foamWidth) * 0.05;
        }
        if (ironWidth > targetIronWidth) {
            ironWidth -= (ironWidth - targetIronWidth) * 0.05;
        }

        if (foamWidth >= targetFoamWidth - 1 && ironWidth <= targetIronWidth + 1) {
            foamWidth = targetFoamWidth;
            ironWidth = targetIronWidth;
            isRunning = false;
            if (startBtn) startBtn.textContent = "Сбросить / Заново";
            if (statusText) {
                statusText.textContent = "Расчет завершен. Видна огромная разница в объемах при равной массе!";
            }
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (foamWidth === targetFoamWidth && ironWidth === targetIronWidth) {
                // Сброс
                foamWidth = 50;
                ironWidth = 50;
                isRunning = false;
                startBtn.textContent = "Рассчитать объемы";
                if (statusText) statusText.textContent = "Масса обоих тел: 5 кг. Ожидание расчета...";
                draw();
            } else if (!isRunning) {
                // Старт
                isRunning = true;
                startBtn.textContent = "Пауза";
                if (statusText) statusText.textContent = "Вычисление V = m/р для обоих тел...";
                animate();
            } else {
                // Пауза
                isRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.textContent = "Продолжить";
            }
        });
    }

    draw();
    if (statusText) statusText.textContent = "Масса обоих тел: 5 кг. Нажмите кнопку для расчета.";
}
function initForceAnimation(canvasId, startBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const statusText = document.getElementById(statusTextId);

    let cartX = 80;
    let velocity = 0;
    let forceModule = 10; // начальный модуль силы
    let isRunning = false;
    let animationId = null;

    const roadY = 130;
    const cartWidth = 70;
    const finishLine = canvas.width - 60;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Дорога
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(40, roadY + 5);
        ctx.lineTo(canvas.width - 40, roadY + 5);
        ctx.stroke();

        // Тележка (корпус)
        ctx.fillStyle = "#8a2be2";
        ctx.fillRect(cartX, roadY - 30, cartWidth, 25);
        // Тележка (груз)
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(cartX + 10, roadY - 40, 50, 10);
        // Колеса тележки
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(cartX + 20, roadY, 8, 0, Math.PI * 2);
        ctx.arc(cartX + 50, roadY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Вектор силы (стрелка)
        if (isRunning) {
            ctx.strokeStyle = "#ff79c6";
            ctx.lineWidth = 4;
            const arrowLen = forceModule * 3; // Длина стрелки зависит от модуля силы
            ctx.beginPath();
            ctx.moveTo(cartX + cartWidth, roadY - 15);
            ctx.lineTo(cartX + cartWidth + arrowLen, roadY - 15);
            // Наконечник стрелки
            ctx.moveTo(cartX + cartWidth + arrowLen - 10, roadY - 20);
            ctx.lineTo(cartX + cartWidth + arrowLen, roadY - 15);
            ctx.lineTo(cartX + cartWidth + arrowLen - 10, roadY - 10);
            ctx.stroke();
            // Текст модуля силы
            ctx.fillStyle = "#ffffff";
            ctx.font = "12px 'Outfit', sans-serif";
            ctx.fillText(`Сила: F = ${forceModule} Н`, cartX + cartWidth, roadY - 25);
        }

        // Финишная линия
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(finishLine, roadY - 45);
        ctx.lineTo(finishLine, roadY + 5);
        ctx.stroke();
    }

    function animate() {
        if (!isRunning) return;

        // Ускорение пропорционально силе (a = F/m, считаем массу m=const=2)
        const acceleration = forceModule / 50;
        velocity += acceleration;
        cartX += velocity;

        if (cartX >= finishLine - cartWidth) {
            cartX = finishLine - cartWidth;
            isRunning = false;
            if (statusText) {
                statusText.textContent = `Тележка доехала до финиша. Использован модуль силы ${forceModule} Н.`;
            }
            if (startBtn) {
                // Меняем действие кнопки при следующем нажатии
                startBtn.textContent = forceModule === 10 ? "Толкнуть сильнее (F=50Н)" : "Сбросить / Повторить";
            }
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (cartX >= finishLine - cartWidth) {
                // Сброс
                cartX = 80;
                velocity = 0;
                // Переключаем модуль силы
                forceModule = (forceModule === 10) ? 50 : 10;
                startBtn.textContent = forceModule === 10 ? "Толкнуть тележку (F=10Н)" : "Толкнуть сильнее (F=50Н)";
                isRunning = false;
                if (statusText) statusText.textContent = "Тележка готова к толчку...";
                draw();
            } else if (!isRunning) {
                // Старт
                isRunning = true;
                if (statusText) statusText.textContent = "Приложена сила! Тележка набирает скорость...";
                startBtn.textContent = "Пауза";
                animate();
            } else {
                // Пауза
                isRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.textContent = "Продолжить";
            }
        });
    }

    draw();
}
function initVectorForceAnimation(canvasId, downBtnId, upBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const downBtn = document.getElementById(downBtnId);
    const upBtn = document.getElementById(upBtnId);
    const statusText = document.getElementById(statusTextId);

    let rotation = 0; // угол поворота бруса
    let isRunning = false;
    let animationId = null;
    let currentAction = null; // 'down' или 'up'

    const centerX = 300;
    const centerY = 110;
    const barWidth = 140;
    const barHeight = 40;
    const forceModule = 40; // постоянный модуль силы

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Точка вращения (центр)
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);

        // Брус (тело)
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight);

        // Линии для обозначения направления приложения силы
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -barHeight / 2 - 40);
        ctx.lineTo(0, barHeight / 2 + 40);
        ctx.stroke();

        // Вектор силы (стрелка) и Точка приложения
        if (isRunning && currentAction) {
            ctx.strokeStyle = "#ff79c6";
            ctx.lineWidth = 5;
            const arrowLen = forceModule * 1.5;

            let startX = barWidth / 2; // по умолчанию с правого края
            let startY = (currentAction === 'down') ? barHeight / 2 : -barHeight / 2;

            ctx.beginPath();
            ctx.moveTo(startX, startY);

            if (currentAction === 'down') {
                // Сила направлена вниз
                ctx.lineTo(startX, startY + arrowLen);
                ctx.moveTo(startX - 10, startY + arrowLen - 10);
                ctx.lineTo(startX, startY + arrowLen);
                ctx.lineTo(startX + 10, startY + arrowLen - 10);
            } else {
                // Сила направлена вверх
                ctx.lineTo(startX, startY - arrowLen);
                ctx.moveTo(startX - 10, startY - arrowLen + 10);
                ctx.lineTo(startX, startY - arrowLen);
                ctx.lineTo(startX + 10, startY - arrowLen + 10);
            }
            ctx.stroke();

            // Точка приложения
            ctx.fillStyle = "#ff79c6";
            ctx.beginPath();
            ctx.arc(startX, startY, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    function animate() {
        if (!isRunning) return;

        // Вращение пропорционально приложенному моменту силы (упрощенная физика для анимации)
        const angularVelocity = 0.03;
        if (currentAction === 'down') {
            rotation -= angularVelocity; // вращение вниз
        } else if (currentAction === 'up') {
            rotation += angularVelocity; // вращение вверх
        }

        // Остановка вращения через определенный угол
        if (Math.abs(rotation) >= Math.PI / 6) {
            isRunning = false;
            if (statusText) {
                statusText.textContent = `Вращение остановлено. Сила приложена к ${currentAction === 'down' ? 'нижнему' : 'верхнему'} краю.`;
            }
            if (downBtn) downBtn.style.display = "inline-block";
            if (upBtn) upBtn.style.display = "inline-block";
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    if (downBtn) {
        downBtn.addEventListener('click', () => {
            if (isRunning) return;
            // Сброс и запуск
            rotation = 0;
            isRunning = true;
            currentAction = 'down';
            downBtn.style.display = "none";
            upBtn.style.display = "none";
            if (statusText) statusText.textContent = "Приложена сила вниз. Брус начинает вращение по часовой стрелке...";
            animate();
        });
    }

    if (upBtn) {
        upBtn.addEventListener('click', () => {
            if (isRunning) return;
            // Сброс и запуск
            rotation = 0;
            isRunning = true;
            currentAction = 'up';
            downBtn.style.display = "none";
            upBtn.style.display = "none";
            if (statusText) statusText.textContent = "Приложена сила вверх. Брус начинает вращение против часовой стрелки...";
            animate();
        });
    }

    draw();
    if (statusText) statusText.textContent = "Брус зафиксирован в центре. Нажмите кнопку для взаимодействия.";
}
function initGravityAnimation(canvasId, startBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const statusText = document.getElementById(statusTextId);

    let y1 = 40; // позиция легкого тела (m = 1 кг)
    let y2 = 40; // позиция тяжелого тела (m = 5 кг)
    let isRunning = false;
    let animationId = null;

    const groundY = 170;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Земля (поверхность)
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(40, groundY);
        ctx.lineTo(canvas.width - 40, groundY);
        ctx.stroke();

        ctx.fillStyle = "rgba(0, 242, 254, 0.1)";
        ctx.fillRect(40, groundY, canvas.width - 80, 15);

        // Легкое тело (1 кг, Fтяж = 10 Н)
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(150, y1, 30, 30);
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText("m = 1 кг (F = 10 Н)", 110, y1 - 10);

        // Тяжелое тело (5 кг, Fтяж = 50 Н)
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(400, y2, 45, 45);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("m = 5 кг (F = 50 Н)", 360, y2 - 10);
    }

    function animate() {
        if (!isRunning) return;

        // В вакууме все тела падают с одинаковым ускорением g, 
        // но сила тяжести для них разная (F = m*g)
        y1 += 4;
        y2 += 4;

        if (y1 >= groundY - 30) {
            y1 = groundY - 30;
        }
        if (y2 >= groundY - 45) {
            y2 = groundY - 45;
        }

        if (y1 >= groundY - 30 && y2 >= groundY - 45) {
            isRunning = false;
            if (startBtn) startBtn.textContent = "Сбросить / Повторить";
            if (statusText) {
                statusText.textContent = "Падение завершено. Сила тяжести действовала на оба тела, заставив их упасть на Землю!";
            }
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (y1 >= groundY - 30 && y2 >= groundY - 45) {
                // Сброс
                y1 = 40;
                y2 = 40;
                isRunning = false;
                startBtn.textContent = "Отпустить грузы";
                if (statusText) statusText.textContent = "Грузы висят на высоте. Нажмите для падения под действием силы тяжести...";
                draw();
            } else if (!isRunning) {
                // Старт
                isRunning = true;
                startBtn.textContent = "Пауза";
                if (statusText) statusText.textContent = "Действует сила тяжести! Тела падают с ускорением g...";
                animate();
            } else {
                // Пауза
                isRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.textContent = "Продолжить";
            }
        });
    }

    draw();
}
function initProportionalityAnimation(canvasId, sliderId, valueSpanId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const slider = document.getElementById(sliderId);
    const valueSpan = document.getElementById(valueSpanId);
    const statusText = document.getElementById(statusTextId);

    const g = 10; // Коэффициент g = 10 Н/кг для наглядности

    function draw(currentMass) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const currentForce = currentMass * g;

        // 1. Рисуем оси координат для графика
        const originX = 60;
        const originY = 180;
        const maxAxisX = 520;
        const maxAxisY = 30;

        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 2;

        // Ось X (Масса)
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(maxAxisX, originY);
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px sans-serif";
        ctx.fillText("Масса m (кг)", maxAxisX - 70, originY + 18);

        // Ось Y (Сила тяжести)
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX, maxAxisY);
        ctx.stroke();
        ctx.fillText("Fтяж (Н)", originX - 30, maxAxisY - 10);

        // 2. Рисуем прямую пропорциональную зависимость (F = g * m)
        // Масштаб: 1 кг = 45 пикселей по X, 10 Н = 13 пикселей по Y
        const scaleX = 45;
        const scaleY = 1.3;

        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + 10 * scaleX, originY - (100 * scaleY));
        ctx.stroke();

        // 3. Рисуем точку текущего состояния на графике
        const pointX = originX + currentMass * scaleX;
        const pointY = originY - currentForce * scaleY;

        // Пунктирные линии от точки к осям
        ctx.strokeStyle = "rgba(255, 121, 198, 0.6)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(pointX, originY);
        ctx.lineTo(pointX, pointY);
        ctx.moveTo(originX, pointY);
        ctx.lineTo(pointX, pointY);
        ctx.stroke();
        ctx.setLineDash([]); // сброс пунктира

        // Сама точка
        ctx.fillStyle = "#ff79c6";
        ctx.beginPath();
        ctx.arc(pointX, pointY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Текст со значениями рядом с точкой
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(`(${currentMass} кг, ${currentForce} Н)`, pointX + 10, pointY - 5);
    }

    if (slider) {
        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            if (valueSpan) valueSpan.textContent = val;
            const force = val * g;
            if (statusText) {
                statusText.textContent = `Сила тяжести: F = ${val} кг × 10 Н/кг = ${force} Н (прямая пропорциональность)`;
            }
            draw(val);
        });
    }

    // Первичная отрисовка
    draw(parseInt(slider ? slider.value : 2));
}
function initPlanetGravityAnimation(canvasId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const statusText = document.getElementById(statusTextId);
    const buttons = document.querySelectorAll('.planet-btn');

    let currentG = 9.8;
    let currentPlanetName = "Земля";
    const mass = 5; // кг

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const groundY = 160;

        // Поверхность
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(40, groundY);
        ctx.lineTo(canvas.width - 40, groundY);
        ctx.stroke();

        ctx.fillStyle = "rgba(0, 242, 254, 0.1)";
        ctx.fillRect(40, groundY, canvas.width - 80, 15);

        // Визуализация веса/силы тяжести через сжатие пружины или размер подставки
        // Чем больше g, тем сильнее "прижато" тело
        let blockHeight = 40;
        let blockY = groundY - blockHeight;

        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(275, blockY, 50, blockHeight);

        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`Груз m = ${mass} кг`, 250, blockY - 15);

        // Индикатор силы тяжести
        const force = (mass * currentG).toFixed(1);
        ctx.fillStyle = "#7dd3fc";
        ctx.font = "13px 'Outfit', sans-serif";
        ctx.fillText(`Сила тяжести на объекте: ${force} Н (g = ${currentG} м/с²)`, 160, 40);
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentG = parseFloat(e.target.getAttribute('data-g'));
            currentPlanetName = e.target.getAttribute('data-name');

            const force = (mass * currentG).toFixed(1);
            if (statusText) {
                statusText.textContent = `Выбрана планета: ${currentPlanetName}. Сила тяжести: F = ${mass} кг × ${currentG} Н/кг = ${force} Н`;
            }
            draw();
        });
    });

    draw();
}
function initBodyWeightAnimation(canvasId, startBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const statusText = document.getElementById(statusTextId);

    let blockY = 30; // начальная позиция груза сверху
    let targetY = 110; // позиция на платформе весов
    let isRunning = false;
    let isPlaced = false;
    let animationId = null;

    const platformY = 140;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Платформа весов (опора)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(225, platformY, 150, 15);

        // Экран весов
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(260, platformY + 15, 80, 30);
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 1;
        ctx.strokeRect(260, platformY + 15, 80, 30);

        // Показания на весах
        ctx.fillStyle = "#00f2fe";
        ctx.font = "14px 'Outfit', sans-serif";
        if (isPlaced) {
            ctx.fillText("P = 50 Н", 272, platformY + 35);
        } else {
            ctx.fillText("0.0 Н", 282, platformY + 35);
        }

        // Груз (m = 5 кг)
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(275, blockY, 50, 30);

        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText("m = 5 кг", 280, blockY - 10);

        // Вектор силы давления (Вес P), направленный на опору
        if (isPlaced) {
            ctx.strokeStyle = "#7dd3fc";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(300, blockY + 30);
            ctx.lineTo(300, platformY);
            // Стрелочка вниз
            ctx.lineTo(295, platformY - 8);
            ctx.moveTo(300, platformY);
            ctx.lineTo(305, platformY - 8);
            ctx.stroke();

            ctx.fillStyle = "#7dd3fc";
            ctx.fillText("Вес (P)", 315, platformY - 10);
        }
    }

    function animate() {
        if (!isRunning) return;

        // Плавное опускание груза на опору
        if (blockY < targetY) {
            blockY += 3;
        } else {
            blockY = targetY;
            isRunning = false;
            isPlaced = true;
            if (startBtn) startBtn.textContent = "Сбросить / Повторить";
            if (statusText) {
                statusText.textContent = "Груз давит на опору. Вес тела равен силе тяжести: P = m · g = 5 кг × 10 Н/кг = 50 Н.";
            }
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (isPlaced) {
                // Сброс
                blockY = 30;
                isPlaced = false;
                isRunning = false;
                startBtn.textContent = "Поставить груз на весы";
                if (statusText) statusText.textContent = "Груз в воздухе. Опора пока не испытывает давления...";
                draw();
            } else if (!isRunning) {
                // Старт
                isRunning = true;
                startBtn.textContent = "Пауза";
                if (statusText) statusText.textContent = "Груз опускается на опору...";
                animate();
            } else {
                // Пауза
                isRunning = false;
                cancelAnimationFrame(animationId);
                startBtn.textContent = "Продолжить";
            }
        });
    }

    draw();
}
function initWeightlessnessAnimation(canvasId, startBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const statusText = document.getElementById(statusTextId);

    // Создадим дополнительную кнопку "С начала", если её еще нет в HTML
    let resetBtn = document.getElementById('weightlessnessResetBtn');
    if (!resetBtn && startBtn && startBtn.parentNode) {
        resetBtn = document.createElement('button');
        resetBtn.id = 'weightlessnessResetBtn';
        resetBtn.textContent = 'С начала';
        resetBtn.style.cssText = "background: #ef4444; color: #fff; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 600; width: fit-content; display: none; margin-left: 10px;";
        startBtn.parentNode.appendChild(resetBtn);
    }

    // Параметры анимации
    let animationStage = 0; // 0: покой, 1: падение, 2: невесомость достигнута
    let liftY = 20;
    let blockOffset = 70; // смещение груза от верха лифта
    let velocity = 0;
    let isRunning = false;
    let animationId = null;

    const liftHeight = 160;
    const liftWidth = 140;
    const liftX = (canvas.width - liftWidth) / 2;
    const groundLiftY = canvas.height - liftHeight - 15;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Шахта лифта
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 2;
        ctx.strokeRect(liftX, 10, liftWidth, canvas.height - 20);

        // Трос (виден только в покое)
        if (animationStage === 0) {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(liftX + liftWidth / 2, 0);
            ctx.lineTo(liftX + liftWidth / 2, 10);
            ctx.stroke();
        }

        // Кабина лифта
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.strokeRect(liftX, liftY, liftWidth, liftHeight);
        ctx.fillStyle = "rgba(0, 242, 254, 0.05)";
        ctx.fillRect(liftX, liftY, liftWidth, liftHeight);

        // Весы на полу лифта
        const scaleX = liftX + (liftWidth - 80) / 2;
        const scaleY = liftY + liftHeight - 30;
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(scaleX, scaleY, 80, 25);
        ctx.strokeStyle = "#00f2fe";
        ctx.strokeRect(scaleX, scaleY, 80, 25);

        // Показания на весах
        ctx.fillStyle = "#00f2fe";
        ctx.font = "12px 'Outfit', sans-serif";
        if (animationStage >= 1) {
            ctx.fillText("P = 0.0 Н", scaleX + 13, scaleY + 17); // Невесомость
        } else {
            ctx.fillText("P = 50 Н", scaleX + 16, scaleY + 17); // Обычный вес
        }

        // Груз внутри лифта
        const blockY = liftY + blockOffset;
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(liftX + 45, blockY, 50, 30);
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText("m = 5 кг", liftX + 50, blockY + 18);
    }

    function animate() {
        if (!isRunning) return;

        if (animationStage === 1) {
            velocity += 0.08;
            liftY += velocity;

            // Груз всплывает к центру кабины
            if (blockOffset > 45) {
                blockOffset -= 0.6;
            }

            // Достигли низа шахты
            if (liftY >= groundLiftY) {
                liftY = groundLiftY;
                animationStage = 2;
                isRunning = false;
                if (statusText) {
                    statusText.textContent = "Лифт упал! Наступила невесомость: груз парит внутри кабины, весы показывают 0 Н.";
                }
                if (resetBtn) resetBtn.style.display = "inline-block";
            }
        }

        draw();
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    // Функция полного сброса
    function resetAnimation() {
        cancelAnimationFrame(animationId);
        isRunning = false;
        animationStage = 0;
        liftY = 20;
        blockOffset = 70;
        velocity = 0;

        if (startBtn) {
            startBtn.textContent = "Перерезать трос лифта";
            startBtn.style.display = "inline-block";
        }
        if (resetBtn) {
            resetBtn.style.display = "none";
        }
        if (statusText) {
            statusText.textContent = "Лифт неподвижен. Весы показывают обычный вес груза (50 Н).";
        }
        draw();
    }

    if (startBtn) {
        startBtn.onclick = () => {
            if (!isRunning && animationStage === 0) {
                animationStage = 1;
                isRunning = true;
                startBtn.style.display = "none";
                if (statusText) statusText.textContent = "Трос оборвался! Лифт и груз летят вниз...";
                animate();
            }
        };
    }

    if (resetBtn) {
        resetBtn.onclick = resetAnimation;
    }

    draw();
}
function initDiffAnimation(canvasId, startBtnId, resetBtnId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById(startBtnId);
    const resetBtn = document.getElementById(resetBtnId);
    const statusText = document.getElementById(statusTextId);

    let showForces = false;

    const centerX = 300;
    const blockY = 90;
    const blockWidth = 70;
    const blockHeight = 50;
    const supportY = blockY + blockHeight;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Опора (поверхность)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(centerX - 100, supportY, 200, 15);

        // 2. Тело (груз)
        ctx.fillStyle = "#7dd3fc";
        ctx.fillRect(centerX - blockWidth / 2, blockY, blockWidth, blockHeight);
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText("Тело (m = 5 кг)", centerX - 42, blockY + 30);

        // 3. Если нажата кнопка — показываем векторы сил
        if (showForces) {
            // А. Сила тяжести (направлена из центра тела вниз)
            ctx.strokeStyle = "#ff79c6"; // Розовый
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(centerX, blockY + blockHeight / 2);
            ctx.lineTo(centerX, blockY + blockHeight / 2 + 60);
            // Наконечник стрелки вниз
            ctx.lineTo(centerX - 5, blockY + blockHeight / 2 + 50);
            ctx.moveTo(centerX, blockY + blockHeight / 2 + 60);
            ctx.lineTo(centerX + 5, blockY + blockHeight / 2 + 50);
            ctx.stroke();

            ctx.fillStyle = "#ff79c6";
            ctx.fillText("Сила тяжести (Fтяж)", centerX + 15, blockY + 45);

            // Б. Вес тела (приложен к опоре, направлен вниз от точки соприкосновения)
            ctx.strokeStyle = "#facc15"; // Желтый
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(centerX, supportY);
            ctx.lineTo(centerX, supportY + 60);
            // Наконечник стрелки вниз
            ctx.lineTo(centerX - 5, supportY + 50);
            ctx.moveTo(centerX, supportY);
            ctx.lineTo(centerX + 5, supportY + 50);
            ctx.stroke();

            ctx.fillStyle = "#facc15";
            ctx.fillText("Вес тела (P) — на опору", centerX + 15, supportY + 35);
        }
    }

    if (startBtn) {
        startBtn.onclick = () => {
            showForces = true;
            startBtn.style.display = "none";
            if (resetBtn) resetBtn.style.display = "inline-block";
            if (statusText) {
                statusText.textContent = "Обратите внимание: сила тяжести приложена к центру тела, а вес — к поверхности опоры!";
            }
            draw();
        };
    }

    if (resetBtn) {
        resetBtn.onclick = () => {
            showForces = false;
            resetBtn.style.display = "none";
            if (startBtn) startBtn.style.display = "inline-block";
            if (statusText) {
                statusText.textContent = "Груз стоит на опоре. Нажмите кнопку для анализа сил.";
            }
            draw();
        };
    }

    draw();
}
function initElasticAnimation(canvasId, sliderId, valueSpanId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const slider = document.getElementById(sliderId);
    const valueSpan = document.getElementById(valueSpanId);
    const statusText = document.getElementById(statusTextId);

    const k = 500; // жесткость пружины Н/м (для шкалы анимации)

    function draw(xValue) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const force = Math.round(k * xValue);
        const startX = 80;
        const baselineY = 100;
        // Базовая длина пружины в пикселях + растяжение, зависящее от x
        const baseSpringLen = 120;
        const currentSpringLen = baseSpringLen + xValue * 600;

        // 1. Стена (опора)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(50, 40, 30, 120);

        // 2. Пружина (рисуем зигзаг)
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, baselineY);

        const coils = 12;
        const segmentLen = currentSpringLen / coils;
        for (let i = 1; i <= coils; i++) {
            const px = startX + segmentLen * i;
            const py = (i % 2 === 0) ? baselineY - 15 : baselineY + 15;
            // Убираем отклонение для последнего сегмента
            const actualPy = (i === coils) ? baselineY : py;
            ctx.lineTo(px, actualPy);
        }
        ctx.stroke();

        // 3. Груз на конце пружины
        const blockX = startX + currentSpringLen;
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(blockX, baselineY - 25, 40, 50);

        // 4. Вектор силы упругости (направлен против растяжения, к стене)
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(blockX, baselineY);
        ctx.lineTo(blockX - (force * 0.8), baselineY);
        // Стрелочка влево
        ctx.lineTo(blockX - (force * 0.8) + 8, baselineY - 5);
        ctx.moveTo(blockX - (force * 0.8), baselineY);
        ctx.lineTo(blockX - (force * 0.8) + 8, baselineY + 5);
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`Fупр = ${force} Н`, blockX - 40, baselineY - 35);
    }

    if (slider) {
        slider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            if (valueSpan) valueSpan.textContent = val.toFixed(2);
            const force = Math.round(k * val);
            if (statusText) {
                statusText.textContent = `Сила упругости: Fупр = ${k} Н/м × ${val.toFixed(2)} м = ${force} Н`;
            }
            draw(val);
        });
    }

    // Первичная отрисовка
    draw(parseFloat(slider ? slider.value : 0.05));
}
function initDeformationAnimation(canvasId, sliderId, valueSpanId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const slider = document.getElementById(sliderId);
    const valueSpan = document.getElementById(valueSpanId);
    const statusText = document.getElementById(statusTextId);

    const baseWidth = 200; // исходная ширина стержня в пикселях
    const centerY = 100;
    const height = 60;

    function draw(delta) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // delta от -5 до 5 см. Переведем в пиксели (например, 1 см = 8 пикселей)
        const pixelDelta = delta * 8;
        const currentWidth = baseWidth + pixelDelta;
        const startX = (canvas.width - currentWidth) / 2;

        // 1. Опора слева (неподвижная стена)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(startX - 15, centerY - height / 2 - 10, 15, height + 20);

        // 2. Сам стержень
        if (delta > 0) {
            ctx.fillStyle = "#7dd3fc"; // Растяжение (голубой)
        } else if (delta < 0) {
            ctx.fillStyle = "#ff79c6"; // Сжатие (розовый)
        } else {
            ctx.fillStyle = "#a855f7"; // Нейтральный
        }
        ctx.fillRect(startX, centerY - height / 2, currentWidth, height);

        // Текст на стержне
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Outfit', sans-serif";
        if (currentWidth > 80) {
            let modeText = delta > 0 ? "Растяжение" : (delta < 0 ? "Сжатие" : "Норма");
            ctx.fillText(modeText, startX + currentWidth / 2 - 35, centerY + 4);
        }

        // 3. Векторы сил внешнего воздействия
        ctx.lineWidth = 3;
        if (delta > 0) {
            // Силы тянут наружу
            ctx.strokeStyle = "#00f2fe";
            // Левая сила (влево)
            ctx.beginPath();
            ctx.moveTo(startX, centerY);
            ctx.lineTo(startX - 30, centerY);
            ctx.lineTo(startX - 22, centerY - 5);
            ctx.moveTo(startX, centerY);
            ctx.lineTo(startX - 22, centerY + 5);
            ctx.stroke();

            // Правая сила (вправо)
            ctx.beginPath();
            ctx.moveTo(startX + currentWidth, centerY);
            ctx.lineTo(startX + currentWidth + 30, centerY);
            ctx.lineTo(startX + currentWidth + 22, centerY - 5);
            ctx.moveTo(startX + currentWidth, centerY);
            ctx.lineTo(startX + currentWidth + 22, centerY + 5);
            ctx.stroke();
        } else if (delta < 0) {
            // Силы давят внутрь
            ctx.strokeStyle = "#ff79c6";
            // Левая сила (вправо)
            ctx.beginPath();
            ctx.moveTo(startX - 30, centerY);
            ctx.lineTo(startX, centerY);
            ctx.lineTo(startX - 8, centerY - 5);
            ctx.moveTo(startX, centerY);
            ctx.lineTo(startX - 8, centerY + 5);
            ctx.stroke();

            // Правая сила (влево)
            ctx.beginPath();
            ctx.moveTo(startX + currentWidth + 30, centerY);
            ctx.lineTo(startX + currentWidth, centerY);
            ctx.lineTo(startX + currentWidth + 8, centerY - 5);
            ctx.moveTo(startX + currentWidth, centerY);
            ctx.lineTo(startX + currentWidth + 8, centerY + 5);
            ctx.stroke();
        }
    }

    if (slider) {
        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            if (valueSpan) valueSpan.textContent = val;

            if (val > 0) {
                if (statusText) statusText.textContent = `Растяжение: стержень удлинился на ${val} см. Возникает сила упругости, стремящаяся сжать его обратно.`;
            } else if (val < 0) {
                if (statusText) statusText.textContent = `Сжатие: стержень укоротился на ${Math.abs(val)} см. Возникает сила упругости, стремящаяся вернуть его длину.`;
            } else {
                if (statusText) statusText.textContent = "Стержень в исходном состоянии (деформация равна нулю).";
            }

            draw(val);
        });
    }

    // Первичная отрисовка
    draw(0);
}
function initHookeAnimation(canvasId, kSliderId, xSliderId, kValId, xValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const kSlider = document.getElementById(kSliderId);
    const xSlider = document.getElementById(xSliderId);
    const kValSpan = document.getElementById(kValId);
    const xValSpan = document.getElementById(xValId);
    const statusText = document.getElementById(statusTextId);

    function draw(k, x) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const force = Math.round(k * x * 10) / 10;
        const startX = 80;
        const baselineY = 100;
        // Базовая длина + удлинение, зависящее от x (в пикселях)
        const baseLen = 100;
        const currentLen = baseLen + x * 600;

        // 1. Стена (опора)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(50, 40, 30, 120);

        // 2. Пружина (зигзаг)
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, baselineY);

        const coils = 12;
        const segmentLen = currentLen / coils;
        for (let i = 1; i <= coils; i++) {
            const px = startX + segmentLen * i;
            const py = (i % 2 === 0) ? baselineY - 15 : baselineY + 15;
            const actualPy = (i === coils) ? baselineY : py;
            ctx.lineTo(px, actualPy);
        }
        ctx.stroke();

        // 3. Груз на конце пружины
        const blockX = startX + currentLen;
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(blockX, baselineY - 25, 40, 50);

        // 4. Вектор силы упругости (направлен влево, к стене)
        const vectorLen = Math.min(force * 2.5, 120); // ограничим длину для красоты
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(blockX, baselineY);
        ctx.lineTo(blockX - vectorLen, baselineY);
        // Стрелочка влево
        ctx.lineTo(blockX - vectorLen + 8, baselineY - 5);
        ctx.moveTo(blockX - vectorLen, baselineY);
        ctx.lineTo(blockX - vectorLen + 8, baselineY + 5);
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`Fупр = ${force} Н`, blockX - 35, baselineY - 35);
    }

    function updatePhysics() {
        const k = parseFloat(kSlider.value);
        const x = parseFloat(xSlider.value);

        if (kValSpan) kValSpan.textContent = k;
        if (xValSpan) xValSpan.textContent = x.toFixed(2);

        const force = (k * x).toFixed(1);
        if (statusText) {
            statusText.textContent = `Сила упругости: Fупр = ${k} Н/м × ${x.toFixed(2)} м = ${force} Н`;
        }

        draw(k, x);
    }

    if (kSlider) kSlider.addEventListener('input', updatePhysics);
    if (xSlider) xSlider.addEventListener('input', updatePhysics);

    // Начальная отрисовка
    draw(parseFloat(kSlider.value), parseFloat(xSlider.value));
}
function initFrictionAnimation(canvasId, sliderId, valueSpanId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const slider = document.getElementById(sliderId);
    const valueSpan = document.getElementById(valueSpanId);
    const statusText = document.getElementById(statusTextId);

    const maxStaticFriction = 30; // Предел силы трения покоя (Н)
    const blockWidth = 70;
    const blockHeight = 50;
    const groundY = 140;

    function draw(pullForce) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Определяем реальную силу трения покоя / скольжения
        let currentFriction = pullForce;
        let isMoving = false;

        if (pullForce > maxStaticFriction) {
            currentFriction = 25; // При скольжении трение чуть меньше максимального
            isMoving = true;
        }

        // Позиция блока (если тянем больше макс. трения, сдвигаем вправо для наглядности)
        let blockX = 250;
        if (isMoving) {
            blockX = 250 + (pullForce - maxStaticFriction) * 2;
            if (blockX > 450) blockX = 450; // ограничим край экрана
        }

        // 1. Поверхность (опора)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(40, groundY, canvas.width - 80, 15);

        // 2. Блок (тяжелый ящик)
        ctx.fillStyle = isMoving ? "#00f2fe" : "#7dd3fc";
        ctx.fillRect(blockX, groundY - blockHeight, blockWidth, blockHeight);
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText("Ящик", blockX + 20, groundY - 20);

        // 3. Вектор силы тяги (вправо)
        ctx.strokeStyle = "#facc15"; // Желтый
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(blockX + blockWidth, groundY - blockHeight / 2);
        ctx.lineTo(blockX + blockWidth + pullForce * 1.5, groundY - blockHeight / 2);
        // Стрелочка вправо
        ctx.lineTo(blockX + blockWidth + pullForce * 1.5 - 8, groundY - blockHeight / 2 - 5);
        ctx.moveTo(blockX + blockWidth + pullForce * 1.5, groundY - blockHeight / 2);
        ctx.lineTo(blockX + blockWidth + pullForce * 1.5 - 8, groundY - blockHeight / 2 + 5);
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.fillText(`Fтяги = ${pullForce} Н`, blockX + blockWidth + 5, groundY - blockHeight / 2 - 10);

        // 4. Вектор силы трения (влево, по контакту с поверхностью)
        ctx.strokeStyle = "#ff79c6"; // Розовый
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(blockX, groundY);
        ctx.lineTo(blockX - currentFriction * 1.5, groundY);
        // Стрелочка влево
        ctx.lineTo(blockX - currentFriction * 1.5 + 8, groundY - 5);
        ctx.moveTo(blockX - currentFriction * 1.5, groundY);
        ctx.lineTo(blockX - currentFriction * 1.5 + 8, groundY + 5);
        ctx.stroke();

        ctx.fillStyle = "#ff79c6";
        let frictionLabel = isMoving ? `Fтр.ск = ${currentFriction} Н` : `Fтр.пок = ${currentFriction} Н`;
        ctx.fillText(frictionLabel, blockX - 70, groundY + 25);
    }

    if (slider) {
        slider.addEventListener('input', (e) => {
            const pull = parseInt(e.target.value);
            if (valueSpan) valueSpan.textContent = pull;

            if (pull <= maxStaticFriction) {
                if (statusText) {
                    statusText.textContent = `Тело покоится. Сила трения покоя подстраивается и равна силе тяги: ${pull} Н.`;
                }
            } else {
                if (statusText) {
                    statusText.textContent = `Предел трения покоя (30 Н) превышен! Ящик сорвался с места и начал скользить.`;
                }
            }

            draw(pull);
        });
    }

    // Первичная отрисовка
    draw(parseInt(slider ? slider.value : 15));
}
function initSlidingAnimation(canvasId, sliderId, valueSpanId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const slider = document.getElementById(sliderId);
    const valueSpan = document.getElementById(valueSpanId);
    const statusText = document.getElementById(statusTextId);

    const mass = 5; // кг
    const g = 10;   // Н/кг
    const normalForce = mass * g; // N = 50 Н

    const blockWidth = 70;
    const blockHeight = 50;
    const groundY = 140;

    let animX = 220; // текущая позиция для анимации движения

    function draw(mu) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const frictionForce = Math.round(mu * normalForce * 10) / 10;

        // Поверхность (опора) с эффектом движения
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(40, groundY, canvas.width - 80, 15);

        // Движем блок туда-сюда плавно для демонстрации скольжения
        animX += 0.5;
        if (animX > 320) animX = 180;

        // Блок
        ctx.fillStyle = "#00f2fe";
        ctx.fillRect(animX, groundY - blockHeight, blockWidth, blockHeight);
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText("Скольжение", animX + 2, groundY - 20);

        // Вектор силы трения скольжения (направлен влево, против движения)
        const vectorLen = frictionForce * 2;
        ctx.strokeStyle = "#ff79c6"; // Розовый
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(animX, groundY);
        ctx.lineTo(animX - vectorLen, groundY);
        // Стрелочка влево
        ctx.lineTo(animX - vectorLen + 8, groundY - 5);
        ctx.moveTo(animX - vectorLen, groundY);
        ctx.lineTo(animX - vectorLen + 8, groundY + 5);
        ctx.stroke();

        ctx.fillStyle = "#ff79c6";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`Fтр.ск = ${frictionForce} Н`, animX - 85, groundY + 25);
    }

    let animationId;
    function loop() {
        const mu = parseFloat(slider.value);
        draw(mu);
        animationId = requestAnimationFrame(loop);
    }

    if (slider) {
        slider.addEventListener('input', (e) => {
            const mu = parseFloat(e.target.value);
            if (valueSpan) valueSpan.textContent = mu.toFixed(1);

            const friction = (mu * normalForce).toFixed(1);
            if (statusText) {
                statusText.textContent = `Сила трения скольжения: Fтр = μ (${mu.toFixed(1)}) × N (${normalForce} Н) = ${friction} Н`;
            }
        });
    }

    // Запуск цикла анимации
    loop();
}
function initRollingAnimation(canvasId, sliderId, valueSpanId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const slider = document.getElementById(sliderId);
    const valueSpan = document.getElementById(valueSpanId);
    const statusText = document.getElementById(statusTextId);

    const g = 10;
    const muRoll = 0.04; // Коэффициент трения качения (маленький)
    const muSlide = 0.3;  // Коэффициент трения скольжения (большой)

    let wheelAngle = 0;
    let wheelX = 150;
    const groundY = 140;
    const radius = 30;

    function draw(mass) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const normalForce = mass * g;
        const rollForce = Math.round(muRoll * normalForce * 10) / 10;
        const slideForce = Math.round(muSlide * normalForce * 10) / 10;

        // Поверхность
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(40, groundY, canvas.width - 80, 15);

        // Анимация качения колеса
        wheelX += 1.2;
        wheelAngle += 0.04;
        if (wheelX > 450) wheelX = 150;

        const centerY = groundY - radius;

        // 1. Рисуем катящееся колесо
        ctx.save();
        ctx.translate(wheelX, centerY);
        ctx.rotate(wheelAngle);

        // Обод колеса
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Спицы колеса для наглядности вращения
        ctx.strokeStyle = "rgba(0, 242, 254, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(0, -radius);
        ctx.moveTo(0, 0); ctx.lineTo(radius, 0);
        ctx.stroke();

        ctx.restore();

        // Подпись колеса
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText("Качение", wheelX - 22, groundY + 30);

        // Вектор силы трения качения (маленький, направлен назад)
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(wheelX, groundY);
        ctx.lineTo(wheelX - rollForce * 4, groundY);
        ctx.lineTo(wheelX - rollForce * 4 + 6, groundY - 4);
        ctx.moveTo(wheelX, groundY);
        ctx.lineTo(wheelX - rollForce * 4 + 6, groundY + 4);
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.fillText(`Fкач = ${rollForce} Н`, wheelX - 35, groundY - 35);
    }

    let animationId;
    function loop() {
        const mass = parseFloat(slider.value);
        draw(mass);
        animationId = requestAnimationFrame(loop);
    }

    if (slider) {
        slider.addEventListener('input', (e) => {
            const mass = parseFloat(e.target.value);
            if (valueSpan) valueSpan.textContent = mass;

            const rollF = (muRoll * mass * g).toFixed(1);
            const slideF = (muSlide * mass * g).toFixed(1);

            if (statusText) {
                statusText.textContent = `Сила трения качения: Fкач = ${rollF} Н (значительно меньше трения скольжения = ${slideF} Н)`;
            }
        });
    }

    loop();
}
function initPressureAnimation(canvasId, sliderId, massValId, nValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const slider = document.getElementById(sliderId);
    const massValSpan = document.getElementById(massValId);
    const nValSpan = document.getElementById(nValId);
    const statusText = document.getElementById(statusTextId);

    const g = 10;
    const mu = 0.3; // постоянный коэффициент трения
    const groundY = 140;
    const baseWidth = 70;
    const baseHeight = 40;

    function draw(mass) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const normalForce = mass * g;
        const frictionForce = Math.round(mu * normalForce * 10) / 10;

        // Поверхность
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(40, groundY, canvas.width - 80, 15);

        // Высота блока увеличивается пропорционально массе для наглядности «тяжести»
        const currentHeight = baseHeight + mass * 4;
        const blockX = 250;
        const blockY = groundY - currentHeight;

        // 1. Рисуем блок (корпус)
        ctx.fillStyle = "#00f2fe";
        ctx.fillRect(blockX, blockY, baseWidth, currentHeight);

        // Текст на блоке
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`${mass} кг`, blockX + 20, blockY + currentHeight / 2 + 4);

        // 2. Вектор силы нормального давления N (вниз на опору или вверх реакция)
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        // Рисуем стрелку силы тяжести/давления
        ctx.beginPath();
        ctx.moveTo(blockX + baseWidth / 2, blockY + currentHeight / 2);
        ctx.lineTo(blockX + baseWidth / 2, groundY + 25);
        ctx.lineTo(blockX + baseWidth / 2 - 4, groundY + 18);
        ctx.moveTo(blockX + baseWidth / 2, groundY + 25);
        ctx.lineTo(blockX + baseWidth / 2 + 4, groundY + 18);
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.fillText(`N = ${normalForce} Н`, blockX + baseWidth / 2 + 8, groundY + 20);

        // 3. Вектор силы трения (влево)
        ctx.strokeStyle = "#ff79c6";
        ctx.lineWidth = 3;
        const vectorLen = frictionForce * 2;
        ctx.beginPath();
        ctx.moveTo(blockX, groundY);
        ctx.lineTo(blockX - vectorLen, groundY);
        ctx.lineTo(blockX - vectorLen + 6, groundY - 4);
        ctx.moveTo(blockX, groundY);
        ctx.lineTo(blockX - vectorLen + 6, groundY + 4);
        ctx.stroke();

        ctx.fillStyle = "#ff79c6";
        ctx.fillText(`Fтр = ${frictionForce} Н`, blockX - 75, groundY + 25);
    }

    if (slider) {
        slider.addEventListener('input', (e) => {
            const mass = parseInt(e.target.value);
            const normalForce = mass * g;
            const friction = (mu * normalForce).toFixed(1);

            if (massValSpan) massValSpan.textContent = mass;
            if (nValSpan) nValSpan.textContent = normalForce;

            if (statusText) {
                statusText.textContent = `При μ = ${mu} и N = ${normalForce} Н, сила трения равна: Fтр = ${friction} Н`;
            }

            draw(mass);
        });
    }

    // Начальная отрисовка
    draw(parseInt(slider ? slider.value : 5));
}
function initQualityAnimation(canvasId, sliderId, muValId, materialNameId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const slider = document.getElementById(sliderId);
    const muValSpan = document.getElementById(muValId);
    const materialNameSpan = document.getElementById(materialNameId);
    const statusText = document.getElementById(statusTextId);

    const normalForce = 50; // постоянная сила нормального давления (при массе 5 кг)
    const groundY = 140;
    const blockWidth = 70;
    const blockHeight = 45;

    function getMaterialDescription(mu) {
        if (mu <= 0.2) return "Металл по льду / Смазанные поверхности";
        if (mu <= 0.4) return "Дерево по дереву";
        if (mu <= 0.6) return "Шероховатый камень / Кирпич";
        return "Резина по сухому асфальту";
    }

    function draw(mu) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const frictionForce = Math.round(mu * normalForce * 10) / 10;

        // Рисуем текстуру поверхности в зависимости от мю (чем больше мю, тем «зубатее» линия)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, groundY);

        let step = 10;
        let roughness = mu * 15; // амплитуда неровностей
        for (let x = 40; x <= canvas.width - 40; x += step) {
            let yOffset = (Math.sin(x / 5) * roughness);
            ctx.lineTo(x, groundY + yOffset);
        }
        ctx.stroke();

        // Основа дороги
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(40, groundY + 5, canvas.width - 80, 15);

        const blockX = 250;
        const blockY = groundY - blockHeight - 2;

        // Блок
        ctx.fillStyle = "#00f2fe";
        ctx.fillRect(blockX, blockY, blockWidth, blockHeight);

        // Текст на блоке
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`μ = ${mu.toFixed(1)}`, blockX + 12, blockY + 26);

        // Вектор силы трения (влево)
        ctx.strokeStyle = "#ff79c6";
        ctx.lineWidth = 3;
        const vectorLen = frictionForce * 1.8;
        ctx.beginPath();
        ctx.moveTo(blockX, groundY);
        ctx.lineTo(blockX - vectorLen, groundY);
        ctx.lineTo(blockX - vectorLen + 6, groundY - 4);
        ctx.moveTo(blockX, groundY);
        ctx.lineTo(blockX - vectorLen + 6, groundY + 4);
        ctx.stroke();

        ctx.fillStyle = "#ff79c6";
        ctx.fillText(`Fтр = ${frictionForce} Н`, blockX - 75, groundY + 25);
    }

    if (slider) {
        slider.addEventListener('input', (e) => {
            const mu = parseFloat(e.target.value);
            const friction = (mu * normalForce).toFixed(1);
            const matName = getMaterialDescription(mu);

            if (muValSpan) muValSpan.textContent = mu.toFixed(1);
            if (materialNameSpan) materialNameSpan.textContent = matName;

            if (statusText) {
                statusText.textContent = `При N = 50 Н и μ = ${mu.toFixed(1)}, сила трения равна: Fтр = ${friction} Н`;
            }

            draw(mu);
        });
    }

    // Начальная отрисовка
    draw(parseFloat(slider ? slider.value : 0.4));
}
function initForcesAdditionAnimation(canvasId, f1SliderId, f2SliderId, f1ValId, f2ValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const f1Slider = document.getElementById(f1SliderId);
    const f2Slider = document.getElementById(f2SliderId);
    const f1ValSpan = document.getElementById(f1ValId);
    const f2ValSpan = document.getElementById(f2ValId);
    const statusText = document.getElementById(statusTextId);

    const centerY = 100;
    const blockWidth = 70;
    const blockHeight = 50;

    function draw(f1, f2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Расчет равнодействующей (направо считаем положительным, налево — отрицательным)
        const netForce = f1 - f2;

        // Позиция блока слегка смещается в сторону равнодействующей силы для наглядности
        const blockX = 265 + netForce * 1.5;

        // 1. Блок (тележка)
        ctx.fillStyle = "#00f2fe";
        ctx.fillRect(blockX, centerY - blockHeight / 2, blockWidth, blockHeight);
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText("Тело", blockX + 20, centerY + 4);

        // 2. Вектор Силы 1 (направлен вправо)
        if (f1 > 0) {
            ctx.strokeStyle = "#facc15"; // Желтый
            ctx.lineWidth = 4;
            const len1 = f1 * 2.5;
            ctx.beginPath();
            ctx.moveTo(blockX + blockWidth, centerY - 10);
            ctx.lineTo(blockX + blockWidth + len1, centerY - 10);
            ctx.lineTo(blockX + blockWidth + len1 - 8, centerY - 15);
            ctx.moveTo(blockX + blockWidth, centerY - 10);
            ctx.lineTo(blockX + blockWidth + len1 - 8, centerY - 5);
            ctx.stroke();

            ctx.fillStyle = "#facc15";
            ctx.fillText(`F₁ = ${f1} Н`, blockX + blockWidth + len1 / 2 - 15, centerY - 20);
        }

        // 3. Вектор Силы 2 (направлен влево)
        if (f2 > 0) {
            ctx.strokeStyle = "#ff79c6"; // Розовый
            ctx.lineWidth = 4;
            const len2 = f2 * 2.5;
            ctx.beginPath();
            ctx.moveTo(blockX, centerY + 10);
            ctx.lineTo(blockX - len2, centerY + 10);
            ctx.lineTo(blockX - len2 + 8, centerY + 5);
            ctx.moveTo(blockX, centerY + 10);
            ctx.lineTo(blockX - len2 + 8, centerY + 15);
            ctx.stroke();

            ctx.fillStyle = "#ff79c6";
            ctx.fillText(`F₂ = ${f2} Н`, blockX - len2 / 2 - 20, centerY + 28);
        }
    }

    function update() {
        const f1 = parseInt(f1Slider.value);
        const f2 = parseInt(f2Slider.value);

        if (f1ValSpan) f1ValSpan.textContent = f1;
        if (f2ValSpan) f2ValSpan.textContent = f2;

        const net = f1 - f2;
        if (statusText) {
            if (net > 0) {
                statusText.textContent = `Равнодействующая сила: Fобщ = ${f1} Н - ${f2} Н = ${net} Н (направлена вправо)`;
            } else if (net < 0) {
                statusText.textContent = `Равнодействующая сила: Fобщ = ${f2} Н - ${f1} Н = ${Math.abs(net)} Н (направлена влево)`;
            } else {
                statusText.textContent = `Силы скомпенсированы! Равнодействующая равна нулю (Fобщ = 0 Н). Тело в покое или движется равномерно.`;
            }
        }

        draw(f1, f2);
    }

    if (f1Slider) f1Slider.addEventListener('input', update);
    if (f2Slider) f2Slider.addEventListener('input', update);

    // Начальная отрисовка
    draw(parseInt(f1Slider.value), parseInt(f2Slider.value));
}
function initStraightLineForcesAnimation(canvasId, f1SliderId, f2SliderId, f1ValId, f2ValId, checkboxId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const f1Slider = document.getElementById(f1SliderId);
    const f2Slider = document.getElementById(f2SliderId);
    const f1ValSpan = document.getElementById(f1ValId);
    const f2ValSpan = document.getElementById(f2ValId);
    const checkbox = document.getElementById(checkboxId);
    const statusText = document.getElementById(statusTextId);

    const centerY = 100;
    const blockWidth = 70;
    const blockHeight = 50;

    function draw(f1, f2, isOpposite) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Расчет равнодействующей
        const netForce = isOpposite ? (f1 - f2) : (f1 + f2);
        const blockX = 265 + (isOpposite ? (f1 - f2) * 1.2 : f1 * 0.6);

        // 1. Блок (тело)
        ctx.fillStyle = "#00f2fe";
        ctx.fillRect(blockX, centerY - blockHeight / 2, blockWidth, blockHeight);
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText("Тело", blockX + 20, centerY + 4);

        // 2. Сила 1 (всегда вправо)
        if (f1 > 0) {
            ctx.strokeStyle = "#facc15"; // Желтый
            ctx.lineWidth = 4;
            const len1 = f1 * 2.5;
            ctx.beginPath();
            ctx.moveTo(blockX + blockWidth, centerY - 10);
            ctx.lineTo(blockX + blockWidth + len1, centerY - 10);
            ctx.lineTo(blockX + blockWidth + len1 - 8, centerY - 15);
            ctx.moveTo(blockX + blockWidth, centerY - 10);
            ctx.lineTo(blockX + blockWidth + len1 - 8, centerY - 5);
            ctx.stroke();

            ctx.fillStyle = "#facc15";
            ctx.fillText(`F₁ = ${f1} Н`, blockX + blockWidth + len1 / 2 - 15, centerY - 20);
        }

        // 3. Сила 2 (вправо или влево в зависимости от чекбокса)
        if (f2 > 0) {
            ctx.strokeStyle = "#ff79c6"; // Розовый
            ctx.lineWidth = 4;
            const len2 = f2 * 2.5;
            ctx.beginPath();

            if (isOpposite) {
                // Влево от левого края блока
                ctx.moveTo(blockX, centerY + 10);
                ctx.lineTo(blockX - len2, centerY + 10);
                ctx.lineTo(blockX - len2 + 8, centerY + 5);
                ctx.moveTo(blockX, centerY + 10);
                ctx.lineTo(blockX - len2 + 8, centerY + 15);
                ctx.stroke();

                ctx.fillStyle = "#ff79c6";
                ctx.fillText(`F₂ = ${f2} Н`, blockX - len2 / 2 - 20, centerY + 28);
            } else {
                // Вправо от правого края блока (поверх или чуть ниже F1)
                ctx.moveTo(blockX + blockWidth, centerY + 10);
                ctx.lineTo(blockX + blockWidth + len2, centerY + 10);
                ctx.lineTo(blockX + blockWidth + len2 - 8, centerY + 5);
                ctx.moveTo(blockX + blockWidth, centerY + 10);
                ctx.lineTo(blockX + blockWidth + len2 - 8, centerY + 15);
                ctx.stroke();

                ctx.fillStyle = "#ff79c6";
                ctx.fillText(`F₂ = ${f2} Н`, blockX + blockWidth + len2 / 2 - 15, centerY + 25);
            }
        }
    }

    function update() {
        const f1 = parseInt(f1Slider.value);
        const f2 = parseInt(f2Slider.value);
        const isOpposite = checkbox.checked;

        if (f1ValSpan) f1ValSpan.textContent = f1;
        if (f2ValSpan) f2ValSpan.textContent = f2;

        if (statusText) {
            if (isOpposite) {
                const diff = f1 - f2;
                if (diff > 0) {
                    statusText.textContent = `Силы в противоположные стороны: Fобщ = ${f1} Н - ${f2} Н = ${diff} Н (направлена вправо)`;
                } else if (diff < 0) {
                    statusText.textContent = `Силы в противоположные стороны: Fобщ = ${f2} Н - ${f1} Н = ${Math.abs(diff)} Н (направлена влево)`;
                } else {
                    statusText.textContent = `Силы равны и противоположны! Fобщ = 0 Н (скомпенсированы).`;
                }
            } else {
                const sum = f1 + f2;
                statusText.textContent = `Силы сонаправлены: Fобщ = ${f1} Н + ${f2} Н = ${sum} Н (направлена вправо)`;
            }
        }

        draw(f1, f2, isOpposite);
    }

    if (f1Slider) f1Slider.addEventListener('input', update);
    if (f2Slider) f2Slider.addEventListener('input', update);
    if (checkbox) checkbox.addEventListener('change', update);

    // Начальная отрисовка
    draw(parseInt(f1Slider.value), parseInt(f2Slider.value), checkbox.checked);
}
function initSolidPressureAnimation(canvasId, massSliderId, areaSliderId, massValId, areaValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const massSlider = document.getElementById(massSliderId);
    const areaSlider = document.getElementById(areaSliderId);
    const massValSpan = document.getElementById(massValId);
    const areaValSpan = document.getElementById(areaValId);
    const statusText = document.getElementById(statusTextId);

    const g = 10;
    const groundY = 150;

    function draw(mass, area) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const force = mass * g;
        const pressure = Math.round(force / area);

        // Поверхность
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(40, groundY, canvas.width - 80, 15);

        // Ширина бруска зависит от площади опоры (для наглядности)
        const blockWidth = area * 160;
        const blockHeight = 60;
        const blockX = (canvas.width - blockWidth) / 2;
        const blockY = groundY - blockHeight;

        // Брусок
        ctx.fillStyle = "#00f2fe";
        ctx.fillRect(blockX, blockY, blockWidth, blockHeight);

        // Текст на бруске
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`m = ${mass} кг`, blockX + blockWidth / 2 - 25, blockY + 25);
        ctx.fillText(`S = ${area.toFixed(1)} м²`, blockX + blockWidth / 2 - 30, blockY + 45);

        // Стрелки силы давления (вниз)
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, blockY - 25);
        ctx.lineTo(canvas.width / 2, blockY);
        ctx.lineTo(canvas.width / 2 - 4, blockY - 8);
        ctx.moveTo(canvas.width / 2, blockY - 25);
        ctx.lineTo(canvas.width / 2 + 4, blockY - 8);
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.fillText(`F = ${force} Н`, canvas.width / 2 + 10, blockY - 12);
    }

    function update() {
        const mass = parseFloat(massSlider.value);
        const area = parseFloat(areaSlider.value);
        const force = mass * g;
        const pressure = Math.round(force / area);

        if (massValSpan) massValSpan.textContent = mass;
        if (areaValSpan) areaValSpan.textContent = area.toFixed(1);

        if (statusText) {
            statusText.textContent = `Давление: p = ${force} Н / ${area.toFixed(1)} м² = ${pressure} Па`;
        }

        draw(mass, area);
    }

    if (massSlider) massSlider.addEventListener('input', update);
    if (areaSlider) areaSlider.addEventListener('input', update);

    // Начальная отрисовка
    draw(parseFloat(massSlider.value), parseFloat(areaSlider.value));
}
function initIncreasePressureAnimation(canvasId, forceSliderId, areaSliderId, forceValId, areaValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const forceSlider = document.getElementById(forceSliderId);
    const areaSlider = document.getElementById(areaSliderId);
    const forceValSpan = document.getElementById(forceValId);
    const areaValSpan = document.getElementById(areaValId);
    const statusText = document.getElementById(statusTextId);

    const groundY = 150;

    function draw(force, areaCm2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Переводим площадь из см² в м² для корректного расчета давления (1 см² = 0.0001 м²)
        const areaM2 = areaCm2 * 0.0001;
        const pressure = Math.round(force / areaM2);

        // Поверхность (материал, который режут/прокалывают)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(40, groundY, canvas.width - 80, 15);

        // Рисуем «острие» инструмента (например, нож или гвоздь), сужающееся книзу в зависимости от площади
        const tipWidth = areaCm2 * 50; // визуальная ширина кончика
        const toolX = canvas.width / 2;
        const toolTopY = groundY - 80;

        ctx.fillStyle = "#00f2fe";
        ctx.beginPath();
        ctx.moveTo(toolX - 25, toolTopY);
        ctx.lineTo(toolX + 25, toolTopY);
        ctx.lineTo(toolX + tipWidth / 2, groundY);
        ctx.lineTo(toolX - tipWidth / 2, groundY);
        ctx.closePath();
        ctx.fill();

        // Стрелка силы, давящей сверху вниз
        const arrowHeight = force * 0.8;
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(toolX, toolTopY - arrowHeight - 10);
        ctx.lineTo(toolX, toolTopY);
        ctx.lineTo(toolX - 5, toolTopY - 8);
        ctx.moveTo(toolX, toolTopY - arrowHeight - 10);
        ctx.lineTo(toolX + 5, toolTopY - 8);
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`F = ${force} Н`, toolX + 15, toolTopY - arrowHeight / 2);
    }

    function update() {
        const force = parseFloat(forceSlider.value);
        const areaCm2 = parseFloat(areaSlider.value);
        const areaM2 = areaCm2 * 0.0001;
        const pressure = Math.round(force / areaM2);

        if (forceValSpan) forceValSpan.textContent = force;
        if (areaValSpan) areaValSpan.textContent = areaCm2.toFixed(1);

        if (statusText) {
            statusText.textContent = `Давление: p = ${force} Н / ${areaM2.toFixed(5)} м² = ${pressure.toLocaleString()} Па`;
        }

        draw(force, areaCm2);
    }

    if (forceSlider) forceSlider.addEventListener('input', update);
    if (areaSlider) areaSlider.addEventListener('input', update);

    // Начальная отрисовка
    draw(parseFloat(forceSlider.value), parseFloat(areaSlider.value));
}
function initDecreasePressureAnimation(canvasId, forceSliderId, areaSliderId, forceValId, areaValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const forceSlider = document.getElementById(forceSliderId);
    const areaSlider = document.getElementById(areaSliderId);
    const forceValSpan = document.getElementById(forceValId);
    const areaValSpan = document.getElementById(areaValId);
    const statusText = document.getElementById(statusTextId);

    const groundY = 150;

    function draw(force, area) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const pressure = Math.round(force / area);

        // Поверхность (грунт/снег)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillRect(40, groundY, canvas.width - 80, 15);

        // Ширина платформы/гусеницы прямо пропорциональна площади S
        const blockWidth = area * 250; 
        const blockHeight = 50;
        const blockX = (canvas.width - blockWidth) / 2;
        const blockY = groundY - blockHeight;

        // Рисуем широкую платформу (например, трактор на гусеницах)
        ctx.fillStyle = "#00f2fe";
        ctx.fillRect(blockX, blockY, blockWidth, blockHeight);

        // Текст на платформе
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`S = ${area.toFixed(1)} м²`, blockX + blockWidth / 2 - 30, blockY + 30);

        // Стрелка силы давления (вниз)
        const arrowHeight = 40;
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, blockY - arrowHeight);
        ctx.lineTo(canvas.width / 2, blockY);
        ctx.lineTo(canvas.width / 2 - 4, blockY - 8);
        ctx.moveTo(canvas.width / 2, blockY - arrowHeight);
        ctx.lineTo(canvas.width / 2 + 4, blockY - 8);
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.fillText(`F = ${force} Н`, canvas.width / 2 + 10, blockY - arrowHeight / 2);
    }

    function update() {
        const force = parseFloat(forceSlider.value);
        const area = parseFloat(areaSlider.value);
        const pressure = Math.round(force / area);

        if (forceValSpan) forceValSpan.textContent = force;
        if (areaValSpan) areaValSpan.textContent = area.toFixed(1);

        if (statusText) {
            statusText.textContent = `Давление: p = ${force} Н / ${area.toFixed(1)} м² = ${pressure.toLocaleString()} Па`;
        }

        draw(force, area);
    }

    if (forceSlider) forceSlider.addEventListener('input', update);
    if (areaSlider) areaSlider.addEventListener('input', update);

    // Начальная отрисовка
    draw(parseFloat(forceSlider.value), parseFloat(areaSlider.value));
}
function initFluidPressureAnimation(canvasId, sliderId, valId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    const statusText = document.getElementById(statusTextId);

    // Создаем массив молекул газа внутри сосуда
    const particles = [];
    const count = 35;
    const boxX = 150, boxY = 30, boxWidth = 300, boxHeight = 140;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: boxX + Math.random() * boxWidth,
            y: boxY + Math.random() * boxHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    }

    function updateAndDraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const temp = parseInt(slider.value);
        if (valSpan) valSpan.textContent = temp;
        
        // Скорость молекул зависит от температуры (коэффициент)
        const speedMultiplier = Math.sqrt(temp / 300);

        // Рисуем сосуд
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Текст внутри сосуда
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText("Газ под давлением", boxX + 90, boxY + boxHeight / 2);

        // Обновляем и рисуем молекулы
        ctx.fillStyle = "#ff79c6";
        particles.forEach(p => {
            p.x += p.vx * speedMultiplier;
            p.y += p.vy * speedMultiplier;

            // Столкновения со стенками сосуда
            if (p.x <= boxX + 5 || p.x >= boxX + boxWidth - 5) p.vx *= -1;
            if (p.y <= boxY + 5 || p.y >= boxY + boxHeight - 5) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(updateAndDraw);
    }

    if (slider) {
        slider.addEventListener('input', (e) => {
            const t = parseInt(e.target.value);
            if (statusText) {
                if (t < 200) {
                    statusText.textContent = `Низкая температура: молекулы движутся медленно, удары о стенки слабые (низкое давление).`;
                } else if (t <= 350) {
                    statusText.textContent = `Нормальная температура: умеренная скорость молекул и стандартное давление.`;
                } else {
                    statusText.textContent = `Высокая температура: скорость молекул резко возросла, удары участились — давление увеличилось!`;
                }
            }
        });
    }

    updateAndDraw();
}
function initPascalLawAnimation(canvasId, sliderId, valId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    const statusText = document.getElementById(statusTextId);

    const centerX = 300;
    const centerY = 120;
    const radius = 50;

    function draw(force) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Цилиндр сверху (горлышко шара/сосуда)
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(centerX - 15, centerY - radius - 35, 30, 35);
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 15, centerY - radius - 35, 30, 35);

        // 2. Поршень
        const pistonY = centerY - radius - 20 - (force * 0.4);
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(centerX - 20, pistonY, 40, 10);

        // Стрелка силы нажатия на поршень
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, pistonY - 25);
        ctx.lineTo(centerX, pistonY);
        ctx.lineTo(centerX - 4, pistonY - 8);
        ctx.moveTo(centerX, pistonY - 25);
        ctx.lineTo(centerX + 4, pistonY - 8);
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`F = ${force} Н`, centerX + 10, pistonY - 12);

        // 3. Шаг Паскаля (сфера)
        ctx.fillStyle = "rgba(0, 242, 254, 0.15)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.stroke();

        // 4. Отверстия и струи воды во все стороны
        const jetLength = force * 2.2;
        const angles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4];

        angles.forEach(angle => {
            const startX = centerX + Math.cos(angle) * radius;
            const startY = centerY + Math.sin(angle) * radius;
            const endX = centerX + Math.cos(angle) * (radius + jetLength);
            const endY = centerY + Math.sin(angle) * (radius + jetLength);

            // Струя воды
            ctx.strokeStyle = "#00f2fe";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Точка отверстия
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(startX, startY, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function update() {
        const force = parseInt(slider.value);
        if (valSpan) valSpan.textContent = force;

        if (statusText) {
            statusText.textContent = `Сила нажатия ${force} Н создает давление, которое одинаково передается во все стороны — вода бьет из всех отверстий на равное расстояние!`;
        }

        draw(force);
    }

    if (slider) {
        slider.addEventListener('input', update);
    }

    // Начальная отрисовка
    draw(parseInt(slider.value));
}
function initHydrostaticAnimation(canvasId, depthSliderId, densitySliderId, depthValId, densityValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const depthSlider = document.getElementById(depthSliderId);
    const densitySlider = document.getElementById(densitySliderId);
    const depthValSpan = document.getElementById(depthValId);
    const densityValSpan = document.getElementById(densityValId);
    const statusText = document.getElementById(statusTextId);

    const g = 10;
    const surfaceY = 30;
    const maxCanvasDepth = 10; // максимальная глубина для шкалы

    function draw(depth, density) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const pressure = density * g * depth;

        // 1. Водная среда (окрашиваем область под поверхностью)
        const waterHeight = 160;
        ctx.fillStyle = "rgba(0, 242, 254, 0.2)";
        ctx.fillRect(40, surfaceY, canvas.width - 80, waterHeight);

        // Поверхность воды
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, surfaceY);
        ctx.lineTo(canvas.width - 40, surfaceY);
        ctx.stroke();

        // Текст «Поверхность»
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText("Поверхность жидкости (h = 0 м)", 50, surfaceY - 8);

        // 2. Положение объекта (подводной лодки) зависит от глубины
        // Преобразуем метры глубины в пиксели на холсте
        const objectY = surfaceY + (depth / maxCanvasDepth) * (waterHeight - 30);
        const objectX = canvas.width / 2;

        // Рисуем «подводную лодку»
        ctx.fillStyle = "#ff79c6";
        ctx.beginPath();
        ctx.ellipse(objectX, objectY, 35, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Метка глубины h рядом с объектом
        ctx.strokeStyle = "#facc15";
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(objectX + 50, surfaceY);
        ctx.lineTo(objectX + 50, objectY);
        ctx.stroke();
        ctx.setLineDash([]); // сброс пунктира

        ctx.fillStyle = "#facc15";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`h = ${depth} м`, objectX + 60, surfaceY + (objectY - surfaceY) / 2);
    }

    function update() {
        const depth = parseInt(depthSlider.value);
        const density = parseInt(densitySlider.value);
        const pressure = density * g * depth;

        if (depthValSpan) depthValSpan.textContent = depth;
        if (densityValSpan) densityValSpan.textContent = density;

        if (statusText) {
            statusText.textContent = `Гидростатическое давление: p = ${density} кг/м³ · ${g} Н/кг · ${depth} м = ${pressure.toLocaleString()} Па`;
        }

        draw(depth, density);
    }

    if (depthSlider) depthSlider.addEventListener('input', update);
    if (densitySlider) densitySlider.addEventListener('input', update);

    // Начальная отрисовка
    draw(parseInt(depthSlider.value), parseInt(densitySlider.value));
}
function initCommunicatingVesselsAnimation(canvasId, sliderId, valId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    const statusText = document.getElementById(statusTextId);

    function draw(level) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const groundY = 170;
        const leftX = 180;
        const rightX = 420;
        const tubeWidth = 40;
        const baseHeight = 30;

        // Переводим значение слайдера в высоту воды от дна
        const waterHeight = level;

        // 1. Рисуем U-образный сосуд (контур)
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Левый сосуд
        ctx.moveTo(leftX - tubeWidth/2, groundY - 120);
        ctx.lineTo(leftX - tubeWidth/2, groundY);
        ctx.lineTo(rightX + tubeWidth/2, groundY);
        ctx.lineTo(rightX + tubeWidth/2, groundY - 120);
        // Внутренние стенки
        ctx.moveTo(leftX + tubeWidth/2, groundY - 120);
        ctx.lineTo(leftX + tubeWidth/2, groundY - baseHeight);
        ctx.lineTo(rightX - tubeWidth/2, groundY - baseHeight);
        ctx.lineTo(rightX - tubeWidth/2, groundY - 120);
        ctx.stroke();

        // 2. Рисуем воду внутри сосудов (уровни всегда равны в сообщающихся сосудах)
        const waterTopY = groundY - waterHeight;
        
        ctx.fillStyle = "rgba(0, 242, 254, 0.35)";
        // Левое колено
        ctx.fillRect(leftX - tubeWidth/2 + 2, waterTopY, tubeWidth - 4, groundY - waterTopY - 2);
        // Соединительная трубка
        ctx.fillRect(leftX + tubeWidth/2, groundY - baseHeight, rightX - leftX - tubeWidth, baseHeight - 2);
        // Правое колено
        ctx.fillRect(rightX - tubeWidth/2 + 2, waterTopY, tubeWidth - 4, groundY - waterTopY - 2);

        // 3. Линия уровня (пунктир для наглядности)
        ctx.strokeStyle = "#facc15";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(leftX - tubeWidth/2 - 10, waterTopY);
        ctx.lineTo(rightX + tubeWidth/2 + 10, waterTopY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Метка уровня
        ctx.fillStyle = "#facc15";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`Уровень h = ${waterHeight} мм`, canvas.width / 2 - 50, waterTopY - 10);
    }

    function update() {
        const level = parseInt(slider.value);
        if (valSpan) valSpan.textContent = level;

        if (statusText) {
            statusText.textContent = `Однородная жидкость в сообщающихся сосудах устанавливается на одном уровне (${level} мм), независимо от положения или формы колен.`;
        }

        draw(level);
    }

    if (slider) {
        slider.addEventListener('input', update);
    }

    // Начальная отрисовка
    draw(parseInt(slider.value));
}
function initHydraulicPressAnimation(canvasId, forceSliderId, areaSliderId, forceValId, areaValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const forceSlider = document.getElementById(forceSliderId);
    const areaSlider = document.getElementById(areaSliderId);
    const forceValSpan = document.getElementById(forceValId);
    const areaValSpan = document.getElementById(areaValId);
    const statusText = document.getElementById(statusTextId);

    function draw(f1, areaRatio) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const f2 = f1 * areaRatio;

        const groundY = 170;
        const leftX = 150;
        const rightX = 450;
        
        const smallWidth = 30;
        const largeWidth = smallWidth * Math.sqrt(areaRatio); // визуальное масштабирование ширины

        // 1. Сосуд с жидкостью
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Малый цилиндр (левый)
        ctx.moveTo(leftX - smallWidth/2, groundY - 100);
        ctx.lineTo(leftX - smallWidth/2, groundY);
        ctx.lineTo(rightX - largeWidth/2, groundY);
        // Большой цилиндр (правый)
        ctx.lineTo(rightX - largeWidth/2, groundY - 120);
        
        ctx.moveTo(leftX + smallWidth/2, groundY - 100);
        ctx.lineTo(leftX + smallWidth/2, groundY - 30);
        ctx.lineTo(rightX + largeWidth/2, groundY - 30);
        ctx.lineTo(rightX + largeWidth/2, groundY - 120);
        ctx.stroke();

        // Жидкость внутри
        ctx.fillStyle = "rgba(0, 242, 254, 0.3)";
        ctx.fillRect(leftX - smallWidth/2 + 2, groundY - 70, smallWidth - 4, 70);
        ctx.fillRect(leftX + smallWidth/2, groundY - 30, rightX - leftX - largeWidth/2, 30);
        ctx.fillRect(rightX - largeWidth/2 + 2, groundY - 90, largeWidth - 4, 90);

        // 2. Поршни
        // Малый поршень (сверху вниз давит сила F1)
        const p1Y = groundY - 70;
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(leftX - smallWidth/2 - 2, p1Y, smallWidth + 4, 8);

        // Стрелка силы F1
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftX, p1Y - 25);
        ctx.lineTo(leftX, p1Y);
        ctx.lineTo(leftX - 3, p1Y - 6);
        ctx.moveTo(leftX, p1Y - 25);
        ctx.lineTo(leftX + 3, p1Y - 6);
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`F₁ = ${f1} Н`, leftX + 10, p1Y - 10);

        // Большой поршень (поднимается вверх силой F2)
        const p2Y = groundY - 90;
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(rightX - largeWidth/2 - 4, p2Y, largeWidth + 8, 10);

        // Стрелка силы F2 (подъем/сопротивление)
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(rightX, p2Y + 30);
        ctx.lineTo(rightX, p2Y + 5);
        ctx.lineTo(rightX - 3, p2Y + 12);
        ctx.moveTo(rightX, p2Y + 30);
        ctx.lineTo(rightX + 3, p2Y + 12);
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`F₂ = ${f2} Н`, rightX + 15, p2Y + 20);
    }

    function update() {
        const f1 = parseInt(forceSlider.value);
        const areaRatio = parseInt(areaSlider.value);
        const f2 = f1 * areaRatio;

        if (forceValSpan) forceValSpan.textContent = f1;
        if (areaValSpan) areaValSpan.textContent = areaRatio;

        if (statusText) {
            statusText.textContent = `Выигрыш в силе: F₂ = ${f1} Н · ${areaRatio} = ${f2} Н (Большой поршень создает усилие в ${f2} Н!)`;
        }

        draw(f1, areaRatio);
    }

    if (forceSlider) forceSlider.addEventListener('input', update);
    if (areaSlider) areaSlider.addEventListener('input', update);

    // Начальная отрисовка
    draw(parseInt(forceSlider.value), parseInt(areaSlider.value));
}
function initAtmosphericPressureAnimation(canvasId, sliderId, valId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    const statusText = document.getElementById(statusTextId);

    const groundY = 180;

    function draw(heightKm) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Расчет условного давления в зависимости от высоты (примерное падение ~ на 90 мм рт. ст. на каждый километр)
        const pressureMmHg = Math.round(760 - heightKm * 90);

        // 1. Рисуем градиент атмосферы (чем выше, тем менее плотный/темный воздух)
        const skyGradient = ctx.createLinearGradient(0, 10, 0, groundY);
        skyGradient.addColorStop(0, `rgba(0, 242, 254, ${Math.max(0.05, 0.4 - heightKm * 0.07)})`);
        skyGradient.addColorStop(1, "rgba(0, 242, 254, 0.4)");
        
        ctx.fillStyle = skyGradient;
        ctx.fillRect(30, 20, canvas.width - 60, groundY - 20);

        // Земля / гора
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.beginPath();
        ctx.moveTo(30, groundY);
        ctx.lineTo(canvas.width / 2, groundY - 120); // вершина горы
        ctx.lineTo(canvas.width - 30, groundY);
        ctx.closePath();
        ctx.fill();

        // Линия земли
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, groundY);
        ctx.lineTo(canvas.width - 30, groundY);
        ctx.stroke();

        // 2. Положение альпиниста на склоне горы в зависимости от высоты (от 0 до 5 км)
        const climberX = 150 + (heightKm / 5) * 150;
        const climberY = groundY - (heightKm / 5) * 120 - 15;

        // Рисуем человечка (альпиниста)
        ctx.fillStyle = "#ff79c6";
        ctx.beginPath();
        ctx.arc(climberX, climberY - 10, 6, 0, Math.PI * 2); // голова
        ctx.fill();
        ctx.fillRect(climberX - 3, climberY - 4, 6, 12); // тело

        // Текстовая метка давления над альпинистом
        ctx.fillStyle = "#facc15";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`${pressureMmHg} мм рт. ст.`, climberX - 35, climberY - 25);

        // Указатель уровня
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(climberX, climberY - 20);
        ctx.lineTo(climberX, climberY - 5);
        ctx.stroke();
    }

    function update() {
        const heightKm = parseFloat(slider.value);
        const pressureMmHg = Math.round(760 - heightKm * 90);

        if (valSpan) valSpan.textContent = heightKm.toFixed(1);

        if (statusText) {
            if (heightKm === 0) {
                statusText.textContent = `Высота: 0 км | Давление: ${pressureMmHg} мм рт. ст. (Нормальное атмосферное давление на уровне моря)`;
            } else {
                statusText.textContent = `Высота: ${heightKm} км | Давление: ${pressureMmHg} мм рт. ст. (Воздух разрежен, давление уменьшилось из-за меньшего слоя атмосферы)`;
            }
        }

        draw(heightKm);
    }

    if (slider) {
        slider.addEventListener('input', update);
    }

    // Начальная отрисовка
    draw(parseFloat(slider.value));
}
function initTorricelliAnimation(canvasId, sliderId, valId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    const statusText = document.getElementById(statusTextId);

    function draw(mmHg) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = 300;
        const basinY = 170;
        const maxMmHg = 850;
        const maxTubeHeight = 130; // максимальная визуальная высота ртути в пикселях

        // Высота столба ртути пропорциональна значению мм рт. ст.
        const mercuryHeightPx = (mmHg / 800) * maxTubeHeight;
        const tubeBottomY = basinY;
        const tubeTopY = basinY - 150; // общая длина трубки

        // 1. Чаша (сосуд со ртутью внизу)
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 60, basinY, 120, 25);

        // Ртуть в чаше
        ctx.fillStyle = "rgba(180, 190, 200, 0.5)";
        ctx.fillRect(centerX - 59, basinY + 5, 118, 20);

        // 2. Стеклянная трубка
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 10, tubeTopY, 20, basinY - tubeTopY);

        // 3. Ртуть внутри трубки (высота зависит от давления)
        const currentMercuryTopY = basinY - mercuryHeightPx;
        ctx.fillStyle = "rgba(180, 190, 200, 0.75)";
        ctx.fillRect(centerX - 8, currentMercuryTopY, 16, basinY - currentMercuryTopY);

        // Пустота над ртутью (торричеллиева пустота)
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(centerX - 8, tubeTopY + 2, 16, currentMercuryTopY - (tubeTopY + 2));

        // 4. Метка высоты столба h
        ctx.strokeStyle = "#facc15";
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(centerX + 25, basinY);
        ctx.lineTo(centerX + 25, currentMercuryTopY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#facc15";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`h = ${mmHg} мм`, centerX + 35, basinY - (basinY - currentMercuryTopY) / 2);
    }

    function update() {
        const mmHg = parseInt(slider.value);
        if (valSpan) valSpan.textContent = mmHg;

        if (statusText) {
            if (mmHg === 760) {
                statusText.textContent = `Нормальное атмосферное давление: высота ртутного столба ровно 760 мм рт. ст.`;
            } else if (mmHg < 760) {
                statusText.textContent = `Пониженное давление (${mmHg} мм рт. ст.): атмосферный столб слабее давит на чашу, ртуть в трубке опускается ниже.`;
            } else {
                statusText.textContent = `Повышенное давление (${mmHg} мм рт. ст.): атмосферное давление возрастает, поднимая ртуть в трубке выше.`;
            }
        }

        draw(mmHg);
    }

    if (slider) {
        slider.addEventListener('input', update);
    }

    // Начальная отрисовка
    draw(parseInt(slider.value));
}
function initAneroidBarometerAnimation(canvasId, sliderId, valId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    const statusText = document.getElementById(statusTextId);

    function draw(mmHg) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = 180;
        const centerY = 110;
        const boxRadius = 55;

        // Нормализация давления для анимации (от 700 до 820 мм рт. ст.)
        // Смещение коробочки по вертикали зависит от давления
        const pressureDelta = mmHg - 760; // от -60 до +60
        const deformation = pressureDelta * 0.08; // сжатие/расширение

        // 1. Рисуем металлическую коробочку с гофрированными краями
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.fillStyle = "rgba(0, 242, 254, 0.2)";
        
        ctx.beginPath();
        // Эллипс коробочки с изменяющейся высотой (деформацией)
        const currentBoxHeight = boxRadius - deformation;
        ctx.ellipse(centerX, centerY, boxRadius, currentBoxHeight, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Гофры (внутренние линии коробочки)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, boxRadius * 0.7, currentBoxHeight * 0.7, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Стрелка давления над коробочкой (показывает силу воздуха)
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - currentBoxHeight - 25);
        ctx.lineTo(centerX, centerY - currentBoxHeight - 5);
        ctx.lineTo(centerX - 4, centerY - currentBoxHeight - 12);
        ctx.moveTo(centerX, centerY - currentBoxHeight - 25);
        ctx.lineTo(centerX + 4, centerY - currentBoxHeight - 12);
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`p = ${mmHg} мм рт. ст.`, centerX - 45, centerY - currentBoxHeight - 32);

        // 2. Циферблат барометра справа
        const dialX = 430;
        const dialY = 110;
        const dialRadius = 65;

        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(dialX, dialY, dialRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fill();
        ctx.stroke();

        // Деления на шкале циферблата
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 1.5 - (Math.PI * 0.75);
            const x1 = dialX + Math.cos(angle) * (dialRadius - 8);
            const y1 = dialY + Math.sin(angle) * (dialRadius - 8);
            const x2 = dialX + Math.cos(angle) * dialRadius;
            const y2 = dialY + Math.sin(angle) * dialRadius;

            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        // Стрелка прибора (угол поворота зависит от значения давления)
        // 700 мм рт. ст. -> -135 градусов, 820 мм рт. ст. -> +135 градусов
        const normalizedVal = (mmHg - 700) / 120; // от 0 до 1
        const pointerAngle = normalizedVal * Math.PI * 1.5 - (Math.PI * 0.75);

        ctx.strokeStyle = "#ff79c6";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(dialX, dialY);
        ctx.lineTo(dialX + Math.cos(pointerAngle) * (dialRadius - 15), dialY + Math.sin(pointerAngle) * (dialRadius - 15));
        ctx.stroke();

        // Центр стрелки
        ctx.fillStyle = "#ff79c6";
        ctx.beginPath();
        ctx.arc(dialX, dialY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Подпись циферблата
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText("Шкала барометра", dialX - 45, dialY + dialRadius + 18);
    }

    function update() {
        const mmHg = parseInt(slider.value);
        if (valSpan) valSpan.textContent = mmHg;

        if (statusText) {
            if (mmHg === 760) {
                statusText.textContent = `Нормальное давление (760 мм рт. ст.): коробочка в стабильном положении, стрелка указывает на стандартное атмосферное давление.`;
            } else if (mmHg < 760) {
                statusText.textContent = `Пониженное давление (${mmHg} мм рт. ст.): воздух слабее давит на коробочку, пружина распрямляет ее, поворачивая стрелку влево.`;
            } else {
                statusText.textContent = `Повышенное давление (${mmHg} мм рт. ст.): атмосферный воздух сильнее сжимает коробочку, поворачивая стрелку вправо.`;
            }
        }

        draw(mmHg);
    }

    if (slider) {
        slider.addEventListener('input', update);
    }

    // Начальная отрисовка
    draw(parseInt(slider.value));
}
function initArchimedesAnimation(canvasId, volumeSliderId, densitySliderId, volumeValId, densityValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const volumeSlider = document.getElementById(volumeSliderId);
    const densitySlider = document.getElementById(densitySliderId);
    const volumeValSpan = document.getElementById(volumeValId);
    const densityValSpan = document.getElementById(densityValId);
    const statusText = document.getElementById(statusTextId);

    const g = 10;
    const surfaceY = 60;
    const groundY = 190;

    function draw(volume, density) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const archimedesForce = Math.round(density * g * volume);

        // 1. Бассейн с жидкостью
        ctx.fillStyle = "rgba(0, 242, 254, 0.25)";
        ctx.fillRect(50, surfaceY, canvas.width - 100, groundY - surfaceY);

        // Поверхность воды
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, surfaceY);
        ctx.lineTo(canvas.width - 50, surfaceY);
        ctx.stroke();

        // 2. Погруженное тело (куб/брусок, размеры зависят от объема V)
        const bodySize = Math.sqrt(volume * 350000); // визуальный размер
        const bodyX = canvas.width / 2 - bodySize / 2;
        const bodyY = surfaceY + 20;

        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(bodyX, bodyY, bodySize, bodySize);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bodyX, bodyY, bodySize, bodySize);

        // Текст на теле
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`V = ${volume.toFixed(2)} м³`, bodyX + 8, bodyY + bodySize / 2);

        // 3. Стрелка выталкивающей силы (направлена строго вверх от центра тела)
        const centerX = canvas.width / 2;
        const arrowLength = Math.min(80, archimedesForce * 0.15); // визуальная длина стрелки

        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, bodyY + bodySize / 2);
        ctx.lineTo(centerX, bodyY + bodySize / 2 - arrowLength - 15);
        ctx.lineTo(centerX - 4, bodyY + bodySize / 2 - arrowLength - 5);
        ctx.moveTo(centerX, bodyY + bodySize / 2);
        ctx.lineTo(centerX + 4, bodyY + bodySize / 2 - arrowLength - 5);
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`F_арх = ${archimedesForce} Н`, centerX + 15, bodyY + bodySize / 2 - arrowLength / 2);
    }

    function update() {
        const volume = parseFloat(volumeSlider.value);
        const density = parseInt(densitySlider.value);
        const archimedesForce = Math.round(density * g * volume);

        if (volumeValSpan) volumeValSpan.textContent = volume.toFixed(2);
        if (densityValSpan) densityValSpan.textContent = density;

        if (statusText) {
            statusText.textContent = `Архимедова сила: F_арх = ${density} кг/м³ · ${g} Н/кг · ${volume.toFixed(2)} м³ = ${archimedesForce} Н`;
        }

        draw(volume, density);
    }

    if (volumeSlider) volumeSlider.addEventListener('input', update);
    if (densitySlider) densitySlider.addEventListener('input', update);

    // Начальная отрисовка
    draw(parseFloat(volumeSlider.value), parseInt(densitySlider.value));
}
function initBuoyantForceAnimation(canvasId, sliderId, valId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    const statusText = document.getElementById(statusTextId);

    const surfaceY = 80;
    const groundY = 190;
    const maxBodyHeight = 80;
    const bodyWidth = 80;
    const centerX = canvas.width / 2;

    function draw(depthPercent) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Бассейн с водой
        ctx.fillStyle = "rgba(0, 242, 254, 0.25)";
        ctx.fillRect(80, surfaceY, canvas.width - 160, groundY - surfaceY);

        // Линия поверхности воды
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, surfaceY);
        ctx.lineTo(canvas.width - 160, surfaceY);
        ctx.stroke();

        // 2. Расчет положения тела в зависимости от процента погружения (0% - над водой, 100% - полностью под водой)
        // Высота погруженной части
        const submergedHeight = (depthPercent / 100) * maxBodyHeight;
        const bodyTopY = surfaceY - (maxBodyHeight - submergedHeight); 
        const bodyX = centerX - bodyWidth / 2;

        // Рисуем тело (брусок)
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(bodyX, bodyTopY, bodyWidth, maxBodyHeight);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bodyX, bodyTopY, bodyWidth, maxBodyHeight);

        // Текст на теле
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText("Тело", bodyX + 26, bodyTopY + maxBodyHeight / 2 + 4);

        // 3. Стрелка выталкивающей силы (растет по мере увеличения погружения)
        if (depthPercent > 0) {
            const arrowLength = (depthPercent / 100) * 60; // визуальная высота стрелки
            const arrowBaseY = surfaceY + submergedHeight / 2;

            ctx.strokeStyle = "#facc15";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(centerX, arrowBaseY + arrowLength / 2);
            ctx.lineTo(centerX, arrowBaseY - arrowLength / 2);
            // Наконечник стрелки вверх
            ctx.lineTo(centerX - 4, arrowBaseY - arrowLength / 2 + 6);
            ctx.moveTo(centerX, arrowBaseY - arrowLength / 2);
            ctx.lineTo(centerX + 4, arrowBaseY - arrowLength / 2 + 6);
            ctx.stroke();

            ctx.fillStyle = "#facc15";
            ctx.font = "12px 'Outfit', sans-serif";
            ctx.fillText(`F_выт (${depthPercent}%)`, centerX + 15, arrowBaseY);
        }
    }

    function update() {
        const depthPercent = parseInt(slider.value);
        if (valSpan) valSpan.textContent = depthPercent;

        if (statusText) {
            if (depthPercent === 0) {
                statusText.textContent = `Тело над водой (0%): выталкивающая сила со стороны воды равна нулю.`;
            } else if (depthPercent === 100) {
                statusText.textContent = `Тело полностью погружено (100%): выталкивающая сила достигает максимума, так как задействован весь объем тела.`;
            } else {
                statusText.textContent = `Погружение на ${depthPercent}%: выталкивающая сила пропорциональна объему погруженной части тела.`;
            }
        }

        draw(depthPercent);
    }

    if (slider) {
        slider.addEventListener('input', update);
    }

    // Начальная отрисовка
    draw(parseInt(slider.value));
}
function initFloatingConditionsAnimation(canvasId, sliderId, valId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    const statusText = document.getElementById(statusTextId);

    const surfaceY = 80;
    const groundY = 190;
    const waterDensity = 1000; // кг/м³
    const bodySize = 60;
    const centerX = canvas.width / 2;

    function draw(bodyDensity) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Бассейн с водой
        ctx.fillStyle = "rgba(0, 242, 254, 0.25)";
        ctx.fillRect(80, surfaceY, canvas.width - 160, groundY - surfaceY);

        // Линия поверхности воды
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, surfaceY);
        ctx.lineTo(canvas.width - 160, surfaceY);
        ctx.stroke();

        // 2. Определение положения тела в зависимости от плотности
        let bodyTopY;
        if (bodyDensity < waterDensity) {
            // Всплывает (часть тела над водой)
            const immersionRatio = bodyDensity / waterDensity; // доля под водой
            const submergedHeight = bodySize * immersionRatio;
            bodyTopY = surfaceY + bodySize * (1 - immersionRatio) - bodySize; 
        } else if (bodyDensity === waterDensity) {
            // Плавает внутри
            bodyTopY = surfaceY + 40;
        } else {
            // Тонет на дно
            bodyTopY = groundY - bodySize;
        }

        const bodyX = centerX - bodySize / 2;

        // Рисуем тело
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(bodyX, bodyTopY, bodySize, bodySize);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bodyX, bodyTopY, bodySize, bodySize);

        // Текст на теле
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`ρ = ${bodyDensity}`, bodyX + 8, bodyTopY + bodySize / 2 + 4);

        // 3. Силы (Сила тяжести вниз, Архимедова сила вверх)
        const bodyCenterY = bodyTopY + bodySize / 2;

        // Стрелка силы тяжести (красная/розовая)
        ctx.strokeStyle = "#ff79c6";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 15, bodyCenterY);
        ctx.lineTo(centerX - 15, bodyCenterY + 40);
        ctx.lineTo(centerX - 18, bodyCenterY + 32);
        ctx.moveTo(centerX - 15, bodyCenterY + 40);
        ctx.lineTo(centerX - 12, bodyCenterY + 32);
        ctx.stroke();

        // Стрелка силы Архимеда (желтая)
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX + 15, bodyCenterY);
        ctx.lineTo(centerX + 15, bodyCenterY - 40);
        ctx.lineTo(centerX + 12, bodyCenterY - 32);
        ctx.moveTo(centerX + 15, bodyCenterY - 40);
        ctx.lineTo(centerX + 18, bodyCenterY - 32);
        ctx.stroke();
    }

    function update() {
        const bodyDensity = parseInt(slider.value);
        if (valSpan) valSpan.textContent = bodyDensity;

        if (statusText) {
            if (bodyDensity < waterDensity) {
                statusText.textContent = `Плотность тела меньше воды (${bodyDensity} < 1000 кг/м³): тело всплывает и плавает на поверхности, пока силы не скомпенсируются.`;
            } else if (bodyDensity === waterDensity) {
                statusText.textContent = `Плотность тела равна плотности воды (${bodyDensity} = 1000 кг/м³): тело находится в равновесии внутри жидкости.`;
            } else {
                statusText.textContent = `Плотность тела больше воды (${bodyDensity} > 1000 кг/м³): сила тяжести превосходит выталкивающую силу, и тело тонет на дно.`;
            }
        }

        draw(bodyDensity);
    }

    if (slider) {
        slider.addEventListener('input', update);
    }

    // Начальная отрисовка
    draw(parseInt(slider.value));
}
function initDensityComparisonAnimation(canvasId, sliderId, valId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    const statusText = document.getElementById(statusTextId);

    const surfaceY = 90;
    const groundY = 190;
    const waterDensity = 1000; // кг/м³
    const bodyHeight = 80;
    const bodyWidth = 100;
    const centerX = canvas.width / 2;

    function draw(bodyDensity) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Бассейн с водой
        ctx.fillStyle = "rgba(0, 242, 254, 0.25)";
        ctx.fillRect(80, surfaceY, canvas.width - 160, groundY - surfaceY);

        // Линия поверхности воды
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, surfaceY);
        ctx.lineTo(canvas.width - 160, surfaceY);
        ctx.stroke();

        // 2. Расчет погружения на основе отношения плотностей
        const ratio = bodyDensity / waterDensity; // доля под водой (от 0.2 до 0.9)
        const submergedHeight = bodyHeight * ratio;
        const bodyTopY = surfaceY - (bodyHeight - submergedHeight);
        const bodyX = centerX - bodyWidth / 2;

        // Рисуем плавающий брусок
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(bodyX, bodyTopY, bodyWidth, bodyHeight);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bodyX, bodyTopY, bodyWidth, bodyHeight);

        // Текст на теле
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`ρ тела = ${bodyDensity} кг/м³`, bodyX + 10, bodyTopY + bodyHeight / 2 + 4);

        // Линия уровня погружения (пунктир)
        ctx.strokeStyle = "#facc15";
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(bodyX - 15, surfaceY);
        ctx.lineTo(bodyX + bodyWidth + 15, surfaceY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Процент погружения справа
        ctx.fillStyle = "#facc15";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`Под водой: ${Math.round(ratio * 100)}%`, bodyX + bodyWidth + 20, surfaceY + submergedHeight / 2);
    }

    function update() {
        const bodyDensity = parseInt(slider.value);
        const ratio = bodyDensity / waterDensity;
        const percent = Math.round(ratio * 100);

        if (valSpan) valSpan.textContent = bodyDensity;

        if (statusText) {
            statusText.textContent = `Плотность тела ${bodyDensity} кг/м³ при плотности воды 1000 кг/м³: тело погружено на ${percent}% своего объема.`;
        }

        draw(bodyDensity);
    }

    if (slider) {
        slider.addEventListener('input', update);
    }

    // Начальная отрисовка
    draw(parseInt(slider.value));
}
function initMechanicalWorkAnimation(canvasId, forceSliderId, pathSliderId, forceValId, pathValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const forceSlider = document.getElementById(forceSliderId);
    const pathSlider = document.getElementById(pathSliderId);
    const forceValSpan = document.getElementById(forceValId);
    const pathValSpan = document.getElementById(pathValId);
    const statusText = document.getElementById(statusTextId);

    const groundY = 160;

    function draw(force, path) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const work = force * path;

        // 1. Дорога (линия земли)
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, groundY);
        ctx.lineTo(canvas.width - 50, groundY);
        ctx.stroke();

        // 2. Положение тележки зависит от пройденного пути (масштабируем условно для экрана)
        // Максимальный путь 10м соответствует смещению тележки по горизонтали
        const minX = 80;
        const maxX = canvas.width - 150;
        const cartX = minX + (path / 10) * (maxX - minX);
        const cartWidth = 60;
        const cartHeight = 35;
        const cartY = groundY - cartHeight;

        // Тележка (прямоугольник + колеса)
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(cartX, cartY, cartWidth, cartHeight);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cartX, cartY, cartWidth, cartHeight);

        // Колеса
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(cartX + 15, groundY, 7, 0, Math.PI * 2);
        ctx.arc(cartX + cartWidth - 15, groundY, 7, 0, Math.PI * 2);
        ctx.fill();

        // 3. Стрелка силы, тянущей тележку вправо
        const arrowLength = Math.min(70, force * 1.2);
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cartX + cartWidth, cartY + cartHeight / 2);
        ctx.lineTo(cartX + cartWidth + arrowLength, cartY + cartHeight / 2);
        // Наконечник стрелки вправо
        ctx.lineTo(cartX + cartWidth + arrowLength - 8, cartY + cartHeight / 2 - 5);
        ctx.moveTo(cartX + cartWidth + arrowLength, cartY + cartHeight / 2);
        ctx.lineTo(cartX + cartWidth + arrowLength - 8, cartY + cartHeight / 2 + 5);
        ctx.stroke();

        // Текст силы над стрелкой
        ctx.fillStyle = "#facc15";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`F = ${force} Н`, cartX + cartWidth + 10, cartY + cartHeight / 2 - 10);

        // 4. Метка пути под дорогой
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(minX, groundY + 15);
        ctx.lineTo(cartX + cartWidth / 2, groundY + 15);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`Путь s = ${path} м`, minX + 10, groundY + 30);
    }

    function update() {
        const force = parseInt(forceSlider.value);
        const path = parseInt(pathSlider.value);
        const work = force * path;

        if (forceValSpan) forceValSpan.textContent = force;
        if (pathValSpan) pathValSpan.textContent = path;

        if (statusText) {
            statusText.textContent = `Работа: A = ${force} Н · ${path} м = ${work} Дж`;
        }

        draw(force, path);
    }

    if (forceSlider) forceSlider.addEventListener('input', update);
    if (pathSlider) pathSlider.addEventListener('input', update);

    // Начальная отрисовка
    draw(parseInt(forceSlider.value), parseInt(pathSlider.value));
}
function initWorkConditionsAnimation(canvasId, forceSliderId, pathSliderId, forceValId, pathValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const forceSlider = document.getElementById(forceSliderId);
    const pathSlider = document.getElementById(pathSliderId);
    const forceValSpan = document.getElementById(forceValId);
    const pathValSpan = document.getElementById(pathValId);
    const statusText = document.getElementById(statusTextId);

    const groundY = 160;

    function draw(force, path) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const work = force * path;

        // 1. Дорога
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, groundY);
        ctx.lineTo(canvas.width - 50, groundY);
        ctx.stroke();

        // 2. Положение объекта (если путь = 0, объект стоит на месте слева; если путь есть, смещается вправо)
        const minX = 80;
        const maxX = canvas.width - 150;
        const objectX = minX + (path / 10) * (maxX - minX);
        const objWidth = 50;
        const objHeight = 45;
        const objY = groundY - objHeight;

        // Ящик / блок
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(objectX, objY, objWidth, objHeight);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(objectX, objY, objWidth, objHeight);

        // Текст на ящике
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText("Тело", objectX + 12, objY + objHeight / 2 + 4);

        // 3. Стрелка силы (если сила > 0)
        if (force > 0) {
            const arrowLength = 50;
            ctx.strokeStyle = "#facc15";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(objectX + objWidth, objY + objHeight / 2);
            ctx.lineTo(objectX + objWidth + arrowLength, objY + objHeight / 2);
            ctx.lineTo(objectX + objWidth + arrowLength - 8, objY + objHeight / 2 - 5);
            ctx.moveTo(objectX + objWidth + arrowLength, objY + objHeight / 2);
            ctx.lineTo(objectX + objWidth + arrowLength - 8, objY + objHeight / 2 + 5);
            ctx.stroke();

            ctx.fillStyle = "#facc15";
            ctx.font = "11px 'Outfit', sans-serif";
            ctx.fillText(`F = ${force} Н`, objectX + objWidth + 5, objY + objHeight / 2 - 10);
        } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
            ctx.font = "11px 'Outfit', sans-serif";
            ctx.fillText("Силы нет (F = 0)", objectX - 5, objY - 10);
        }

        // Индикатор состояния пути под объектом
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`Путь s = ${path} м`, minX, groundY + 25);
    }

    function update() {
        const force = parseInt(forceSlider.value);
        const path = parseInt(pathSlider.value);
        const work = force * path;

        if (forceValSpan) forceValSpan.textContent = force;
        if (pathValSpan) pathValSpan.textContent = path;

        if (statusText) {
            if (force === 0 && path === 0) {
                statusText.textContent = `Работа не выполняется: нет ни силы, ни движения (A = 0 Дж).`;
            } else if (force === 0) {
                statusText.textContent = `Работа не выполняется: сила равна нулю ($F = 0$), тело движется по инерции. A = 0 Дж.`;
            } else if (path === 0) {
                statusText.textContent = `Работа не выполняется: путь равен нулю ($s = 0$), тело стоит на месте несмотря на силу. A = 0 Дж.`;
            } else {
                statusText.textContent = `Работа успешно совершается: есть и приложенная сила ($F = ${force}$ Н), и путь ($s = ${path}$ м). A = ${work} Дж.`;
            }
        }

        draw(force, path);
    }

    if (forceSlider) forceSlider.addEventListener('input', update);
    if (pathSlider) pathSlider.addEventListener('input', update);

    // Начальная отрисовка
    draw(parseInt(forceSlider.value), parseInt(pathSlider.value));
}
function initPowerAnimation(canvasId, workSliderId, timeSliderId, workValId, timeValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const workSlider = document.getElementById(workSliderId);
    const timeSlider = document.getElementById(timeSliderId);
    const workValSpan = document.getElementById(workValId);
    const timeValSpan = document.getElementById(timeValId);
    const statusText = document.getElementById(statusTextId);

    const groundY = 160;

    function draw(work, time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const power = Math.round(work / time);

        // 1. Дорога
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, groundY);
        ctx.lineTo(canvas.width - 50, groundY);
        ctx.stroke();

        // 2. Визуализация механизма / крана (высота подъема зависит от работы)
        const minX = 80;
        const maxX = canvas.width - 150;
        // Чем больше работа, тем дальше продвигается груз
        const objX = minX + (work / 1000) * (maxX - minX);
        const objWidth = 55;
        const objHeight = 40;
        const objY = groundY - objHeight;

        // Блок / груз
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(objX, objY, objWidth, objHeight);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(objX, objY, objWidth, objHeight);

        // Текст на блоке
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`A = ${work} Дж`, objX + 4, objY + objHeight / 2 + 4);

        // 3. Индикатор скорости / времени (чем меньше время, тем "быстрее" стрелка/мощность)
        const centerX = canvas.width / 2;
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`Время выполнения: t = ${time} с`, minX, groundY + 25);

        // Мощность отображаем динамически
        ctx.fillStyle = "#facc15";
        ctx.font = "13px 'Outfit', sans-serif";
        ctx.fillText(`Мощность N = ${power} Вт`, minX, groundY + 45);
    }

    function update() {
        const work = parseInt(workSlider.value);
        const time = parseInt(timeSlider.value);
        const power = Math.round(work / time);

        if (workValSpan) workValSpan.textContent = work;
        if (timeValSpan) timeValSpan.textContent = time;

        if (statusText) {
            statusText.textContent = `Мощность: N = ${work} Дж / ${time} с = ${power} Вт (${(power / 1000).toFixed(2)} кВт)`;
        }

        draw(work, time);
    }

    if (workSlider) workSlider.addEventListener('input', update);
    if (timeSlider) timeSlider.addEventListener('input', update);

    // Начальная отрисовка
    draw(parseInt(workSlider.value), parseInt(timeSlider.value));
}
window.initTorqueAnimation = function (canvasId, forceSliderId, armSliderId, forceValId, armValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const forceSlider = document.getElementById(forceSliderId);
    const armSlider = document.getElementById(armSliderId);
    const forceValSpan = document.getElementById(forceValId);
    const armValSpan = document.getElementById(armValId);
    const statusText = document.getElementById(statusTextId);

    const pivotX = 150; // точка опоры / ось вращения
    const beamY = 130;

    function draw(force, arm) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const torque = force * arm;

        // 1. Опора (треугольник)
        ctx.fillStyle = "#00f2fe";
        ctx.beginPath();
        ctx.moveTo(pivotX, beamY);
        ctx.lineTo(pivotX - 15, beamY + 30);
        ctx.lineTo(pivotX + 15, beamY + 30);
        ctx.closePath();
        ctx.fill();

        // 2. Рычаг (стержень)
        // Максимальное плечо 5м масштабируем в пиксели (например, 1м = 50px)
        const scale = 50;
        const beamLength = 5 * scale; // общая длина в одну сторону для шкалы
        const currentArmPx = arm * scale;

        ctx.strokeStyle = "#ff79c6";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(pivotX - 50, beamY);
        ctx.lineTo(pivotX + beamLength + 20, beamY);
        ctx.stroke();

        // Метки делений плеча на рычаге
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.moveTo(pivotX + i * scale, beamY - 6);
            ctx.lineTo(pivotX + i * scale, beamY + 6);
            ctx.stroke();
        }

        // Ось вращения (точка)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(pivotX, beamY, 5, 0, Math.PI * 2);
        ctx.fill();

        // 3. Точка приложения силы и стрелка вниз/вверх
        const forceX = pivotX + currentArmPx;
        const arrowHeight = Math.min(70, force * 1.2);

        // Стрелка силы (желтая)
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(forceX, beamY);
        ctx.lineTo(forceX, beamY + arrowHeight);
        ctx.lineTo(forceX - 4, beamY + arrowHeight - 8);
        ctx.moveTo(forceX, beamY + arrowHeight);
        ctx.lineTo(forceX + 4, beamY + arrowHeight - 8);
        ctx.stroke();

        // Текст силы
        ctx.fillStyle = "#facc15";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`F = ${force} Н`, forceX + 10, beamY + arrowHeight / 2);

        // Дуга и обозначение плеча `d`
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(pivotX, beamY - 20);
        ctx.lineTo(forceX, beamY - 20);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`d = ${arm} м`, pivotX + currentArmPx / 2 - 15, beamY - 26);
    }

    function update() {
        const force = parseInt(forceSlider.value);
        const arm = parseFloat(armSlider.value);
        const torque = force * arm;

        if (forceValSpan) forceValSpan.textContent = force;
        if (armValSpan) armValSpan.textContent = arm;

        if (statusText) {
            statusText.textContent = `Момент силы: M = ${force} Н · ${arm} м = ${torque} Н·м`;
        }

        draw(force, arm);
    }

    if (forceSlider) forceSlider.addEventListener('input', update);
    if (armSlider) armSlider.addEventListener('input', update);

    // Начальная отрисовка
    draw(parseInt(forceSlider.value), parseFloat(armSlider.value));
};
window.initLeverArmAnimation = function (canvasId, sliderId, valId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    const statusText = document.getElementById(statusTextId);

    const pivotX = 120; // ось вращения
    const beamY = 130;
    const fixedForce = 20; // постоянная сила для наглядности (Н)

    function draw(arm) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const torque = fixedForce * arm;
        const scale = 60; // масштаб пикселей на метр
        const currentArmPx = arm * scale;

        // 1. Опора (треугольник)
        ctx.fillStyle = "#00f2fe";
        ctx.beginPath();
        ctx.moveTo(pivotX, beamY);
        ctx.lineTo(pivotX - 15, beamY + 30);
        ctx.lineTo(pivotX + 15, beamY + 30);
        ctx.closePath();
        ctx.fill();

        // 2. Рычаг (стержень)
        ctx.strokeStyle = "#ff79c6";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(pivotX - 40, beamY);
        ctx.lineTo(pivotX + 330, beamY);
        ctx.stroke();

        // Ось вращения (точка)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(pivotX, beamY, 5, 0, Math.PI * 2);
        ctx.fill();

        // 3. Точка приложения силы
        const forceX = pivotX + currentArmPx;

        // Стрелка силы (вниз)
        const arrowHeight = 60;
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(forceX, beamY);
        ctx.lineTo(forceX, beamY + arrowHeight);
        ctx.lineTo(forceX - 4, beamY + arrowHeight - 8);
        ctx.moveTo(forceX, beamY + arrowHeight);
        ctx.lineTo(forceX + 4, beamY + arrowHeight - 8);
        ctx.stroke();

        // Подпись силы
        ctx.fillStyle = "#facc15";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`F = ${fixedForce} Н`, forceX + 10, beamY + arrowHeight / 2);

        // 4. Обозначение плеча (отрезок от оси до линии силы с размером)
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(pivotX, beamY - 25);
        ctx.lineTo(forceX, beamY - 25);
        // Засечки для плеча
        ctx.moveTo(pivotX, beamY - 30);
        ctx.lineTo(pivotX, beamY - 20);
        ctx.moveTo(forceX, beamY - 30);
        ctx.lineTo(forceX, beamY - 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Текст плеча
        ctx.fillStyle = "#00f2fe";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`Плечо d = ${arm} м`, pivotX + currentArmPx / 2 - 35, beamY - 35);
    }

    function update() {
        const arm = parseFloat(slider.value);
        const torque = fixedForce * arm;

        if (valSpan) valSpan.textContent = arm;

        if (statusText) {
            statusText.textContent = `При плече d = ${arm} м и силе F = ${fixedForce} Н вращательный момент составляет M = ${torque} Н·м.`;
        }

        draw(arm);
    }

    if (slider) {
        slider.addEventListener('input', update);
    }

    // Начальная отрисовка
    draw(parseFloat(slider.value));
};
window.initLeverEquilibriumAnimation = function (canvasId, forceSliderId, armSliderId, forceValId, armValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const forceSlider = document.getElementById(forceSliderId);
    const armSlider = document.getElementById(armSliderId);
    const forceValSpan = document.getElementById(forceValId);
    const armValSpan = document.getElementById(armValId);
    const statusText = document.getElementById(statusTextId);

    const pivotX = canvas.width / 2;
    const pivotY = 130;
    
    // Фиксированные параметры левой стороны
    const F1 = 20; // Н
    const d1 = 3;  // м
    const M1 = F1 * d1; // 60 Н·м
    const scale = 50; // пикселей на метр

    function draw(F2, d2) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const M2 = F2 * d2;
        
        // Расчет угла наклона рычага в зависимости от разницы моментов (для наглядности качания)
        const diff = M2 - M1;
        const angle = Math.max(-0.25, Math.min(0.25, diff * 0.003));

        // 1. Опора (треугольник)
        ctx.fillStyle = "#00f2fe";
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(pivotX - 15, pivotY + 35);
        ctx.lineTo(pivotX + 15, pivotY + 35);
        ctx.closePath();
        ctx.fill();

        ctx.save();
        ctx.translate(pivotX, pivotY);
        ctx.rotate(angle);

        // 2. Стержень рычага
        ctx.strokeStyle = "#ff79c6";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(-200, 0);
        ctx.lineTo(200, 0);
        ctx.stroke();

        // Ось вращения (точка в центре)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        // 3. Левый груз (фиксированный)
        const leftX = -d1 * scale;
        ctx.fillStyle = "#facc15";
        ctx.fillRect(leftX - 15, 0, 30, 30);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(leftX - 15, 0, 30, 30);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`F₁=${F1}Н`, leftX - 18, -10);

        // 4. Правый груз (регулируемый)
        const rightX = d2 * scale;
        ctx.fillStyle = "#facc15";
        ctx.fillRect(rightX - 15, 0, 30, 30);
        ctx.strokeRect(rightX - 15, 0, 30, 30);

        ctx.fillStyle = "#ffffff";
        ctx.fillText(`F₂=${F2}Н`, rightX - 18, -10);

        ctx.restore();

        // Индикатор равновесия поверх
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText(`Левое плечо d₁ = ${d1} м`, 30, 30);
        ctx.fillText(`Правое плечо d₂ = ${d2} м`, canvas.width - 170, 30);
    }

    function update() {
        const F2 = parseInt(forceSlider.value);
        const d2 = parseFloat(armSlider.value);
        const M2 = F2 * d2;

        if (forceValSpan) forceValSpan.textContent = F2;
        if (armValSpan) armValSpan.textContent = d2;

        if (statusText) {
            if (M1 === M2) {
                statusText.textContent = `Левый момент: ${F1}·${d1} = ${M1} Н·м | Правый момент: ${F2}·${d2} = ${M2} Н·м. Рычаг в идеальном равновесии! 🎉`;
            } else if (M1 > M2) {
                statusText.textContent = `Левый момент (${M1} Н·м) больше правого (${M2} Н·м). Рычаг перевешивает влево!`;
            } else {
                statusText.textContent = `Правый момент (${M2} Н·м) больше левого (${M1} Н·м). Рычаг перевешивает вправо!`;
            }
        }

        draw(F2, d2);
    }

    if (forceSlider) forceSlider.addEventListener('input', update);
    if (armSlider) armSlider.addEventListener('input', update);

    // Начальная отрисовка
    draw(parseInt(forceSlider.value), parseFloat(armSlider.value));
};
window.initFixedPulleyAnimation = function (canvasId, sliderId, valId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    const statusText = document.getElementById(statusTextId);

    const pulleyX = canvas.width / 2;
    const pulleyY = 70;
    const pulleyRadius = 25;

    function draw(mass) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const weight = mass * 10; // Н (при g = 10 м/с²)

        // 1. Потолок / балка
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(pulleyX - 60, 30);
        ctx.lineTo(pulleyX + 60, 30);
        ctx.stroke();

        // Крепление блока к балке
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pulleyX, 30);
        ctx.lineTo(pulleyX, pulleyY - pulleyRadius);
        ctx.stroke();

        // 2. Колесо блока
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.arc(pulleyX, pulleyY, pulleyRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ff79c6";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Ось блока (точка)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(pulleyX, pulleyY, 4, 0, Math.PI * 2);
        ctx.fill();

        // 3. Веревка
        const leftX = pulleyX - pulleyRadius;
        const rightX = pulleyX + pulleyRadius;
        const loadY = 160;

        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        // От груза вверх к левому краю шкива
        ctx.moveTo(leftX, loadY);
        ctx.lineTo(leftX, pulleyY);
        // Огибает шкив
        ctx.arc(pulleyX, pulleyY, pulleyRadius, Math.PI, 0, false);
        // От правого края шкива вниз (рука тянет)
        ctx.lineTo(rightX, pulleyY + 70);
        ctx.stroke();

        // 4. Груз слева
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(leftX - 18, loadY, 36, 30);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(leftX - 18, loadY, 36, 30);

        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`${mass} кг`, leftX - 12, loadY + 18);

        // Стрелка веса груза (вниз)
        ctx.strokeStyle = "#ff4757";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(leftX, loadY + 30);
        ctx.lineTo(leftX, loadY + 55);
        ctx.lineTo(leftX - 4, loadY + 48);
        ctx.moveTo(leftX, loadY + 55);
        ctx.lineTo(leftX + 4, loadY + 48);
        ctx.stroke();

        // 5. Сила тяги справа (вниз)
        const handY = pulleyY + 70;
        ctx.strokeStyle = "#2ed573";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(rightX, pulleyY);
        ctx.lineTo(rightX, handY);
        ctx.lineTo(rightX - 4, handY - 8);
        ctx.moveTo(rightX, handY);
        ctx.lineTo(rightX + 4, handY - 8);
        ctx.stroke();

        // Подпись силы тяги
        ctx.fillStyle = "#2ed573";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`Сила F = ${weight} Н (вниз)`, rightX + 10, pulleyY + 40);
    }

    function update() {
        const mass = parseInt(slider.value);
        const weight = mass * 10;

        if (valSpan) valSpan.textContent = mass;

        if (statusText) {
            statusText.textContent = `Масса груза ${mass} кг (вес ${weight} Н). Неподвижный блок не дает выигрыша в силе ($F = ${weight}$ Н), но меняет направление: мы тянем веревку вниз.`;
        }

        draw(mass);
    }

    if (slider) {
        slider.addEventListener('input', update);
    }

    draw(parseInt(slider.value));
};
window.initMovablePulleyAnimation = function (canvasId, sliderId, valId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    const statusText = document.getElementById(statusTextId);

    const ceilingY = 30;
    const pulleyRadius = 22;

    function draw(mass) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const weight = mass * 10; // Вес груза в Н (при g = 10 м/с²)
        const requiredForce = weight / 2; // Сила человека в Н

        // 1. Потолок / балка
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(150, ceilingY);
        ctx.lineTo(450, ceilingY);
        ctx.stroke();

        // 2. Веревка закреплена одним концом к потолку слева (например, на X = 200)
        const fixedAnchorX = 200;
        const pulleyX = 320; // Центр подвижного блока смещен вправо
        const pulleyY = 120; // Подвижный блок висит ниже

        // 3. Рисуем веревку:
        // От левой точки потолка вниз к левой стороне блока, огибает блок, уходит вверх направо к руке
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        // Левая ветвь (от потолка к блоку)
        ctx.moveTo(fixedAnchorX, ceilingY);
        ctx.lineTo(fixedAnchorX, pulleyY);
        // Огибает подвижный шкив
        ctx.arc(pulleyX, pulleyY, pulleyRadius, Math.PI, 0, false);
        // Правая ветвь (от блока вверх к руке / силе)
        ctx.lineTo(pulleyX + pulleyRadius, ceilingY);
        ctx.stroke();

        // Точка крепления веревки к потолку
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(fixedAnchorX, ceilingY, 4, 0, Math.PI * 2);
        ctx.fill();

        // 4. Шкив подвижного блока
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.arc(pulleyX, pulleyY, pulleyRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ff79c6";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Ось подвижного блока (точка)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(pulleyX, pulleyY, 4, 0, Math.PI * 2);
        ctx.fill();

        // 5. Груз под блоком
        const loadX = pulleyX - 18;
        const loadY = pulleyY + pulleyRadius + 10;
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(loadX, loadY, 36, 35);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(loadX, loadY, 36, 35);

        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`${mass} кг`, loadX + 6, loadY + 22);

        // Стрелка веса груза (вниз)
        ctx.strokeStyle = "#ff4757";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(pulleyX, loadY + 35);
        ctx.lineTo(pulleyX, loadY + 70);
        ctx.lineTo(pulleyX - 4, loadY + 62);
        ctx.moveTo(pulleyX, loadY + 35);
        ctx.lineTo(pulleyX + 4, loadY + 62);
        ctx.stroke();

        ctx.fillStyle = "#ff4757";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`Вес P = ${weight} Н`, pulleyX + 8, loadY + 55);

        // 6. Сила тяги человека (вверх/вдоль правой ветви)
        const handX = pulleyX + pulleyRadius;
        ctx.strokeStyle = "#2ed573";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(handX, ceilingY + 50);
        ctx.lineTo(handX, ceilingY + 15);
        ctx.lineTo(handX - 4, ceilingY + 22);
        ctx.moveTo(handX, ceilingY + 50);
        ctx.lineTo(handX + 4, ceilingY + 22);
        ctx.stroke();

        ctx.fillStyle = "#2ed573";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`F = ${requiredForce} Н`, handX + 10, ceilingY + 35);
    }

    function update() {
        const mass = parseInt(slider.value);
        const weight = mass * 10;
        const requiredForce = weight / 2;

        if (valSpan) valSpan.textContent = mass;

        if (statusText) {
            statusText.textContent = `Груз массой ${mass} кг имеет вес ${weight} Н. Благодаря подвижному блоку прикладываемая сила равна всего F = ${requiredForce} Н (выигрыш в силе в 2 раза).`;
        }

        draw(mass);
    }

    if (slider) {
        slider.addEventListener('input', update);
    }

    draw(parseInt(slider.value));
};
window.initInclinedPlaneAnimation = function (canvasId, massSliderId, lengthSliderId, massValId, lengthValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const massSlider = document.getElementById(massSliderId);
    const lengthSlider = document.getElementById(lengthSliderId);
    const massValSpan = document.getElementById(massValId);
    const lengthValSpan = document.getElementById(lengthValId);
    const statusText = document.getElementById(statusTextId);

    const fixedHeight = 120; // фиксированная высота подъема в пикселях (соответствует 2 метрам)
    const startX = 80;
    const groundY = 190;

    function draw(mass, lengthMeters) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const weight = mass * 10; // Вес в Н
        const realHeightM = 2; // Высота h = 2 м
        const force = weight * (realHeightM / lengthMeters); // Требуемая сила

        // Масштабирование длины плоскости в пиксели
        // 3 метра -> 220px, 8 метров -> 480px
        const planePixelLength = 150 + lengthMeters * 45;

        const topX = startX + planePixelLength;
        const topY = groundY - fixedHeight;

        // 1. Опорная земля и треугольник наклонной плоскости
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Земля горизонтальная
        ctx.moveTo(40, groundY);
        ctx.lineTo(canvas.width - 40, groundY);
        ctx.stroke();

        // Наклонная плоскость (гипотенуза)
        ctx.strokeStyle = "#ff79c6";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(startX, groundY);
        ctx.lineTo(topX, topY);
        // Вертикальная стенка (высота h)
        ctx.lineTo(topX, groundY);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = "rgba(255, 121, 198, 0.05)";
        ctx.fill();

        // Подписи высоты и длины
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`h = ${realHeightM} м`, topX + 10, groundY - fixedHeight / 2);
        ctx.fillText(`l = ${lengthMeters} м`, startX + planePixelLength / 2 - 20, groundY + 20);

        // 2. Блок / тележка на плоскости (расположим примерно посередине)
        const progress = 0.5;
        const boxX = startX + (topX - startX) * progress;
        const boxY = groundY - (groundY - topY) * progress;

        ctx.save();
        ctx.translate(boxX, boxY);
        // Угол наклона плоскости
        const angle = Math.atan2(topY - groundY, topX - startX);
        ctx.rotate(angle);

        // Сам груз
        ctx.fillStyle = "#facc15";
        ctx.fillRect(-18, -24, 36, 24);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-18, -24, 36, 24);

        ctx.fillStyle = "#1e1b4b";
        ctx.font = "10px 'Outfit', sans-serif";
        ctx.fillText(`${mass}кг`, -12, -9);

        ctx.restore();

        // 3. Вектор силы тяги (вдоль плоскости вверх)
        ctx.strokeStyle = "#2ed573";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(boxX, boxY);
        // Направление вектора силы вверх вдоль наклона
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        const arrowLen = 50;
        ctx.lineTo(boxX - dx * arrowLen, boxY - dy * arrowLen);
        ctx.stroke();

        // Текст силы
        ctx.fillStyle = "#2ed573";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`F = ${Math.round(force)} Н`, boxX - 30, boxY - 20);
    }

    function update() {
        const mass = parseInt(massSlider.value);
        const lengthM = parseInt(lengthSlider.value);
        const weight = mass * 10;
        const realHeightM = 2;
        const force = (weight * realHeightM / lengthM).toFixed(1);
        const advantage = (lengthM / realHeightM).toFixed(1);

        if (massValSpan) massValSpan.textContent = mass;
        if (lengthValSpan) lengthValSpan.textContent = lengthM;

        if (statusText) {
            statusText.textContent = `Для подъема груза весом ${weight} Н по плоскости длиной ${lengthM} м нужна сила F = ${force} Н. Выигрыш в силе составляет в ${advantage} раза.`;
        }

        draw(mass, lengthM);
    }

    if (massSlider) massSlider.addEventListener('input', update);
    if (lengthSlider) lengthSlider.addEventListener('input', update);

    draw(parseInt(massSlider.value), parseInt(lengthSlider.value));
};
window.initGoldenRuleAnimation = function (canvasId, sliderId, valId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    const statusText = document.getElementById(statusTextId);

    const fixedWork = 100; // Постоянная работа 100 Дж (например, Вес P = 100 Н, высота h = 1 м)
    const baseForce = 100; // Н
    const basePath = 1;    // м

    function draw(advantage) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const currentForce = baseForce / advantage;
        const currentPath = basePath * advantage;

        // Линия горизонта / опоры
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 160);
        ctx.lineTo(canvas.width - 40, 160);
        ctx.stroke();

        // Визуализация двух шкалок: Сила и Путь
        // 1. Шкала силы (чем больше выигрыш, тем меньше столбик силы)
        const barStartX = 80;
        const maxBarHeight = 100;
        
        // Сила
        const forceBarHeight = (currentForce / 100) * maxBarHeight;
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(barStartX, 160 - forceBarHeight, 50, forceBarHeight);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(barStartX, 160 - forceBarHeight, 50, forceBarHeight);

        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`Сила F`, barStartX + 8, 175);
        ctx.fillText(`${currentForce} Н`, barStartX + 5, 160 - forceBarHeight - 8);

        // 2. Шкала пути (чем больше выигрыш, тем длиннее столбик пути)
        const pathStartX = 240;
        const pathBarHeight = currentPath * 30; // масштабируем метры в пиксели
        
        ctx.fillStyle = "#facc15";
        ctx.fillRect(pathStartX, 160 - pathBarHeight, 50, pathBarHeight);
        ctx.strokeRect(pathStartX, 160 - pathBarHeight, 50, pathBarHeight);

        ctx.fillStyle = "#ffffff";
        ctx.fillText(`Путь s`, pathStartX + 10, 175);
        ctx.fillText(`${currentPath} м`, pathStartX + 10, 160 - pathBarHeight - 8);

        // 3. Информационный блок справа: Произведение (Работа)
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(380, 50, 180, 100);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.strokeRect(380, 50, 180, 100);

        ctx.fillStyle = "#00f2fe";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText("Закон сохранения работы:", 395, 75);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`A = F · s`, 395, 100);
        ctx.fillText(`A = ${currentForce} Н · ${currentPath} м`, 395, 120);
        ctx.fillStyle = "#2ed573";
        ctx.fillText(`A = ${fixedWork} Дж (константа)`, 395, 140);
    }

    function update() {
        const advantage = parseInt(slider.value);
        const currentForce = baseForce / advantage;
        const currentPath = basePath * advantage;

        if (valSpan) valSpan.textContent = advantage;

        if (statusText) {
            statusText.textContent = `Выигрыш в силе в ${advantage} раза: сила уменьшилась до ${currentForce} Н, но путь увеличился до ${currentPath} м. Работа осталась равной ${fixedWork} Дж!`;
        }

        draw(advantage);
    }

    if (slider) {
        slider.addEventListener('input', update);
    }

    draw(parseInt(slider.value));
};
window.initEfficiencyAnimation = function (canvasId, usefulSliderId, totalSliderId, usefulValId, totalValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const usefulSlider = document.getElementById(usefulSliderId);
    const totalSlider = document.getElementById(totalSliderId);
    const usefulValSpan = document.getElementById(usefulValId);
    const totalValSpan = document.getElementById(totalValId);
    const statusText = document.getElementById(statusTextId);

    function draw(useful, total) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Защита: затраченная работа не может быть меньше полезной
        if (total < useful) total = useful;

        const efficiency = Math.round((useful / total) * 100);
        const losses = total - useful;

        const startX = 50;
        const barMaxWidth = 320;
        const maxScaleWork = 150; // максимальное значение шкалы в джоулях

        // 1. Затраченная работа (общий объем энергии)
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`Затраченная работа (A_затр = ${total} Дж)`, startX, 45);

        const totalWidth = (total / maxScaleWork) * barMaxWidth;
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(startX, 55, totalWidth, 22);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(startX, 55, barMaxWidth, 22); // контур максимума

        // 2. Распределение затраченной работы (Полезная + Потери)
        ctx.fillText(`Распределение энергии:`, startX, 105);

        const usefulWidth = (useful / maxScaleWork) * barMaxWidth;
        const lossWidth = (losses / maxScaleWork) * barMaxWidth;
        const lossStartX = startX + usefulWidth;

        // Полезная работа (зеленый)
        ctx.fillStyle = "#2ed573";
        ctx.fillRect(startX, 115, usefulWidth, 22);
        ctx.strokeRect(startX, 115, barMaxWidth, 22); // контур

        // Потери / трение (красный)
        if (losses > 0) {
            ctx.fillStyle = "#ff4757";
            ctx.fillRect(lossStartX, 115, lossWidth, 22);
        }

        // Подписи частей внутри или возле шкалы
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`Полезная: ${useful} Дж`, startX, 158);
        ctx.fillText(`Потери: ${losses} Дж`, startX + 160, 158);

        // Итоговый КПД крупно справа
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(400, 45, 175, 95);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.strokeRect(400, 45, 175, 95);

        ctx.fillStyle = "#00f2fe";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText("Коэффициент КПД:", 415, 70);

        ctx.fillStyle = "#facc15";
        ctx.font = "20px 'Outfit', sans-serif";
        ctx.fillText(`η = ${efficiency}%`, 415, 105);
    }

    function update() {
        let useful = parseInt(usefulSlider.value);
        let total = parseInt(totalSlider.value);

        // Автокоррекция если полезная ползунком превысила затраченную
        if (useful > total) {
            total = useful;
            totalSlider.value = total;
        }

        const efficiency = Math.round((useful / total) * 100);
        const losses = total - useful;

        if (usefulValSpan) usefulValSpan.textContent = useful;
        if (totalValSpan) totalValSpan.textContent = total;

        if (statusText) {
            statusText.textContent = `КПД: (${useful} Дж / ${total} Дж) · 100% = ${efficiency}%. Потери энергии на трение составляют ${losses} Дж.`;
        }

        draw(useful, total);
    }

    if (usefulSlider) usefulSlider.addEventListener('input', update);
    if (totalSlider) totalSlider.addEventListener('input', update);

    draw(parseInt(usefulSlider.value), parseInt(totalSlider.value));
};
window.initKineticEnergyAnimation = function (canvasId, massSliderId, velocitySliderId, massValId, velocityValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const massSlider = document.getElementById(massSliderId);
    const velocitySlider = document.getElementById(velocitySliderId);
    const massValSpan = document.getElementById(massValId);
    const velocityValSpan = document.getElementById(velocityValId);
    const statusText = document.getElementById(statusTextId);

    function draw(mass, velocity) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const energy = 0.5 * mass * velocity * velocity;

        // Линия дороги
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 140);
        ctx.lineTo(canvas.width - 40, 140);
        ctx.stroke();

        // 1. Рисуем объект (машинку/блок)
        // Размер объекта визуально зависит от массы
        const boxWidth = 30 + mass * 3;
        const boxHeight = 25;
        const boxX = 60;
        const boxY = 140 - boxHeight;

        ctx.fillStyle = "#facc15";
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Колеса
        ctx.fillStyle = "#ff79c6";
        ctx.beginPath();
        ctx.arc(boxX + 10, 140, 6, 0, Math.PI * 2);
        ctx.arc(boxX + boxWidth - 10, 140, 6, 0, Math.PI * 2);
        ctx.fill();

        // Текст на объекте
        ctx.fillStyle = "#1e1b4b";
        ctx.font = "10px 'Outfit', sans-serif";
        ctx.fillText(`${mass} кг`, boxX + 4, boxY + 16);

        // 2. Вектор скорости (стрелка вправо)
        const arrowLen = velocity * 10;
        ctx.strokeStyle = "#2ed573";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(boxX + boxWidth, boxY + boxHeight / 2);
        ctx.lineTo(boxX + boxWidth + arrowLen, boxY + boxHeight / 2);
        // Наконечник стрелки
        ctx.lineTo(boxX + boxWidth + arrowLen - 6, boxY + boxHeight / 2 - 4);
        ctx.moveTo(boxX + boxWidth + arrowLen, boxY + boxHeight / 2);
        ctx.lineTo(boxX + boxWidth + arrowLen - 6, boxY + boxHeight / 2 + 4);
        ctx.stroke();

        ctx.fillStyle = "#2ed573";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`v = ${velocity} м/с`, boxX + boxWidth + 10, boxY + 5);

        // 3. Информационный блок энергии справа
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(360, 30, 200, 95);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.strokeRect(360, 30, 200, 95);

        ctx.fillStyle = "#00f2fe";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText("Кинетическая энергия:", 375, 55);

        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`E_k = (${mass} · ${velocity}²) / 2`, 375, 80);

        ctx.fillStyle = "#facc15";
        ctx.font = "16px 'Outfit', sans-serif";
        ctx.fillText(`E_k = ${energy} Дж`, 375, 110);
    }

    function update() {
        const mass = parseInt(massSlider.value);
        const velocity = parseInt(velocitySlider.value);
        const energy = 0.5 * mass * velocity * velocity;

        if (massValSpan) massValSpan.textContent = mass;
        if (velocityValSpan) velocityValSpan.textContent = velocity;

        if (statusText) {
            statusText.textContent = `Кинетическая энергия: E_k = (${mass} кг · (${velocity} м/с)²) / 2 = ${energy} Дж. При увеличении скорости вдвое энергия вырастает в 4 раза!`;
        }

        draw(mass, velocity);
    }

    if (massSlider) massSlider.addEventListener('input', update);
    if (velocitySlider) velocitySlider.addEventListener('input', update);

    draw(parseInt(massSlider.value), parseInt(velocitySlider.value));
};
window.initPotentialEnergyAnimation = function (canvasId, massSliderId, heightSliderId, massValId, heightValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const massSlider = document.getElementById(massSliderId);
    const heightSlider = document.getElementById(heightSliderId);
    const massValSpan = document.getElementById(massValId);
    const heightValSpan = document.getElementById(heightValId);
    const statusText = document.getElementById(statusTextId);

    const groundY = 190;
    const startX = 100;

    function draw(mass, height) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const energy = mass * 10 * height;

        // 1. Земля (нулевой уровень)
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, groundY);
        ctx.lineTo(canvas.width - 40, groundY);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText("Нулевой уровень (h = 0 м)", 50, groundY + 18);

        // 2. Линия высоты (шкала справа от груза)
        // Масштаб: 1 метр = 13 пикселей
        const pixelHeight = height * 13;
        const boxY = groundY - pixelHeight - 30; // 30 — высота самого груза

        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(startX + 60, groundY);
        ctx.lineTo(startX + 60, boxY + 30);
        ctx.stroke();
        ctx.setLineDash([]); // сброс пунктира

        // Метка высоты
        ctx.fillStyle = "#facc15";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`h = ${height} м`, startX + 70, groundY - pixelHeight / 2);

        // 3. Груз
        const boxWidth = 36 + mass * 2;
        const boxHeight = 30;
        
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(startX, boxY, boxWidth, boxHeight);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(startX, boxY, boxWidth, boxHeight);

        ctx.fillStyle = "#ffffff";
        ctx.font = "10px 'Outfit', sans-serif";
        ctx.fillText(`${mass} кг`, startX + 6, boxY + 18);

        // 4. Информационный блок энергии справа
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(360, 30, 200, 95);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.strokeRect(360, 30, 200, 95);

        ctx.fillStyle = "#00f2fe";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText("Потенциальная энергия:", 375, 55);

        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`E_p = ${mass} · 10 · ${height}`, 375, 80);

        ctx.fillStyle = "#2ed573";
        ctx.font = "16px 'Outfit', sans-serif";
        ctx.fillText(`E_p = ${energy} Дж`, 375, 110);
    }

    function update() {
        const mass = parseInt(massSlider.value);
        const height = parseInt(heightSlider.value);
        const energy = mass * 10 * height;

        if (massValSpan) massValSpan.textContent = mass;
        if (heightValSpan) heightValSpan.textContent = height;

        if (statusText) {
            statusText.textContent = `Потенциальная энергия: E_p = ${mass} кг · 10 Н/кг · ${height} м = ${energy} Дж. При увеличении высоты вдвое энергия возрастает вдвое!`;
        }

        draw(mass, height);
    }

    if (massSlider) massSlider.addEventListener('input', update);
    if (heightSlider) heightSlider.addEventListener('input', update);

    draw(parseInt(massSlider.value), parseInt(heightSlider.value));
};
window.initSpringEnergyAnimation = function (canvasId, stiffSliderId, dispSliderId, stiffValId, dispValId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const stiffSlider = document.getElementById(stiffSliderId);
    const dispSlider = document.getElementById(dispSliderId);
    const stiffValSpan = document.getElementById(stiffValId);
    const dispValSpan = document.getElementById(dispValId);
    const statusText = document.getElementById(statusTextId);

    const centerY = 120;
    const wallX = 80;

    function draw(k, x) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Расчет энергии: E = (k * x^2) / 2
        const energy = 0.5 * k * x * x;

        // 1. Рисуем стену (опору) вертикальную линию с штриховкой
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(wallX, 60);
        ctx.lineTo(wallX, 180);
        ctx.stroke();

        // Штрихи опоры
        ctx.lineWidth = 1.5;
        for (let y = 65; y < 180; y += 15) {
            ctx.beginPath();
            ctx.moveTo(wallX, y);
            ctx.lineTo(wallX - 10, y + 10);
            ctx.stroke();
        }

        // 2. Длина пружины зависит от деформации x
        // x от 0.1 до 1.0 м -> пиксельная длина от 100 до 220 пикселей
        const springLength = 100 + x * 120;
        const endX = wallX + springLength;

        // Рисуем зигзаг пружины
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(wallX, centerY);

        const coils = 8;
        const segmentWidth = springLength / (coils * 2);
        let currentX = wallX;

        for (let i = 0; i < coils; i++) {
            currentX += segmentWidth;
            ctx.lineTo(currentX, centerY - 18);
            currentX += segmentWidth;
            ctx.lineTo(currentX, centerY + 18);
        }
        ctx.lineTo(endX, centerY);
        ctx.stroke();

        // 3. Груз на конце пружины
        const boxWidth = 35;
        const boxHeight = 40;
        const boxX = endX;
        const boxY = centerY - boxHeight / 2;

        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        ctx.fillStyle = "#ffffff";
        ctx.font = "10px 'Outfit', sans-serif";
        ctx.fillText(`x=${x}м`, boxX + 4, boxY + 24);

        // 4. Информационный блок энергии справа
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(360, 30, 200, 95);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.strokeRect(360, 30, 200, 95);

        ctx.fillStyle = "#00f2fe";
        ctx.font = "12px 'Outfit', sans-serif";
        ctx.fillText("Потенциальная энергия:", 375, 55);

        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Outfit', sans-serif";
        ctx.fillText(`E_p = (${k} · ${x}²) / 2`, 375, 80);

        ctx.fillStyle = "#2ed573";
        ctx.font = "16px 'Outfit', sans-serif";
        ctx.fillText(`E_p = ${energy.toFixed(1)} Дж`, 375, 110);
    }

    function update() {
        const k = parseInt(stiffSlider.value);
        const x = parseFloat(dispSlider.value);
        const energy = 0.5 * k * x * x;

        if (stiffValSpan) stiffValSpan.textContent = k;
        if (dispValSpan) dispValSpan.textContent = x.toFixed(1);

        if (statusText) {
            statusText.textContent = `Потенциальная энергия пружины: E_p = (${k} Н/м · (${x} м)²) / 2 = ${energy.toFixed(1)} Дж. Увеличение растяжения вдвое увеличивает энергию в 4 раза!`;
        }

        draw(k, x);
    }

    if (stiffSlider) stiffSlider.addEventListener('input', update);
    if (dispSlider) dispSlider.addEventListener('input', update);

    draw(parseInt(stiffSlider.value), parseFloat(dispSlider.value));
};
window.initEnergyTransformationAnimation = function (canvasId, sliderId, valId, statusTextId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    const statusText = document.getElementById(statusTextId);

    const maxH = 10; // максимальная высота 10 м
    const totalEnergy = 500; // Постоянная полная энергия 500 Дж (при m = 5 кг, g = 10, h_max = 10)
    const mass = 5;
    const groundY = 190;
    const startX = 120;

    function draw(height) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const ep = mass * 10 * height;
        const ek = Math.max(0, totalEnergy - ep);

        // 1. Опора / земля
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, groundY);
        ctx.lineTo(canvas.width - 40, groundY);
        ctx.stroke();

        // 2. Визуализация объекта на высоте
        // Масштаб высоты: 1 м = 13 пикселей
        const pixelHeight = height * 13;
        const boxY = groundY - pixelHeight - 25;

        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(startX - 15, boxY, 30, 25);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(startX - 15, boxY, 30, 25);

        ctx.fillStyle = "#ffffff";
        ctx.font = "10px 'Outfit', sans-serif";
        ctx.fillText(`${height} м`, startX - 10, boxY + 16);

        // 3. Графики (столбики) энергий справа
        const barX1 = 300;
        const barX2 = 380;
        const barX3 = 460;
        const maxBarH = 120;

        // Потенциальная (Ep) - сиреневый
        const epH = (ep / totalEnergy) * maxBarH;
        ctx.fillStyle = "#ff79c6";
        ctx.fillRect(barX1, groundY - epH, 40, epH);
        ctx.strokeRect(barX1, groundY - maxBarH, 40, maxBarH);

        // Кинетическая (Ek) - зеленый
        const ekH = (ek / totalEnergy) * maxBarH;
        ctx.fillStyle = "#2ed573";
        ctx.fillRect(barX2, groundY - ekH, 40, ekH);
        ctx.strokeRect(barX2, groundY - maxBarH, 40, maxBarH);

        // Полная энергия (Ek + Ep) - желтый
        const totalH = maxBarH;
        ctx.fillStyle = "#facc15";
        ctx.fillRect(barX3, groundY - totalH, 40, totalH);
        ctx.strokeRect(barX3, groundY - maxBarH, 40, maxBarH);

        // Подписи под столбиками
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px 'Outfit', sans-serif";
        ctx.fillText("E_p", barX1 + 10, groundY + 15);
        ctx.fillText("E_k", barX2 + 10, groundY + 15);
        ctx.fillText("E_полн", barX3 + 5, groundY + 15);

        // Цифровые значения над столбиками
        ctx.fillText(`${ep} Дж`, barX1 - 2, groundY - epH - 8);
        ctx.fillText(`${ek} Дж`, barX2 - 2, groundY - ekH - 8);
        ctx.fillText(`${totalEnergy} Дж`, barX3 - 5, groundY - totalH - 8);
    }

    function update() {
        const height = parseInt(slider.value);
        const ep = mass * 10 * height;
        const ek = totalEnergy - ep;

        if (valSpan) valSpan.textContent = height;

        if (statusText) {
            statusText.textContent = `На высоте h = ${height} м: Потенциальная энергия E_p = ${ep} Дж, Кинетическая энергия E_k = ${ek} Дж. Их сумма неизменна: ${totalEnergy} Дж.`;
        }

        draw(height);
    }

    if (slider) {
        slider.addEventListener('input', update);
    }

    draw(parseInt(slider.value));
}