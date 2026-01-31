// ============================================
// 🎯 AI LOTTERY ANALYTICS PRO - FULL FEATURES
// ============================================

let allData = null;
let currentMode = 'mega';
let currentPage = 1;
const rowsPerPage = 99999; // Show all data without pagination

let jackpotChart = null;
let frequencyChart = null;
let evenOddChart = null;
let rangeChart = null;

// ============================================
// 🚀 INITIALIZATION
// ============================================

async function init() {
    // Check auth
    if (!sessionStorage.getItem('auth')) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('db_storage.json');
        const rawData = await response.json();

        // Convert string numbers to integers
        allData = {
            mega: rawData.mega.map(draw => ({
                ...draw,
                numbers: draw.numbers.map(n => parseInt(n)),
                bonus: draw.bonus ? parseInt(draw.bonus) : null,
                jackpot: parseInt(draw.jackpot)
            })),
            power: rawData.power.map(draw => ({
                ...draw,
                numbers: draw.numbers.map(n => parseInt(n)),
                bonus: draw.bonus ? parseInt(draw.bonus) : null,
                jackpot1: parseInt(draw.jackpot1),
                jackpot2: parseInt(draw.jackpot2)
            }))
        };

        console.log('Loaded data:', {
            mega: allData.mega.length + ' draws',
            power: allData.power.length + ' draws'
        });

        setupEventListeners();
        setupNavigation();
        setupThemeToggle();
        loadFavorites();
        renderDashboard();
        showNotification(`Đã tải ${allData.mega.length} kỳ Mega và ${allData.power.length} kỳ Power!`, 'success');
    } catch (error) {
        console.error("Error loading data:", error);
        showNotification('Lỗi tải dữ liệu: ' + error.message, 'error');
    }
}

// ============================================
// 📱 EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Mode switchers
    document.getElementById('mega-btn').addEventListener('click', () => {
        if (currentMode === 'mega') return;
        currentMode = 'mega';
        updateUI();
    });

    document.getElementById('power-btn').addEventListener('click', () => {
        if (currentMode === 'power') return;
        currentMode = 'power';
        updateUI();
    });

    // Search
    document.getElementById('draw-search').addEventListener('input', (e) => {
        currentPage = 1;
        renderTable(e.target.value);
    });

    // AI Prediction
    document.getElementById('generate-prediction').addEventListener('click', generateAIPrediction);

    // Smart Generator
    document.getElementById('smart-generate').addEventListener('click', generateSmartNumbers);

    // Favorites
    document.getElementById('add-favorite-btn').addEventListener('click', addFavorite);

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem('auth');
        window.location.href = 'index.html';
    });
}

// ============================================
// 🎨 NAVIGATION & THEME
// ============================================

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section;

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show corresponding section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(`section-${sectionId}`).classList.add('active');

            // Render section-specific content
            if (sectionId === 'ai-predict') renderAISection();
            if (sectionId === 'advanced-stats') renderAdvancedStats();
            if (sectionId === 'favorites') renderFavoritesSection();
            if (sectionId === 'history') renderTable();
        });
    });

    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        showNotification(`Đã chuyển sang chế độ ${newTheme === 'dark' ? 'tối' : 'sáng'}`, 'info');
    });
}

// ============================================
// 🔔 NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    notification.innerHTML = `
        <span style="font-size: 1.5rem;">${icons[type]}</span>
        <span>${message}</span>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// 📊 DASHBOARD
// ============================================

function updateUI() {
    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${currentMode}-btn`).classList.add('active');

    document.getElementById('draw-search').value = '';
    currentPage = 1;

    renderDashboard();
    renderAISection();
    renderAdvancedStats();
}

function formatCurrency(val) {
    if (!val) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
}

function estimateCashflow(current, previous, base) {
    let diff = 0;
    if (current < previous) {
        diff = current - base;
    } else {
        diff = current - previous;
    }
    return Math.max(0, diff / 0.4);
}

function renderDashboard() {
    const data = allData[currentMode];
    const latest = data[data.length - 1];

    // Stats Update
    document.getElementById('total-draws').innerText = data.length;
    document.getElementById('latest-jackpot').innerText = formatCurrency(currentMode === 'mega' ? latest.jackpot : latest.jackpot1);
    document.getElementById('start-date').innerText = data[0].date.split(', ')[1];

    // Latest Cashflow
    const prev = data[data.length - 2];
    const base = currentMode === 'mega' ? 12000000000 : 30000000000;
    const curVal = currentMode === 'mega' ? latest.jackpot : latest.jackpot1;
    const prevVal = currentMode === 'mega' ? prev.jackpot : prev.jackpot1;
    const cf = estimateCashflow(curVal, prevVal, base);
    document.getElementById('latest-cashflow').innerText = formatCurrency(cf);

    renderCharts();
    renderTable();
}

function renderCharts() {
    const data = allData[currentMode];
    const labels = data.slice(-50).map(d => d.date.split(', ')[1]);
    const values = data.slice(-50).map(d => currentMode === 'mega' ? d.jackpot : d.jackpot1);

    // Jackpot Chart
    if (jackpotChart) jackpotChart.destroy();
    const ctxJ = document.getElementById('jackpot-chart').getContext('2d');
    jackpotChart = new Chart(ctxJ, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jackpot',
                data: values,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
                pointBorderColor: '#6366f1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: value => (value / 1e9).toFixed(0) + 'B',
                        color: '#94a3b8'
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Frequency Chart
    const freqs = {};
    data.forEach(d => {
        d.numbers.forEach(n => {
            freqs[n] = (freqs[n] || 0) + 1;
        });
    });

    const sortedNums = Object.keys(freqs).sort((a, b) => freqs[b] - freqs[a]).slice(0, 15);
    const freqValues = sortedNums.map(n => freqs[n]);

    if (frequencyChart) frequencyChart.destroy();
    const ctxF = document.getElementById('frequency-chart').getContext('2d');
    frequencyChart = new Chart(ctxF, {
        type: 'bar',
        data: {
            labels: sortedNums,
            datasets: [{
                label: 'Tần suất',
                data: freqValues,
                backgroundColor: '#a855f7',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { display: false }
                }
            }
        }
    });
}

// ============================================
// 🤖 AI PREDICTION
// ============================================

function renderAISection() {
    generateAIPrediction();
    renderTrendAnalysis();
    createFavoriteInputs();
}

function generateAIPrediction() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;
    const numCount = 6;

    // Calculate frequency and recency scores
    const stats = calculateNumberStats(data, maxNum);

    // AI Algorithm: Weighted selection based on multiple factors
    const prediction = [];
    const weights = { ...stats.frequency };

    // Boost recent numbers
    stats.recent.forEach(num => {
        weights[num] = (weights[num] || 0) * 1.5;
    });

    // Boost hot numbers
    stats.hot.forEach(num => {
        weights[num] = (weights[num] || 0) * 1.3;
    });

    // Select numbers based on weighted probability
    while (prediction.length < numCount) {
        const num = weightedRandomSelection(weights, prediction);
        if (num && !prediction.includes(num)) {
            prediction.push(num);
        }
    }

    prediction.sort((a, b) => a - b);

    // Calculate confidence score
    const confidence = calculateConfidence(prediction, stats);

    // Display prediction
    const resultDiv = document.getElementById('ai-prediction-result');
    resultDiv.innerHTML = `
        <div class="balls">
            ${prediction.map(n => `<div class="ball">${n}</div>`).join('')}
        </div>
    `;

    document.getElementById('confidence-score').innerText = `${confidence}%`;

    showNotification('Dự đoán AI đã được tạo!', 'success');
}

function calculateNumberStats(data, maxNum) {
    const frequency = {};
    const lastAppearance = {};
    const recent = [];

    // Initialize
    for (let i = 1; i <= maxNum; i++) {
        frequency[i] = 0;
        lastAppearance[i] = -1;
    }

    // Calculate stats
    data.forEach((draw, idx) => {
        draw.numbers.forEach(num => {
            frequency[num]++;
            lastAppearance[num] = idx;
        });
    });

    // Get recent numbers (last 10 draws)
    data.slice(-10).forEach(draw => {
        draw.numbers.forEach(num => {
            if (!recent.includes(num)) recent.push(num);
        });
    });

    // Get hot and cold numbers
    const sorted = Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]);
    const hot = sorted.slice(0, 10).map(Number);
    const cold = sorted.slice(-10).map(Number);

    return { frequency, lastAppearance, recent, hot, cold };
}

function weightedRandomSelection(weights, exclude = []) {
    const available = Object.keys(weights).filter(n => !exclude.includes(Number(n)));
    const totalWeight = available.reduce((sum, n) => sum + weights[n], 0);

    let random = Math.random() * totalWeight;

    for (const num of available) {
        random -= weights[num];
        if (random <= 0) return Number(num);
    }

    return Number(available[0]);
}

function calculateConfidence(prediction, stats) {
    let score = 0;

    prediction.forEach(num => {
        // Frequency score
        if (stats.hot.includes(num)) score += 15;
        else if (stats.frequency[num] > 50) score += 10;

        // Recency score
        if (stats.recent.includes(num)) score += 10;
    });

    return Math.min(95, Math.max(60, score));
}

function renderTrendAnalysis() {
    const data = allData[currentMode];
    const stats = calculateNumberStats(data, currentMode === 'mega' ? 45 : 55);

    document.getElementById('trend-up').innerText = stats.hot.slice(0, 5).join(', ');
    document.getElementById('trend-down').innerText = stats.cold.slice(0, 5).join(', ');
    document.getElementById('recent-numbers').innerText = stats.recent.slice(0, 10).join(', ');
}

// ============================================
// 🎲 SMART NUMBER GENERATOR
// ============================================

function generateSmartNumbers() {
    const mode = document.querySelector('input[name="gen-mode"]:checked').value;
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;
    const stats = calculateNumberStats(data, maxNum);

    let numbers = [];

    switch (mode) {
        case 'hot':
            numbers = selectRandom(stats.hot, 6);
            break;
        case 'cold':
            numbers = selectRandom(stats.cold, 6);
            break;
        case 'balanced':
            numbers = [
                ...selectRandom(stats.hot, 3),
                ...selectRandom(stats.cold, 3)
            ];
            break;
        case 'random':
            const allNums = Array.from({ length: maxNum }, (_, i) => i + 1);
            numbers = selectRandom(allNums, 6);
            break;
    }

    numbers.sort((a, b) => a - b);

    const resultDiv = document.getElementById('generated-numbers');
    resultDiv.innerHTML = `
        <div class="balls">
            ${numbers.map(n => `<div class="ball">${n}</div>`).join('')}
        </div>
    `;

    showNotification(`Đã tạo bộ số ${mode}!`, 'success');
}

function selectRandom(arr, count) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// ============================================
// 📊 ADVANCED STATISTICS
// ============================================

function renderAdvancedStats() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;
    const stats = calculateNumberStats(data, maxNum);

    renderHotColdNumbers(stats);
    renderNumberPairs(data);
    renderEvenOddChart(data);
    renderRangeDistribution(data, maxNum);
    renderGapAnalysis(stats, data.length);
}

function renderHotColdNumbers(stats) {
    const hotDiv = document.getElementById('hot-numbers');
    const coldDiv = document.getElementById('cold-numbers');

    hotDiv.innerHTML = stats.hot.slice(0, 10).map((num, idx) => `
        <div class="number-item">
            <div class="number-badge">${num}</div>
            <div class="frequency-bar" style="width: ${100 - idx * 10}%"></div>
            <span>${stats.frequency[num]} lần</span>
        </div>
    `).join('');

    coldDiv.innerHTML = stats.cold.slice(0, 10).map((num, idx) => `
        <div class="number-item">
            <div class="number-badge">${num}</div>
            <div class="frequency-bar" style="width: ${50 - idx * 5}%; background: #64748b;"></div>
            <span>${stats.frequency[num]} lần</span>
        </div>
    `).join('');
}

function renderNumberPairs(data) {
    const pairs = {};

    data.forEach(draw => {
        const nums = draw.numbers;
        for (let i = 0; i < nums.length; i++) {
            for (let j = i + 1; j < nums.length; j++) {
                const pair = [nums[i], nums[j]].sort((a, b) => a - b).join('-');
                pairs[pair] = (pairs[pair] || 0) + 1;
            }
        }
    });

    const sortedPairs = Object.entries(pairs).sort((a, b) => b[1] - a[1]).slice(0, 10);

    const pairsDiv = document.getElementById('number-pairs');
    pairsDiv.innerHTML = sortedPairs.map(([pair, count]) => {
        const [n1, n2] = pair.split('-');
        return `
            <div class="pair-item">
                <div style="display: flex; gap: 0.5rem;">
                    <div class="number-badge">${n1}</div>
                    <div class="number-badge">${n2}</div>
                </div>
                <span>${count} lần</span>
            </div>
        `;
    }).join('');
}

function renderEvenOddChart(data) {
    let evenCount = 0, oddCount = 0;

    data.forEach(draw => {
        draw.numbers.forEach(num => {
            if (num % 2 === 0) evenCount++;
            else oddCount++;
        });
    });

    if (evenOddChart) evenOddChart.destroy();
    const ctx = document.getElementById('even-odd-chart').getContext('2d');
    evenOddChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Số Chẵn', 'Số Lẻ'],
            datasets: [{
                data: [evenCount, oddCount],
                backgroundColor: ['#6366f1', '#a855f7'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8' }
                }
            }
        }
    });
}

function renderRangeDistribution(data, maxNum) {
    const ranges = {
        '1-10': 0,
        '11-20': 0,
        '21-30': 0,
        '31-40': 0,
        '41-50': 0,
        '51-55': 0
    };

    data.forEach(draw => {
        draw.numbers.forEach(num => {
            if (num <= 10) ranges['1-10']++;
            else if (num <= 20) ranges['11-20']++;
            else if (num <= 30) ranges['21-30']++;
            else if (num <= 40) ranges['31-40']++;
            else if (num <= 50) ranges['41-50']++;
            else ranges['51-55']++;
        });
    });

    const labels = Object.keys(ranges).filter(r => maxNum >= parseInt(r.split('-')[1]));
    const values = labels.map(l => ranges[l]);

    if (rangeChart) rangeChart.destroy();
    const ctx = document.getElementById('range-distribution-chart').getContext('2d');
    rangeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Số lượng',
                data: values,
                backgroundColor: '#22d3ee',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { display: false }
                }
            }
        }
    });
}

function renderGapAnalysis(stats, totalDraws) {
    const gapDiv = document.getElementById('gap-analysis');

    const gaps = Object.entries(stats.lastAppearance)
        .map(([num, lastIdx]) => ({
            num: Number(num),
            gap: totalDraws - lastIdx - 1
        }))
        .sort((a, b) => b.gap - a.gap)
        .slice(0, 10);

    gapDiv.innerHTML = gaps.map(({ num, gap }) => `
        <div class="number-item">
            <div class="number-badge">${num}</div>
            <span>Chưa xuất hiện ${gap} kỳ</span>
        </div>
    `).join('');
}

// ============================================
// ⭐ FAVORITES MANAGEMENT
// ============================================

function createFavoriteInputs() {
    const container = document.getElementById('favorite-number-inputs');
    const count = currentMode === 'mega' ? 6 : 6;

    container.innerHTML = Array.from({ length: count }, (_, i) =>
        `<input type="number" min="1" max="${currentMode === 'mega' ? 45 : 55}" placeholder="${i + 1}">`
    ).join('');
}

function addFavorite() {
    const name = document.getElementById('favorite-name').value.trim();
    const inputs = document.querySelectorAll('#favorite-number-inputs input');
    const numbers = Array.from(inputs).map(input => parseInt(input.value)).filter(n => !isNaN(n));

    if (!name) {
        showNotification('Vui lòng nhập tên bộ số!', 'warning');
        return;
    }

    if (numbers.length !== 6) {
        showNotification('Vui lòng nhập đủ 6 số!', 'warning');
        return;
    }

    const favorites = getFavorites();
    favorites.push({ name, numbers, mode: currentMode, date: new Date().toISOString() });
    localStorage.setItem('favorites', JSON.stringify(favorites));

    document.getElementById('favorite-name').value = '';
    inputs.forEach(input => input.value = '');

    renderFavoritesSection();
    showNotification('Đã lưu bộ số yêu thích!', 'success');
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function loadFavorites() {
    renderFavoritesSection();
}

function renderFavoritesSection() {
    const favorites = getFavorites().filter(f => f.mode === currentMode);
    const listDiv = document.getElementById('favorites-list');

    if (favorites.length === 0) {
        listDiv.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Chưa có bộ số yêu thích nào</p>';
        return;
    }

    listDiv.innerHTML = favorites.map((fav, idx) => `
        <div class="favorite-item">
            <div>
                <strong>${fav.name}</strong>
                <div class="balls" style="margin-top: 0.5rem;">
                    ${fav.numbers.map(n => `<div class="ball">${n}</div>`).join('')}
                </div>
            </div>
            <button class="favorite-delete" onclick="deleteFavorite(${idx})">🗑️ Xóa</button>
        </div>
    `).join('');

    checkFavoriteResults();
}

function deleteFavorite(index) {
    const favorites = getFavorites();
    const filtered = favorites.filter(f => f.mode === currentMode);
    const globalIndex = favorites.findIndex(f => f === filtered[index]);

    favorites.splice(globalIndex, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));

    renderFavoritesSection();
    showNotification('Đã xóa bộ số!', 'info');
}

function checkFavoriteResults() {
    const favorites = getFavorites().filter(f => f.mode === currentMode);
    const data = allData[currentMode];
    const resultsDiv = document.getElementById('check-results');

    if (favorites.length === 0) {
        resultsDiv.innerHTML = '<p style="color: var(--text-muted);">Chưa có bộ số để kiểm tra</p>';
        return;
    }

    const results = favorites.map(fav => {
        let matches = 0;
        let bestMatch = 0;

        data.forEach(draw => {
            const matchCount = fav.numbers.filter(n => draw.numbers.includes(n)).length;
            if (matchCount > 0) matches++;
            if (matchCount > bestMatch) bestMatch = matchCount;
        });

        return { name: fav.name, matches, bestMatch, total: data.length };
    });

    resultsDiv.innerHTML = results.map(r => `
        <div class="number-item">
            <strong>${r.name}</strong>
            <span>Trùng tối đa: ${r.bestMatch}/6 số | Xuất hiện: ${r.matches}/${r.total} kỳ</span>
        </div>
    `).join('');
}

// ============================================
// 📜 HISTORY TABLE
// ============================================

function renderTable(searchTerm = '') {
    const data = [...allData[currentMode]].reverse();
    const filtered = data.filter(d =>
        d.date.includes(searchTerm) ||
        d.numbers.join(' ').includes(searchTerm)
    );

    const tbody = document.querySelector('#draw-table tbody');
    tbody.innerHTML = '';

    document.getElementById('th-jackpot').innerText = currentMode === 'power' ? 'Jackpot 1 / 2' : 'Jackpot';

    const base = currentMode === 'mega' ? 12000000000 : 30000000000;

    // Show ALL data without pagination
    const start = 0;
    const paginated = filtered;

    paginated.forEach((d, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'fade-in';

        const originalIndex = data.length - 1 - (start + idx);

        const nextDraw = allData[currentMode][originalIndex];
        const prevDraw = allData[currentMode][originalIndex - 1];
        let cfStr = '--';
        if (prevDraw) {
            const v1 = currentMode === 'mega' ? d.jackpot : d.jackpot1;
            const v0 = currentMode === 'mega' ? prevDraw.jackpot : prevDraw.jackpot1;
            cfStr = formatCurrency(estimateCashflow(v1, v0, base));
        }

        const ballsHtml = d.numbers.map(n => `<div class="ball">${n}</div>`).join('');
        const bonusHtml = d.bonus ? `<div class="ball bonus">${d.bonus}</div>` : '';

        const jpDisplay = currentMode === 'mega'
            ? `<span class="jackpot-val">${formatCurrency(d.jackpot)}</span>`
            : `<span class="jackpot-val">JP1: ${formatCurrency(d.jackpot1)}</span><br><small>JP2: ${formatCurrency(d.jackpot2)}</small>`;

        tr.innerHTML = `
            <td>#${originalIndex}</td>
            <td>${d.date}</td>
            <td><div class="balls">${ballsHtml}${bonusHtml}</div></td>
            <td>${jpDisplay}</td>
            <td>${cfStr}</td>
        `;
        tbody.appendChild(tr);
    });

    // Pagination disabled - showing all data
    // renderPagination(filtered.length);
    document.getElementById('pagination').innerHTML = '';
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const container = document.getElementById('pagination');
    container.innerHTML = '';

    if (totalPages <= 1) return;

    const maxBtns = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxBtns - 1);

    if (end === totalPages) start = Math.max(1, end - maxBtns + 1);

    for (let i = start; i <= end; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = `btn ${i === currentPage ? 'active' : ''}`;
        btn.style.padding = '0.5rem 1rem';
        btn.addEventListener('click', () => {
            currentPage = i;
            renderTable(document.getElementById('draw-search').value);
            document.querySelector('#section-history').scrollIntoView({ behavior: 'smooth' });
        });
        container.appendChild(btn);
    }
}

// ============================================
// 🚀 START APPLICATION
// ============================================

init();
