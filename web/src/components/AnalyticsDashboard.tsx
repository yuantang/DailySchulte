import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from 'recharts';
import {
  Activity,
  Award,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Flame,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  Zap,
  BarChart2,
  AlertCircle,
} from 'lucide-react';
import { SessionRecord, GridSize } from '../types';
import { SharePosterModal } from './SharePosterModal';
import {
  exportDataAsJSON,
  importDataFromJSON,
  clearAllData,
  deleteSessionRecord,
  getPerformanceAssessment,
} from '../utils/analytics';

interface AnalyticsDashboardProps {
  sessions: SessionRecord[];
  onRefreshData: () => void;
  onSelectSessionToPlay?: (size: GridSize) => void;
  initialSelectedSessionId?: string | null;
}

type MainTab = 'period' | 'performance' | 'session' | 'history';
type PeriodMode = 'day' | 'week' | 'month' | 'year';

interface HeatmapDay {
  dateStr: string;
  date: Date;
  dayOfWeek: number; // 0=Mon, ..., 6=Sun
  month: number;
  dayOfMonth: number;
  count: number;
  totalMinutes: string;
  bestTimeSec: string | null;
  level: 0 | 1 | 2 | 3 | 4;
  isFuture: boolean;
  isToday: boolean;
}

export const MODE_NAMES: Record<string, string> = {
  numbers_asc: '经典正序',
  numbers_desc: '逆向倒序',
  numbers_odd: '奇数筛选',
  numbers_even: '偶数筛选',
  numbers_skip: '步长跳跃',
  roman_numerals: '罗马数字',
  letters_asc: '英文大写',
  letters_desc: '字母倒序',
  letters_case: '大小写交替',
  chinese_pinyin: '汉语拼音',
  chinese_poetry: '经典古诗',
  chinese_chars: '国风千字文',
  chinese_stems: '天干地支',
  chinese_idioms: '成语寻踪',
  red_asc_black_desc: '格尔波夫红黑表',
  red_black: '红黑双轨',
  trail_making: '数字字母连线',
  odd_even_switch: '奇偶双轨',
  symbols: '几何星象符号',
  color_gradient: '光谱色彩',
  stroop_color: '斯特鲁普抗干扰',
  math_calc: '心算速算',
  blind_memory: '记忆盲打',
  dynamic_shift: '动态微移',
  custom_text: '自定义题库',
};

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  sessions,
  onRefreshData,
  onSelectSessionToPlay,
  initialSelectedSessionId,
}) => {
  // Main Tab Navigation
  const [activeTab, setActiveTab] = useState<MainTab>(
    initialSelectedSessionId ? 'session' : 'period'
  );

  // Time Dimension Mode: Day | Week | Month | Year
  const [periodMode, setPeriodMode] = useState<PeriodMode>('week');

  // Time navigation offset (0 = current, -1 = previous, etc.)
  const [periodOffset, setPeriodOffset] = useState<number>(0);

  // Global size filter for performance & history tabs
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<number | 'all'>('all');

  // Active session for deep drill-down in 'session' tab
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    initialSelectedSessionId || (sessions[0]?.id ?? null)
  );

  // Modals
  const [sessionToDelete, setSessionToDelete] = useState<SessionRecord | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [posterRecord, setPosterRecord] = useState<SessionRecord | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync initialSelectedSessionId if changed
  useEffect(() => {
    if (initialSelectedSessionId) {
      setSelectedSessionId(initialSelectedSessionId);
      setActiveTab('session');
    }
  }, [initialSelectedSessionId]);

  // Overall Aggregate Statistics
  const overallStats = useMemo(() => {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        best5x5Time: null,
        avgTapMs: 0,
        avgOverallScore: 0,
        totalMinutesFocused: '0',
      };
    }

    const fiveByFives = sessions.filter((s) => s.size === 5);
    const best5x5 =
      fiveByFives.length > 0
        ? Math.min(...fiveByFives.map((s) => s.totalTimeMs))
        : null;

    const totalTapMs = sessions.reduce((acc, s) => acc + s.averageTapMs, 0);
    const totalScore = sessions.reduce((acc, s) => acc + s.metrics.overallScore, 0);
    const totalDurationMs = sessions.reduce((acc, s) => acc + s.totalTimeMs, 0);

    return {
      totalSessions: sessions.length,
      best5x5Time: best5x5 ? (best5x5 / 1000).toFixed(2) : null,
      avgTapMs: Math.round(totalTapMs / sessions.length),
      avgOverallScore: Math.round(totalScore / sessions.length),
      totalMinutesFocused: (totalDurationMs / (1000 * 60)).toFixed(1),
    };
  }, [sessions]);

  // Heatmap state and reference
  const heatmapContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  // GitHub-style contribution heatmap for the past 53 weeks (~371 days)
  const yearHeatmap = useMemo(() => {
    const sessionsByDay = new Map<string, { count: number; totalMs: number; bestMs: number | null }>();
    sessions.forEach((s) => {
      const existing = sessionsByDay.get(s.dayKey) || { count: 0, totalMs: 0, bestMs: null };
      existing.count += 1;
      existing.totalMs += s.totalTimeMs;
      existing.bestMs = existing.bestMs === null ? s.totalTimeMs : Math.min(existing.bestMs, s.totalTimeMs);
      sessionsByDay.set(s.dayKey, existing);
    });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Align end date to Sunday of current week (ISO Monday=0 ... Sunday=6)
    const dayOfWeek = now.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + daysUntilSunday);
    endDate.setHours(23, 59, 59, 999);

    // 53 weeks
    const totalWeeks = 53;
    const totalDays = totalWeeks * 7;
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - totalDays + 1);
    startDate.setHours(0, 0, 0, 0);

    const weeks: Array<{ weekIndex: number; days: HeatmapDay[] }> = [];
    const monthLabels: Array<{ weekIndex: number; label: string }> = [];

    let lastMonth = -1;
    const cur = new Date(startDate);

    let pastYearTotalSessions = 0;
    let pastYearActiveDays = 0;
    let maxSessionsInDay = 0;

    for (let w = 0; w < totalWeeks; w++) {
      const days: HeatmapDay[] = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = cur.toISOString().split('T')[0];
        const month = cur.getMonth() + 1;
        const dayOfMonth = cur.getDate();
        const isToday = dateStr === todayStr;
        const isFuture = cur > now && !isToday;

        const dayData = sessionsByDay.get(dateStr);
        const count = isFuture ? 0 : (dayData?.count || 0);
        const totalMs = dayData?.totalMs || 0;
        const bestMs = dayData?.bestMs ?? null;

        if (!isFuture && count > 0) {
          pastYearTotalSessions += count;
          pastYearActiveDays += 1;
          if (count > maxSessionsInDay) maxSessionsInDay = count;
        }

        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (count >= 7) level = 4;
        else if (count >= 4) level = 3;
        else if (count >= 2) level = 2;
        else if (count >= 1) level = 1;

        days.push({
          dateStr,
          date: new Date(cur),
          dayOfWeek: d,
          month,
          dayOfMonth,
          count,
          totalMinutes: (totalMs / (1000 * 60)).toFixed(1),
          bestTimeSec: bestMs ? (bestMs / 1000).toFixed(2) : null,
          level,
          isFuture,
          isToday,
        });

        // Track month label at the start of each month
        if (d === 0 && month !== lastMonth && w < totalWeeks - 1) {
          monthLabels.push({ weekIndex: w, label: `${month}月` });
          lastMonth = month;
        }

        cur.setDate(cur.getDate() + 1);
      }
      weeks.push({ weekIndex: w, days });
    }

    // Calculate streak from sessionsByDay
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const checkDate = new Date(now);
    while (true) {
      const checkKey = checkDate.toISOString().split('T')[0];
      if (sessionsByDay.has(checkKey) && sessionsByDay.get(checkKey)!.count > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const walkDate = new Date(startDate);
    while (walkDate <= now) {
      const walkKey = walkDate.toISOString().split('T')[0];
      if (sessionsByDay.has(walkKey) && sessionsByDay.get(walkKey)!.count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
      walkDate.setDate(walkDate.getDate() + 1);
    }

    return {
      weeks,
      monthLabels,
      pastYearTotalSessions,
      pastYearActiveDays,
      maxSessionsInDay,
      currentStreak,
      longestStreak,
    };
  }, [sessions]);

  // Auto-scroll heatmap to far right on load so latest days are immediately visible
  useEffect(() => {
    if (heatmapContainerRef.current) {
      heatmapContainerRef.current.scrollLeft = heatmapContainerRef.current.scrollWidth;
    }
  }, [yearHeatmap]);

  // Filtered sessions for Performance and History tabs
  const filteredSessions = useMemo(() => {
    if (selectedSizeFilter === 'all') return sessions;
    return sessions.filter((s) => s.size === selectedSizeFilter);
  }, [sessions, selectedSizeFilter]);

  // Active session currently inspected in 'session' tab
  const activeSession = useMemo(() => {
    if (selectedSessionId) {
      const found = sessions.find((s) => s.id === selectedSessionId);
      if (found) return found;
    }
    return filteredSessions[0] || sessions[0] || null;
  }, [sessions, filteredSessions, selectedSessionId]);

  // =========================================================================
  // TIME DIMENSION DATA CALCULATIONS (日 · 周 · 月 · 年)
  // =========================================================================
  const periodData = useMemo(() => {
    const now = new Date();

    if (periodMode === 'day') {
      // Offset by days
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + periodOffset);
      const targetDateStr = targetDate.toISOString().split('T')[0];
      const isToday = periodOffset === 0;

      const daySessions = sessions
        .filter((s) => s.dayKey === targetDateStr)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const count = daySessions.length;
      const totalDurationMs = daySessions.reduce((acc, s) => acc + s.totalTimeMs, 0);
      const bestTimeMs = count > 0 ? Math.min(...daySessions.map((s) => s.totalTimeMs)) : null;
      const avgTapMs = count > 0 ? Math.round(daySessions.reduce((acc, s) => acc + s.averageTapMs, 0) / count) : 0;

      // Chart: Each session in this day as a sequence step
      const dayChartData = daySessions.map((s, idx) => ({
        label: `第${idx + 1}局`,
        timeSec: Number((s.totalTimeMs / 1000).toFixed(2)),
        timeFormatted: s.dateFormatted.slice(11, 16),
        score: s.metrics.overallScore,
        size: `${s.size}×${s.size}`,
        durationMin: Number((s.totalTimeMs / (1000 * 60)).toFixed(1)),
      }));

      return {
        title: isToday ? '今天' : targetDateStr,
        subTitle: `${targetDate.getFullYear()}年${targetDate.getMonth() + 1}月${targetDate.getDate()}日`,
        count,
        totalMinutes: (totalDurationMs / (1000 * 60)).toFixed(1),
        bestTimeSec: bestTimeMs ? (bestTimeMs / 1000).toFixed(2) : null,
        avgTapMs: (avgTapMs / 1000).toFixed(2),
        activeDaysCount: count > 0 ? 1 : 0,
        dayChartData,
        barChartData: [] as { label: string; subLabel?: string; count: number; durationMin: number }[],
        sessionsList: daySessions,
      };
    }

    if (periodMode === 'week') {
      // Offset by weeks (7 days per unit)
      const baseDate = new Date(now);
      baseDate.setDate(now.getDate() + periodOffset * 7);

      const dayOfWeek = baseDate.getDay(); // 0 is Sunday
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(baseDate);
      monday.setDate(baseDate.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const weekDayLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      const weekDays: { dateStr: string; label: string; dayName: string }[] = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        weekDays.push({
          dateStr: d.toISOString().split('T')[0],
          label: `${d.getMonth() + 1}/${d.getDate()}`,
          dayName: weekDayLabels[i],
        });
      }

      const weekDateStrings = weekDays.map((w) => w.dateStr);
      const weekSessions = sessions.filter((s) => weekDateStrings.includes(s.dayKey));

      const count = weekSessions.length;
      const totalDurationMs = weekSessions.reduce((acc, s) => acc + s.totalTimeMs, 0);
      const bestTimeMs = count > 0 ? Math.min(...weekSessions.map((s) => s.totalTimeMs)) : null;
      const activeDaysCount = new Set(weekSessions.map((s) => s.dayKey)).size;

      // Chart: 7 days breakdown
      const barChartData = weekDays.map((w) => {
        const matches = weekSessions.filter((s) => s.dayKey === w.dateStr);
        const dayDurationMs = matches.reduce((acc, s) => acc + s.totalTimeMs, 0);
        return {
          label: w.dayName,
          subLabel: w.label,
          count: matches.length,
          durationMin: Number((dayDurationMs / (1000 * 60)).toFixed(1)),
        };
      });

      const isCurrentWeek = periodOffset === 0;
      const title = isCurrentWeek
        ? '本周'
        : `${monday.getMonth() + 1}.${monday.getDate()} - ${sunday.getMonth() + 1}.${sunday.getDate()}`;

      return {
        title,
        subTitle: `${monday.getFullYear()}年 第${Math.ceil((monday.getDate() - 1) / 7) + 1}周`,
        count,
        totalMinutes: (totalDurationMs / (1000 * 60)).toFixed(1),
        bestTimeSec: bestTimeMs ? (bestTimeMs / 1000).toFixed(2) : null,
        avgTapMs: null,
        activeDaysCount,
        dayChartData: [] as { label: string; timeSec: number; timeFormatted: string; score: number; size: string; durationMin: number }[],
        barChartData,
        sessionsList: weekSessions,
      };
    }

    if (periodMode === 'month') {
      // Offset by months
      const targetDate = new Date(now.getFullYear(), now.getMonth() + periodOffset, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth(); // 0-indexed
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
      const monthSessions = sessions.filter((s) => s.dayKey.startsWith(monthPrefix));

      const count = monthSessions.length;
      const totalDurationMs = monthSessions.reduce((acc, s) => acc + s.totalTimeMs, 0);
      const bestTimeMs = count > 0 ? Math.min(...monthSessions.map((s) => s.totalTimeMs)) : null;
      const activeDaysCount = new Set(monthSessions.map((s) => s.dayKey)).size;

      // Group days into individual days
      const barChartData = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const dStr = `${monthPrefix}-${String(day).padStart(2, '0')}`;
        const matches = monthSessions.filter((s) => s.dayKey === dStr);
        const dayDurationMs = matches.reduce((acc, s) => acc + s.totalTimeMs, 0);
        barChartData.push({
          label: `${day}日`,
          count: matches.length,
          durationMin: Number((dayDurationMs / (1000 * 60)).toFixed(1)),
        });
      }

      const isCurrentMonth = periodOffset === 0;
      const title = isCurrentMonth ? '本月' : `${year}年${month + 1}月`;

      return {
        title,
        subTitle: `${year}年${month + 1}月 (共 ${daysInMonth} 天)`,
        count,
        totalMinutes: (totalDurationMs / (1000 * 60)).toFixed(1),
        bestTimeSec: bestTimeMs ? (bestTimeMs / 1000).toFixed(2) : null,
        avgTapMs: null,
        activeDaysCount,
        dayChartData: [] as { label: string; timeSec: number; timeFormatted: string; score: number; size: string; durationMin: number }[],
        barChartData,
        sessionsList: monthSessions,
      };
    }

    // Default: 'year'
    const targetYear = now.getFullYear() + periodOffset;
    const yearPrefix = `${targetYear}-`;
    const yearSessions = sessions.filter((s) => s.dayKey.startsWith(yearPrefix));

    const count = yearSessions.length;
    const totalDurationMs = yearSessions.reduce((acc, s) => acc + s.totalTimeMs, 0);
    const bestTimeMs = count > 0 ? Math.min(...yearSessions.map((s) => s.totalTimeMs)) : null;
    const activeDaysCount = new Set(yearSessions.map((s) => s.dayKey)).size;

    // 12 months data
    const barChartData = [];
    for (let m = 1; m <= 12; m++) {
      const mPrefix = `${targetYear}-${String(m).padStart(2, '0')}`;
      const matches = yearSessions.filter((s) => s.dayKey.startsWith(mPrefix));
      const mDurationMs = matches.reduce((acc, s) => acc + s.totalTimeMs, 0);
      barChartData.push({
        label: `${m}月`,
        count: matches.length,
        durationMin: Number((mDurationMs / (1000 * 60)).toFixed(1)),
      });
    }

    const isCurrentYear = periodOffset === 0;
    const title = isCurrentYear ? '本年' : `${targetYear}年`;

    return {
      title,
      subTitle: `${targetYear}年度总训练量`,
      count,
      totalMinutes: (totalDurationMs / (1000 * 60)).toFixed(1),
      bestTimeSec: bestTimeMs ? (bestTimeMs / 1000).toFixed(2) : null,
      avgTapMs: null,
      activeDaysCount,
      dayChartData: [] as { label: string; timeSec: number; timeFormatted: string; score: number; size: string; durationMin: number }[],
      barChartData,
      sessionsList: yearSessions,
    };
  }, [sessions, periodMode, periodOffset]);

  // Personal Best Records Matrix across all grid sizes (3 to 9)
  const personalBestsMatrix = useMemo(() => {
    const sizes: GridSize[] = [3, 4, 5, 6, 7, 8, 9];
    return sizes.map((sz) => {
      const matching = sessions.filter((s) => s.size === sz);
      if (matching.length === 0) {
        return { size: sz, bestTimeSec: null, count: 0, avgTimeSec: null };
      }
      const bestMs = Math.min(...matching.map((s) => s.totalTimeMs));
      const avgMs = matching.reduce((acc, s) => acc + s.totalTimeMs, 0) / matching.length;
      return {
        size: sz,
        bestTimeSec: Number((bestMs / 1000).toFixed(2)),
        count: matching.length,
        avgTimeSec: Number((avgMs / 1000).toFixed(2)),
      };
    });
  }, [sessions]);

  // Aggregate Radar Data
  const aggregateRadarData = useMemo(() => {
    const targetPool = filteredSessions.length > 0 ? filteredSessions : sessions;
    if (targetPool.length === 0) return [];

    const avgReaction =
      targetPool.reduce((acc, s) => acc + s.metrics.reactionSpeed, 0) / targetPool.length;
    const avgStability =
      targetPool.reduce((acc, s) => acc + s.metrics.attentionStability, 0) / targetPool.length;
    const avgSpan =
      targetPool.reduce((acc, s) => acc + s.metrics.visualSpan, 0) / targetPool.length;
    const avgEndurance =
      targetPool.reduce((acc, s) => acc + s.metrics.mentalEndurance, 0) / targetPool.length;
    const avgAccuracy =
      targetPool.reduce((acc, s) => acc + s.metrics.accuracy, 0) / targetPool.length;

    return [
      { subject: '反应速度', value: Math.round(avgReaction), fullMark: 100 },
      { subject: '节奏平稳度', value: Math.round(avgStability), fullMark: 100 },
      { subject: '视野广度', value: Math.round(avgSpan), fullMark: 100 },
      { subject: '专注耐力', value: Math.round(avgEndurance), fullMark: 100 },
      { subject: '准确率', value: Math.round(avgAccuracy), fullMark: 100 },
    ];
  }, [filteredSessions, sessions]);

  // Historical progression line data
  const trendLineData = useMemo(() => {
    return [...filteredSessions]
      .reverse()
      .slice(-30)
      .map((s, idx) => ({
        index: idx + 1,
        date: s.dateFormatted.slice(5),
        timeSec: Number((s.totalTimeMs / 1000).toFixed(2)),
        avgTapMs: s.averageTapMs,
        stability: s.metrics.attentionStability,
      }));
  }, [filteredSessions]);

  // Latency step curve for active session
  const latencyData = useMemo(() => {
    if (!activeSession || !activeSession.clickLogs) return [];
    return activeSession.clickLogs.map((log) => ({
      step: log.step,
      target: log.targetKey,
      latencyMs: log.latencyMs,
      latencySec: (log.latencyMs / 1000).toFixed(2),
    }));
  }, [activeSession]);

  const medianLatency = useMemo(() => {
    if (!latencyData.length) return 0;
    const sorted = [...latencyData].map((d) => d.latencyMs).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }, [latencyData]);

  const hesitationPeaks = useMemo(() => {
    if (!latencyData.length || !medianLatency) return [];
    return latencyData.filter((d) => d.latencyMs > medianLatency * 1.8);
  }, [latencyData, medianLatency]);

  // Spatial hesitation heatmap for active session
  const spatialHeatmap = useMemo(() => {
    if (!activeSession || !activeSession.clickLogs || activeSession.shape !== 'grid') return null;

    const totalCells = activeSession.size * activeSession.size;
    const cellLatencies: number[] = new Array(totalCells).fill(0);
    const cellTargets: string[] = new Array(totalCells).fill('');

    activeSession.clickLogs.forEach((log) => {
      if (log.tileIndex >= 0 && log.tileIndex < totalCells) {
        cellLatencies[log.tileIndex] = log.latencyMs;
        cellTargets[log.tileIndex] = String(log.targetKey);
      }
    });

    const maxLatency = Math.max(...cellLatencies, 1);
    const minLatency = Math.min(...cellLatencies.filter((v) => v > 0), 0);

    return {
      size: activeSession.size,
      items: cellLatencies.map((lat, idx) => {
        const ratio = maxLatency === minLatency ? 0.5 : (lat - minLatency) / (maxLatency - minLatency);
        let colorClass = 'bg-emerald-100 text-emerald-950 border-emerald-300';
        if (ratio > 0.75) colorClass = 'bg-rose-500 text-white border-rose-600 font-bold';
        else if (ratio > 0.45) colorClass = 'bg-amber-300 text-amber-950 border-amber-400 font-semibold';
        else if (ratio > 0.25) colorClass = 'bg-emerald-300 text-emerald-950 border-emerald-400';

        return {
          index: idx,
          targetKey: cellTargets[idx] || `${idx + 1}`,
          latencyMs: lat,
          ratio,
          colorClass,
        };
      }),
    };
  }, [activeSession]);

  // Export / Import / Clear Data Handlers
  const handleExport = () => {
    const jsonStr = exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schulte-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content) {
        const ok = importDataFromJSON(content);
        if (ok) {
          onRefreshData();
          showToast('数据已成功恢复！', 'success');
        } else {
          showToast('数据格式不合法，导入失败。', 'error');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmClearAll = () => {
    clearAllData();
    onRefreshData();
    setShowClearConfirm(false);
    showToast('已清空所有练习记录', 'success');
  };

  const handleConfirmDeleteSession = () => {
    if (!sessionToDelete) return;
    deleteSessionRecord(sessionToDelete.id);
    onRefreshData();
    if (selectedSessionId === sessionToDelete.id) {
      setSelectedSessionId(null);
    }
    setSessionToDelete(null);
    showToast('已删除该条练习记录', 'success');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-3 pb-24 relative">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl shadow-lg text-xs font-bold transition-all animate-in fade-in slide-in-from-top duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-rose-600 text-white shadow-rose-600/30'
          }`}
        >
          {toastMessage.text}
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-slate-900">确认清空全部记录？</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              此操作将永久清空全部历史训练数据及打卡记录，操作不可撤回。建议您提前点击“导出”做好备份。
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Item Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-slate-900">确认删除该条记录？</h3>
            <p className="text-xs text-slate-600">
              规格: {sessionToDelete.size}×{sessionToDelete.size} · 用时:{' '}
              {(sessionToDelete.totalTimeMs / 1000).toFixed(2)}s · 日期:{' '}
              {sessionToDelete.dateFormatted}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSessionToDelete(null)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSession}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Ultra-Compact KPI Summary Bar (Eliminates the huge empty whitespace at the top) */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                数据统计
              </span>
              <span className="text-xs text-slate-400 ml-2 hidden sm:inline">
                专注力趋势与复盘
              </span>
            </div>
          </div>

          {overallStats.totalSessions > 0 && (
            <div className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>综合均分 {overallStats.avgOverallScore} 分</span>
            </div>
          )}
        </div>

        {/* 4 Compact Inline KPI Metrics (low vertical height, dense & readable) */}
        <div className="grid grid-cols-4 gap-2 pt-2 text-center">
          <div className="px-1 py-1 rounded-xl bg-slate-50/80">
            <span className="text-[10px] text-slate-400 block">累计练习</span>
            <span className="text-sm sm:text-base font-black text-slate-900 font-mono">
              {overallStats.totalSessions}
              <span className="text-[10px] font-normal text-slate-400 ml-0.5">次</span>
            </span>
          </div>

          <div className="px-1 py-1 rounded-xl bg-slate-50/80">
            <span className="text-[10px] text-slate-400 block">5×5 最佳</span>
            <span className="text-sm sm:text-base font-black text-emerald-600 font-mono">
              {overallStats.best5x5Time ? `${overallStats.best5x5Time}s` : '--'}
            </span>
          </div>

          <div className="px-1 py-1 rounded-xl bg-slate-50/80">
            <span className="text-[10px] text-slate-400 block">平均间隔</span>
            <span className="text-sm sm:text-base font-black text-slate-900 font-mono">
              {(overallStats.avgTapMs / 1000).toFixed(2)}s
            </span>
          </div>

          <div className="px-1 py-1 rounded-xl bg-slate-50/80">
            <span className="text-[10px] text-slate-400 block">专注时长</span>
            <span className="text-sm sm:text-base font-black text-slate-900 font-mono">
              {overallStats.totalMinutesFocused}
              <span className="text-[10px] font-normal text-slate-400 ml-0.5">分</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. GitHub-Style Annual Contribution Heatmap (年度训练打卡热力图) */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5">
        {/* Heatmap Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  年度训练热力图
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  近一年 {yearHeatmap.pastYearTotalSessions} 局
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                记录 365 天每日专注训练频次与持续打卡状态
              </p>
            </div>
          </div>

          {/* Quick Streak & Achievement Pills */}
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <div className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200/70 text-slate-700 flex items-center gap-1 text-[10px]">
              <span className="text-slate-400">活跃打卡:</span>
              <span className="font-bold text-slate-900 font-mono">{yearHeatmap.pastYearActiveDays}天</span>
            </div>
            <div className="px-2 py-0.5 rounded-lg bg-amber-50/80 border border-amber-200/70 text-amber-900 flex items-center gap-1 text-[10px]">
              <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
              <span className="text-amber-700">当前连续:</span>
              <span className="font-bold font-mono">{yearHeatmap.currentStreak}天</span>
            </div>
            <div className="px-2 py-0.5 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-emerald-900 flex items-center gap-1 text-[10px]">
              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
              <span className="text-emerald-700">最长连击:</span>
              <span className="font-bold font-mono">{yearHeatmap.longestStreak}天</span>
            </div>
          </div>
        </div>

        {/* Heatmap Matrix Grid Container */}
        <div className="relative">
          <div
            ref={heatmapContainerRef}
            className="overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="inline-flex gap-2 min-w-max pt-0.5 pb-1">
              {/* Left Day of Week Labels */}
              <div className="flex flex-col justify-between text-[9px] text-slate-400 font-medium select-none h-[84px] pt-4 shrink-0">
                <span className="leading-none">一</span>
                <span className="leading-none">三</span>
                <span className="leading-none">五</span>
                <span className="leading-none">日</span>
              </div>

              {/* 53 Weeks Grid Columns */}
              <div className="flex gap-[3px] shrink-0">
                {yearHeatmap.weeks.map((week) => {
                  const monthMarker = yearHeatmap.monthLabels.find((m) => m.weekIndex === week.weekIndex);

                  return (
                    <div key={week.weekIndex} className="flex flex-col gap-[3px]">
                      {/* Month label header cell */}
                      <div className="h-3 text-[9px] text-slate-400 font-bold whitespace-nowrap overflow-visible">
                        {monthMarker ? monthMarker.label : ''}
                      </div>

                      {/* 7 Day cells */}
                      {week.days.map((day) => {
                        let bgClass = 'bg-slate-100/90 border-slate-200/50 hover:bg-slate-200/80';
                        if (day.isFuture) {
                          bgClass = 'bg-slate-50 border-dashed border-slate-200/40 opacity-30 cursor-default';
                        } else if (day.level === 4) {
                          bgClass = 'bg-emerald-700 border-emerald-800 hover:bg-emerald-800';
                        } else if (day.level === 3) {
                          bgClass = 'bg-emerald-500 border-emerald-600 hover:bg-emerald-600';
                        } else if (day.level === 2) {
                          bgClass = 'bg-emerald-400 border-emerald-500 hover:bg-emerald-500';
                        } else if (day.level === 1) {
                          bgClass = 'bg-emerald-200 border-emerald-300 hover:bg-emerald-300';
                        }

                        const isHovered = hoveredDay?.dateStr === day.dateStr;

                        return (
                          <div
                            key={day.dateStr}
                            onMouseEnter={() => !day.isFuture && setHoveredDay(day)}
                            onClick={() => {
                              if (!day.isFuture) {
                                setHoveredDay(day);
                              }
                            }}
                            className={`w-2.5 h-2.5 sm:w-[11px] sm:h-[11px] rounded-[2.5px] border transition-all cursor-pointer ${bgClass} ${
                              day.isToday
                                ? 'ring-1.5 ring-amber-500 ring-offset-1 z-10'
                                : ''
                            } ${isHovered ? 'scale-125 z-20 shadow-xs' : ''}`}
                            title={
                              day.isFuture
                                ? undefined
                                : `${day.dateStr}: ${day.count} 局训练${day.bestTimeSec ? ` (最佳: ${day.bestTimeSec}s)` : ''}`
                            }
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Footer: Hovered Day Inspector + Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <div className="min-h-5 flex items-center gap-2">
            {hoveredDay ? (
              <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                <div
                  className={`w-2 h-2 rounded-[2px] shrink-0 ${
                    hoveredDay.level === 4
                      ? 'bg-emerald-700'
                      : hoveredDay.level === 3
                      ? 'bg-emerald-500'
                      : hoveredDay.level === 2
                      ? 'bg-emerald-400'
                      : hoveredDay.level === 1
                      ? 'bg-emerald-200'
                      : 'bg-slate-200'
                  }`}
                />
                <span className="font-bold text-slate-800">
                  {hoveredDay.dateStr} (周{['一', '二', '三', '四', '五', '六', '日'][hoveredDay.dayOfWeek]})
                </span>
                <span className="text-slate-500">
                  {hoveredDay.count > 0 ? (
                    <>
                      完成 <strong className="text-slate-900">{hoveredDay.count}</strong> 次练习 · 专注{' '}
                      <strong className="text-slate-900">{hoveredDay.totalMinutes}</strong> 分钟
                      {hoveredDay.bestTimeSec && (
                        <>
                          {' '}· 最佳 <strong className="text-emerald-600 font-mono">{hoveredDay.bestTimeSec}s</strong>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="text-slate-400">无练习记录</span>
                  )}
                </span>
              </div>
            ) : (
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500" />
                <span>悬停或轻触方格可查阅单日训练详情；金色边框代表今日</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
            {hoveredDay && hoveredDay.count > 0 && (
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const target = new Date(hoveredDay.dateStr);
                  const diffDays = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  setPeriodMode('day');
                  setPeriodOffset(diffDays);
                  setActiveTab('period');
                }}
                className="text-amber-600 hover:text-amber-700 font-bold text-[10px] cursor-pointer hover:underline flex items-center gap-0.5"
              >
                <span>在周期中查看该日</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}

            {/* Legend */}
            <div className="flex items-center gap-1 text-[9px] text-slate-400 select-none">
              <span>少</span>
              <div className="w-2 h-2 rounded-[2px] bg-slate-100 border border-slate-200/60" title="0次" />
              <div className="w-2 h-2 rounded-[2px] bg-emerald-200 border border-emerald-300" title="1次" />
              <div className="w-2 h-2 rounded-[2px] bg-emerald-400 border border-emerald-500" title="2-3次" />
              <div className="w-2 h-2 rounded-[2px] bg-emerald-500 border border-emerald-600" title="4-6次" />
              <div className="w-2 h-2 rounded-[2px] bg-emerald-700 border border-emerald-800" title="7+次" />
              <span>多</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Primary Navigation Tabs: 周期统计 (日·周·月·年) | 表现走势 | 单局复盘 | 练习档案 */}
      <div className="grid grid-cols-4 gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('period')}
          className={`flex items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'period'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>周期统计</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('performance')}
          className={`flex items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'performance'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
          <span>表现走势</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('session')}
          className={`flex items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'session'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Target className="w-3.5 h-3.5 shrink-0" />
          <span>单局复盘</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>练习档案</span>
        </button>
      </div>

      {/* 3. Empty State If No History */}
      {sessions.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Activity className="w-6 h-6" />
          </div>
          <p className="text-base font-bold text-slate-800">暂无练习数据</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            完成一次舒尔特训练后，系统将自动汇总日、周、月、年时间维度的练习量与成绩走势。
          </p>
          {onSelectSessionToPlay && (
            <button
              type="button"
              onClick={() => onSelectSessionToPlay(5)}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>开始 5×5 经典练习</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* TAB 1: 周期统计 (日 · 周 · 月 · 年 维度统计)                               */}
          {/* ========================================================================= */}
          {activeTab === 'period' && (
            <div className="space-y-3">
              {/* Period Mode Selector Toolbar + Time Pagination */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  {/* Day / Week / Month / Year Switcher */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {(
                      [
                        { id: 'day', label: '日' },
                        { id: 'week', label: '周' },
                        { id: 'month', label: '月' },
                        { id: 'year', label: '年' },
                      ] as { id: PeriodMode; label: string }[]
                    ).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setPeriodMode(item.id);
                          setPeriodOffset(0); // Reset to current period
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          periodMode === item.id
                            ? 'bg-white text-slate-900 shadow-2xs font-black'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Time Pagination: < Previous | Today/Current | Next > */}
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setPeriodOffset((prev) => prev - 1)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                      title="上一周期"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {periodOffset !== 0 && (
                      <button
                        type="button"
                        onClick={() => setPeriodOffset(0)}
                        className="px-2 py-1 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 font-bold text-[11px] cursor-pointer"
                      >
                        回到当前
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={periodOffset >= 0}
                      onClick={() => setPeriodOffset((prev) => prev + 1)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        periodOffset >= 0
                          ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                      title="下一周期"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Current Time Period Range Display */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-black text-slate-900">{periodData.title}</span>
                    <span className="text-slate-400">({periodData.subTitle})</span>
                  </div>
                  <span className="text-slate-500">
                    完成 <strong className="text-slate-900">{periodData.count}</strong> 局 · 专注{' '}
                    <strong className="text-slate-900">{periodData.totalMinutes}</strong> 分钟
                  </span>
                </div>
              </div>

              {/* Period KPI Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {periodMode === 'day' ? '今日练习次数' : '周期练习总量'}
                  </span>
                  <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">
                    {periodData.count} <span className="text-xs font-normal text-slate-400">次</span>
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[11px] text-slate-400 block font-medium">累计专注时长</span>
                  <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">
                    {periodData.totalMinutes}{' '}
                    <span className="text-xs font-normal text-slate-400">分钟</span>
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[11px] text-slate-400 block font-medium">周期最佳成绩</span>
                  <span className="text-lg font-black text-emerald-600 font-mono mt-0.5 block">
                    {periodData.bestTimeSec ? `${periodData.bestTimeSec}s` : '--'}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {periodMode === 'day' ? '平均点击间隔' : '活跃练习天数'}
                  </span>
                  <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">
                    {periodMode === 'day'
                      ? `${periodData.avgTapMs || '--'}s`
                      : `${periodData.activeDaysCount || 0} 天`}
                  </span>
                </div>
              </div>

              {/* Interactive Period Chart (Bar Chart for Distribution) */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-amber-500" />
                    <span>
                      {periodMode === 'day' && '今日各局用时走势 (秒)'}
                      {periodMode === 'week' && '本周每日训练量 (次)'}
                      {periodMode === 'month' && '本月每日训练频次分布 (次)'}
                      {periodMode === 'year' && '年度月份训练量分布 (次)'}
                    </span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {periodMode === 'day' ? '点击局次查看' : '柱高代表训练局数'}
                  </span>
                </div>

                {(periodMode === 'day' ? periodData.dayChartData.length > 0 : periodData.barChartData.length > 0) ? (
                  <div className="w-full h-56 sm:h-64 pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      {periodMode === 'day' ? (
                        <LineChart data={periodData.dayChartData} margin={{ top: 10, right: 10, bottom: 5, left: -15 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} unit="s" />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                  <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg space-y-1">
                                    <p className="font-bold text-amber-400">
                                      {d.label} ({d.timeFormatted})
                                    </p>
                                    <p>规格: {d.size}</p>
                                    <p>用时: {d.timeSec} 秒</p>
                                    <p>得分: {d.score} 分</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="timeSec"
                            stroke="#f59e0b"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: '#f59e0b' }}
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={periodData.barChartData} margin={{ top: 10, right: 10, bottom: 5, left: -15 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} allowDecimals={false} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                  <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg space-y-1">
                                    <p className="font-bold text-amber-400">
                                      {d.label} {d.subLabel ? `(${d.subLabel})` : ''}
                                    </p>
                                    <p>训练局数: {d.count} 局</p>
                                    <p>专注时长: {d.durationMin} 分钟</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    该周期内暂无训练记录
                  </div>
                )}
              </div>

              {/* Period Sessions Quick Log */}
              {periodData.sessionsList.length > 0 && (
                <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>该周期练习流水 ({periodData.sessionsList.length} 条)</span>
                    <span className="text-slate-400 font-normal">点击“复盘”查看单局详情</span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    {periodData.sessionsList.map((s, idx) => (
                      <div
                        key={s.id}
                        className="py-2 flex items-center justify-between text-xs hover:bg-slate-50 px-1 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-slate-400 font-mono text-[11px]">#{idx + 1}</span>
                          <span className="font-semibold text-slate-800">
                            {s.size}×{s.size}
                          </span>
                          <span className="text-slate-400 text-[11px] font-mono">
                            {s.dateFormatted.slice(5)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-900">
                            {(s.totalTimeMs / 1000).toFixed(2)}s
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold">
                            {s.metrics.overallScore}分
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSessionId(s.id);
                              setActiveTab('session');
                            }}
                            className="text-amber-600 hover:text-amber-700 font-bold text-[11px] cursor-pointer"
                          >
                            复盘 ➔
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: 表现走势 (规格走势 · 五维雷达 · 个人纪录矩阵)                        */}
          {/* ========================================================================= */}
          {activeTab === 'performance' && (
            <div className="space-y-3">
              {/* Filter Toolbar */}
              <div className="flex items-center justify-between gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-2xs overflow-x-auto no-scrollbar">
                <span className="text-xs font-bold text-slate-500 shrink-0">规格筛选:</span>
                <div className="flex items-center gap-1 shrink-0">
                  {(['all', 3, 4, 5, 6, 7, 8, 9] as (number | 'all')[]).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSelectedSizeFilter(val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        selectedSizeFilter === val
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {val === 'all' ? '全部' : `${val}×${val}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 1: Historical Progression Line Chart */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>
                        完成用时演进走势 (
                        {selectedSizeFilter === 'all' ? '全部规格' : `${selectedSizeFilter}×${selectedSizeFilter}`}
                        )
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      曲线下行表示反应速度与搜索敏捷度提升
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 self-start sm:self-auto">
                    近 {trendLineData.length} 局样本
                  </span>
                </div>

                {trendLineData.length > 0 ? (
                  <div className="w-full h-60 sm:h-64 pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={trendLineData}
                        margin={{ top: 10, right: 15, bottom: 5, left: -15 }}
                      >
                        <defs>
                          <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="index" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} unit="s" />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg space-y-1">
                                  <p className="font-bold text-emerald-400">
                                    第 #{data.index} 局 ({data.date})
                                  </p>
                                  <p>完成用时: {data.timeSec} 秒</p>
                                  <p>平均点击间隔: {(data.avgTapMs / 1000).toFixed(2)} 秒</p>
                                  <p>稳定性得分: {data.stability} 分</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="timeSec"
                          stroke="#10b981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#timeGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    当前筛选规格下暂无练习数据
                  </div>
                )}
              </div>

              {/* Section 2: Personal Bests Matrix Across Grid Sizes */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>各规格个人最佳纪录</span>
                  </h3>
                  <span className="text-xs text-slate-400">点击规格可快速筛选</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {personalBestsMatrix.map((item) => {
                    const isSelected = selectedSizeFilter === item.size;
                    return (
                      <div
                        key={item.size}
                        onClick={() => setSelectedSizeFilter(item.size)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300'
                            : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-500">{item.size}×{item.size}</div>
                        <div className="text-base font-black text-slate-900 mt-0.5">
                          {item.bestTimeSec !== null ? `${item.bestTimeSec}s` : '--'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {item.count > 0 ? `${item.count} 局` : '未完成'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Macro Five-Dimension Capability Assessment */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span>综合能力维度雷达</span>
                  </h3>
                  <span className="text-xs text-slate-400">真实历史均值</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-1">
                  <div className="md:col-span-6 w-full h-52 sm:h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={aggregateRadarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                        <Radar
                          name="综合表现"
                          dataKey="value"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.4}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="md:col-span-6 space-y-2">
                    {aggregateRadarData.map((item) => (
                      <div key={item.subject} className="space-y-0.5">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-slate-600">{item.subject}</span>
                          <span className="font-mono font-bold text-slate-900">{item.value} 分</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-purple-500 transition-all"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                      💡 保持平稳呼吸与视线中心锚定，可有效缩减视野两端与边缘区域的反应时差。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: 单局复盘 (Single Session Deep Drill-down & Heatmap)                   */}
          {/* ========================================================================= */}
          {activeTab === 'session' && (
            <div className="space-y-3">
              {/* Session Switcher Toolbar */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs font-bold text-slate-500 shrink-0">选择复盘局:</span>
                  <select
                    value={activeSession?.id || ''}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="flex-1 sm:max-w-xs text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    {sessions.map((s, idx) => (
                      <option key={s.id} value={s.id}>
                        {idx === 0 ? '【最新】' : ''} {s.size}×{s.size} · {(s.totalTimeMs / 1000).toFixed(2)}s · {s.dateFormatted.slice(5)}
                      </option>
                    ))}
                  </select>
                </div>

                {activeSession && onSelectSessionToPlay && (
                  <button
                    type="button"
                    onClick={() => onSelectSessionToPlay(activeSession.size)}
                    className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>以本规格再练一局 ({activeSession.size}×{activeSession.size})</span>
                  </button>
                )}
              </div>

              {activeSession ? (
                <>
                  {/* Active Session Overview Card */}
                  <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                          {activeSession.size}×{activeSession.size}{' '}
                          {activeSession.shape === 'grid'
                            ? '方格'
                            : activeSession.shape === 'heart'
                            ? '爱心'
                            : activeSession.shape === 'star'
                            ? '五角星'
                            : activeSession.shape === 'spiral'
                            ? '螺旋'
                            : activeSession.shape === 'butterfly'
                            ? '蝶翼'
                            : activeSession.shape === 'cross'
                            ? '十字'
                            : activeSession.shape === 'wave'
                            ? '波浪'
                            : activeSession.shape === 'crescent'
                            ? '弯月'
                            : activeSession.shape === 'irregular'
                            ? '异形卵石'
                            : activeSession.shape === 'honeycomb'
                            ? '蜂巢'
                            : activeSession.shape === 'circle'
                            ? '圆盘'
                            : activeSession.shape === 'diamond'
                            ? '菱形'
                            : activeSession.shape === 'triangle'
                            ? '三角'
                            : '散落'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                          {MODE_NAMES[activeSession.mode] || activeSession.mode}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {activeSession.dateFormatted}
                        </span>
                        {activeSession.isDailyChallenge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                            每日打卡
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                        {(() => {
                          const assessment = getPerformanceAssessment(activeSession);
                          return (
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${assessment.badgeColor}`}>
                              {assessment.tier}
                            </span>
                          );
                        })()}
                        <button
                          type="button"
                          onClick={() => setPosterRecord(activeSession)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>成绩海报一键导出</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">总完成用时</span>
                        <span className="text-base font-black text-slate-900 font-mono">
                          {(activeSession.totalTimeMs / 1000).toFixed(2)}s
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">平均点击间隔</span>
                        <span className="text-base font-black text-slate-900 font-mono">
                          {(activeSession.averageTapMs / 1000).toFixed(2)}s
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">点击准确率</span>
                        <span className="text-base font-black text-emerald-600 font-mono">
                          {activeSession.accuracyRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">本局得分</span>
                        <span className="text-base font-black text-purple-600 font-mono">
                          {activeSession.metrics.overallScore} 分
                        </span>
                      </div>
                    </div>

                    {(() => {
                      const assessment = getPerformanceAssessment(activeSession);
                      return (
                        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                            <Eye className="w-3.5 h-3.5 text-amber-600" />
                            <span>复盘诊断与建议</span>
                          </div>
                          <p className="text-xs text-amber-800 leading-relaxed">
                            {assessment.summary} {assessment.advice}
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Dual Drill-down: Heatmap + Latency Curve */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    {/* Heatmap (5 Cols) */}
                    <div className="md:col-span-5 bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-emerald-600" />
                          <span>点击耗时热力分布</span>
                        </h3>
                        <span className="text-[10px] text-slate-400">绿快 ➔ 红慢</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        红色代表耗时较长，揭示视线搜索盲区
                      </p>

                      {spatialHeatmap ? (
                        <div className="max-w-[220px] aspect-square mx-auto p-2 rounded-xl bg-slate-100 border border-slate-200">
                          <div
                            className="w-full h-full grid gap-1"
                            style={{
                              gridTemplateColumns: `repeat(${spatialHeatmap.size}, minmax(0, 1fr))`,
                              gridTemplateRows: `repeat(${spatialHeatmap.size}, minmax(0, 1fr))`,
                            }}
                          >
                            {spatialHeatmap.items.map((it) => (
                              <div
                                key={it.index}
                                className={`w-full h-full rounded-md border flex flex-col items-center justify-center text-[10px] select-none transition-transform hover:scale-105 shadow-2xs ${it.colorClass}`}
                                title={`目标【${it.targetKey}】: 查找用时 ${it.latencyMs}ms`}
                              >
                                <span className="font-bold">{it.targetKey}</span>
                                <span className="text-[8px] opacity-80">{(it.latencyMs / 1000).toFixed(1)}s</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center text-xs text-slate-400">
                          非标准正交方格不展示二维热力矩阵
                        </div>
                      )}
                    </div>

                    {/* Latency Curve (7 Cols) */}
                    <div className="md:col-span-7 bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-blue-500" />
                          <span>每步点击节奏波形</span>
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          基准 {(medianLatency / 1000).toFixed(2)}s
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        红虚线为参考阈值，突起波峰表明寻找过程中有明显停顿
                      </p>

                      <div className="w-full h-44 sm:h-52">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={latencyData}
                            margin={{ top: 10, right: 15, bottom: 5, left: -15 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="step" tick={{ fill: '#64748b', fontSize: 10 }} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} unit="ms" />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-slate-900 text-white p-2 rounded-xl text-xs shadow-lg space-y-0.5">
                                      <p className="font-bold text-amber-400">
                                        第 {data.step} 步: 目标【{data.target}】
                                      </p>
                                      <p>耗时: {data.latencyMs}ms ({data.latencySec}s)</p>
                                      {data.latencyMs > medianLatency * 1.8 && (
                                        <p className="text-rose-400 font-semibold">⚠️ 出现明显停顿</p>
                                      )}
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <ReferenceLine
                              y={medianLatency * 1.8}
                              stroke="#ef4444"
                              strokeDasharray="4 4"
                              label={{ value: '停顿线', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }}
                            />
                            <Line
                              type="monotone"
                              dataKey="latencyMs"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              dot={{ r: 2, fill: '#3b82f6' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Hesitation Hotspots */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-rose-500" />
                            <span>停顿点目标 ({hesitationPeaks.length} 处)</span>
                          </span>
                          <span className="text-[10px] text-slate-400">&gt; 1.8倍基准</span>
                        </div>
                        {hesitationPeaks.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {hesitationPeaks.map((p) => (
                              <span
                                key={p.step}
                                className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-medium"
                              >
                                【{p.target}】: {p.latencySec}s
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-emerald-600 font-medium">
                            本局节奏极为连贯，全程无明显停顿！
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-400 border border-slate-200">
                  请在上方下拉菜单中选择一个要复盘的历史局次
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: 练习档案 (Session History Table & Data Management)                  */}
          {/* ========================================================================= */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>
                      练习档案列表 (
                      {selectedSizeFilter === 'all' ? '全部规格' : `${selectedSizeFilter}×${selectedSizeFilter}`}
                      ，共 {filteredSessions.length} 条)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    点击“复盘”可载入单局盲区热力图与节奏波形
                  </p>
                </div>

                {/* Data Backup & Management */}
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={handleExport}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>备份</span>
                  </button>
                  <label className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>恢复</span>
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="p-1 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="清空所有记录"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {filteredSessions.length > 0 ? (
                <div
                  className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs bg-white"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <table className="w-full min-w-[580px] text-left text-xs text-slate-700 divide-y divide-slate-100">
                    <thead className="bg-slate-50/90 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                      <tr>
                        <th className="py-2.5 px-2.5 whitespace-nowrap font-medium text-[11px] w-[80px]">时间</th>
                        <th className="py-2.5 px-2 whitespace-nowrap font-medium text-[11px] w-[75px]">规格</th>
                        <th className="py-2.5 px-2 whitespace-nowrap font-medium text-[11px] w-[80px]">题型模式</th>
                        <th className="py-2.5 px-2 whitespace-nowrap font-medium text-[11px] w-[70px]">完成总时</th>
                        <th className="py-2.5 px-2 whitespace-nowrap font-medium text-[11px] w-[65px]">平均间隔</th>
                        <th className="py-2.5 px-2 whitespace-nowrap font-medium text-[11px] w-[60px]">准确率</th>
                        <th className="py-2.5 px-2 whitespace-nowrap font-medium text-[11px] w-[70px]">专注得分</th>
                        <th className="py-2.5 px-2.5 whitespace-nowrap font-medium text-[11px] text-right w-[100px]">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredSessions.map((s) => {
                        return (
                          <tr
                            key={s.id}
                            className="hover:bg-amber-50/40 transition-colors"
                          >
                            <td className="py-2.5 px-2.5 whitespace-nowrap font-mono text-[11px] text-slate-500">
                              {s.dateFormatted.slice(5)}
                            </td>
                            <td className="py-2.5 px-2 whitespace-nowrap font-semibold">
                              <span className="font-bold text-slate-900">{s.size}×{s.size}</span>
                              {s.isDailyChallenge && (
                                <span className="ml-1 inline-flex items-center text-[9px] px-1 py-0.2 rounded font-bold bg-amber-100 text-amber-800 whitespace-nowrap shrink-0">
                                  打卡
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-2 whitespace-nowrap text-slate-700">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px] whitespace-nowrap shrink-0">
                                {MODE_NAMES[s.mode] || s.mode}
                              </span>
                            </td>
                            <td className="py-2.5 px-2 whitespace-nowrap font-mono font-bold text-slate-900">
                              {(s.totalTimeMs / 1000).toFixed(2)}s
                            </td>
                            <td className="py-2.5 px-2 whitespace-nowrap font-mono text-slate-600">
                              {(s.averageTapMs / 1000).toFixed(2)}s
                            </td>
                            <td className="py-2.5 px-2 whitespace-nowrap text-emerald-600 font-bold">
                              {s.accuracyRate.toFixed(1)}%
                            </td>
                            <td className="py-2.5 px-2 whitespace-nowrap">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 font-bold text-[11px] whitespace-nowrap shrink-0">
                                {s.metrics.overallScore}分
                              </span>
                            </td>
                            <td className="py-2.5 px-2.5 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedSessionId(s.id);
                                    setActiveTab('session');
                                  }}
                                  className="px-1.5 py-0.8 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] transition-colors cursor-pointer shrink-0"
                                >
                                  复盘
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPosterRecord(s)}
                                  className="px-1.5 py-0.8 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-0.5 shadow-2xs shrink-0"
                                  title="导出该次成绩海报"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>海报</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSessionToDelete(s)}
                                  className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                                  title="删除此记录"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  当前规格筛选下无记录
                </div>
              )}
            </div>
          )}
        </>
      )}
      {posterRecord && (
        <SharePosterModal
          isOpen={!!posterRecord}
          onClose={() => setPosterRecord(null)}
          record={posterRecord}
          isNewBest={false}
          streakCount={1}
        />
      )}
    </div>
  );
};
