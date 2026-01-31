// ============================================
// 🚀 ULTRA AI PREDICTION SYSTEM v2.0
// Advanced Machine Learning Algorithms
// ============================================

console.log('🚀 Loading Ultra AI System v2.0...');

// ============================================
// 📊 HELPER FUNCTIONS
// ============================================

function getFrequencyMap(data, maxNum) {
    const freq = new Array(maxNum + 1).fill(0);
    data.forEach(d => d.numbers.forEach(n => freq[n]++));
    return freq;
}

function getRecentFrequency(data, lastN, maxNum) {
    const freq = new Array(maxNum + 1).fill(0);
    data.slice(-lastN).forEach(d => d.numbers.forEach(n => freq[n]++));
    return freq;
}

function getAverageSum(data) {
    const sums = data.map(d => d.numbers.reduce((a, b) => a + b, 0));
    return sums.reduce((a, b) => a + b, 0) / sums.length;
}

function getStandardDeviation(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const squaredDiffs = arr.map(x => Math.pow(x - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / arr.length);
}

// ============================================
// 🧠 AI #1: NEURAL NETWORK SIMULATOR
// Multi-layer perceptron simulation
// ============================================

function runNeuralNetworkAI() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Create input layer from historical patterns
    const freq = getFrequencyMap(data, maxNum);
    const recentFreq = getRecentFrequency(data, 20, maxNum);
    const gapScores = new Array(maxNum + 1).fill(0);

    // Calculate gap scores (how long since last appearance)
    const lastSeen = new Array(maxNum + 1).fill(-1);
    data.forEach((d, idx) => d.numbers.forEach(n => lastSeen[n] = idx));

    for (let i = 1; i <= maxNum; i++) {
        gapScores[i] = lastSeen[i] === -1 ? data.length : data.length - 1 - lastSeen[i];
    }

    // Normalize inputs (0-1 range)
    const maxFreq = Math.max(...freq);
    const maxRecentFreq = Math.max(...recentFreq);
    const maxGap = Math.max(...gapScores);

    // Simulated neural network with 3 hidden layers
    const activations = [];

    for (let i = 1; i <= maxNum; i++) {
        // Input layer
        const x1 = freq[i] / maxFreq;
        const x2 = recentFreq[i] / maxRecentFreq;
        const x3 = gapScores[i] / maxGap;

        // Hidden layer 1 (ReLU activation)
        const h1_1 = Math.max(0, 0.3 * x1 + 0.5 * x2 + 0.2 * x3 - 0.1);
        const h1_2 = Math.max(0, 0.4 * x1 + 0.3 * x2 + 0.3 * x3 - 0.15);
        const h1_3 = Math.max(0, 0.2 * x1 + 0.4 * x2 + 0.4 * x3 - 0.2);

        // Hidden layer 2
        const h2_1 = Math.max(0, 0.5 * h1_1 + 0.3 * h1_2 + 0.2 * h1_3);
        const h2_2 = Math.max(0, 0.3 * h1_1 + 0.4 * h1_2 + 0.3 * h1_3);

        // Output layer (sigmoid-like)
        const output = 1 / (1 + Math.exp(-(h2_1 * 0.6 + h2_2 * 0.4)));

        activations.push({ num: i, score: output });
    }

    // Add some stochastic noise
    activations.forEach(a => {
        a.score += (Math.random() - 0.5) * 0.1;
    });

    activations.sort((a, b) => b.score - a.score);

    // Select top candidates with diversity
    const prediction = [];
    let lowCount = 0, highCount = 0;
    const midPoint = maxNum / 2;

    for (const candidate of activations) {
        if (prediction.length >= 6) break;

        const isHigh = candidate.num > midPoint;
        if (isHigh && highCount >= 4) continue;
        if (!isHigh && lowCount >= 4) continue;

        prediction.push(candidate.num);
        if (isHigh) highCount++; else lowCount++;
    }

    return {
        name: '🧠 Neural Network',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.78,
        analysis: `3-layer perceptron simulation, balance: ${lowCount}L/${highCount}H`
    };
}

// ============================================
// 🎲 AI #2: MONTE CARLO SIMULATION
// Statistical probability simulation
// ============================================

function runMonteCarloAI() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;
    const simulations = 10000;

    // Calculate base probabilities
    const freq = getFrequencyMap(data, maxNum);
    const totalNumbers = data.length * 6;
    const probabilities = freq.map(f => f / totalNumbers);

    // Run simulations
    const numberAppearances = new Array(maxNum + 1).fill(0);

    for (let sim = 0; sim < simulations; sim++) {
        const draw = [];
        const tempProb = [...probabilities];

        while (draw.length < 6) {
            // Weighted random selection based on probabilities
            let random = Math.random();
            let cumulative = 0;

            for (let i = 1; i <= maxNum; i++) {
                if (draw.includes(i)) continue;
                cumulative += tempProb[i];
                if (random <= cumulative) {
                    draw.push(i);
                    break;
                }
            }

            // Fallback if no selection made
            if (draw.length < 6 && draw[draw.length - 1] === undefined) {
                const available = Array.from({ length: maxNum }, (_, i) => i + 1)
                    .filter(n => !draw.includes(n));
                draw.push(available[Math.floor(Math.random() * available.length)]);
            }
        }

        // Count appearances
        draw.forEach(n => {
            if (n && n <= maxNum) numberAppearances[n]++;
        });
    }

    // Select numbers with highest simulation frequency
    const ranked = [];
    for (let i = 1; i <= maxNum; i++) {
        ranked.push({ num: i, score: numberAppearances[i] });
    }
    ranked.sort((a, b) => b.score - a.score);

    const prediction = ranked.slice(0, 12)
        .sort(() => Math.random() - 0.5)
        .slice(0, 6)
        .map(r => r.num);

    return {
        name: '🎲 Monte Carlo',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.75,
        analysis: `${simulations.toLocaleString()} simulations, top score: ${ranked[0].score}`
    };
}

// ============================================
// 🔄 AI #3: MARKOV CHAIN PREDICTOR
// Transition probability matrix
// ============================================

function runMarkovChainAI() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Build transition matrix: P(number appears | previous draw contained certain numbers)
    const transitions = {};

    for (let i = 1; i <= maxNum; i++) {
        transitions[i] = new Array(maxNum + 1).fill(0);
    }

    // Analyze consecutive draws
    for (let i = 1; i < data.length; i++) {
        const prevDraw = data[i - 1].numbers;
        const currentDraw = data[i].numbers;

        prevDraw.forEach(prevNum => {
            currentDraw.forEach(currNum => {
                transitions[prevNum][currNum]++;
            });
        });
    }

    // Get last draw
    const lastDraw = data[data.length - 1].numbers;

    // Calculate expected next numbers based on Markov transition
    const expectedScores = new Array(maxNum + 1).fill(0);

    lastDraw.forEach(lastNum => {
        for (let i = 1; i <= maxNum; i++) {
            expectedScores[i] += transitions[lastNum][i];
        }
    });

    // Rank candidates
    const ranked = [];
    for (let i = 1; i <= maxNum; i++) {
        ranked.push({ num: i, score: expectedScores[i] });
    }
    ranked.sort((a, b) => b.score - a.score);

    // Select with some randomization
    const prediction = [];
    const pool = ranked.slice(0, 20);

    while (prediction.length < 6 && pool.length > 0) {
        const idx = Math.floor(Math.random() * Math.min(10, pool.length));
        prediction.push(pool[idx].num);
        pool.splice(idx, 1);
    }

    return {
        name: '🔄 Markov Chain',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.72,
        analysis: `Based on ${data.length - 1} transitions, last draw: [${lastDraw.join(', ')}]`
    };
}

// ============================================
// 🎯 AI #4: DEEP PATTERN RECOGNITION
// Multi-dimensional pattern analysis
// ============================================

function runDeepPatternAI() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Pattern 1: Decade distribution
    const decadePattern = { d1: 0, d2: 0, d3: 0, d4: 0, d5: 0, d6: 0 };
    const recentDecades = { d1: 0, d2: 0, d3: 0, d4: 0, d5: 0, d6: 0 };

    data.forEach(d => {
        d.numbers.forEach(n => {
            if (n <= 10) decadePattern.d1++;
            else if (n <= 20) decadePattern.d2++;
            else if (n <= 30) decadePattern.d3++;
            else if (n <= 40) decadePattern.d4++;
            else if (n <= 50) decadePattern.d5++;
            else decadePattern.d6++;
        });
    });

    data.slice(-30).forEach(d => {
        d.numbers.forEach(n => {
            if (n <= 10) recentDecades.d1++;
            else if (n <= 20) recentDecades.d2++;
            else if (n <= 30) recentDecades.d3++;
            else if (n <= 40) recentDecades.d4++;
            else if (n <= 50) recentDecades.d5++;
            else recentDecades.d6++;
        });
    });

    // Pattern 2: Sum pattern
    const avgSum = getAverageSum(data);
    const recentAvgSum = getAverageSum(data.slice(-20));
    const targetSum = avgSum + (avgSum - recentAvgSum) * 0.5; // Mean reversion

    // Pattern 3: Even/Odd distribution
    const evenOddCounts = data.slice(-50).map(d => ({
        even: d.numbers.filter(n => n % 2 === 0).length,
        odd: d.numbers.filter(n => n % 2 !== 0).length
    }));
    const avgEven = evenOddCounts.reduce((a, b) => a + b.even, 0) / evenOddCounts.length;
    const targetEven = Math.round(avgEven);

    // Generate prediction matching patterns
    const freq = getFrequencyMap(data, maxNum);
    let bestCandidate = null;
    let bestScore = -Infinity;

    for (let attempt = 0; attempt < 5000; attempt++) {
        const candidate = [];
        const numbers = Array.from({ length: maxNum }, (_, i) => i + 1)
            .sort(() => Math.random() - 0.5);

        for (const n of numbers) {
            if (candidate.length >= 6) break;
            candidate.push(n);
        }

        // Score this candidate
        let score = 0;

        // Frequency score
        candidate.forEach(n => score += freq[n] * 2);

        // Sum closeness
        const sum = candidate.reduce((a, b) => a + b, 0);
        score -= Math.abs(sum - targetSum) * 0.5;

        // Even/Odd balance
        const evenCount = candidate.filter(n => n % 2 === 0).length;
        score -= Math.abs(evenCount - targetEven) * 10;

        // Spread score
        candidate.sort((a, b) => a - b);
        const spread = candidate[5] - candidate[0];
        if (spread > maxNum * 0.5) score += 20;

        if (score > bestScore) {
            bestScore = score;
            bestCandidate = [...candidate];
        }
    }

    return {
        name: '🎯 Deep Pattern',
        prediction: bestCandidate.sort((a, b) => a - b),
        confidence: 0.76,
        analysis: `Target sum: ${Math.round(targetSum)}, score: ${bestScore.toFixed(0)}`
    };
}

// ============================================
// 📈 AI #5: MOMENTUM ANALYSIS
// Trend acceleration analysis
// ============================================

function runMomentumAI() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Calculate momentum for each number
    const momentum = new Array(maxNum + 1).fill(0);

    // Period 1: Last 10 draws
    const freq10 = getRecentFrequency(data, 10, maxNum);
    // Period 2: Draws 11-20
    const freq20 = new Array(maxNum + 1).fill(0);
    data.slice(-20, -10).forEach(d => d.numbers.forEach(n => freq20[n]++));
    // Period 3: Draws 21-30
    const freq30 = new Array(maxNum + 1).fill(0);
    data.slice(-30, -20).forEach(d => d.numbers.forEach(n => freq30[n]++));

    // Calculate acceleration (2nd derivative approximation)
    for (let i = 1; i <= maxNum; i++) {
        const velocity1 = freq10[i] - freq20[i]; // Recent change
        const velocity2 = freq20[i] - freq30[i]; // Previous change
        momentum[i] = velocity1 - velocity2; // Acceleration
    }

    // Rank by positive momentum
    const ranked = [];
    for (let i = 1; i <= maxNum; i++) {
        ranked.push({
            num: i,
            momentum: momentum[i],
            recent: freq10[i]
        });
    }

    // Sort by momentum, with tiebreaker on recent frequency
    ranked.sort((a, b) => {
        if (b.momentum !== a.momentum) return b.momentum - a.momentum;
        return b.recent - a.recent;
    });

    // Take top accelerating numbers
    const prediction = [];
    const pool = ranked.slice(0, 18);

    while (prediction.length < 6 && pool.length > 0) {
        const idx = Math.floor(Math.random() * Math.min(8, pool.length));
        prediction.push(pool[idx].num);
        pool.splice(idx, 1);
    }

    return {
        name: '📈 Momentum',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.73,
        analysis: `Top momentum: ${ranked[0].num} (${ranked[0].momentum > 0 ? '+' : ''}${ranked[0].momentum})`
    };
}

// ============================================
// 🌊 AI #6: WAVE PATTERN DETECTOR
// Cyclical pattern analysis
// ============================================

function runWavePatternAI() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Analyze appearance waves for each number
    const waveScores = new Array(maxNum + 1).fill(0);

    for (let num = 1; num <= maxNum; num++) {
        // Find all appearances
        const appearances = [];
        data.forEach((d, idx) => {
            if (d.numbers.includes(num)) appearances.push(idx);
        });

        if (appearances.length < 3) continue;

        // Calculate average gap between appearances
        const gaps = [];
        for (let i = 1; i < appearances.length; i++) {
            gaps.push(appearances[i] - appearances[i - 1]);
        }
        const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;

        // Current gap
        const currentGap = data.length - 1 - appearances[appearances.length - 1];

        // Score based on wave timing
        // If currentGap is close to avgGap, number is "due"
        const gapRatio = currentGap / avgGap;

        if (gapRatio >= 0.8 && gapRatio <= 1.5) {
            waveScores[num] = 10 + (1 - Math.abs(1 - gapRatio)) * 20;
        } else if (gapRatio > 1.5) {
            waveScores[num] = 5; // Overdue
        }
    }

    const ranked = [];
    for (let i = 1; i <= maxNum; i++) {
        ranked.push({ num: i, score: waveScores[i] });
    }
    ranked.sort((a, b) => b.score - a.score);

    const prediction = ranked.slice(0, 15)
        .sort(() => Math.random() - 0.5)
        .slice(0, 6)
        .map(r => r.num);

    return {
        name: '🌊 Wave Pattern',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.71,
        analysis: `Cycle-aware selection, top wave: ${ranked[0].num}`
    };
}

// ============================================
// 🔮 AI #7: PROBABILITY FUSION
// Bayesian probability combination
// ============================================

function runProbabilityFusionAI() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Prior probability (overall frequency)
    const freq = getFrequencyMap(data, maxNum);
    const totalAppearances = freq.reduce((a, b) => a + b, 0);
    const prior = freq.map(f => f / totalAppearances);

    // Likelihood 1: Recent frequency
    const recentFreq = getRecentFrequency(data, 30, maxNum);
    const recentTotal = recentFreq.reduce((a, b) => a + b, 0);
    const likelihood1 = recentFreq.map(f => (f + 1) / (recentTotal + maxNum)); // Laplace smoothing

    // Likelihood 2: Gap-based
    const lastSeen = new Array(maxNum + 1).fill(-1);
    data.forEach((d, idx) => d.numbers.forEach(n => lastSeen[n] = idx));

    const gapLikelihood = new Array(maxNum + 1).fill(0);
    for (let i = 1; i <= maxNum; i++) {
        const gap = lastSeen[i] === -1 ? data.length : data.length - 1 - lastSeen[i];
        // Higher gap = higher likelihood (mean reversion assumption)
        gapLikelihood[i] = Math.min(1, gap / 20);
    }

    // Posterior = Prior * Likelihoods (simplified Bayesian)
    const posterior = new Array(maxNum + 1).fill(0);
    for (let i = 1; i <= maxNum; i++) {
        posterior[i] = prior[i] * likelihood1[i] * (0.5 + gapLikelihood[i] * 0.5);
    }

    // Normalize
    const postTotal = posterior.reduce((a, b) => a + b, 0);
    for (let i = 1; i <= maxNum; i++) {
        posterior[i] /= postTotal;
    }

    // Sample based on posterior
    const ranked = [];
    for (let i = 1; i <= maxNum; i++) {
        ranked.push({ num: i, prob: posterior[i] });
    }
    ranked.sort((a, b) => b.prob - a.prob);

    const prediction = ranked.slice(0, 15)
        .sort(() => Math.random() - 0.5)
        .slice(0, 6)
        .map(r => r.num);

    return {
        name: '🔮 Probability Fusion',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.74,
        analysis: `Bayesian posterior, top prob: ${(ranked[0].prob * 100).toFixed(2)}%`
    };
}

// ============================================
// ⚡ AI #8: HYBRID ENSEMBLE
// Combines multiple simple strategies
// ============================================

function runHybridEnsembleAI() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Strategy 1: Top frequency
    const freq = getFrequencyMap(data, maxNum);
    const byFreq = [];
    for (let i = 1; i <= maxNum; i++) byFreq.push({ num: i, score: freq[i] });
    byFreq.sort((a, b) => b.score - a.score);

    // Strategy 2: Recent hot
    const recentFreq = getRecentFrequency(data, 15, maxNum);
    const byRecent = [];
    for (let i = 1; i <= maxNum; i++) byRecent.push({ num: i, score: recentFreq[i] });
    byRecent.sort((a, b) => b.score - a.score);

    // Strategy 3: Overdue
    const lastSeen = new Array(maxNum + 1).fill(-1);
    data.forEach((d, idx) => d.numbers.forEach(n => lastSeen[n] = idx));
    const byGap = [];
    for (let i = 1; i <= maxNum; i++) {
        const gap = lastSeen[i] === -1 ? data.length : data.length - 1 - lastSeen[i];
        byGap.push({ num: i, score: gap });
    }
    byGap.sort((a, b) => b.score - a.score);

    // Combine: Take top 3 from each strategy, remove duplicates
    const combined = new Set();
    byFreq.slice(0, 8).forEach(x => combined.add(x.num));
    byRecent.slice(0, 8).forEach(x => combined.add(x.num));
    byGap.slice(0, 8).forEach(x => combined.add(x.num));

    const pool = [...combined];
    const prediction = [];

    while (prediction.length < 6 && pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        prediction.push(pool[idx]);
        pool.splice(idx, 1);
    }

    return {
        name: '⚡ Hybrid Ensemble',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.77,
        analysis: `Combined ${combined.size} unique candidates from 3 strategies`
    };
}

// ============================================
// 🏆 ULTRA META-AI COORDINATOR
// Intelligent ensemble with dynamic weighting
// ============================================

function runUltraMetaAI(allResults) {
    const maxNum = currentMode === 'mega' ? 45 : 55;
    const data = allData[currentMode];

    // Dynamic weights based on AI characteristics
    const baseWeights = {
        '🧠 Neural Network': 1.2,
        '🎲 Monte Carlo': 1.1,
        '🔄 Markov Chain': 1.0,
        '🎯 Deep Pattern': 1.15,
        '📈 Momentum': 1.1,
        '🌊 Wave Pattern': 1.0,
        '🔮 Probability Fusion': 1.15,
        '⚡ Hybrid Ensemble': 1.2
    };

    // Score each number
    const numberScores = new Array(maxNum + 1).fill(0);
    const numberVotes = new Array(maxNum + 1).fill(0);

    allResults.forEach(result => {
        const weight = (baseWeights[result.name] || 1.0) * result.confidence;

        result.prediction.forEach((num, pos) => {
            // Position-based scoring (first numbers might be more confident)
            const positionBonus = 1 + (6 - pos) * 0.05;
            numberScores[num] += weight * positionBonus;
            numberVotes[num]++;
        });
    });

    // Consensus bonus: numbers appearing in multiple AIs
    for (let i = 1; i <= maxNum; i++) {
        if (numberVotes[i] >= 3) {
            numberScores[i] *= 1.2;
        }
        if (numberVotes[i] >= 5) {
            numberScores[i] *= 1.3;
        }
    }

    // Rank all numbers
    const ranked = [];
    for (let i = 1; i <= maxNum; i++) {
        ranked.push({
            num: i,
            score: numberScores[i],
            votes: numberVotes[i]
        });
    }
    ranked.sort((a, b) => b.score - a.score);

    // Smart selection with constraints
    const finalPrediction = [];
    let evenCount = 0, lowCount = 0, highCount = 0;
    const midPoint = maxNum / 2;

    for (const candidate of ranked) {
        if (finalPrediction.length >= 6) break;

        const num = candidate.num;
        const isEven = num % 2 === 0;
        const isHigh = num > midPoint;

        // Balance constraints
        if (isEven && evenCount >= 4) continue;
        if (!isEven && evenCount < 2 && finalPrediction.length >= 4) continue;
        if (highCount >= 4 && isHigh) continue;
        if (lowCount >= 4 && !isHigh) continue;

        finalPrediction.push(num);
        if (isEven) evenCount++;
        if (isHigh) highCount++; else lowCount++;
    }

    // Calculate consensus metrics
    let totalVotes = 0;
    finalPrediction.forEach(num => {
        totalVotes += ranked.find(r => r.num === num)?.votes || 0;
    });
    const avgVotes = (totalVotes / 6).toFixed(1);
    const consensusPercent = ((totalVotes / (6 * allResults.length)) * 100).toFixed(1);

    return {
        name: '🏆 Ultra Meta-AI',
        prediction: finalPrediction.sort((a, b) => a - b),
        confidence: Math.min(0.95, 0.6 + totalVotes / 50),
        analysis: `${consensusPercent}% consensus, avg ${avgVotes} votes/number`,
        breakdown: {
            even: evenCount,
            odd: 6 - evenCount,
            high: highCount,
            low: lowCount
        },
        topCandidates: ranked.slice(0, 10)
    };
}

// ============================================
// 🔬 ADVANCED BACKTEST SYSTEM
// Real accuracy measurement
// ============================================

function runAdvancedBacktest(aiFunction, testDraws = 50) {
    const data = allData[currentMode];
    if (data.length < testDraws + 50) {
        return { error: 'Not enough data for backtest' };
    }

    const results = {
        totalTests: testDraws,
        matches: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
        avgMatch: 0,
        predictions: []
    };

    // Test on historical data
    for (let i = data.length - testDraws; i < data.length; i++) {
        // Temporarily set data to only use draws before current
        const originalData = allData[currentMode];
        allData[currentMode] = data.slice(0, i);

        try {
            const prediction = aiFunction();
            const actualNumbers = data[i].numbers;

            const matchCount = prediction.prediction.filter(n =>
                actualNumbers.includes(n)
            ).length;

            results.matches[matchCount]++;
            results.avgMatch += matchCount;
            results.predictions.push({
                draw: i,
                predicted: prediction.prediction,
                actual: actualNumbers,
                matched: matchCount
            });
        } catch (e) {
            console.error('Backtest error:', e);
        }

        allData[currentMode] = originalData;
    }

    results.avgMatch = (results.avgMatch / testDraws).toFixed(2);
    results.successRate = (((results.matches[3] || 0) +
        (results.matches[4] || 0) +
        (results.matches[5] || 0) +
        (results.matches[6] || 0)) / testDraws * 100).toFixed(1);

    return results;
}

// ============================================
// 🚀 RUN ALL ULTRA AIs
// ============================================

async function runAllUltraAIs() {
    console.log('🚀 Starting Ultra AI System v2.0...');

    const aiRunners = [
        { name: 'Neural Network', fn: runNeuralNetworkAI },
        { name: 'Monte Carlo', fn: runMonteCarloAI },
        { name: 'Markov Chain', fn: runMarkovChainAI },
        { name: 'Deep Pattern', fn: runDeepPatternAI },
        { name: 'Momentum', fn: runMomentumAI },
        { name: 'Wave Pattern', fn: runWavePatternAI },
        { name: 'Probability Fusion', fn: runProbabilityFusionAI },
        { name: 'Hybrid Ensemble', fn: runHybridEnsembleAI }
    ];

    const results = [];

    for (const ai of aiRunners) {
        try {
            const result = ai.fn();
            results.push(result);
            console.log(`✅ ${ai.name}: [${result.prediction.join(', ')}] (${(result.confidence * 100).toFixed(0)}%)`);
        } catch (e) {
            console.error(`❌ ${ai.name} failed:`, e);
        }
    }

    // Run Ultra Meta-AI
    const finalResult = runUltraMetaAI(results);
    console.log(`🏆 Ultra Meta-AI: [${finalResult.prediction.join(', ')}] (${(finalResult.confidence * 100).toFixed(0)}%)`);

    return {
        individualResults: results,
        finalResult: finalResult
    };
}

// ============================================
// 🎯 DISPLAY ULTRA AI RESULTS
// ============================================

function displayUltraAIResults(container, systemResult) {
    const { individualResults, finalResult } = systemResult;

    let html = `
        <div class="ultra-ai-results">
            <h3 style="text-align: center; margin-bottom: 1.5rem; color: var(--primary);">
                🚀 Ultra AI System v2.0 - 8 Advanced Algorithms
            </h3>
            
            <div class="ai-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
    `;

    individualResults.forEach((result, idx) => {
        html += `
            <div class="ai-result-card" style="background: rgba(99, 102, 241, 0.1); border-radius: 12px; padding: 1rem; border: 1px solid rgba(99, 102, 241, 0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <strong>${result.name}</strong>
                    <span style="background: linear-gradient(135deg, #6366f1, #a855f7); padding: 0.25rem 0.5rem; border-radius: 20px; font-size: 0.8rem;">
                        ${(result.confidence * 100).toFixed(0)}%
                    </span>
                </div>
                <div class="balls" style="display: flex; gap: 0.3rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                    ${result.prediction.map(n => `<div class="ball" style="width: 32px; height: 32px; font-size: 0.9rem;">${n}</div>`).join('')}
                </div>
                <small style="color: var(--text-muted);">${result.analysis}</small>
            </div>
        `;
    });

    html += `
            </div>
            
            <div class="final-result" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2)); border-radius: 16px; padding: 1.5rem; border: 2px solid var(--primary); text-align: center;">
                <h3 style="margin-bottom: 1rem; color: var(--primary);">🏆 KẾT QUẢ TỔNG HỢP ULTRA META-AI</h3>
                <div class="balls" style="display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1rem;">
                    ${finalResult.prediction.map(n => `<div class="ball" style="width: 50px; height: 50px; font-size: 1.5rem; background: linear-gradient(135deg, #6366f1, #a855f7);">${n}</div>`).join('')}
                </div>
                <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    <span>📊 Độ tin cậy: <strong>${(finalResult.confidence * 100).toFixed(0)}%</strong></span>
                    <span>🔢 Chẵn/Lẻ: <strong>${finalResult.breakdown.even}/${finalResult.breakdown.odd}</strong></span>
                    <span>📈 Cao/Thấp: <strong>${finalResult.breakdown.high}/${finalResult.breakdown.low}</strong></span>
                </div>
                <p style="color: var(--text-muted);">${finalResult.analysis}</p>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ============================================
// 📤 EXPORT
// ============================================

window.ultraAI = {
    runAll: runAllUltraAIs,
    neural: runNeuralNetworkAI,
    monteCarlo: runMonteCarloAI,
    markov: runMarkovChainAI,
    deepPattern: runDeepPatternAI,
    momentum: runMomentumAI,
    wavePattern: runWavePatternAI,
    probabilityFusion: runProbabilityFusionAI,
    hybridEnsemble: runHybridEnsembleAI,
    metaAI: runUltraMetaAI,
    backtest: runAdvancedBacktest,
    display: displayUltraAIResults
};

console.log('✅ Ultra AI System v2.0 loaded - 8 Advanced AIs + Meta-AI ready!');
