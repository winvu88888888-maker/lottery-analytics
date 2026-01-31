// ============================================
// 🔮 QUANTUM AI SYSTEM - MAXIMUM OPTIMIZATION
// The Most Advanced Prediction System
// ============================================

console.log('🔮 Loading Quantum AI System...');

// ============================================
// 📊 STATISTICAL ANALYSIS ENGINE
// ============================================

class StatisticalEngine {
    constructor(data, maxNum) {
        this.data = data;
        this.maxNum = maxNum;
        this.totalDraws = data.length;
    }

    // Tính tần suất tổng thể
    getOverallFrequency() {
        const freq = new Array(this.maxNum + 1).fill(0);
        this.data.forEach(d => d.numbers.forEach(n => freq[n]++));
        return freq;
    }

    // Tính tần suất gần đây có trọng số
    getWeightedRecentFrequency(lastN = 50) {
        const freq = new Array(this.maxNum + 1).fill(0);
        const recentData = this.data.slice(-lastN);

        recentData.forEach((d, idx) => {
            const weight = (idx + 1) / lastN; // Gần hơn = trọng số cao hơn
            d.numbers.forEach(n => freq[n] += weight);
        });

        return freq;
    }

    // Tính gap (số kỳ chưa xuất hiện)
    getGapScores() {
        const lastSeen = new Array(this.maxNum + 1).fill(-1);
        this.data.forEach((d, idx) => d.numbers.forEach(n => lastSeen[n] = idx));

        const gaps = [];
        for (let i = 1; i <= this.maxNum; i++) {
            gaps[i] = lastSeen[i] === -1 ? this.totalDraws : this.totalDraws - 1 - lastSeen[i];
        }
        return gaps;
    }

    // Phân tích cặp số
    getPairAnalysis() {
        const pairs = {};
        this.data.forEach(d => {
            for (let i = 0; i < d.numbers.length; i++) {
                for (let j = i + 1; j < d.numbers.length; j++) {
                    const pair = [d.numbers[i], d.numbers[j]].sort((a, b) => a - b).join('-');
                    pairs[pair] = (pairs[pair] || 0) + 1;
                }
            }
        });
        return pairs;
    }

    // Phân tích bộ ba số
    getTripleAnalysis() {
        const triples = {};
        this.data.forEach(d => {
            for (let i = 0; i < d.numbers.length; i++) {
                for (let j = i + 1; j < d.numbers.length; j++) {
                    for (let k = j + 1; k < d.numbers.length; k++) {
                        const triple = [d.numbers[i], d.numbers[j], d.numbers[k]]
                            .sort((a, b) => a - b).join('-');
                        triples[triple] = (triples[triple] || 0) + 1;
                    }
                }
            }
        });
        return triples;
    }

    // Tính tổng trung bình
    getAverageSum() {
        const sums = this.data.map(d => d.numbers.reduce((a, b) => a + b, 0));
        return sums.reduce((a, b) => a + b, 0) / sums.length;
    }

    // Phân tích chẵn/lẻ
    getEvenOddPattern() {
        const patterns = this.data.slice(-100).map(d => {
            const even = d.numbers.filter(n => n % 2 === 0).length;
            return even;
        });
        const avg = patterns.reduce((a, b) => a + b, 0) / patterns.length;
        return Math.round(avg);
    }

    // Phân tích cao/thấp
    getHighLowPattern() {
        const mid = this.maxNum / 2;
        const patterns = this.data.slice(-100).map(d => {
            const high = d.numbers.filter(n => n > mid).length;
            return high;
        });
        const avg = patterns.reduce((a, b) => a + b, 0) / patterns.length;
        return Math.round(avg);
    }
}

// ============================================
// 🧬 GENETIC OPTIMIZER - ADVANCED
// ============================================

class GeneticOptimizer {
    constructor(statsEngine, config = {}) {
        this.stats = statsEngine;
        this.populationSize = config.populationSize || 200;
        this.generations = config.generations || 100;
        this.mutationRate = config.mutationRate || 0.15;
        this.eliteRatio = config.eliteRatio || 0.1;

        this.freq = this.stats.getOverallFrequency();
        this.recentFreq = this.stats.getWeightedRecentFrequency();
        this.gaps = this.stats.getGapScores();
        this.pairs = this.stats.getPairAnalysis();
        this.avgSum = this.stats.getAverageSum();
        this.targetEven = this.stats.getEvenOddPattern();
        this.targetHigh = this.stats.getHighLowPattern();
    }

    // Hàm fitness nâng cao
    fitness(individual) {
        let score = 0;
        const maxNum = this.stats.maxNum;

        // 1. Điểm tần suất tổng thể
        individual.forEach(n => score += this.freq[n] * 3);

        // 2. Điểm tần suất gần đây (quan trọng hơn)
        individual.forEach(n => score += this.recentFreq[n] * 5);

        // 3. Điểm gap - thưởng số "đến hạn"
        individual.forEach(n => {
            const gap = this.gaps[n];
            if (gap >= 5 && gap <= 15) score += 20; // Sweet spot
            else if (gap > 15) score += 10; // Overdue
        });

        // 4. Điểm cặp số phổ biến
        for (let i = 0; i < individual.length; i++) {
            for (let j = i + 1; j < individual.length; j++) {
                const pair = [individual[i], individual[j]].sort((a, b) => a - b).join('-');
                score += (this.pairs[pair] || 0) * 4;
            }
        }

        // 5. Điểm tổng gần trung bình
        const sum = individual.reduce((a, b) => a + b, 0);
        const sumDiff = Math.abs(sum - this.avgSum);
        if (sumDiff < 20) score += 30;
        else if (sumDiff < 40) score += 15;

        // 6. Điểm cân bằng chẵn/lẻ
        const evenCount = individual.filter(n => n % 2 === 0).length;
        const evenDiff = Math.abs(evenCount - this.targetEven);
        score += (3 - evenDiff) * 10;

        // 7. Điểm cân bằng cao/thấp
        const mid = maxNum / 2;
        const highCount = individual.filter(n => n > mid).length;
        const highDiff = Math.abs(highCount - this.targetHigh);
        score += (3 - highDiff) * 10;

        // 8. Điểm phân bố đều
        const sorted = [...individual].sort((a, b) => a - b);
        const spread = sorted[5] - sorted[0];
        if (spread > maxNum * 0.5 && spread < maxNum * 0.85) score += 25;

        // 9. Phạt consecutive quá nhiều
        let consecutiveCount = 0;
        for (let i = 0; i < 5; i++) {
            if (sorted[i + 1] - sorted[i] === 1) consecutiveCount++;
        }
        if (consecutiveCount > 2) score -= 30;

        return score;
    }

    // Tạo cá thể ban đầu thông minh
    createIndividual() {
        const individual = [];
        const maxNum = this.stats.maxNum;

        // Tạo pool có trọng số
        const pool = [];
        for (let n = 1; n <= maxNum; n++) {
            const weight = Math.max(1, Math.floor(this.freq[n] / 5 + this.recentFreq[n] * 2));
            for (let w = 0; w < weight; w++) {
                pool.push(n);
            }
        }

        while (individual.length < 6) {
            const n = pool[Math.floor(Math.random() * pool.length)];
            if (!individual.includes(n)) individual.push(n);
        }

        return individual;
    }

    // Crossover
    crossover(parent1, parent2) {
        const child = [];
        const genes = [...new Set([...parent1, ...parent2])];
        genes.sort(() => Math.random() - 0.5);

        for (const gene of genes) {
            if (child.length < 6 && !child.includes(gene)) {
                child.push(gene);
            }
        }

        // Fill if needed
        while (child.length < 6) {
            const n = Math.floor(Math.random() * this.stats.maxNum) + 1;
            if (!child.includes(n)) child.push(n);
        }

        return child;
    }

    // Mutation
    mutate(individual) {
        if (Math.random() < this.mutationRate) {
            const idx = Math.floor(Math.random() * 6);
            let newN;
            do {
                newN = Math.floor(Math.random() * this.stats.maxNum) + 1;
            } while (individual.includes(newN));
            individual[idx] = newN;
        }
        return individual;
    }

    // Chạy tiến hóa
    evolve() {
        // Khởi tạo quần thể
        let population = [];
        for (let i = 0; i < this.populationSize; i++) {
            population.push(this.createIndividual());
        }

        // Tiến hóa qua các thế hệ
        for (let gen = 0; gen < this.generations; gen++) {
            // Đánh giá fitness
            population.sort((a, b) => this.fitness(b) - this.fitness(a));

            // Elite selection
            const eliteCount = Math.floor(this.populationSize * this.eliteRatio);
            const newPop = population.slice(0, eliteCount);

            // Breeding
            const breeders = population.slice(0, this.populationSize / 2);
            while (newPop.length < this.populationSize) {
                const p1 = breeders[Math.floor(Math.random() * breeders.length)];
                const p2 = breeders[Math.floor(Math.random() * breeders.length)];
                let child = this.crossover(p1, p2);
                child = this.mutate(child);
                newPop.push(child);
            }

            population = newPop;
        }

        // Trả về top 5 cá thể tốt nhất
        population.sort((a, b) => this.fitness(b) - this.fitness(a));
        return population.slice(0, 5).map(ind => ({
            numbers: ind.sort((a, b) => a - b),
            fitness: this.fitness(ind)
        }));
    }
}

// ============================================
// 🎯 QUANTUM AI - MAIN PREDICTOR
// ============================================

function runQuantumAI() {
    const data = allData[currentMode];
    const maxNum = currentMode === 'mega' ? 45 : 55;

    console.log('🔮 Quantum AI analyzing...');

    // Khởi tạo engines
    const statsEngine = new StatisticalEngine(data, maxNum);
    const geneticOptimizer = new GeneticOptimizer(statsEngine, {
        populationSize: 300,
        generations: 150,
        mutationRate: 0.12,
        eliteRatio: 0.15
    });

    // Chạy genetic algorithm
    const geneticResults = geneticOptimizer.evolve();
    console.log('🧬 Genetic results:', geneticResults);

    // Phân tích thống kê bổ sung
    const freq = statsEngine.getOverallFrequency();
    const recentFreq = statsEngine.getWeightedRecentFrequency();
    const gaps = statsEngine.getGapScores();
    const pairs = statsEngine.getPairAnalysis();

    // Tính điểm cho mỗi số
    const numberScores = new Array(maxNum + 1).fill(0);

    // 1. Genetic votes
    geneticResults.forEach((result, rank) => {
        const weight = (5 - rank) * 10;
        result.numbers.forEach(n => numberScores[n] += weight);
    });

    // 2. Frequency score
    const maxFreq = Math.max(...freq);
    for (let i = 1; i <= maxNum; i++) {
        numberScores[i] += (freq[i] / maxFreq) * 30;
    }

    // 3. Recent frequency score
    const maxRecent = Math.max(...recentFreq);
    for (let i = 1; i <= maxNum; i++) {
        numberScores[i] += (recentFreq[i] / maxRecent) * 40;
    }

    // 4. Gap score (mean reversion)
    for (let i = 1; i <= maxNum; i++) {
        if (gaps[i] >= 5 && gaps[i] <= 12) numberScores[i] += 25;
        else if (gaps[i] > 12 && gaps[i] <= 20) numberScores[i] += 15;
    }

    // 5. Pair synergy (số xuất hiện nhiều với số khác hot)
    const topNumbers = Object.entries(pairs)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50);

    topNumbers.forEach(([pair, count]) => {
        const [a, b] = pair.split('-').map(Number);
        numberScores[a] += count * 0.5;
        numberScores[b] += count * 0.5;
    });

    // Rank tất cả số
    const ranked = [];
    for (let i = 1; i <= maxNum; i++) {
        ranked.push({ num: i, score: numberScores[i] });
    }
    ranked.sort((a, b) => b.score - a.score);

    // Chọn final prediction với constraints
    const finalPrediction = [];
    const targetEven = statsEngine.getEvenOddPattern();
    const targetHigh = statsEngine.getHighLowPattern();
    let evenCount = 0, highCount = 0;
    const mid = maxNum / 2;

    for (const candidate of ranked) {
        if (finalPrediction.length >= 6) break;

        const num = candidate.num;
        const isEven = num % 2 === 0;
        const isHigh = num > mid;

        // Balance constraints
        if (isEven && evenCount >= targetEven + 1) continue;
        if (!isEven && (6 - finalPrediction.length) <= (targetEven - evenCount)) continue;
        if (highCount >= targetHigh + 1 && isHigh) continue;

        finalPrediction.push(num);
        if (isEven) evenCount++;
        if (isHigh) highCount++;
    }

    // Tính confidence dựa trên nhiều yếu tố
    const avgScore = finalPrediction.reduce((sum, n) => {
        return sum + ranked.find(r => r.num === n).score;
    }, 0) / 6;

    const maxPossibleScore = ranked[0].score;
    const confidenceRaw = (avgScore / maxPossibleScore) * 100;
    const confidence = Math.min(85, Math.max(65, confidenceRaw));

    return {
        name: '🔮 Quantum AI',
        prediction: finalPrediction.sort((a, b) => a - b),
        confidence: confidence,
        geneticTop: geneticResults[0].numbers,
        geneticFitness: geneticResults[0].fitness,
        breakdown: {
            even: evenCount,
            odd: 6 - evenCount,
            high: highCount,
            low: 6 - highCount
        },
        topCandidates: ranked.slice(0, 15),
        analysis: `Gen fitness: ${geneticResults[0].fitness.toFixed(0)}, Avg score: ${avgScore.toFixed(1)}`
    };
}

// ============================================
// 🎰 GENERATE MULTIPLE SETS
// ============================================

function generateQuantumSets(count = 5) {
    const sets = [];
    const usedCombinations = new Set();

    for (let i = 0; i < count; i++) {
        let result;
        let attempts = 0;

        do {
            result = runQuantumAI();
            const key = result.prediction.join('-');
            if (!usedCombinations.has(key)) {
                usedCombinations.add(key);
                sets.push(result);
                break;
            }
            attempts++;
        } while (attempts < 10);
    }

    return sets;
}

// ============================================
// 📊 DISPLAY QUANTUM RESULTS
// ============================================

function displayQuantumResults(container, results) {
    let html = `
        <div class="quantum-results">
            <div class="quantum-header" style="text-align: center; margin-bottom: 2rem;">
                <h2 style="font-size: 1.8rem; background: linear-gradient(135deg, #6366f1, #a855f7, #22d3ee); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    🔮 QUANTUM AI - KẾT QUẢ TỐI ƯU
                </h2>
                <p style="color: var(--text-muted);">Thuật toán di truyền 300 cá thể × 150 thế hệ</p>
            </div>

            <div class="quantum-main-result" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2)); border-radius: 20px; padding: 2rem; text-align: center; border: 2px solid var(--primary); margin-bottom: 2rem;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">🏆 BỘ SỐ TỐI ƯU NHẤT</h3>
                <div class="balls" style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem;">
                    ${results.prediction.map(n => `
                        <div class="ball" style="width: 60px; height: 60px; font-size: 1.5rem; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);">
                            ${n}
                        </div>
                    `).join('')}
                </div>
                
                <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    <span style="background: rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 20px;">
                        📊 Độ tin cậy: <strong style="color: var(--success);">${results.confidence.toFixed(1)}%</strong>
                    </span>
                    <span style="background: rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 20px;">
                        🔢 Chẵn/Lẻ: <strong>${results.breakdown.even}/${results.breakdown.odd}</strong>
                    </span>
                    <span style="background: rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 20px;">
                        📈 Cao/Thấp: <strong>${results.breakdown.high}/${results.breakdown.low}</strong>
                    </span>
                </div>
                
                <div class="confidence-bar" style="width: 100%; height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden; margin-top: 1rem;">
                    <div style="width: ${results.confidence}%; height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7, #10b981); border-radius: 5px;"></div>
                </div>
            </div>

            <div class="quantum-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                <div class="card" style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3);">
                    <h4 style="color: var(--primary); margin-bottom: 1rem;">🧬 Genetic Algorithm Result</h4>
                    <div class="balls" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                        ${results.geneticTop.map(n => `<div class="ball" style="width: 36px; height: 36px;">${n}</div>`).join('')}
                    </div>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Fitness Score: ${results.geneticFitness.toFixed(0)}</p>
                </div>

                <div class="card" style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3);">
                    <h4 style="color: var(--secondary); margin-bottom: 1rem;">🔥 Top 10 Hot Numbers</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${results.topCandidates.slice(0, 10).map((c, idx) => `
                            <div style="display: flex; align-items: center; gap: 0.3rem; background: rgba(255,255,255,0.05); padding: 0.3rem 0.6rem; border-radius: 20px;">
                                <span style="background: var(--primary); color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600;">${c.num}</span>
                                <span style="color: var(--text-muted); font-size: 0.75rem;">${c.score.toFixed(0)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(245, 158, 11, 0.1); border-radius: 12px; border: 1px solid rgba(245, 158, 11, 0.3);">
                <p style="color: var(--warning); margin: 0;">
                    ⚠️ <strong>Lưu ý:</strong> Đây là kết quả từ thuật toán tối ưu hóa dựa trên dữ liệu lịch sử. 
                    Xổ số là ngẫu nhiên và không thể dự đoán 100% chính xác.
                </p>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ============================================
// 📤 EXPORT
// ============================================

window.quantumAI = {
    run: runQuantumAI,
    generateSets: generateQuantumSets,
    display: displayQuantumResults,
    StatisticalEngine,
    GeneticOptimizer
};

console.log('✅ Quantum AI System loaded - Advanced Genetic Algorithm ready!');
