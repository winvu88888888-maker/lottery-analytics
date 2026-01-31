// ============================================
// 🧠 ADVANCED AI RESEARCH SYSTEM
// 10 Specialized AIs + 1 Meta-AI Coordinator
// ============================================

// AI Weights (learned from performance)
let aiWeights = JSON.parse(localStorage.getItem('aiWeights')) || {
    ai1: 1.0, ai2: 1.0, ai3: 1.0, ai4: 1.0, ai5: 1.0,
    ai6: 1.0, ai7: 1.0, ai8: 1.0, ai9: 1.0, ai10: 1.0
};

// Track AI performance history
let aiPerformance = JSON.parse(localStorage.getItem('aiPerformance')) || [];

// ============================================
// 🔬 RESEARCH AIs (1-3): Pattern Discovery
// ============================================

// AI-R1: Consecutive Number Pattern Analyzer
function runResearchAI1_ConsecutivePatterns() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Analyze consecutive number patterns in winning draws
    const consecutiveStats = { pairs: {}, triples: {} };

    data.forEach(draw => {
        const sorted = [...draw.numbers].sort((a, b) => a - b);
        for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i + 1] - sorted[i] === 1) {
                const pair = `${sorted[i]}-${sorted[i + 1]}`;
                consecutiveStats.pairs[pair] = (consecutiveStats.pairs[pair] || 0) + 1;
            }
        }
    });

    // Find most common consecutive patterns
    const topPairs = Object.entries(consecutiveStats.pairs)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    // Build prediction avoiding common consecutive (they're rare individually)
    const recentNumbers = new Set();
    data.slice(-10).forEach(d => d.numbers.forEach(n => recentNumbers.add(n)));

    const prediction = [];
    const candidates = [];
    for (let i = 1; i <= maxNum; i++) {
        if (!recentNumbers.has(i)) {
            candidates.push(i);
        }
    }

    // Select spread-out numbers
    while (prediction.length < 6 && candidates.length > 0) {
        const idx = Math.floor(Math.random() * candidates.length);
        const num = candidates[idx];

        // Check not consecutive with existing
        const hasConsecutive = prediction.some(p => Math.abs(p - num) === 1);
        if (!hasConsecutive || prediction.length >= 4) {
            prediction.push(num);
        }
        candidates.splice(idx, 1);
    }

    return {
        name: 'Consecutive Pattern',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.7,
        analysis: `Found ${topPairs.length} common pairs`
    };
}

// AI-R2: Gap Analysis - Numbers that are "due"
function runResearchAI2_GapAnalysis() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Calculate gap (draws since last appearance) for each number
    const lastSeen = new Array(maxNum + 1).fill(-1);
    const totalDraws = data.length;

    data.forEach((draw, idx) => {
        draw.numbers.forEach(n => lastSeen[n] = idx);
    });

    const gaps = [];
    for (let i = 1; i <= maxNum; i++) {
        const gap = lastSeen[i] === -1 ? totalDraws : totalDraws - 1 - lastSeen[i];
        gaps.push({ num: i, gap, lastSeen: lastSeen[i] });
    }

    // Numbers with high gaps are "due"
    gaps.sort((a, b) => b.gap - a.gap);

    // Mix: 3 numbers with high gap, 3 with medium gap
    const prediction = [];
    const highGap = gaps.slice(0, 15);
    const mediumGap = gaps.slice(15, 30);

    while (prediction.length < 3 && highGap.length > 0) {
        const idx = Math.floor(Math.random() * Math.min(10, highGap.length));
        prediction.push(highGap[idx].num);
        highGap.splice(idx, 1);
    }

    while (prediction.length < 6 && mediumGap.length > 0) {
        const idx = Math.floor(Math.random() * mediumGap.length);
        prediction.push(mediumGap[idx].num);
        mediumGap.splice(idx, 1);
    }

    return {
        name: 'Gap Analysis',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.65,
        analysis: `Max gap: ${gaps[0].gap} draws (number ${gaps[0].num})`
    };
}

// AI-R3: Sum Range Pattern
function runResearchAI3_SumRangePattern() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Analyze sum of winning numbers
    const sums = data.map(d => d.numbers.reduce((a, b) => a + b, 0));
    const avgSum = sums.reduce((a, b) => a + b, 0) / sums.length;
    const recentSum = sums.slice(-10).reduce((a, b) => a + b, 0) / 10;

    // Target sum based on mean reversion
    const targetSum = avgSum + (avgSum - recentSum) * 0.3;

    // Build prediction that targets this sum
    const prediction = [];
    let attempts = 0;

    while (attempts < 1000) {
        const candidate = [];
        while (candidate.length < 6) {
            const n = Math.floor(Math.random() * maxNum) + 1;
            if (!candidate.includes(n)) candidate.push(n);
        }

        const sum = candidate.reduce((a, b) => a + b, 0);
        if (Math.abs(sum - targetSum) < 20) {
            return {
                name: 'Sum Range Pattern',
                prediction: candidate.sort((a, b) => a - b),
                confidence: 0.6,
                analysis: `Target sum: ${Math.round(targetSum)}, Avg: ${Math.round(avgSum)}`
            };
        }
        attempts++;
    }

    // Fallback
    while (prediction.length < 6) {
        const n = Math.floor(Math.random() * maxNum) + 1;
        if (!prediction.includes(n)) prediction.push(n);
    }

    return {
        name: 'Sum Range Pattern',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.5,
        analysis: `Target sum: ${Math.round(targetSum)}`
    };
}

// ============================================
// 👨‍🔬 SPECIALIST AIs (4-6): Domain Experts
// ============================================

// AI-S1: Jackpot Correlation Specialist
function runSpecialistAI4_JackpotCorrelation() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Categorize draws by jackpot quartiles
    const jackpots = data.map(d => currentMode === 'mega' ? d.jackpot : d.jackpot1);
    jackpots.sort((a, b) => a - b);
    const q1 = jackpots[Math.floor(jackpots.length * 0.25)];
    const q2 = jackpots[Math.floor(jackpots.length * 0.5)];
    const q3 = jackpots[Math.floor(jackpots.length * 0.75)];

    // Count numbers by quartile
    const quartileNums = { q1: {}, q2: {}, q3: {}, q4: {} };

    data.forEach(d => {
        const jp = currentMode === 'mega' ? d.jackpot : d.jackpot1;
        let q;
        if (jp <= q1) q = 'q1';
        else if (jp <= q2) q = 'q2';
        else if (jp <= q3) q = 'q3';
        else q = 'q4';

        d.numbers.forEach(n => {
            quartileNums[q][n] = (quartileNums[q][n] || 0) + 1;
        });
    });

    // Current jackpot quartile
    const currentJp = currentMode === 'mega' ? data[data.length - 1].jackpot : data[data.length - 1].jackpot1;
    let currentQ;
    if (currentJp <= q1) currentQ = 'q1';
    else if (currentJp <= q2) currentQ = 'q2';
    else if (currentJp <= q3) currentQ = 'q3';
    else currentQ = 'q4';

    // Get best numbers for current quartile
    const scores = [];
    for (let i = 1; i <= maxNum; i++) {
        scores.push({ num: i, score: quartileNums[currentQ][i] || 0 });
    }
    scores.sort((a, b) => b.score - a.score);

    const prediction = scores.slice(0, 15)
        .sort(() => Math.random() - 0.5)
        .slice(0, 6)
        .map(s => s.num);

    return {
        name: 'Jackpot Correlation',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.7,
        analysis: `Current quartile: ${currentQ.toUpperCase()}`
    };
}

// AI-S2: Day of Week Specialist
function runSpecialistAI5_DayOfWeek() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Build day-specific frequency
    const dayFreq = {};
    for (let i = 0; i < 7; i++) {
        dayFreq[i] = new Array(maxNum + 1).fill(0);
    }

    data.forEach(d => {
        try {
            const parts = d.date.split('/');
            const date = new Date(parts[2], parts[1] - 1, parts[0]);
            const day = date.getDay();
            d.numbers.forEach(n => dayFreq[day][n]++);
        } catch (e) { }
    });

    // Get numbers for next draw day (assuming Wed, Fri, Sun for Mega)
    const today = new Date().getDay();
    const nextDrawDay = [0, 3, 5].includes(today) ? today :
        today < 3 ? 3 : today < 5 ? 5 : 0;

    const scores = [];
    for (let i = 1; i <= maxNum; i++) {
        scores.push({ num: i, score: dayFreq[nextDrawDay][i] });
    }
    scores.sort((a, b) => b.score - a.score);

    const prediction = scores.slice(0, 20)
        .sort(() => Math.random() - 0.5)
        .slice(0, 6)
        .map(s => s.num);

    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    return {
        name: 'Day Specialist',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.65,
        analysis: `Optimized for: ${dayNames[nextDrawDay]}`
    };
}

// AI-S3: Recent Trend Specialist
function runSpecialistAI6_RecentTrend() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Heavily weight recent draws
    const recentFreq = new Array(maxNum + 1).fill(0);
    const last20 = data.slice(-20);

    last20.forEach((d, idx) => {
        const weight = (idx + 1) / 10; // More recent = higher weight
        d.numbers.forEach(n => recentFreq[n] += weight);
    });

    const scores = [];
    for (let i = 1; i <= maxNum; i++) {
        scores.push({ num: i, score: recentFreq[i] });
    }
    scores.sort((a, b) => b.score - a.score);

    // Mix hot and cold from recent
    const hot = scores.slice(0, 10);
    const cold = scores.slice(-10);

    const prediction = [];
    while (prediction.length < 4) {
        const pick = hot[Math.floor(Math.random() * hot.length)];
        if (!prediction.includes(pick.num)) prediction.push(pick.num);
    }
    while (prediction.length < 6) {
        const pick = cold[Math.floor(Math.random() * cold.length)];
        if (!prediction.includes(pick.num)) prediction.push(pick.num);
    }

    return {
        name: 'Recent Trend',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.7,
        analysis: `Based on last 20 draws`
    };
}

// ============================================
// 🧬 EVOLUTION AIs (7-8): Self-Improving
// ============================================

// AI-E1: Advanced Genetic Algorithm
function runEvolutionAI7_AdvancedGenetic() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Historical frequency for fitness
    const freq = new Array(maxNum + 1).fill(0);
    data.forEach(d => d.numbers.forEach(n => freq[n]++));

    // Pair frequency for bonus fitness
    const pairFreq = {};
    data.forEach(d => {
        for (let i = 0; i < d.numbers.length; i++) {
            for (let j = i + 1; j < d.numbers.length; j++) {
                const pair = [d.numbers[i], d.numbers[j]].sort((a, b) => a - b).join('-');
                pairFreq[pair] = (pairFreq[pair] || 0) + 1;
            }
        }
    });

    // Advanced fitness function
    const fitness = (individual) => {
        let score = 0;

        // Base frequency score
        individual.forEach(n => score += freq[n] * 2);

        // Pair bonus
        for (let i = 0; i < individual.length; i++) {
            for (let j = i + 1; j < individual.length; j++) {
                const pair = [individual[i], individual[j]].sort((a, b) => a - b).join('-');
                score += (pairFreq[pair] || 0) * 3;
            }
        }

        // Balance bonus
        const even = individual.filter(n => n % 2 === 0).length;
        if (even >= 2 && even <= 4) score += 20;

        // Spread bonus
        const sorted = [...individual].sort((a, b) => a - b);
        const spread = sorted[5] - sorted[0];
        if (spread > maxNum * 0.5 && spread < maxNum * 0.9) score += 15;

        // Sum bonus (near average)
        const sum = individual.reduce((a, b) => a + b, 0);
        const avgSum = (maxNum * 7) / 2; // Approximate average
        if (Math.abs(sum - avgSum) < 30) score += 10;

        return score;
    };

    // Larger population, more generations
    const popSize = 100;
    const generations = 50;
    let population = [];

    // Initialize with smart seeding
    for (let i = 0; i < popSize; i++) {
        const individual = [];
        while (individual.length < 6) {
            // Bias toward frequent numbers
            const pool = [];
            for (let n = 1; n <= maxNum; n++) {
                for (let f = 0; f < Math.max(1, freq[n] / 10); f++) {
                    pool.push(n);
                }
            }
            const n = pool[Math.floor(Math.random() * pool.length)];
            if (!individual.includes(n)) individual.push(n);
        }
        population.push(individual);
    }

    // Evolution with elitism
    for (let gen = 0; gen < generations; gen++) {
        population.sort((a, b) => fitness(b) - fitness(a));

        // Keep top 10% (elitism)
        const elites = population.slice(0, popSize / 10);
        const breeders = population.slice(0, popSize / 2);

        population = [...elites];

        while (population.length < popSize) {
            const p1 = breeders[Math.floor(Math.random() * breeders.length)];
            const p2 = breeders[Math.floor(Math.random() * breeders.length)];

            // Uniform crossover
            const child = [];
            const genePool = [...new Set([...p1, ...p2])];
            genePool.sort(() => Math.random() - 0.5);

            for (const gene of genePool) {
                if (child.length < 6 && !child.includes(gene)) {
                    child.push(gene);
                }
            }

            // Fill remaining
            while (child.length < 6) {
                const n = Math.floor(Math.random() * maxNum) + 1;
                if (!child.includes(n)) child.push(n);
            }

            // Mutation
            if (Math.random() < 0.15) {
                const idx = Math.floor(Math.random() * 6);
                let newN;
                do {
                    newN = Math.floor(Math.random() * maxNum) + 1;
                } while (child.includes(newN));
                child[idx] = newN;
            }

            population.push(child);
        }
    }

    population.sort((a, b) => fitness(b) - fitness(a));

    return {
        name: 'Advanced Genetic',
        prediction: population[0].sort((a, b) => a - b),
        confidence: 0.75,
        analysis: `${generations} generations, fitness: ${fitness(population[0])}`
    };
}

// AI-E2: Simulated Annealing Optimizer
function runEvolutionAI8_SimulatedAnnealing() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    const freq = new Array(maxNum + 1).fill(0);
    data.forEach(d => d.numbers.forEach(n => freq[n]++));

    const energy = (state) => {
        let e = 0;
        state.forEach(n => e -= freq[n]); // Lower is better

        // Penalize consecutive numbers
        const sorted = [...state].sort((a, b) => a - b);
        for (let i = 0; i < 5; i++) {
            if (sorted[i + 1] - sorted[i] === 1) e += 20;
        }

        return e;
    };

    // Initial random state
    let current = [];
    while (current.length < 6) {
        const n = Math.floor(Math.random() * maxNum) + 1;
        if (!current.includes(n)) current.push(n);
    }

    let best = [...current];
    let bestEnergy = energy(best);
    let temperature = 100;
    const coolingRate = 0.995;

    for (let iter = 0; iter < 5000; iter++) {
        // Generate neighbor
        const neighbor = [...current];
        const idx = Math.floor(Math.random() * 6);
        let newN;
        do {
            newN = Math.floor(Math.random() * maxNum) + 1;
        } while (neighbor.includes(newN));
        neighbor[idx] = newN;

        const currentEnergy = energy(current);
        const neighborEnergy = energy(neighbor);

        // Accept if better, or probabilistically if worse
        if (neighborEnergy < currentEnergy ||
            Math.random() < Math.exp((currentEnergy - neighborEnergy) / temperature)) {
            current = neighbor;

            if (energy(current) < bestEnergy) {
                best = [...current];
                bestEnergy = energy(best);
            }
        }

        temperature *= coolingRate;
    }

    return {
        name: 'Simulated Annealing',
        prediction: best.sort((a, b) => a - b),
        confidence: 0.7,
        analysis: `Final energy: ${bestEnergy.toFixed(0)}`
    };
}

// ============================================
// ⚔️ ADVERSARIAL AIs (9-10): Validators
// ============================================

// AI-A1: Anti-Pattern Detector
function runAdversarialAI9_AntiPattern() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Find numbers that NEVER appear together
    const cooccurrence = {};
    for (let i = 1; i <= maxNum; i++) {
        for (let j = i + 1; j <= maxNum; j++) {
            cooccurrence[`${i}-${j}`] = 0;
        }
    }

    data.forEach(d => {
        for (let i = 0; i < d.numbers.length; i++) {
            for (let j = i + 1; j < d.numbers.length; j++) {
                const pair = [d.numbers[i], d.numbers[j]].sort((a, b) => a - b).join('-');
                cooccurrence[pair]++;
            }
        }
    });

    // Find pairs that DO appear together often
    const commonPairs = Object.entries(cooccurrence)
        .filter(([k, v]) => v > 3)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);

    // Build prediction from common pair numbers
    const poolNumbers = new Set();
    commonPairs.forEach(([pair]) => {
        const [a, b] = pair.split('-').map(Number);
        poolNumbers.add(a);
        poolNumbers.add(b);
    });

    const pool = [...poolNumbers];
    const prediction = [];
    while (prediction.length < 6 && pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        prediction.push(pool[idx]);
        pool.splice(idx, 1);
    }

    // Fill if needed
    while (prediction.length < 6) {
        const n = Math.floor(Math.random() * maxNum) + 1;
        if (!prediction.includes(n)) prediction.push(n);
    }

    return {
        name: 'Anti-Pattern',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.65,
        analysis: `Found ${commonPairs.length} common pairs`
    };
}

// AI-A2: Contrarian Strategy
function runAdversarialAI10_Contrarian() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // What numbers has everyone been ignoring?
    const recent50Freq = new Array(maxNum + 1).fill(0);
    data.slice(-50).forEach(d => d.numbers.forEach(n => recent50Freq[n]++));

    const allTimeFreq = new Array(maxNum + 1).fill(0);
    data.forEach(d => d.numbers.forEach(n => allTimeFreq[n]++));

    // Find numbers that are underperforming recently vs all-time
    const underperformers = [];
    for (let i = 1; i <= maxNum; i++) {
        const expectedRecent = (allTimeFreq[i] / data.length) * 50;
        const actualRecent = recent50Freq[i];
        const deviation = expectedRecent - actualRecent;
        if (deviation > 0) {
            underperformers.push({ num: i, deviation });
        }
    }

    underperformers.sort((a, b) => b.deviation - a.deviation);

    const prediction = underperformers.slice(0, 15)
        .sort(() => Math.random() - 0.5)
        .slice(0, 6)
        .map(u => u.num);

    // Fill if needed
    while (prediction.length < 6) {
        const n = Math.floor(Math.random() * maxNum) + 1;
        if (!prediction.includes(n)) prediction.push(n);
    }

    return {
        name: 'Contrarian',
        prediction: prediction.sort((a, b) => a - b),
        confidence: 0.6,
        analysis: `Found ${underperformers.length} underperforming numbers`
    };
}

// ============================================
// 🎯 META-AI: Intelligent Coordinator
// ============================================

function runMetaAI_Coordinator(allResults) {
    const maxNum = currentMode === 'mega' ? 45 : 55;

    // Score each number based on weighted votes from all AIs
    const numberScores = new Array(maxNum + 1).fill(0);

    allResults.forEach((result, idx) => {
        const aiKey = `ai${idx + 1}`;
        const weight = aiWeights[aiKey] * result.confidence;

        result.prediction.forEach((num, pos) => {
            // Higher score for numbers appearing in multiple predictions
            numberScores[num] += weight * (1 + (6 - pos) * 0.1);
        });
    });

    // Rank numbers by total score
    const ranked = [];
    for (let i = 1; i <= maxNum; i++) {
        ranked.push({ num: i, score: numberScores[i] });
    }
    ranked.sort((a, b) => b.score - a.score);

    // Apply constraints for final selection
    const finalPrediction = [];
    let evenCount = 0;
    let highCount = 0;
    const midPoint = maxNum / 2;

    for (const candidate of ranked) {
        if (finalPrediction.length >= 6) break;

        const num = candidate.num;
        const isEven = num % 2 === 0;
        const isHigh = num > midPoint;

        // Balance constraints
        if (isEven && evenCount >= 4) continue;
        if (!isEven && (6 - finalPrediction.length) <= (4 - evenCount)) continue;
        if (isHigh && highCount >= 4) continue;

        finalPrediction.push(num);
        if (isEven) evenCount++;
        if (isHigh) highCount++;
    }

    // Calculate agreement score
    let totalAgreement = 0;
    finalPrediction.forEach(num => {
        allResults.forEach(result => {
            if (result.prediction.includes(num)) totalAgreement++;
        });
    });

    const agreementPercent = ((totalAgreement / (6 * allResults.length)) * 100).toFixed(1);

    return {
        name: 'META-AI Coordinator',
        prediction: finalPrediction.sort((a, b) => a - b),
        confidence: Math.min(0.95, 0.5 + totalAgreement / 100),
        analysis: `${agreementPercent}% agreement across ${allResults.length} AIs`,
        breakdown: {
            even: evenCount,
            odd: 6 - evenCount,
            high: highCount,
            low: 6 - highCount
        }
    };
}

// ============================================
// 🚀 RUN ALL ADVANCED AIs
// ============================================

async function runAdvancedAISystem() {
    console.log('🧠 Starting Advanced AI Research System...');

    const allResults = [];
    const aiRunner = [
        { name: 'Research AI 1', fn: runResearchAI1_ConsecutivePatterns },
        { name: 'Research AI 2', fn: runResearchAI2_GapAnalysis },
        { name: 'Research AI 3', fn: runResearchAI3_SumRangePattern },
        { name: 'Specialist AI 4', fn: runSpecialistAI4_JackpotCorrelation },
        { name: 'Specialist AI 5', fn: runSpecialistAI5_DayOfWeek },
        { name: 'Specialist AI 6', fn: runSpecialistAI6_RecentTrend },
        { name: 'Evolution AI 7', fn: runEvolutionAI7_AdvancedGenetic },
        { name: 'Evolution AI 8', fn: runEvolutionAI8_SimulatedAnnealing },
        { name: 'Adversarial AI 9', fn: runAdversarialAI9_AntiPattern },
        { name: 'Adversarial AI 10', fn: runAdversarialAI10_Contrarian }
    ];

    for (const ai of aiRunner) {
        try {
            const result = ai.fn();
            allResults.push(result);
            console.log(`✅ ${ai.name}: ${result.prediction.join(', ')}`);
        } catch (e) {
            console.error(`❌ ${ai.name} failed:`, e);
        }
    }

    // Run Meta-AI coordinator
    const finalResult = runMetaAI_Coordinator(allResults);
    console.log(`🎯 META-AI Final: ${finalResult.prediction.join(', ')}`);

    return {
        individualResults: allResults,
        finalResult: finalResult
    };
}

// Export for use in main logic
window.advancedAI = {
    runAll: runAdvancedAISystem,
    research: {
        consecutive: runResearchAI1_ConsecutivePatterns,
        gap: runResearchAI2_GapAnalysis,
        sumRange: runResearchAI3_SumRangePattern
    },
    specialist: {
        jackpot: runSpecialistAI4_JackpotCorrelation,
        dayOfWeek: runSpecialistAI5_DayOfWeek,
        recentTrend: runSpecialistAI6_RecentTrend
    },
    evolution: {
        genetic: runEvolutionAI7_AdvancedGenetic,
        annealing: runEvolutionAI8_SimulatedAnnealing
    },
    adversarial: {
        antiPattern: runAdversarialAI9_AntiPattern,
        contrarian: runAdversarialAI10_Contrarian
    },
    meta: runMetaAI_Coordinator
};

console.log('🧠 Advanced AI System Loaded - 10 AIs + 1 Meta-AI ready');
