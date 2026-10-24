// Анимация изменения внутренней энергии (молоток и атомы)
window.initInternalEnergyAnimation = function () {
    const canvas = document.getElementById('energyCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const hitBtn = document.getElementById('hitButton');
    const status = document.getElementById('energyStatus');

    if (!hitBtn) return;

    let temperature = 20.0; // °C
    let hammerY = -40;      
    let isHitting = false;
    let hitEffect = 0;      

    const atoms = [];
    const rows = 3;
    const cols = 6;
    const startX = 220;
    const startY = 120;
    const spacingX = 40;
    const spacingY = 30;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            atoms.push({
                baseX: startX + c * spacingX,
                baseY: startY + r * spacingY,
                offsetX: 0,
                offsetY: 0
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Металлическая пластина
        let redVal = Math.min(255, Math.floor(50 + (temperature - 20) * 3));
        ctx.fillStyle = `rgb(${redVal}, 70, 150)`;
        ctx.fillRect(180, 100, 260, 90);
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 2;
        ctx.strokeRect(180, 100, 260, 90);

        // Колеблющиеся атомы
        const vibrationSpeed = 0.2 + (temperature - 20) * 0.05;
        const vibrationAmplitude = 1 + (temperature - 20) * 0.15;

        atoms.forEach((atom, index) => {
            atom.offsetX = (Math.sin(Date.now() * vibrationSpeed + index) * vibrationAmplitude);
            atom.offsetY = (Math.cos(Date.now() * vibrationSpeed * 1.3 + index) * vibrationAmplitude);

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(atom.baseX + atom.offsetX, atom.baseY + atom.offsetY, 6, 0, Math.PI * 2);
            ctx.fill();
        });

        // Молоток
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(295, 30 + hammerY, 30, 50);
        ctx.fillStyle = '#854d0e';
        ctx.fillRect(305, 80 + hammerY, 10, 40);

        // Вспышка при ударе
        if (hitEffect > 0) {
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(310, 100, hitEffect * 15, 0, Math.PI * 2);
            ctx.fill();
            hitEffect -= 0.1;
        }

        // Остывание со временем
        if (temperature > 20 && !isHitting) {
            temperature -= 0.02;
            if (temperature < 20) temperature = 20;
            status.textContent = `Температура тела: ${temperature.toFixed(1)} °C`;
        }

        requestAnimationFrame(draw);
    }

    hitBtn.onclick = () => {
        if (isHitting) return;
        isHitting = true;
        hammerY = 20; 
        hitEffect = 1.5; 
        temperature += 4.5; 

        status.textContent = `Температура тела: ${temperature.toFixed(1)} °C (совершена работа!)`;

        setTimeout(() => {
            hammerY = -40; 
            isHitting = false;
        }, 150);
    };

    draw();
};
window.initConductivityAnimation = function () {
    const canvas = document.getElementById('conductivityCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const heatBtn = document.getElementById('heatRodButton');
    const status = document.getElementById('rodStatus');
    if (!heatBtn) return;

    // Массив точек вдоль стержня (температура от 0 до 1)
    const segments = 30;
    const temperatures = new Array(segments).fill(0);
    let isHeatingRod = false;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Если греем, левый край постоянно получает тепло
        if (isHeatingRod) {
            temperatures[0] = 1.0;
        } else {
            // Остывание левого края
            temperatures[0] *= 0.98;
        }

        // Уравнение теплопроводности (каждая точка стремится принять температуру соседей)
        let newTemp = [...temperatures];
        for (let i = 1; i < segments - 1; i++) {
            newTemp[i] = temperatures[i] + 0.15 * (temperatures[i - 1] + temperatures[i + 1] - 2 * temperatures[i]);
        }
        for (let i = 0; i < segments; i++) {
            temperatures[i] = newTemp[i];
        }

        // Рисуем стержень по сегментам
        const segWidth = 500 / segments;
        const startX = 50;
        const startY = 80;
        const segHeight = 40;

        for (let i = 0; i < segments; i++) {
            let t = temperatures[i];
            // Цвет от синего (холодно) до ярко-красного/желтого (горячо)
            let red = Math.floor(20 + t * 235);
            let blue = Math.floor(220 - t * 200);
            let green = Math.floor(40 + t * 100);

            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.fillRect(startX + i * segWidth, startY, segWidth + 1, segHeight);
        }

        // Рамка стержня
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, 500, segHeight);

        // Подписи концов
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Outfit, sans-serif';
        ctx.fillText('Нагрев', startX, startY - 10);
        ctx.fillText('Холодный конец', startX + 400, startY - 10);

        requestAnimationFrame(draw);
    }

    heatBtn.onmousedown = () => { isHeatingRod = true; status.textContent = "Состояние: Идет нагрев слева..."; };
    heatBtn.onmouseup = () => { isHeatingRod = false; status.textContent = "Состояние: Тепло распространяется по стержню"; };
    heatBtn.onmouseleave = () => { isHeatingRod = false; status.textContent = "Состояние: Равновесие"; };

    // Поддержка для телефонов/планшетов (touchstart/touchend)
    heatBtn.ontouchstart = (e) => { e.preventDefault(); isHeatingRod = true; status.textContent = "Состояние: Идет нагрев слева..."; };
    heatBtn.ontouchend = () => { isHeatingRod = false; status.textContent = "Состояние: Тепло распространяется по стержню"; };

    draw();
};
window.initConvectionAnimation = function() {
    const canvas = document.getElementById('convectionCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const btn = document.getElementById('convectionBtn');
    const status = document.getElementById('convectionStatus');
    if (!btn) return;

    let isHeating = false;

    // Создаем частицы воздуха для циркуляции
    const particles = [];
    const count = 40;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * 500 + 50,
            y: Math.random() * 140 + 40,
            speedY: 0,
            speedX: 0,
            temp: 0.2 
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Контур комнаты, окна и батареи
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 20, 520, 170);

        // Окно справа
        ctx.fillStyle = 'rgba(0, 242, 254, 0.1)';
        ctx.fillRect(500, 40, 45, 120);
        ctx.strokeStyle = '#00f2fe';
        ctx.strokeRect(500, 40, 45, 120);
        
        ctx.fillStyle = '#7dd3fc';
        ctx.font = '10px Outfit, sans-serif';
        ctx.fillText('Окно', 510, 32);

        // Батарея слева снизу
        ctx.fillStyle = isHeating ? '#ff4500' : '#475569';
        ctx.fillRect(60, 140, 50, 40);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Батарея', 65, 132);

        // Движение частиц
        particles.forEach(p => {
            if (isHeating) {
                if (p.x < 140 && p.y > 50) {
                    p.speedY = -1.2;
                    p.speedX = 0.5;
                    p.temp = Math.min(1, p.temp + 0.05);
                } else if (p.y < 50 && p.x < 500) {
                    p.speedY = 0;
                    p.speedX = 1.5;
                } else if (p.x > 450 && p.y < 160) {
                    p.speedY = 1.0;
                    p.speedX = -0.3;
                    p.temp = Math.max(0.1, p.temp - 0.05);
                } else {
                    p.speedY = 0;
                    p.speedX = -1.0;
                }
            } else {
                p.speedX *= 0.95;
                p.speedY *= 0.95;
                p.temp = 0.2;
            }

            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 50) p.x = 550;
            if (p.x > 550) p.x = 50;
            if (p.y < 30) p.y = 180;
            if (p.y > 180) p.y = 30;

            let red = Math.floor(50 + p.temp * 205);
            let blue = Math.floor(250 - p.temp * 200);
            ctx.fillStyle = `rgb(${red}, 100, ${blue})`;

            ctx.beginPath();
            ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    btn.onclick = () => {
        isHeating = !isHeating;
        if (isHeating) {
            btn.style.background = '#ff4500';
            btn.textContent = '❄️ Выключить батарею';
            status.textContent = 'Состояние: Идет конвекция (нагретый воздух поднимается, холодный опускается)';
        } else {
            btn.style.background = '#8a2be2';
            btn.textContent = '🔥 Включить батарею';
            status.textContent = 'Состояние: Воздух неподвижен';
        }
    };

    draw();
};

window.initRadiationAnimation = function () {
    const canvas = document.getElementById('radiationCanvas');
    const button = document.getElementById('radiationBtn');
    const status = document.getElementById('radiationStatus');
    if (!canvas || !button) return;

    const ctx = canvas.getContext('2d');
    let isRunning = false;
    let phase = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        phase += isRunning ? 0.08 : 0.02;

        ctx.fillStyle = '#080b18';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(100, 110, 38, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(250, 204, 21, .55)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 6; i++) {
            const y = 45 + i * 25;
            const offset = Math.sin(phase + i) * 6;
            ctx.beginPath();
            ctx.moveTo(145, y);
            ctx.bezierCurveTo(220, y - 20 + offset, 300, y + 20 - offset, 375, y);
            ctx.stroke();
        }

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(485, 110, 28, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = "14px 'Outfit', sans-serif";
        ctx.fillText('Солнце', 72, 175);
        ctx.fillText('Земля', 460, 175);
        ctx.fillText('Электромагнитные волны', 190, 30);
        requestAnimationFrame(draw);
    }

    button.onclick = () => {
        isRunning = !isRunning;
        button.textContent = isRunning ? 'Остановить излучение' : 'Запустить излучение';
        if (status) {
            status.textContent = isRunning
                ? 'Энергия передаётся электромагнитными волнами через пространство.'
                : 'Излучение остановлено.';
        }
    };

    draw();
};
window.initHeatAnimation = function() {
    const canvas = document.getElementById('heatCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const massSlider = document.getElementById('heatMassSlider');
    const tempSlider = document.getElementById('heatTempSlider');
    const massVal = document.getElementById('heatMassVal');
    const tempVal = document.getElementById('heatTempVal');
    const status = document.getElementById('heatStatus');

    if (!massSlider || !tempSlider) return;

    const c = 4200; // удельная теплоемкость воды (Дж / кг·°C)
    const t1 = 20;  // начальная температура

    function updateCalculation() {
        let m = parseFloat(massSlider.value);
        let t2 = parseFloat(tempSlider.value);

        massVal.textContent = m;
        tempVal.textContent = t2;

        let deltaT = t2 - t1;
        let Q = c * m * deltaT;

        status.textContent = `Требуется энергии: Q = ${Q.toLocaleString('ru-RU')} Дж (${(Q / 1000).toFixed(1)} кДж)`;
        return { m, t2, deltaT };
    }

    // Слушаем ползунки
    massSlider.oninput = updateCalculation;
    tempSlider.oninput = updateCalculation;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let { m, t2, deltaT } = updateCalculation();

        // 1. Рисуем сосуд с водой слева
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 3;
        ctx.strokeRect(40, 35, 180, 130);

        // Уровень воды зависит от массы (от 1 до 5 кг)
        let waterHeight = (m / 5) * 110;
        let waterY = 165 - waterHeight;

        // Цвет воды плавно меняется от синего к красному при росте температуры t2
        let heatRatio = (t2 - 20) / 80; 
        let red = Math.floor(50 + heatRatio * 200);
        let blue = Math.floor(250 - heatRatio * 200);
        ctx.fillStyle = `rgba(${red}, 100, ${blue}, 0.35)`;
        ctx.fillRect(42, waterY, 176, waterHeight + (165 - waterY));

        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Outfit, sans-serif';
        ctx.fillText(`Масса (m): ${m} кг`, 75, 90);
        ctx.fillText(`Температура (t₂): ${t2} °C`, 60, 120);

        // 2. Информационный блок справа
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(250, 35, 310, 130);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.strokeRect(250, 35, 310, 130);

        ctx.fillStyle = '#7dd3fc';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText('Параметры расчета в реальном времени:', 270, 60);

        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Outfit, sans-serif';
        ctx.fillText(`• Удельная теплоемкость воды (c): 4200 Дж/(кг·°C)`, 270, 90);
        ctx.fillText(`• Нагрев (Δt = t₂ - t₁): ${t2} - 20 = ${deltaT} °C`, 270, 115);
        ctx.fillText(`• Формула: Q = 4200 · ${m} · ${deltaT}`, 270, 140);

        requestAnimationFrame(draw);
    }

    updateCalculation();
    draw();
};
window.initSpecificHeatAnimation = function() {
    const canvas = document.getElementById('specificHeatCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const status = document.getElementById('materialStatus');

    // Параметры материалов (c в Дж/кг*°C)
    const materials = {
        water: { name: 'Вода', c: 4200, color: '#00f2fe', desc: 'нагревается медленнее всех, так как удерживает максимум энергии.' },
        aluminum: { name: 'Алюминий', c: 920, color: '#a855f7', desc: 'нагревается значительно быстрее воды.' },
        iron: { name: 'Железо', c: 460, color: '#f59e0b', desc: 'быстро раскаляется при получении тепла.' },
        lead: { name: 'Свинец', c: 140, color: '#ef4444', desc: 'нагревается мгновенно, так как теплоемкость очень низкая.' }
    };

    let currentMat = 'water';
    let currentTemp = 20; // начальная температура
    let heatingTime = 0;

    // Глобальная функция смены материала для кнопок из HTML
    window.selectMaterial = function(matKey) {
        if (!materials[matKey]) return;
        currentMat = matKey;
        currentTemp = 20;
        heatingTime = 0;
        status.textContent = `Выбран материал: ${materials[matKey].name} ($$c = ${materials[matKey].c}$$ Дж/(кг·°C)) — ${materials[matKey].desc}`;
        
        // Подсветка активной кнопки
        ['water', 'aluminum', 'iron', 'lead'].forEach(k => {
            let btn = document.getElementById(k === 'aluminum' ? 'btnAl' : (k === 'iron' ? 'btnIron' : (k === 'lead' ? 'btnLead' : 'btnWater')));
            if (btn) {
                btn.style.background = (k === matKey) ? materials[matKey].color : '#475569';
                btn.style.color = (k === matKey) ? '#0b0c10' : '#ffffff';
            }
        });
    };

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let mat = materials[currentMat];

        // Скорость нагрева обратно пропорциональна удельной теплоемкости c
        // Чем больше c, тем медленнее растет температура при той же энергии
        heatingTime += 0.5;
        let targetTemp = 20 + (heatingTime * 15000) / (mat.c * 2);
        if (targetTemp > 120) targetTemp = 120; // ограничим график
        currentTemp = targetTemp;

        // 1. Рисуем брусок / сосуд выбранного вещества
        ctx.fillStyle = mat.color;
        ctx.fillRect(60, 60, 120, 100);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(60, 60, 120, 100);

        ctx.fillStyle = '#0b0c10';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.fillText(mat.name, 75, 115);

        // 2. Шкала термометра (отображение роста температуры)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(230, 40, 310, 140);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.strokeRect(230, 40, 310, 140);

        ctx.fillStyle = '#7dd3fc';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.fillText(`Температура: ${currentTemp.toFixed(1)} °C`, 255, 75);

        // Графическая полоса нагрева
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(255, 95, 260, 20);

        let barWidth = ((currentTemp - 20) / 100) * 260;
        if (barWidth > 260) barWidth = 260;
        ctx.fillStyle = mat.color;
        ctx.fillRect(255, 95, barWidth, 20);

        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Outfit, sans-serif';
        ctx.fillText(`Значение удельной теплоемкости (c): ${mat.c} Дж/(кг·°C)`, 255, 145);
        ctx.fillText(`Энергия тратится на каждый 1 кг вещества`, 255, 165);

        requestAnimationFrame(draw);
    }

    draw();
};
window.initMeltingAnimation = function () {
    const canvas = document.getElementById('meltingCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const heatBtn = document.getElementById('heatButton');
    const coolBtn = document.getElementById('coolButton');
    const status = document.getElementById('meltingStatus');

    if (!heatBtn || !coolBtn) return;

    let temperature = 0.0; // от -20 до 100 °C (0 °C — точка плавления/кристаллизации льда)
    let isHeating = false;
    let isCooling = false;

    // Создаем сетку атомов (кристаллическая решетка)
    const atoms = [];
    const rows = 4;
    const cols = 6;
    const startX = 210;
    const startY = 110;
    const spacingX = 40;
    const spacingY = 35;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            atoms.push({
                baseX: startX + c * spacingX,
                baseY: startY + r * spacingY,
                // Текущие координаты для плавного движения в жидкости
                x: startX + c * spacingX,
                y: startY + r * spacingY,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Определяем фазовое состояние по температуре
        let stateText = "Твердое тело (кристаллическая решетка)";
        let boxColor = '#38bdf8'; // синий (лед)

        if (temperature > 0 && temperature < 5) {
            stateText = "Плавление (температура постоянна T = 0°C)";
            boxColor = '#fbbf24'; // желтый (переход)
        } else if (temperature >= 5) {
            stateText = "Жидкое состояние (разрушены связи)";
            boxColor = '#f87171'; // красный (вода)
        }

        // Контейнер для вещества
        ctx.strokeStyle = boxColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(170, 75, 260, 160);

        // Интенсивность теплового движения
        const vib = Math.max(0, temperature * 0.4);

        atoms.forEach((atom, index) => {
            if (temperature < 2) {
                // Твердое тело: атомы колеблются около узлов решетки
                let targetX = atom.baseX + (Math.sin(Date.now() * 0.01 + index) * vib);
                let targetY = atom.baseY + (Math.cos(Date.now() * 0.012 + index) * vib);
                atom.x += (targetX - atom.x) * 0.2;
                atom.y += (targetY - atom.y) * 0.2;

                // Рисуем связи между соседями в решетке
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 1;
                atoms.forEach(other => {
                    let dist = Math.hypot(atom.baseX - other.baseX, atom.baseY - other.baseY);
                    if (dist > 0 && dist < 45) {
                        ctx.beginPath();
                        ctx.moveTo(atom.x, atom.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                });
            } else {
                // Жидкость: атомы свободно летают и сталкиваются внутри контейнера
                let speedMultiplier = temperature * 0.15;
                atom.x += atom.vx * speedMultiplier;
                atom.y += atom.vy * speedMultiplier;

                // Столкновения со стенками контейнера (170..430, 75..235)
                if (atom.x < 185) { atom.x = 185; atom.vx *= -1; }
                if (atom.x > 415) { atom.x = 415; atom.vx *= -1; }
                if (atom.y < 90) { atom.y = 90; atom.vy *= -1; }
                if (atom.y > 220) { atom.y = 220; atom.vy *= -1; }
            }

            // Рисуем атом
            ctx.fillStyle = temperature >= 5 ? '#60a5fa' : '#ffffff';
            ctx.beginPath();
            ctx.arc(atom.x, atom.y, 7, 0, Math.PI * 2);
            ctx.fill();
        });

        // Нагрев / Остывание
        if (isHeating && temperature < 12) {
            temperature += 0.05;
        } else if (isCooling && temperature > -10) {
            temperature -= 0.05;
            // При остывании до точки кристаллизации плавно возвращаем атомы к базовым позициям
            if (temperature <= 1) {
                atoms.forEach(atom => {
                    atom.x += (atom.baseX - atom.x) * 0.05;
                    atom.y += (atom.baseY - atom.y) * 0.05;
                });
            }
        }

        // Обновляем текст статуса
        status.innerHTML = `Состояние: <b>${stateText}</b><br>Температура: ${temperature.toFixed(1)} °C`;

        requestAnimationFrame(draw);
    }

    // Управление кнопкой нагрева
    heatBtn.onmousedown = () => { isHeating = true; isCooling = false; };
    heatBtn.onmouseup = () => { isHeating = false; };
    heatBtn.onmouseleave = () => { isHeating = false; };

    // Управление кнопкой охлаждения
    coolBtn.onmousedown = () => { isCooling = true; isHeating = false; };
    coolBtn.onmouseup = () => { isCooling = false; };
    coolBtn.onmouseleave = () => { isCooling = false; };

    // Запуск цикла анимации
    draw();
};
window.initEvaporationAnimation = function () {
    const canvas = document.getElementById('evaporationCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const tempSlider = document.getElementById('evapTempSlider');
    const widthSlider = document.getElementById('evapWidthSlider');
    const windCheck = document.getElementById('evapWindCheck');
    const lidCheck = document.getElementById('evapLidCheck');
    const tempVal = document.getElementById('evapTempVal');
    const widthVal = document.getElementById('evapWidthVal');
    const status = document.getElementById('evaporationStatus');

    let temperature = tempSlider ? parseFloat(tempSlider.value) : 20;
    let vesselWidth = widthSlider ? parseFloat(widthSlider.value) : 260;
    let hasWind = windCheck ? windCheck.checked : false;
    let hasLid = lidCheck ? lidCheck.checked : false;

    const TOTAL_MOLECULES = 100;
    const molecules = [];
    const vesselBottom = canvas.height - 30;
    const vesselHeight = 150;

    function initMolecules() {
        molecules.length = 0;
        const vesselLeft = (canvas.width - vesselWidth) / 2;
        for (let i = 0; i < TOTAL_MOLECULES; i++) {
            molecules.push({
                x: vesselLeft + 10 + Math.random() * (vesselWidth - 20),
                y: vesselBottom - 10 - Math.random() * (vesselHeight - 30),
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                state: 'liquid',
                color: '#38bdf8'
            });
        }
    }

    if (tempSlider) {
        tempSlider.oninput = (e) => {
            temperature = parseFloat(e.target.value);
            if (tempVal) tempVal.innerText = `${temperature} °C`;
        };
    }
    if (widthSlider) {
        widthSlider.oninput = (e) => {
            vesselWidth = parseFloat(e.target.value);
            if (widthVal) widthVal.innerText = `${vesselWidth} px`;
        };
    }
    if (windCheck) windCheck.onchange = (e) => { hasWind = e.target.checked; };
    if (lidCheck) lidCheck.onchange = (e) => { hasLid = e.target.checked; };

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const vesselLeft = (canvas.width - vesselWidth) / 2;
        const vesselRight = vesselLeft + vesselWidth;
        const liquidSurfaceY = vesselBottom - vesselHeight + 30;
        const speedMultiplier = 0.4 + (temperature / 30);

        // Ветер
        if (hasWind && !hasLid) {
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
            ctx.lineWidth = 2;
            const time = Date.now() * 0.003;
            for (let i = 0; i < 3; i++) {
                const y = 40 + i * 25;
                const offset = (time * 100 + i * 50) % canvas.width;
                ctx.beginPath();
                ctx.moveTo(offset - 100, y);
                ctx.lineTo(offset, y);
                ctx.stroke();
            }
        }

        // Сосуд
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(vesselLeft, vesselBottom - vesselHeight);
        ctx.lineTo(vesselLeft, vesselBottom);
        ctx.lineTo(vesselRight, vesselBottom);
        ctx.lineTo(vesselRight, vesselBottom - vesselHeight);
        ctx.stroke();

        // Крышка
        if (hasLid) {
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(vesselLeft - 10, 60);
            ctx.lineTo(vesselRight + 10, 60);
            ctx.stroke();
        }

        // Уровень жидкости
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.fillRect(vesselLeft + 2, liquidSurfaceY, vesselWidth - 4, vesselBottom - liquidSurfaceY);

        // Молекулы
        molecules.forEach(m => {
            m.vx += (Math.random() - 0.5) * 0.4 * speedMultiplier;
            m.vy += (Math.random() - 0.5) * 0.4 * speedMultiplier;

            const speed = Math.hypot(m.vx, m.vy);
            const maxSpeed = 2.5 * speedMultiplier;
            if (speed > maxSpeed) {
                m.vx = (m.vx / speed) * maxSpeed;
                m.vy = (m.vy / speed) * maxSpeed;
            }

            m.x += m.vx;
            m.y += m.vy;

            if (m.state === 'liquid') {
                m.color = '#38bdf8';
                if (m.x < vesselLeft + 6) { m.x = vesselLeft + 6; m.vx *= -1; }
                if (m.x > vesselRight - 6) { m.x = vesselRight - 6; m.vx *= -1; }
                if (m.y > vesselBottom - 6) { m.y = vesselBottom - 6; m.vy *= -1; }

                if (m.y < liquidSurfaceY) {
                    if (m.vy < -0.8 && Math.random() < (temperature / 120)) {
                        m.state = 'vapor';
                        m.color = '#f43f5e';
                    } else {
                        m.y = liquidSurfaceY;
                        m.vy *= -0.8;
                    }
                }
            } else if (m.state === 'vapor') {
                if (m.color !== '#a855f7' && Math.abs(m.y - liquidSurfaceY) > 25) {
                    m.color = '#a855f7';
                }

                if (hasWind && !hasLid) m.vx += 0.2;

                if (hasLid) {
                    if (m.y < 60) {
                        m.y = 60;
                        m.state = 'liquid';
                        m.vy = Math.abs(m.vy);
                    }
                    if (m.x < vesselLeft) { m.x = vesselLeft; m.vx *= -1; }
                    if (m.x > vesselRight) { m.x = vesselRight; m.vx *= -1; }
                } else {
                    if (m.y < 0 || m.x > canvas.width + 20 || m.x < -20) {
                        m.x = vesselLeft + 10 + Math.random() * (vesselWidth - 20);
                        m.y = vesselBottom - 15;
                        m.state = 'liquid';
                    }
                }

                if (m.y > liquidSurfaceY && m.x >= vesselLeft && m.x <= vesselRight) {
                    m.state = 'liquid';
                }
            }

            ctx.fillStyle = m.color;
            ctx.beginPath();
            ctx.arc(m.x, m.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });

        if (status) {
            if (hasLid) {
                status.innerHTML = "<b>Закрытый сосуд:</b> Молекулы пара конденсируются на крышке. Динамическое равновесие.";
            } else if (hasWind) {
                status.innerHTML = "<b>Ветер:</b> Уносит вылетевшие молекулы, ускоряя испарение.";
            } else {
                status.innerHTML = `Испарение идет с поверхности при T = ${temperature} °C.`;
            }
        }

        requestAnimationFrame(draw);
    }

    initMolecules();
    draw();
};
window.initBoilingAnimation = function () {
    const canvas = document.getElementById('boilingCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const heatBtn = document.getElementById('boilHeatBtn');
    const coolBtn = document.getElementById('boilCoolBtn');
    const pressureSlider = document.getElementById('boilPressureSlider');
    const pressureVal = document.getElementById('boilPressureVal');
    const status = document.getElementById('boilingStatus');

    if (!heatBtn || !coolBtn) return;

    let temperature = 20.0; // Текущая температура в °C
    let pressure = pressureSlider ? parseFloat(pressureSlider.value) : 1.0; // Атмосферы (атм)
    let isHeating = false;
    let isCooling = false;

    // Пузырьки пара
    const bubbles = [];

    if (pressureSlider) {
        pressureSlider.oninput = (e) => {
            pressure = parseFloat(e.target.value);
            if (pressureVal) pressureVal.innerText = `${pressure.toFixed(1)} атм`;
        };
    }

    heatBtn.onmousedown = () => { isHeating = true; isCooling = false; };
    heatBtn.onmouseup = () => { isHeating = false; };
    heatBtn.onmouseleave = () => { isHeating = false; };

    coolBtn.onmousedown = () => { isCooling = true; isHeating = false; };
    coolBtn.onmouseup = () => { isCooling = false; };
    coolBtn.onmouseleave = () => { isCooling = false; };

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Расчет температуры кипения от давления (при 1 атм = 100°C)
        const boilingTemp = 100 * Math.pow(pressure, 0.25);
        const isBoiling = temperature >= boilingTemp;

        // Нагрев / Остывание
        if (isHeating) {
            // Во время кипения температура НЕ растет!
            if (temperature < boilingTemp) {
                temperature += 0.2;
            } else {
                temperature = boilingTemp;
            }
        } else if (isCooling) {
            if (temperature > 10) {
                temperature -= 0.3;
            }
        } else {
            // Естественное медленное остывание
            if (temperature > 20) temperature -= 0.05;
        }

        // Параметры сосуда
        const vesselX = 170;
        const vesselY = 70;
        const vesselW = 160;
        const vesselH = 180;
        const waterY = vesselY + 40;

        // 1. Отрисовка огня при нагреве
        if (isHeating) {
            ctx.fillStyle = '#f97316';
            for (let i = 0; i < 5; i++) {
                const flameX = vesselX + 20 + i * 30;
                const flameH = 15 + Math.sin(Date.now() * 0.02 + i) * 8;
                ctx.beginPath();
                ctx.arc(flameX, vesselY + vesselH + 10, 10, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 2. Отрисовка стакана
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.strokeRect(vesselX, vesselY, vesselW, vesselH);

        // 3. Вода (меняет цвет от нагрева)
        const heatRatio = Math.min(1, temperature / 120);
        const r = Math.round(56 + heatRatio * 150);
        const g = Math.round(189 - heatRatio * 100);
        const b = Math.round(248 - heatRatio * 100);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
        ctx.fillRect(vesselX + 2, waterY, vesselW - 4, vesselH - (waterY - vesselY) - 2);

        // 4. Поршень / Стрелки давления
        ctx.fillStyle = '#64748b';
        ctx.fillRect(vesselX - 10, vesselY - 10, vesselW + 20, 10);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px sans-serif';
        ctx.fillText(`Давление: ${pressure.toFixed(1)} атм`, vesselX + 25, vesselY - 20);

        // 5. Логика и отрисовка пузырьков (Кипение)
        if (isBoiling) {
            // Генерируем новые пузырьки на дне
            if (Math.random() < 0.6) {
                bubbles.push({
                    x: vesselX + 15 + Math.random() * (vesselW - 30),
                    y: vesselY + vesselH - 10,
                    radius: 2 + Math.random() * 3,
                    speed: 1.5 + Math.random() * 2
                });
            }
        } else if (temperature > boilingTemp * 0.7) {
            // Закипание (мало пузырьков)
            if (Math.random() < 0.1) {
                bubbles.push({
                    x: vesselX + 15 + Math.random() * (vesselW - 30),
                    y: vesselY + vesselH - 10,
                    radius: 1.5,
                    speed: 1
                });
            }
        }

        // Движение пузырьков
        for (let i = bubbles.length - 1; i >= 0; i--) {
            const b = bubbles[i];
            b.y -= b.speed;
            b.radius += 0.03; // Всплывая, пузырек растет!

            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.stroke();

            // Удаляем пузырек, если он достиг поверхности
            if (b.y <= waterY) {
                bubbles.splice(i, 1);
            }
        }

        // Обновляем статус
        let stateText = "Нагревание жидкости";
        if (isBoiling) {
            stateText = "<b>КИПЕНИЕ</b> (Температура не растет!)";
        } else if (temperature > boilingTemp * 0.7) {
            stateText = "Образование пузырьков на дне";
        }

        if (status) {
            status.innerHTML = `Состояние: <b>${stateText}</b><br>` +
                `Температура: <b>${temperature.toFixed(1)} °C</b> | Точка кипения: <b>${boilingTemp.toFixed(1)} °C</b>`;
        }

        requestAnimationFrame(draw);
    }

    draw();
};

window.initGrade8TopicAnimation = function (title, lesson) {
    const canvas = document.getElementById('grade8AnimationCanvas');
    const slider = document.getElementById('grade8AnimationSlider');
    const valueOutput = document.getElementById('grade8AnimationValue');
    const status = document.getElementById('grade8AnimationStatus');
    const toggle = document.getElementById('grade8AnimationToggle');
    if (!canvas || !slider || !valueOutput || !status || !toggle) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;
    let frame = 0;
    let frameRequest = null;
    const number = () => Number(slider.value);
    const format = (value) => value.toLocaleString('ru-RU', { maximumFractionDigits: 2 });

    function updateReadout() {
        const value = number();
        valueOutput.textContent = `${format(value)} ${lesson.unit}`;

        switch (lesson.kind) {
            case 'heat':
                status.textContent = `Для нагрева 0,5 кг воды на ${format(value)} °C нужно около ${format(2100 * value)} Дж.`;
                break;
            case 'specificHeat':
                status.textContent = `Для нагрева ${format(value)} кг воды на 20 °C потребуется ${format(4200 * value * 20)} Дж.`;
                break;
            case 'fuel':
                status.textContent = `При сгорании выделится около ${format(value * 10)} МДж теплоты.`;
                break;
            case 'melting':
                status.textContent = value < 50
                    ? 'Модель: лёд нагревается до температуры плавления.'
                    : 'Модель: во время плавления энергия меняет состояние вещества, а не повышает температуру.';
                break;
            case 'evaporation':
                status.textContent = `При ${format(value)} °C молекулы движутся быстрее, поэтому испарение идёт интенсивнее.`;
                break;
            case 'boiling':
                status.textContent = value < 70
                    ? 'Жидкость нагревается; устойчивое кипение ещё не началось.'
                    : 'Идёт кипение: энергия расходуется на парообразование, температура почти постоянна.';
                break;
            case 'charge':
                status.textContent = `${format(value)} элементарных зарядов одного знака: одноимённые заряды отталкиваются.`;
                break;
            case 'field':
                status.textContent = `В модели напряжённость поля источника равна ${format(value)} усл. ед.`;
                break;
            case 'current':
                status.textContent = `За 1 секунду через сечение проходит заряд ${format(value)} Кл.`;
                break;
            case 'voltage':
                status.textContent = `На каждый кулон заряда поле совершает работу ${format(value)} Дж.`;
                break;
            case 'resistance':
                status.textContent = `При U = 12 В сила тока через этот проводник равна ${format(12 / value)} А.`;
                break;
            case 'ohm':
                status.textContent = `При R = 6 Ом ток равен I = U/R = ${format(value / 6)} А.`;
                break;
            case 'series':
                status.textContent = `Общее сопротивление: R = 4 + ${format(value)} = ${format(4 + value)} Ом.`;
                break;
            case 'parallel': {
                const totalResistance = (6 * value) / (6 + value);
                status.textContent = `При R₁ = 6 Ом общее сопротивление равно ${format(totalResistance)} Ом и меньше сопротивления каждой ветви.`;
                break;
            }
            case 'work':
                status.textContent = `При I = 2 А и t = 10 с работа тока A = UIt = ${format(20 * value)} Дж.`;
                break;
            case 'power':
                status.textContent = `При U = 12 В мощность прибора P = UI = ${format(12 * value)} Вт.`;
                break;
            case 'jouleLenz':
                status.textContent = `За 10 с в резисторе R = 5 Ом выделится Q = I²Rt = ${format(value * value * 50)} Дж.`;
                break;
            case 'lightSources':
                status.textContent = `Источник испускает свет во все стороны. Яркость модели: ${format(value)}%.`;
                break;
            case 'straightLight':
                status.textContent = `Свет идёт по прямым линиям; за непрозрачным препятствием образуется тень.`;
                break;
            case 'reflection':
                status.textContent = `Угол падения α = ${format(value)}°; угол отражения β = ${format(value)}°.`;
                break;
            case 'planeMirror':
                status.textContent = `Изображение находится на ${format(value)} м за зеркалом — на таком же расстоянии, как предмет перед ним.`;
                break;
            case 'refraction': {
                const refractedAngle = Math.asin(Math.sin(value * Math.PI / 180) / 1.5) * 180 / Math.PI;
                status.textContent = `Из воздуха в стекло: угол падения ${format(value)}°, преломления около ${format(refractedAngle)}° — луч отклоняется к нормали.`;
                break;
            }
            case 'convergingLens':
            case 'lensImages': {
                const objectDistance = value;
                if (Math.abs(objectDistance - 1) < 0.06) {
                    status.textContent = 'Предмет около фокуса: после линзы лучи идут почти параллельно, изображение очень далеко.';
                } else if (objectDistance < 1) {
                    status.textContent = 'Изображение мнимое, прямое и увеличенное: предмет находится между линзой и фокусом.';
                } else {
                    const imageDistance = objectDistance / (objectDistance - 1);
                    const magnification = Math.abs(1 / (objectDistance - 1));
                    const imageType = objectDistance > 2 ? 'уменьшенное' : Math.abs(objectDistance - 2) < 0.06 ? 'равное предмету' : 'увеличенное';
                    status.textContent = `Изображение действительное, перевёрнутое и ${imageType}; расстояние до линзы ≈ ${format(imageDistance)}F, увеличение ${format(magnification)}×.`;
                }
                break;
            }
            case 'divergingLens': {
                const imageDistance = -value / (value + 1);
                const magnification = 1 / (value + 1);
                status.textContent = `Изображение мнимое, прямое и уменьшенное; оно находится на ${format(Math.abs(imageDistance))}F от линзы со стороны предмета, увеличение ${format(magnification)}×.`;
                break;
            }
            case 'lensPower':
                status.textContent = `Оптическая сила собирающей линзы D = 1/F = ${(1 / value).toLocaleString('ru-RU', { maximumFractionDigits: 2 })} дптр.`;
                break;
            default:
                status.textContent = 'Изменяйте параметр, чтобы наблюдать за моделью.';
        }
    }

    function text(value, x, y, color = '#e2e8f0', font = '15px Outfit, sans-serif') {
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(value, x, y);
    }

    function drawParticles() {
        const value = number();
        const kind = lesson.kind;
        const midY = 142;
        const particleCount = 9;
        ctx.strokeStyle = 'rgba(148, 163, 184, .55)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(70, midY);
        ctx.lineTo(570, midY);
        ctx.stroke();
        for (let index = 0; index < particleCount; index++) {
            const x = 90 + index * 58;
            const displacement = Math.sin(frame * 0.08 + index) * (2 + value * 0.12);
            ctx.fillStyle = `hsl(${205 - Math.min(value, 100) * 1.1}, 85%, 65%)`;
            ctx.beginPath();
            ctx.arc(x + displacement, midY + Math.cos(frame * 0.07 + index) * displacement, 8, 0, Math.PI * 2);
            ctx.fill();
        }
        text(kind === 'conduction' ? 'Тепло распространяется вдоль тела' : 'Частицы вещества', 190, 205, '#7dd3fc');
        if (kind === 'conduction') {
            const progress = (frame * 2) % 430;
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.arc(80 + progress, midY - 24, 7, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawConvection() {
        const amount = number() / 100;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.strokeRect(205, 64, 230, 150);
        ctx.fillStyle = `rgba(14, 165, 233, ${0.12 + amount * 0.35})`;
        ctx.fillRect(208, 120, 224, 91);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(275, 222, 90, 12);
        for (let i = 0; i < 12; i++) {
            const angle = frame * 0.025 + i * Math.PI / 6;
            const x = 320 + Math.cos(angle) * 70;
            const y = 165 + Math.sin(angle) * 47;
            ctx.fillStyle = `hsl(${200 - amount * 160}, 90%, 65%)`;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        text('Тёплая жидкость поднимается, холодная опускается', 105, 35, '#7dd3fc', '14px Outfit, sans-serif');
    }

    function drawRadiation() {
        const intensity = number() / 100;
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(105, 137, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(540, 137, 27 + intensity * 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(250, 204, 21, ${0.25 + intensity * 0.7})`;
        ctx.lineWidth = 3;
        for (let i = 0; i < 5; i++) {
            const y = 74 + i * 30;
            ctx.beginPath();
            ctx.moveTo(150, y);
            ctx.bezierCurveTo(240, y - 17, 370, y + 17, 505, y);
            ctx.stroke();
        }
        text('Солнце', 76, 200);
        text('Земля', 512, 200);
        text('Энергия проходит через вакуум', 205, 39, '#fde68a');
    }

    function drawLiquidModel() {
        const value = number();
        const amount = value / Number(slider.max);
        const phaseModel = lesson.kind === 'melting' || lesson.kind === 'boiling' || lesson.kind === 'evaporation';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(205, 65);
        ctx.lineTo(220, 218);
        ctx.lineTo(420, 218);
        ctx.lineTo(435, 65);
        ctx.stroke();
        ctx.fillStyle = `rgba(14, 165, 233, ${0.18 + amount * 0.3})`;
        ctx.fillRect(218, 145, 204, 70);
        if (phaseModel) {
            const bubbles = lesson.kind === 'boiling' ? Math.max(2, Math.round(amount * 10)) : Math.round(amount * 5);
            for (let i = 0; i < bubbles; i++) {
                const x = 235 + ((i * 37 + frame * (1 + amount * 3)) % 170);
                const y = 205 - ((frame * (1 + amount * 3) + i * 31) % 75);
                ctx.strokeStyle = '#bae6fd';
                ctx.beginPath();
                ctx.arc(x, y, 3 + (i % 3), 0, Math.PI * 2);
                ctx.stroke();
            }
            for (let i = 0; i < 8; i++) {
                const x = 230 + i * 25 + Math.sin(frame * 0.04 + i) * 7;
                const y = 124 - ((frame + i * 29) % 88);
                ctx.fillStyle = '#c084fc';
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            const barWidth = 35 + amount * 155;
            ctx.fillStyle = '#fb923c';
            ctx.fillRect(320 - barWidth / 2, 119, barWidth, 14);
        }
        ctx.fillStyle = '#f97316';
        for (let i = 0; i < 5; i++) {
            const x = 260 + i * 28;
            const flicker = Math.sin(frame * 0.12 + i) * 5;
            ctx.beginPath();
            ctx.arc(x, 236 - flicker, 6 + amount * 3, 0, Math.PI * 2);
            ctx.fill();
        }
        text('Подвод энергии', 265, 38, '#fdba74');
    }

    function drawChargeModel() {
        const count = Math.round(number());
        for (let i = 0; i < count; i++) {
            const angle = frame * 0.018 + i * (Math.PI * 2 / count);
            const x = 320 + Math.cos(angle) * 150;
            const y = 137 + Math.sin(angle) * 72;
            const directionX = Math.cos(angle);
            const directionY = Math.sin(angle);
            ctx.strokeStyle = '#fda4af';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + directionX * 20, y + directionY * 20);
            ctx.lineTo(x + directionX * 34, y + directionY * 34);
            ctx.lineTo(x + directionX * 28 - directionY * 5, y + directionY * 28 + directionX * 5);
            ctx.moveTo(x + directionX * 34, y + directionY * 34);
            ctx.lineTo(x + directionX * 28 + directionY * 5, y + directionY * 28 - directionX * 5);
            ctx.stroke();
            ctx.fillStyle = '#fb7185';
            ctx.beginPath();
            ctx.arc(x, y, 18, 0, Math.PI * 2);
            ctx.fill();
            text('+', x - 5, y + 6, '#07111f', 'bold 18px sans-serif');
        }
        text('Одноимённые заряды отталкиваются', 180, 35, '#fda4af');
        text('Разноимённые заряды притягиваются', 190, 245, '#7dd3fc');
    }

    function drawFieldModel() {
        const strength = number();
        const centerX = 320;
        const centerY = 137;
        ctx.strokeStyle = 'rgba(125, 211, 252, .65)';
        ctx.lineWidth = 2;
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
            const length = 30 + strength * 8;
            const endX = centerX + Math.cos(angle) * length;
            const endY = centerY + Math.sin(angle) * length;
            ctx.beginPath();
            ctx.moveTo(centerX + Math.cos(angle) * 28, centerY + Math.sin(angle) * 28);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.fillStyle = '#7dd3fc';
            ctx.beginPath();
            ctx.arc(endX, endY, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#fb7185';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
        ctx.fill();
        text('+', centerX - 6, centerY + 7, '#fff', 'bold 24px sans-serif');
        text('Направление поля — сила на положительный пробный заряд', 115, 35, '#7dd3fc', '14px Outfit, sans-serif');
    }

    function drawCircuitModel() {
        const kind = lesson.kind;
        const value = number();
        const current = kind === 'current' || kind === 'power' || kind === 'jouleLenz'
            ? value
            : kind === 'resistance' ? 12 / value
                : kind === 'ohm' ? value / 6
                    : kind === 'series' ? 12 / (4 + value)
                        : kind === 'parallel' ? 12 / ((6 * value) / (6 + value))
                            : kind === 'voltage' ? value / 6
                                : kind === 'work' ? 2
                                    : 1.5;
        const electricalPower = kind === 'jouleLenz' ? current * current * 5
            : kind === 'voltage' ? value * current
                : kind === 'work' ? value * current
                    : kind === 'resistance' ? 12 * current
                        : kind === 'series' || kind === 'parallel' ? 12 * current
                            : kind === 'power' ? 12 * current
                                : 6 * current;
        const glow = Math.min(1, electricalPower / 36);
        const resistorColor = `rgb(${Math.round(80 + glow * 175)}, ${Math.round(100 - glow * 50)}, 70)`;

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(110, 70);
        if (kind === 'parallel') {
            ctx.lineTo(220, 70);
            ctx.moveTo(220, 70);
            ctx.lineTo(220, 105);
            ctx.lineTo(334, 105);
            ctx.moveTo(406, 105);
            ctx.lineTo(500, 105);
            ctx.lineTo(500, 70);
            ctx.lineTo(530, 70);
            ctx.moveTo(220, 70);
            ctx.lineTo(220, 180);
            ctx.lineTo(334, 180);
            ctx.moveTo(406, 180);
            ctx.lineTo(500, 180);
            ctx.lineTo(500, 70);
            ctx.moveTo(220, 70);
            ctx.lineTo(220, 215);
            ctx.moveTo(500, 70);
            ctx.lineTo(500, 215);
        } else {
            const firstResistorEnd = kind === 'series' ? 264 : 354;
            const secondResistorStart = kind === 'series' ? 336 : 426;
            ctx.lineTo(firstResistorEnd, 70);
            if (kind === 'series') {
                ctx.moveTo(336, 70);
                ctx.lineTo(374, 70);
                ctx.moveTo(446, 70);
                ctx.lineTo(530, 70);
            } else {
                ctx.moveTo(secondResistorStart, 70);
                ctx.lineTo(530, 70);
            }
        }
        ctx.lineTo(530, 215);
        ctx.lineTo(110, 215);
        ctx.lineTo(110, 70);
        ctx.stroke();

        ctx.fillStyle = '#facc15';
        ctx.fillRect(102, 125, 16, 35);
        ctx.fillRect(98, 135, 24, 4);
        ctx.fillRect(98, 148, 24, 4);
        text('источник', 72, 183, '#e2e8f0', '12px Outfit, sans-serif');

        const drawResistor = (x, y, label) => {
            ctx.fillStyle = resistorColor;
            ctx.fillRect(x - 36, y - 17, 72, 34);
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 36, y - 17, 72, 34);
            text(label, x - 21, y + 5, '#fff', '13px Outfit, sans-serif');
        };
        if (kind === 'parallel') {
            drawResistor(370, 105, 'R₁');
            drawResistor(370, 180, 'R₂');
        } else if (kind === 'series') {
            drawResistor(300, 70, 'R₁');
            drawResistor(410, 70, 'R₂');
        } else {
            drawResistor(390, 70, 'R');
        }

        const bulbX = 530;
        const bulbY = 145;
        ctx.beginPath();
        ctx.arc(bulbX, bulbY, 21 + glow * 7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 204, 21, ${0.15 + glow * 0.75})`;
        ctx.fill();
        ctx.strokeStyle = '#fde68a';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(bulbX - 8, bulbY - 8);
        ctx.lineTo(bulbX + 8, bulbY + 8);
        ctx.moveTo(bulbX + 8, bulbY - 8);
        ctx.lineTo(bulbX - 8, bulbY + 8);
        ctx.stroke();

        const dots = 14;
        for (let i = 0; i < dots; i++) {
            const phase = (frame * Math.max(0.4, current) * 0.012 + i / dots) % 1;
            const perimeter = 2 * (420 + 145);
            const distance = phase * perimeter;
            let x;
            let y;
            if (distance < 420) {
                x = 110 + distance;
                y = 215;
            } else if (distance < 565) {
                x = 530;
                y = 215 - (distance - 420);
            } else if (distance < 985) {
                x = 530 - (distance - 565);
                y = 70;
            } else {
                x = 110;
                y = 70 + (distance - 985);
            }
            ctx.fillStyle = '#7dd3fc';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        text('Электрическая цепь', 245, 252, '#7dd3fc');
    }

    function drawArrow(x, axisY, tipY, color, label, dashed = false) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;
        ctx.setLineDash(dashed ? [6, 5] : []);
        ctx.beginPath();
        ctx.moveTo(x, axisY);
        ctx.lineTo(x, tipY);
        ctx.stroke();
        const direction = tipY < axisY ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(x, tipY);
        ctx.lineTo(x - 7, tipY + direction * 12);
        ctx.lineTo(x + 7, tipY + direction * 12);
        ctx.closePath();
        ctx.fill();
        ctx.setLineDash([]);
        text(label, x - 12, tipY + (tipY < axisY ? -10 : 20), color, '13px Outfit, sans-serif');
        ctx.restore();
    }

    function drawLightSources() {
        const brightness = number() / 100;
        const centerX = 145;
        const centerY = 137;
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI) / 6;
            const endX = centerX + Math.cos(angle) * 210;
            const endY = centerY + Math.sin(angle) * 105;
            ctx.strokeStyle = `rgba(250, 204, 21, ${0.12 + brightness * 0.45})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX + Math.cos(angle) * 35, centerY + Math.sin(angle) * 25);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        ctx.fillStyle = `rgba(250, 204, 21, ${0.4 + brightness * 0.6})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 27 + brightness * 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(472, 112, 54, 50);
        text('источник света', 98, 194, '#fde68a');
        text('освещённый предмет', 440, 190, '#d8b4fe', '13px Outfit, sans-serif');
        text('Луч света', 273, 44, '#fde68a');
    }

    function drawStraightLight() {
        const sourceX = 90;
        const obstacleX = 310;
        const screenX = 555;
        const halfHeight = number() * 0.75;
        const scale = (screenX - sourceX) / (obstacleX - sourceX);
        const shadowHalfHeight = halfHeight * scale;
        const axisY = 137;

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(sourceX, axisY, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(obstacleX - 10, axisY - halfHeight, 20, halfHeight * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, .9)';
        ctx.fillRect(screenX - 9, axisY - shadowHalfHeight, 18, shadowHalfHeight * 2);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(screenX, 25);
        ctx.lineTo(screenX, 248);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(250, 204, 21, .9)';
        ctx.lineWidth = 2;
        for (const edge of [-1, 1]) {
            const objectY = axisY + edge * halfHeight;
            const shadowY = axisY + edge * shadowHalfHeight;
            ctx.beginPath();
            ctx.moveTo(sourceX, axisY);
            ctx.lineTo(obstacleX, objectY);
            ctx.lineTo(screenX, shadowY);
            ctx.stroke();
        }
        text('Источник', 60, 177, '#fde68a', '12px Outfit, sans-serif');
        text('Препятствие', obstacleX - 44, 238, '#e2e8f0', '12px Outfit, sans-serif');
        text('Экран: тень', screenX - 38, 264, '#cbd5e1', '12px Outfit, sans-serif');
        text('Границы тени показывают прямые лучи', 170, 34, '#fde68a', '14px Outfit, sans-serif');
    }

    function drawReflection() {
        const angle = number() * Math.PI / 180;
        const mirrorY = 200;
        const pointX = 320;
        const rayLength = 145;
        const dx = Math.sin(angle) * rayLength;
        const dy = Math.cos(angle) * rayLength;

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(120, mirrorY);
        ctx.lineTo(520, mirrorY);
        ctx.stroke();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pointX, 34);
        ctx.lineTo(pointX, 240);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pointX - dx, mirrorY - dy);
        ctx.lineTo(pointX, mirrorY);
        ctx.lineTo(pointX + dx, mirrorY - dy);
        ctx.stroke();
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(pointX, mirrorY, 5, 0, Math.PI * 2);
        ctx.fill();
        text('Падающий луч', 105, 44, '#fde68a', '13px Outfit, sans-serif');
        text('Отражённый луч', 403, 44, '#fde68a', '13px Outfit, sans-serif');
        text('нормаль', pointX + 8, 60, '#cbd5e1', '13px Outfit, sans-serif');
        text(`α = β = ${format(number())}°`, 254, 253, '#7dd3fc');
    }

    function drawPlaneMirror() {
        const distance = 34 + (number() - 1) * 22;
        const mirrorX = 360;
        const axisY = 145;
        const topY = 91;
        const imageX = mirrorX + distance;
        const leftRayEnds = [{ x: 100, y: 50 }, { x: 100, y: 238 }];
        const mirrorPoints = [{ x: mirrorX, y: 93 }, { x: mirrorX, y: 202 }];

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(mirrorX, 35);
        ctx.lineTo(mirrorX, 248);
        ctx.stroke();
        drawArrow(mirrorX - distance, axisY, topY, '#facc15', 'Предмет');
        drawArrow(imageX, axisY, topY, '#c084fc', 'Изображение', true);

        for (const point of mirrorPoints) {
            const imageTip = { x: imageX, y: topY };
            const reflectedEnd = {
                x: mirrorX - (imageTip.x - point.x),
                y: point.y + (imageTip.y - point.y)
            };
            const objectTip = { x: mirrorX - distance, y: topY };
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#7dd3fc';
            ctx.beginPath();
            ctx.moveTo(objectTip.x, objectTip.y);
            ctx.lineTo(point.x, point.y);
            ctx.lineTo(reflectedEnd.x, reflectedEnd.y);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(192, 132, 252, .75)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(imageTip.x, imageTip.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        text('зеркало', mirrorX - 28, 269, '#e2e8f0');
        text('d предмета = d изображения', 213, 32, '#7dd3fc');
    }

    function drawRefraction() {
        const angle = number() * Math.PI / 180;
        const refractedAngle = Math.asin(Math.sin(angle) / 1.5);
        const boundaryY = 137;
        const boundaryX = 320;
        const length = 150;

        ctx.fillStyle = 'rgba(56, 189, 248, .1)';
        ctx.fillRect(0, boundaryY, canvas.width, canvas.height - boundaryY);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(45, boundaryY);
        ctx.lineTo(595, boundaryY);
        ctx.stroke();
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(boundaryX, 30);
        ctx.lineTo(boundaryX, 250);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(boundaryX - Math.sin(angle) * length, boundaryY - Math.cos(angle) * length);
        ctx.lineTo(boundaryX, boundaryY);
        ctx.lineTo(boundaryX + Math.sin(refractedAngle) * length, boundaryY + Math.cos(refractedAngle) * length);
        ctx.stroke();
        text('воздух', 48, 66, '#e2e8f0');
        text('стекло', 48, 169, '#7dd3fc');
        text('нормаль', boundaryX + 8, 50, '#cbd5e1', '12px Outfit, sans-serif');
        text(`α = ${format(number())}°`, 180, 65, '#fde68a');
        text(`β ≈ ${format(refractedAngle * 180 / Math.PI)}°`, 351, 215, '#fde68a');
        text('В стекле луч отклоняется к нормали', 182, 34, '#7dd3fc', '14px Outfit, sans-serif');
    }

    function drawLensModel(kind) {
        const axisY = 145;
        const lensX = 360;
        const focalPixels = kind === 'lensPower'
            ? 36 + ((number() - 0.1) / 0.4) * 144
            : 72;
        const diverging = kind === 'divergingLens';
        const objectDistanceInF = kind === 'lensPower' ? 2.2 : number();
        const objectX = lensX - objectDistanceInF * focalPixels;
        const objectTopY = axisY - 46;
        const signedFocalPixels = diverging ? -focalPixels : focalPixels;
        const imageDistanceInF = diverging
            ? -objectDistanceInF / (objectDistanceInF + 1)
            : Math.abs(objectDistanceInF - 1) < 0.06
                ? null
                : objectDistanceInF / (objectDistanceInF - 1);
        const signedMagnification = imageDistanceInF === null ? null : -imageDistanceInF / objectDistanceInF;
        const imageX = imageDistanceInF === null
            ? lensX + canvas.width
            : Math.max(34, Math.min(606, lensX + imageDistanceInF * focalPixels));
        const imageHeight = signedMagnification === null
            ? 0
            : Math.max(-100, Math.min(100, signedMagnification * 46));
        const imageTopY = axisY - imageHeight;

        ctx.strokeStyle = 'rgba(203, 213, 225, .7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(35, axisY);
        ctx.lineTo(605, axisY);
        ctx.stroke();

        ctx.strokeStyle = diverging ? '#a78bfa' : '#38bdf8';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(lensX, 55);
        ctx.bezierCurveTo(lensX - (diverging ? -21 : 21), 95, lensX - (diverging ? -21 : 21), 195, lensX, 235);
        ctx.bezierCurveTo(lensX + (diverging ? -21 : 21), 195, lensX + (diverging ? -21 : 21), 95, lensX, 55);
        ctx.stroke();

        for (const side of [-1, 1]) {
            const focusX = lensX + side * focalPixels;
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(focusX, axisY, 4, 0, Math.PI * 2);
            ctx.fill();
            text('F', focusX - 4, axisY + 20, '#fde68a', '12px Outfit, sans-serif');
            if (!diverging) {
                const twiceFocusX = lensX + side * focalPixels * 2;
                ctx.fillStyle = '#94a3b8';
                ctx.beginPath();
                ctx.arc(twiceFocusX, axisY, 3, 0, Math.PI * 2);
                ctx.fill();
                text('2F', twiceFocusX - 8, axisY + 35, '#cbd5e1', '11px Outfit, sans-serif');
            }
        }

        drawArrow(objectX, axisY, objectTopY, '#facc15', 'Предмет');

        const objectRayEndX = lensX;
        const objectRayEndY = objectTopY + ((objectRayEndX - objectX) * (axisY - objectTopY)) / (lensX - objectX);
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(objectX, objectTopY);
        ctx.lineTo(lensX, objectTopY);
        const rayEndX = lensX + 180;
        const rayEndY = objectTopY + ((rayEndX - lensX) * (axisY - objectTopY)) / signedFocalPixels;
        ctx.lineTo(rayEndX, rayEndY);
        ctx.stroke();

        ctx.strokeStyle = '#fda4af';
        const centerRayStartX = objectX + 8;
        const centerRayStartY = objectTopY + (axisY - objectTopY) * (8 / (lensX - objectX));
        ctx.beginPath();
        ctx.moveTo(centerRayStartX, centerRayStartY);
        ctx.lineTo(rayEndX, objectTopY + ((rayEndX - objectX) * (axisY - objectTopY)) / (lensX - objectX));
        ctx.stroke();

        const imageOnScreen = imageDistanceInF !== null && imageX >= 35 && imageX <= 605
            && imageTopY >= 30 && imageTopY <= 250;
        if (!diverging && imageOnScreen) {
            ctx.fillStyle = 'rgba(192, 132, 252, .55)';
            ctx.beginPath();
            ctx.arc(imageX, imageTopY, 6, 0, Math.PI * 2);
            ctx.fill();
        } else if (diverging && imageOnScreen) {
            ctx.setLineDash([6, 5]);
            ctx.strokeStyle = '#7dd3fc';
            ctx.beginPath();
            ctx.moveTo(lensX, objectRayEndY);
            ctx.lineTo(imageX, imageTopY);
            ctx.stroke();
            ctx.strokeStyle = '#fda4af';
            ctx.beginPath();
            ctx.moveTo(lensX, axisY);
            ctx.lineTo(imageX, imageTopY);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        if (imageOnScreen) {
            drawArrow(imageX, axisY, imageTopY, '#c084fc', 'Изображение', diverging);
        } else if (imageDistanceInF === null || !imageOnScreen) {
            text('Изображение очень далеко', 389, 40, '#c084fc', '13px Outfit, sans-serif');
        }
        text(diverging ? 'Рассеивающая линза' : 'Собирающая линза', 260, 265, '#7dd3fc');
    }

    function drawOpticsModel() {
        switch (lesson.kind) {
            case 'lightSources':
                drawLightSources();
                break;
            case 'straightLight':
                drawStraightLight();
                break;
            case 'reflection':
                drawReflection();
                break;
            case 'planeMirror':
                drawPlaneMirror();
                break;
            case 'refraction':
                drawRefraction();
                break;
            case 'convergingLens':
            case 'lensImages':
            case 'lensPower':
                drawLensModel(lesson.kind);
                break;
            case 'divergingLens':
                drawLensModel('divergingLens');
                break;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame += 1;
        switch (lesson.kind) {
            case 'atoms':
            case 'conduction':
                drawParticles();
                break;
            case 'convection':
                drawConvection();
                break;
            case 'radiation':
                drawRadiation();
                break;
            case 'charge':
                drawChargeModel();
                break;
            case 'field':
                drawFieldModel();
                break;
            case 'heat':
            case 'specificHeat':
            case 'fuel':
            case 'melting':
            case 'evaporation':
            case 'boiling':
                drawLiquidModel();
                break;
            case 'lightSources':
            case 'straightLight':
            case 'reflection':
            case 'planeMirror':
            case 'refraction':
            case 'convergingLens':
            case 'divergingLens':
            case 'lensPower':
            case 'lensImages':
                drawOpticsModel();
                break;
            default:
                drawCircuitModel();
        }
        if (running && frameRequest === null) {
            frameRequest = requestAnimationFrame(() => {
                frameRequest = null;
                draw();
            });
        }
    }

    slider.addEventListener('input', () => {
        updateReadout();
        if (!running) draw();
    });
    toggle.addEventListener('click', () => {
        running = !running;
        toggle.textContent = running ? 'Пауза' : 'Продолжить';
        if (running) draw();
    });

    updateReadout();
    draw();
};