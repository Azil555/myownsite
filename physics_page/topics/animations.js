// 1. Анимация для механического движения (поезд с ползунком)
window.initMotionAnimation = function(canvasId, sliderId, valueId) {
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
window.initCustomOriginAnimation = function(canvasId, infoTextId) {
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
window.initReferenceSystemAnimation = function(canvasId, sliderId, valueId) {
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
window.initTrajectoryAnimation = function(canvasId, btnStraightId, btnCurvedId, statusTextId) {
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
window.initPathAnimation = function(canvasId, sliderId, valueId) {
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
window.initDisplacementAnimation = function(canvasId, sliderId, textInfoId) {
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