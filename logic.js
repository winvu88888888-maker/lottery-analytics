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
// 🤖 MULTI-AI ANALYSIS SYSTEM
// ============================================

// Store AI predictions
let aiPredictions = {
    ai1: null,
    ai2: null,
    ai3: null,
    ai4: null,
    ai5: null
};

// AI #1: Advanced Frequency Analysis
function runAI1_FrequencyAnalysis() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Count frequency for last 50, 100, all draws
    const freq50 = new Array(maxNum + 1).fill(0);
    const freq100 = new Array(maxNum + 1).fill(0);
    const freqAll = new Array(maxNum + 1).fill(0);

    data.slice(-50).forEach(d => d.numbers.forEach(n => freq50[n]++));
    data.slice(-100).forEach(d => d.numbers.forEach(n => freq100[n]++));
    data.forEach(d => d.numbers.forEach(n => freqAll[n]++));

    // Calculate weighted scores
    const scores = [];
    for (let i = 1; i <= maxNum; i++) {
        const score = (freq50[i] * 3) + (freq100[i] * 2) + (freqAll[i] * 1);
        scores.push({ num: i, score, freq50: freq50[i], freq100: freq100[i], freqAll: freqAll[i] });
    }

    // Mix hot and cold numbers
    scores.sort((a, b) => b.score - a.score);
    const hot = scores.slice(0, 15).map(s => s.num);
    const cold = scores.slice(-15).map(s => s.num);

    // Select 4 from hot, 2 from cold
    const prediction = [];
    while (prediction.length < 4) {
        const n = hot[Math.floor(Math.random() * hot.length)];
        if (!prediction.includes(n)) prediction.push(n);
    }
    while (prediction.length < 6) {
        const n = cold[Math.floor(Math.random() * cold.length)];
        if (!prediction.includes(n)) prediction.push(n);
    }

    return {
        prediction: prediction.sort((a, b) => a - b),
        stats: { hot: hot.slice(0, 5), cold: cold.slice(0, 5) }
    };
}

// AI #2: Cycle Analysis
function runAI2_CycleAnalysis() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Analyze by day of week
    const dayFreq = {};
    for (let i = 0; i < 7; i++) dayFreq[i] = new Array(maxNum + 1).fill(0);

    data.forEach(d => {
        const date = new Date(d.date.split('/').reverse().join('-'));
        const day = date.getDay();
        d.numbers.forEach(n => dayFreq[day][n]++);
    });

    // Get today's best numbers
    const today = new Date().getDay();
    const todayScores = [];
    for (let i = 1; i <= maxNum; i++) {
        todayScores.push({ num: i, score: dayFreq[today][i] });
    }
    todayScores.sort((a, b) => b.score - a.score);

    // Also check weekly patterns
    const lastDraw = data[data.length - 1];
    const lastNumbers = lastDraw ? lastDraw.numbers : [];

    const prediction = [];
    // Top 4 from day pattern
    for (let i = 0; i < 20 && prediction.length < 4; i++) {
        const n = todayScores[i].num;
        if (!lastNumbers.includes(n) && !prediction.includes(n)) {
            prediction.push(n);
        }
    }
    // 2 random from bottom (less frequent today)
    while (prediction.length < 6) {
        const n = todayScores[Math.floor(Math.random() * 20) + 25].num;
        if (!prediction.includes(n)) prediction.push(n);
    }

    return {
        prediction: prediction.sort((a, b) => a - b),
        stats: { dayPattern: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][today] }
    };
}

// AI #3: Cashflow Pattern Analysis
function runAI3_CashflowAnalysis() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Categorize draws by jackpot level
    const highJackpotNums = new Array(maxNum + 1).fill(0);
    const lowJackpotNums = new Array(maxNum + 1).fill(0);
    const risingNums = new Array(maxNum + 1).fill(0);

    const avgJackpot = data.reduce((sum, d) => sum + (currentMode === 'mega' ? d.jackpot : d.jackpot1), 0) / data.length;

    for (let i = 1; i < data.length; i++) {
        const jp = currentMode === 'mega' ? data[i].jackpot : data[i].jackpot1;
        const prevJp = currentMode === 'mega' ? data[i - 1].jackpot : data[i - 1].jackpot1;

        if (jp > avgJackpot) {
            data[i].numbers.forEach(n => highJackpotNums[n]++);
        } else {
            data[i].numbers.forEach(n => lowJackpotNums[n]++);
        }

        if (jp > prevJp) {
            data[i].numbers.forEach(n => risingNums[n]++);
        }
    }

    // Current jackpot analysis
    const lastJp = currentMode === 'mega' ? data[data.length - 1].jackpot : data[data.length - 1].jackpot1;
    const isHigh = lastJp > avgJackpot;

    const targetNums = isHigh ? highJackpotNums : lowJackpotNums;
    const scores = [];
    for (let i = 1; i <= maxNum; i++) {
        scores.push({ num: i, score: targetNums[i] + risingNums[i] });
    }
    scores.sort((a, b) => b.score - a.score);

    const prediction = [];
    for (let i = 0; i < 20 && prediction.length < 6; i++) {
        if (!prediction.includes(scores[i].num)) {
            prediction.push(scores[i].num);
        }
    }

    return {
        prediction: prediction.sort((a, b) => a - b),
        stats: { jackpotLevel: isHigh ? 'Cao' : 'Thấp', avgJackpot: formatCurrency(avgJackpot) }
    };
}

// AI #4: Simple Genetic Algorithm
function runAI4_GeneticAlgorithm() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Calculate fitness based on historical frequency
    const freq = new Array(maxNum + 1).fill(0);
    data.forEach(d => d.numbers.forEach(n => freq[n]++));

    // Generate population
    const popSize = 50;
    const generations = 20;
    let population = [];

    for (let i = 0; i < popSize; i++) {
        const individual = [];
        while (individual.length < 6) {
            const n = Math.floor(Math.random() * maxNum) + 1;
            if (!individual.includes(n)) individual.push(n);
        }
        population.push(individual);
    }

    // Fitness function
    const fitness = (ind) => {
        let score = 0;
        ind.forEach(n => score += freq[n]);
        // Bonus for balanced even/odd
        const even = ind.filter(n => n % 2 === 0).length;
        if (even >= 2 && even <= 4) score += 10;
        // Bonus for spread
        const sorted = [...ind].sort((a, b) => a - b);
        const spread = sorted[5] - sorted[0];
        if (spread > maxNum / 2) score += 5;
        return score;
    };

    // Evolve
    for (let gen = 0; gen < generations; gen++) {
        // Sort by fitness
        population.sort((a, b) => fitness(b) - fitness(a));

        // Keep top half
        population = population.slice(0, popSize / 2);

        // Crossover & mutate to refill
        while (population.length < popSize) {
            const p1 = population[Math.floor(Math.random() * population.length)];
            const p2 = population[Math.floor(Math.random() * population.length)];

            // Crossover
            const child = [...new Set([...p1.slice(0, 3), ...p2.slice(3, 6)])];
            while (child.length < 6) {
                const n = Math.floor(Math.random() * maxNum) + 1;
                if (!child.includes(n)) child.push(n);
            }

            // Mutate (10% chance per gene)
            for (let i = 0; i < 6; i++) {
                if (Math.random() < 0.1) {
                    let newN;
                    do {
                        newN = Math.floor(Math.random() * maxNum) + 1;
                    } while (child.includes(newN));
                    child[i] = newN;
                }
            }

            population.push(child.slice(0, 6));
        }
    }

    // Return best individual
    population.sort((a, b) => fitness(b) - fitness(a));
    const best = population[0];

    return {
        prediction: best.sort((a, b) => a - b),
        stats: { generations: generations, fitness: fitness(best) }
    };
}

// AI #5: Combined Analysis (voting from all AIs)
function runAI5_Combined(ai1, ai2, ai3, ai4) {
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Count votes from all AIs
    const votes = new Array(maxNum + 1).fill(0);

    [ai1, ai2, ai3, ai4].forEach(result => {
        if (result && result.prediction) {
            result.prediction.forEach(n => votes[n] += 2);
        }
    });

    // Add frequency data
    const data = allData[currentMode];
    data.slice(-30).forEach(d => d.numbers.forEach(n => votes[n]++));

    // Get top voted
    const ranked = [];
    for (let i = 1; i <= maxNum; i++) {
        ranked.push({ num: i, votes: votes[i] });
    }
    ranked.sort((a, b) => b.votes - a.votes);

    const prediction = ranked.slice(0, 6).map(r => r.num);

    return {
        prediction: prediction.sort((a, b) => a - b),
        stats: { method: 'Voting', topVotes: ranked[0].votes }
    };
}

// Update AI status display
function updateAIStatus(aiNum, status, result = null) {
    const statusEl = document.getElementById(`ai${aiNum}-status`);
    const resultEl = document.getElementById(`ai${aiNum}-result`);
    const predEl = document.getElementById(`ai${aiNum}-prediction`);
    const card = document.querySelector(`#ai${aiNum}-status`).closest('.ai-card');

    if (status === 'running') {
        statusEl.textContent = '⏳';
        card.classList.add('running');
        card.classList.remove('complete');
        resultEl.innerHTML = '<div class="ai-waiting">Đang phân tích...</div>';
        predEl.innerHTML = '';
    } else if (status === 'complete' && result) {
        statusEl.textContent = '✅';
        card.classList.remove('running');
        card.classList.add('complete');

        // Display stats
        let statsHtml = '<div class="result-stats">';
        if (result.stats) {
            Object.entries(result.stats).forEach(([key, val]) => {
                if (Array.isArray(val)) {
                    statsHtml += `<span>${key}: ${val.join(', ')}</span>`;
                } else {
                    statsHtml += `<span>${key}: ${val}</span>`;
                }
            });
        }
        statsHtml += '</div>';
        resultEl.innerHTML = statsHtml;

        // Display prediction balls
        predEl.innerHTML = result.prediction.map(n => `<div class="ball">${n}</div>`).join('');
    }
}

// Run all AIs
async function runAllAIs() {
    const runBtn = document.getElementById('run-all-ai');
    const statusEl = document.getElementById('ai-status');
    const finalResult = document.getElementById('final-ai-result');
    const finalConfidence = document.getElementById('final-confidence');

    runBtn.disabled = true;
    statusEl.textContent = 'Đang chạy...';
    statusEl.style.color = '#f59e0b';

    // Reset
    finalResult.innerHTML = '<div class="ai-waiting">Đang xử lý các mô hình AI...</div>';
    finalConfidence.innerHTML = '';

    // Run AI 1
    updateAIStatus(1, 'running');
    await new Promise(r => setTimeout(r, 500));
    aiPredictions.ai1 = runAI1_FrequencyAnalysis();
    updateAIStatus(1, 'complete', aiPredictions.ai1);

    // Run AI 2
    updateAIStatus(2, 'running');
    await new Promise(r => setTimeout(r, 500));
    aiPredictions.ai2 = runAI2_CycleAnalysis();
    updateAIStatus(2, 'complete', aiPredictions.ai2);

    // Run AI 3
    updateAIStatus(3, 'running');
    await new Promise(r => setTimeout(r, 500));
    aiPredictions.ai3 = runAI3_CashflowAnalysis();
    updateAIStatus(3, 'complete', aiPredictions.ai3);

    // Run AI 4
    updateAIStatus(4, 'running');
    await new Promise(r => setTimeout(r, 700));
    aiPredictions.ai4 = runAI4_GeneticAlgorithm();
    updateAIStatus(4, 'complete', aiPredictions.ai4);

    // Run AI 5 (Combined)
    updateAIStatus(5, 'running');
    await new Promise(r => setTimeout(r, 500));
    aiPredictions.ai5 = runAI5_Combined(
        aiPredictions.ai1,
        aiPredictions.ai2,
        aiPredictions.ai3,
        aiPredictions.ai4
    );
    updateAIStatus(5, 'complete', aiPredictions.ai5);

    // Final result
    const finalPrediction = aiPredictions.ai5.prediction;
    finalResult.innerHTML = `
        <div class="balls">
            ${finalPrediction.map(n => `<div class="ball">${n}</div>`).join('')}
        </div>
        <p>Bộ số được 5 AI đồng thuận cao nhất</p>
    `;

    // Calculate "confidence" based on agreement
    const allPreds = [aiPredictions.ai1, aiPredictions.ai2, aiPredictions.ai3, aiPredictions.ai4].map(p => p.prediction);
    let agreement = 0;
    finalPrediction.forEach(n => {
        allPreds.forEach(pred => {
            if (pred.includes(n)) agreement++;
        });
    });
    const confidence = Math.min(95, 60 + (agreement * 2));

    finalConfidence.innerHTML = `Độ đồng thuận: <strong>${confidence}%</strong>`;

    statusEl.textContent = 'Hoàn thành!';
    statusEl.style.color = '#10b981';
    runBtn.disabled = false;

    showNotification('Đã hoàn thành phân tích từ 5 mô hình AI!', 'success');
}

// Setup Multi-AI event listener
function setupMultiAI() {
    const runBtn = document.getElementById('run-all-ai');
    if (runBtn) {
        runBtn.addEventListener('click', runAllAIs);
    }
}

// ============================================
// 📊 BACKTESTING SYSTEM
// ============================================

// Backtest a single AI on historical data
function backtestAI(aiFunction, startIndex = 100) {
    const data = allData[currentMode];
    const results = {
        totalTests: 0,
        totalMatches: 0,
        match0: 0,
        match1: 0,
        match2: 0,
        match3: 0,
        match4: 0,
        match5: 0,
        match6: 0
    };

    // Test from startIndex to end
    for (let i = startIndex; i < data.length; i++) {
        // Create temporary data slice (only data before this draw)
        const tempData = data.slice(0, i);

        // Store original and swap
        const originalData = allData[currentMode];
        allData[currentMode] = tempData;

        try {
            // Run AI prediction
            const prediction = aiFunction();

            // Restore original data
            allData[currentMode] = originalData;

            // Compare with actual result
            const actual = data[i].numbers;
            let matches = 0;
            prediction.prediction.forEach(n => {
                if (actual.includes(n)) matches++;
            });

            results.totalTests++;
            results.totalMatches += matches;
            results[`match${matches}`]++;
        } catch (e) {
            // Restore on error
            allData[currentMode] = originalData;
        }
    }

    return results;
}

// Run full backtest on all AIs
async function runFullBacktest() {
    const backtestBtn = document.getElementById('run-backtest');
    const resultsDiv = document.getElementById('backtest-results');

    if (!backtestBtn || !resultsDiv) return;

    backtestBtn.disabled = true;
    backtestBtn.textContent = '⏳ Đang kiểm tra...';

    resultsDiv.innerHTML = '<div class="ai-waiting">Đang chạy backtest trên dữ liệu lịch sử... Vui lòng đợi...</div>';

    await new Promise(r => setTimeout(r, 100));

    const aiTests = [
        { name: 'AI #1: Phân Tích Tần Suất', fn: runAI1_FrequencyAnalysis },
        { name: 'AI #2: Phân Tích Chu Kỳ', fn: runAI2_CycleAnalysis },
        { name: 'AI #3: Phân Tích Dòng Tiền', fn: runAI3_CashflowAnalysis },
        { name: 'AI #4: Thuật Toán Di Truyền', fn: runAI4_GeneticAlgorithm }
    ];

    const allResults = [];

    for (const ai of aiTests) {
        resultsDiv.innerHTML = `<div class="ai-waiting">Đang test ${ai.name}...</div>`;
        await new Promise(r => setTimeout(r, 50));

        const result = backtestAI(ai.fn, 100);
        result.name = ai.name;
        result.avgMatches = (result.totalMatches / result.totalTests).toFixed(2);
        result.accuracy = ((result.totalMatches / (result.totalTests * 6)) * 100).toFixed(2);
        allResults.push(result);
    }

    // Display results
    let html = `
        <h4>📊 Kết Quả Backtest (${allResults[0].totalTests} kỳ)</h4>
        <p class="backtest-note">⚠️ Lưu ý: Xổ số là ngẫu nhiên, độ chính xác ngẫu nhiên thuần túy là ~13.3% (6/45)</p>
        <table class="backtest-table">
            <thead>
                <tr>
                    <th>Mô Hình AI</th>
                    <th>TB Số Trùng</th>
                    <th>% Chính Xác</th>
                    <th>0 số</th>
                    <th>1 số</th>
                    <th>2 số</th>
                    <th>3 số</th>
                    <th>4+ số</th>
                </tr>
            </thead>
            <tbody>
    `;

    allResults.forEach(r => {
        const isGood = parseFloat(r.accuracy) > 13.5;
        html += `
            <tr>
                <td>${r.name}</td>
                <td><strong>${r.avgMatches}</strong>/6</td>
                <td class="${isGood ? 'good' : ''}">${r.accuracy}%</td>
                <td>${r.match0}</td>
                <td>${r.match1}</td>
                <td>${r.match2}</td>
                <td>${r.match3}</td>
                <td>${r.match4 + r.match5 + r.match6}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        <div class="backtest-summary">
            <p>📈 <strong>Giải thích:</strong></p>
            <ul>
                <li><strong>TB Số Trùng:</strong> Trung bình số lượng số trùng với kết quả thực tế</li>
                <li><strong>% Chính Xác:</strong> (Tổng số trùng / Tổng số dự đoán) × 100</li>
                <li><strong>Ngẫu nhiên thuần túy:</strong> ~0.8 số/kỳ (13.3%)</li>
            </ul>
        </div>
    `;

    resultsDiv.innerHTML = html;

    backtestBtn.disabled = false;
    backtestBtn.textContent = '🔬 Chạy Backtest Lại';

    showNotification('Hoàn thành backtest! Xem kết quả bên dưới.', 'info');
}

// Setup backtest
function setupBacktest() {
    const btn = document.getElementById('run-backtest');
    if (btn) {
        btn.addEventListener('click', runFullBacktest);
    }
}

// ============================================
// 🚀 START APPLICATION
// ============================================

init();
setupMultiAI();
setupBacktest();
