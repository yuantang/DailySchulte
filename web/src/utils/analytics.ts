import { ClickLog, DailyStreakData, GridSize, RadarMetrics, SessionRecord } from '../types';

const SESSIONS_STORAGE_KEY = 'daily_schulte_sessions_v1';
const STREAK_STORAGE_KEY = 'daily_schulte_streak_v1';

/**
 * Compute multi-dimensional cognitive radar metrics from click history and session stats
 */
export function calculateRadarMetrics(
  clickLogs: ClickLog[],
  totalTimeMs: number,
  size: GridSize,
  errorsCount: number
): RadarMetrics {
  const correctLogs = clickLogs.filter((log) => log.isCorrect);
  if (correctLogs.length === 0) {
    return {
      reactionSpeed: 50,
      attentionStability: 50,
      visualSpan: 50,
      mentalEndurance: 50,
      accuracy: 50,
      overallScore: 50
    };
  }

  const latencies = correctLogs.map((l) => l.latencyMs);
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;

  // 1. 反应速度 (Reaction Speed):
  // Benchmark: < 600ms = 98, 800ms = 90, 1200ms = 75, 2000ms = 60, > 3500ms = 40
  const speedScore = Math.max(30, Math.min(99, Math.round(100 - (avgLatency - 400) / 35)));

  // 2. 注意力稳定性 (Attention Stability):
  // Standard Deviation / Mean (Coefficient of Variation)
  const variance = latencies.reduce((acc, val) => acc + Math.pow(val - avgLatency, 2), 0) / latencies.length;
  const stdDev = Math.sqrt(variance);
  const cv = avgLatency > 0 ? stdDev / avgLatency : 1;
  // CV < 0.3 is very stable (95+), CV > 0.8 is fluctuating
  const stabilityScore = Math.max(30, Math.min(99, Math.round(100 - cv * 70)));

  // 3. 视野广度 (Visual Span):
  // Based on Euclidean distances between consecutive targets and how fast they are caught
  let totalDistanceRate = 0;
  let distCount = 0;
  for (let i = 1; i < correctLogs.length; i++) {
    const prev = correctLogs[i - 1];
    const curr = correctLogs[i];
    if (prev.coord && curr.coord) {
      const dx = (curr.coord.x - prev.coord.x) / 100;
      const dy = (curr.coord.y - prev.coord.y) / 100;
      const dist = Math.hypot(dx, dy); // distance in 0..1 scale
      const timeSec = Math.max(0.2, curr.latencyMs / 1000);
      const speed = dist / timeSec; // distance traversed per second
      totalDistanceRate += speed;
      distCount++;
    }
  }
  const avgDistRate = distCount > 0 ? totalDistanceRate / distCount : 0.5;
  // avgDistRate ~ 0.8+ is high peripheral scanning speed
  const visualSpanScore = Math.max(35, Math.min(99, Math.round(50 + avgDistRate * 45)));

  // 4. 心智耐力 (Mental Endurance):
  // Compare latency of early 30% vs late 30%
  const chunkLen = Math.max(2, Math.floor(latencies.length * 0.3));
  const earlyChunk = latencies.slice(0, chunkLen);
  const lateChunk = latencies.slice(latencies.length - chunkLen);
  const earlyAvg = earlyChunk.reduce((a, b) => a + b, 0) / earlyChunk.length;
  const lateAvg = lateChunk.reduce((a, b) => a + b, 0) / lateChunk.length;
  // Ratio of late to early
  const fatigueRatio = earlyAvg > 0 ? lateAvg / earlyAvg : 1;
  // If fatigueRatio <= 1.0, user sped up or kept pace; if > 1.5, noticeable fatigue
  const enduranceScore = Math.max(35, Math.min(99, Math.round(95 - (fatigueRatio - 0.9) * 45)));

  // 5. 准确率 (Accuracy):
  const totalAttempts = clickLogs.length;
  const accuracyRate = totalAttempts > 0 ? ((totalAttempts - errorsCount) / totalAttempts) * 100 : 100;
  const accuracyScore = Math.max(20, Math.min(100, Math.round(accuracyRate)));

  // 6. 综合评分 (Weighted Overall):
  const overallScore = Math.round(
    speedScore * 0.28 +
    stabilityScore * 0.24 +
    visualSpanScore * 0.20 +
    enduranceScore * 0.16 +
    accuracyScore * 0.12
  );

  return {
    reactionSpeed: speedScore,
    attentionStability: stabilityScore,
    visualSpan: visualSpanScore,
    mentalEndurance: enduranceScore,
    accuracy: accuracyScore,
    overallScore
  };
}

/**
 * Diagnostic assessment text according to score and grid size
 */
export function getPerformanceAssessment(record: SessionRecord): {
  tier: string;
  badgeColor: string;
  summary: string;
  advice: string;
} {
  const { size, totalTimeMs, metrics } = record;
  const timeSec = totalTimeMs / 1000;

  // 5x5 standard benchmarks
  if (size === 5) {
    if (timeSec <= 15) {
      return {
        tier: '顶尖水平 (≤15s)',
        badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
        summary: '视野广阔，反应极其敏捷，点击节奏连贯稳定。',
        advice: '可尝试 6×6、7×7 或双轨交替等进阶题型，进一步挑战视觉扫描范围。'
      };
    } else if (timeSec <= 25) {
      return {
        tier: '优秀水平 (16-25s)',
        badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        summary: '视觉搜索敏捷，反应迅速，点击节奏平稳顺畅。',
        advice: '建议尝试视线锚定于中心点，利用周边余光识别周围数字，减少眼球大幅频繁扫动。'
      };
    } else if (timeSec <= 40) {
      return {
        tier: '良好水平 (26-40s)',
        badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
        summary: '反应良好，数字定位清晰，具备扎实的基础。',
        advice: '可关注偶尔出现的停顿点，尽量保持前后点击节奏的一致性。'
      };
    } else {
      return {
        tier: '基础水平 (>40s)',
        badgeColor: 'text-slate-700 bg-slate-100 border-slate-200',
        summary: '完成本次训练。坚持日常练习有助于建立对数字分布的快速直觉。',
        advice: '建议开启中心红点辅助，保持视线平稳，循序渐进练习。'
      };
    }
  }

  // Generic evaluation for other sizes
  if (metrics.overallScore >= 90) {
    return {
      tier: '优秀 (≥90分)',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
      summary: '反应速度快，各项指标均衡，发挥稳定。',
      advice: '可尝试双轨交替或抗干扰模式，挑战更多变的应用场景。'
    };
  } else if (metrics.overallScore >= 75) {
    return {
      tier: '良好 (75-89分)',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      summary: '节奏平稳，搜索效率良好，失误率低。',
      advice: '注意保持后半程的点击节奏，减少用时波动。'
    };
  } else {
    return {
      tier: '练习中 (<75分)',
      badgeColor: 'text-slate-700 bg-slate-100 border-slate-200',
      summary: '顺利完成本次训练。',
      advice: '可先从较小规格或基础正序开始练习，逐步提升熟练度。'
    };
  }
}

/**
 * Storage helpers
 */
export function getStoredSessions(): SessionRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSessionRecord(record: SessionRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getStoredSessions();
    const updated = [record, ...history].slice(0, 150); // Keep latest 150 sessions
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
    updateDailyStreak(record.dayKey);
  } catch (err) {
    console.error('Failed to save session record', err);
  }
}

export function deleteSessionRecord(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getStoredSessions();
    const updated = history.filter((s) => s.id !== id);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete session record', err);
  }
}

export function getDailyStreakData(): DailyStreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastCompletedDate: '', historyDates: [] };
  }
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) {
      return { currentStreak: 0, longestStreak: 0, lastCompletedDate: '', historyDates: [] };
    }
    return JSON.parse(raw);
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastCompletedDate: '', historyDates: [] };
  }
}

export function updateDailyStreak(todayKey: string): DailyStreakData {
  const current = getDailyStreakData();
  const historyDates = Array.from(new Set([...current.historyDates, todayKey])).sort();

  // Calculate streak
  const today = new Date(todayKey);
  let streak = 0;

  // Check backwards from today
  const checkDate = new Date(today);
  while (true) {
    const checkKey = checkDate.toISOString().split('T')[0];
    if (historyDates.includes(checkKey)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const updated: DailyStreakData = {
    currentStreak: streak,
    longestStreak: Math.max(current.longestStreak, streak),
    lastCompletedDate: todayKey,
    historyDates
  };

  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function exportDataAsJSON(): string {
  const sessions = getStoredSessions();
  const streak = getDailyStreakData();
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), sessions, streak }, null, 2);
}

export function importDataFromJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.sessions && Array.isArray(parsed.sessions)) {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(parsed.sessions));
    }
    if (parsed.streak) {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(parsed.streak));
    }
    return true;
  } catch {
    return false;
  }
}

export function clearAllData(): void {
  localStorage.removeItem(SESSIONS_STORAGE_KEY);
  localStorage.removeItem(STREAK_STORAGE_KEY);
}
