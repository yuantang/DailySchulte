import React, { useState, useMemo } from 'react';
import {
  Flame,
  Calendar as CalendarIcon,
  Award,
  Play,
  CheckCircle2,
  Trophy,
  Zap,
  Target,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  Share2,
  Quote,
  Compass,
  Bell,
  Lock,
  Info,
} from 'lucide-react';
import { DailyStreakData, SessionRecord, DailyReminderConfig } from '../types';
import { StreakFlameMedal } from './ProductIcons';

export interface StreakMilestone {
  days: number;
  label: string;
  tierName: string;
  desc: string;
  cognitiveEffect: string;
  rewardTitle: string;
  accentBg: string;
  accentBorder: string;
}

interface DailyCheckInViewProps {
  streakData: DailyStreakData;
  isDailyDoneToday: boolean;
  onStartDailyChallenge: () => void;
  todayDateStr: string;
  sessions: SessionRecord[];
  onGoToTraining: () => void;
  onOpenSettings?: () => void;
  reminderConfig?: DailyReminderConfig;
}

const MINDFUL_QUOTES = [
  { text: '注意力是我们选择体验现实的唯一透镜。', author: '威廉·詹姆斯 (心理学者)' },
  { text: '真正的敏锐并非眼球的仓促扫视，而是注视中心时对周围全局的从容掌握。', author: '舒尔特训练要诀' },
  { text: '心流的本质在于全身心投入，注意力如光束般高度聚焦。', author: '米哈里·契克森米哈赖' },
  { text: '日积月累，水滴石穿。每天坚持几组舒尔特练习，有助于提升扫视广度与定位敏捷度。', author: '视觉训练常识' },
  { text: '不乱于心，不困于眼。定睛红心，余光揽胜。', author: '舒尔特方格练习准则' },
];

export const DailyCheckInView: React.FC<DailyCheckInViewProps> = ({
  streakData,
  isDailyDoneToday,
  onStartDailyChallenge,
  todayDateStr,
  sessions,
  onGoToTraining,
  onOpenSettings,
  reminderConfig,
}) => {
  const [currentMonthOffset, setCurrentMonthOffset] = useState<number>(0);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [selectedMilestone, setSelectedMilestone] = useState<StreakMilestone | null>(null);
  const [milestoneFilter, setMilestoneFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Today's specific sessions
  const todaySessions = sessions.filter((s) => s.dayKey === todayDateStr);
  const bestTodaySession = todaySessions.length > 0
    ? [...todaySessions].sort((a, b) => a.totalTimeMs - b.totalTimeMs)[0]
    : null;

  // Calendar month calculation
  const calendarBaseDate = new Date(todayDateStr);
  calendarBaseDate.setMonth(calendarBaseDate.getMonth() + currentMonthOffset);
  const year = calendarBaseDate.getFullYear();
  const month = calendarBaseDate.getMonth(); // 0-indexed

  // Month days
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Adjust Monday as first day: Monday is 0, Sunday is 6
  const startCol = (firstDayOfWeek + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Completed dates in this month
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthCompletedCount = streakData.historyDates.filter((d) => d.startsWith(monthPrefix)).length;

  // Past 7 Days timeline (including today)
  const past7Days = useMemo(() => {
    const list: { dateKey: string; label: string; isToday: boolean; isDone: boolean }[] = [];
    const base = new Date(todayDateStr);
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '六'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${y}-${m}-${day}`;
      const isToday = dateKey === todayDateStr;
      const isDone = streakData.historyDates.includes(dateKey);
      const dayName = isToday ? '今天' : dayNames[d.getDay()];
      list.push({ dateKey, label: `${m}.${day}`, isToday, isDone, dayName } as any);
    }
    return list;
  }, [todayDateStr, streakData.historyDates]);

  // Multi-Tiered Streak Milestones (8 distinct milestones with cognitive science foundations)
  const MILESTONES: StreakMilestone[] = [
    {
      days: 3,
      label: '破茧初醒',
      tierName: '青铜新星',
      desc: '连续练习 3 天，初步适应中心注视与周边余光定位。',
      cognitiveEffect: '建立最初的眼动反射习惯，克服急躁寻数的初期无序定势。',
      rewardTitle: '点亮专注新星',
      accentBg: 'bg-amber-50',
      accentBorder: 'border-amber-300',
    },
    {
      days: 7,
      label: '渐入心流',
      tierName: '青铜之火',
      desc: '坚持练习整整 1 周，形成稳定的日常专注律动。',
      cognitiveEffect: '视觉抑制控制开始起效，杂念与环境干扰对定位速度的影响明显减弱。',
      rewardTitle: '周胜执念奖章',
      accentBg: 'bg-orange-50',
      accentBorder: 'border-orange-300',
    },
    {
      days: 14,
      label: '银翼专注',
      tierName: '白银徽章',
      desc: '连续专注 2 周，舒尔特扫视已融入生活习惯。',
      cognitiveEffect: '注视稳定性明显增强，有效视野扫视半径较初测扩大约 15%~20%。',
      rewardTitle: '银翼专注者',
      accentBg: 'bg-slate-100',
      accentBorder: 'border-slate-300',
    },
    {
      days: 21,
      label: '视幅蜕变',
      tierName: '白银之冠',
      desc: '连续专注 3 周（达成 21 天心理学习惯重塑黄金周期）。',
      cognitiveEffect: '大脑神经回路重塑，神经皮层处理周边余光符号的反应潜伏期缩短。',
      rewardTitle: '21天重塑勋章',
      accentBg: 'bg-blue-50',
      accentBorder: 'border-blue-300',
    },
    {
      days: 30,
      label: '月度宗师',
      tierName: '黄金徽章',
      desc: '坚持打卡整整 1 个月，成为百里挑一的专注自律者。',
      cognitiveEffect: '眼动扫视幅度大幅缩短，能在 5×5 方格中实现近乎固定的中轴余光辨读。',
      rewardTitle: '月度金牌宗师',
      accentBg: 'bg-amber-100/70',
      accentBorder: 'border-amber-400',
    },
    {
      days: 60,
      label: '深潜专注',
      tierName: '黄金荣耀',
      desc: '连续打卡 2 个月，心如止水，外界干扰难以动摇注意力。',
      cognitiveEffect: '短时记忆容量与抗疲劳耐受力显著攀升，速读辨识率达到高水平状态。',
      rewardTitle: '双月深潜勋章',
      accentBg: 'bg-yellow-50',
      accentBorder: 'border-yellow-400',
    },
    {
      days: 100,
      label: '百日筑基',
      tierName: '钻石圣杯',
      desc: '连续打卡 100 天！达成坚如磐石的超强意志力奇迹。',
      cognitiveEffect: '认知灵活性与全脑协同能力跃升，拥有极强的抗视觉疲劳与长程心流耐力。',
      rewardTitle: '百日传奇圣杯',
      accentBg: 'bg-cyan-50',
      accentBorder: 'border-cyan-300',
    },
    {
      days: 365,
      label: '岁月同辉',
      tierName: '王者殿堂',
      desc: '连续打卡 1 年（365天），成就专注力领域的终极王者。',
      cognitiveEffect: '至臻专注心境，无论是高强度阅读、精准操作还是日常决断皆游刃有余。',
      rewardTitle: '年度不朽桂冠',
      accentBg: 'bg-purple-50',
      accentBorder: 'border-purple-300',
    },
  ];

  // Calculate highest unlocked and next target milestone
  const maxStreak = Math.max(streakData.currentStreak, streakData.longestStreak);
  const unlockedMilestones = useMemo(
    () => MILESTONES.filter((m) => maxStreak >= m.days),
    [maxStreak]
  );
  const nextTargetMilestone = useMemo(
    () => MILESTONES.find((m) => maxStreak < m.days) || null,
    [maxStreak]
  );

  // Filtered milestones list based on active tab
  const filteredMilestones = useMemo(() => {
    if (milestoneFilter === 'unlocked') {
      return MILESTONES.filter((m) => maxStreak >= m.days);
    }
    if (milestoneFilter === 'locked') {
      return MILESTONES.filter((m) => maxStreak < m.days);
    }
    return MILESTONES;
  }, [milestoneFilter, maxStreak]);

  // Next milestone progress percentage
  const nextProgressPercent = useMemo(() => {
    if (!nextTargetMilestone) return 100;
    const prevDays =
      unlockedMilestones.length > 0
        ? unlockedMilestones[unlockedMilestones.length - 1].days
        : 0;
    const range = nextTargetMilestone.days - prevDays;
    const currentOverPrev = Math.max(0, streakData.currentStreak - prevDays);
    return Math.min(100, Math.round((currentOverPrev / range) * 100));
  }, [nextTargetMilestone, unlockedMilestones, streakData.currentStreak]);

  // Daily Tasks List
  const dailyTasks = [
    {
      id: 'daily-schulte',
      title: '完成今日每日打卡',
      desc: '完成一局标准 5×5 舒尔特练习',
      done: isDailyDoneToday,
      reward: '今日必做',
    },
    {
      id: 'three-sessions',
      title: '单日累计练习 3 局',
      desc: `今日已完成 ${todaySessions.length}/3 局`,
      done: todaySessions.length >= 3,
      reward: '日常训练',
    },
    {
      id: 'high-score',
      title: '单局综合评分 ≥ 80 分',
      desc: bestTodaySession && bestTodaySession.metrics.overallScore >= 80 ? '今日已达成！' : '保持稳定节奏与高准确率',
      done: Boolean(bestTodaySession && bestTodaySession.metrics.overallScore >= 80),
      reward: '质量挑战',
    },
  ];

  // Pick today's quote based on date string hash
  const todayQuote = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < todayDateStr.length; i++) {
      hash = (hash << 5) - hash + todayDateStr.charCodeAt(i);
    }
    return MINDFUL_QUOTES[Math.abs(hash) % MINDFUL_QUOTES.length];
  }, [todayDateStr]);

  const handleShareStreak = () => {
    const text = `我正在「每日舒尔特」坚持专注训练，已连续打卡 ${streakData.currentStreak} 天！今日成绩：${
      bestTodaySession ? (bestTodaySession.totalTimeMs / 1000).toFixed(2) + '秒' : '挑战中'
    }。来一起练习周边视野与快速注意力吧！`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-20">
      {/* 1. Refined Compact Daily Challenge Bar */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-amber-200/80 bg-gradient-to-r from-amber-50/40 via-white to-orange-50/30 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                每日专注打卡
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {todayDateStr}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-600">5×5 标准模式</span>
              <span className="text-slate-300">·</span>
              {bestTodaySession ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  今日最佳: {(bestTodaySession.totalTimeMs / 1000).toFixed(2)} 秒
                </span>
              ) : (
                <span className="text-amber-600 font-medium">今日待打卡</span>
              )}
            </div>
          </div>
        </div>

        <button
          id="btn-daily-challenge-hero-start"
          type="button"
          onClick={onStartDailyChallenge}
          className="self-stretch sm:self-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation shrink-0"
        >
          {isDailyDoneToday ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
              <span>刷新今日战绩</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-slate-950" />
              <span>立即打卡挑战</span>
            </>
          )}
        </button>
      </div>

      {/* Habit Reminder Banner */}
      {onOpenSettings && (
        <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                reminderConfig?.enabled
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Bell className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">每日训练提醒</span>
                {reminderConfig?.enabled ? (
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                    每天 {reminderConfig.time}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                    未开启
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {reminderConfig?.enabled
                  ? '系统将准时推送每日专注提醒，助您保持连击习惯'
                  : '设定每日固定时间，通过系统通知提醒打卡'}
              </p>
            </div>
          </div>
          <button
            id="btn-daily-open-reminder-settings"
            type="button"
            onClick={onOpenSettings}
            className="shrink-0 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 text-xs font-bold transition-all cursor-pointer"
          >
            {reminderConfig?.enabled ? '修改时间' : '设定提醒'}
          </button>
        </div>
      )}

      {/* 2. Past 7 Days Quick Streak Bar */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>近 7 天打卡记录</span>
          </span>
          <span className="text-amber-600 font-bold">
            已连续 {streakData.currentStreak} 天
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {past7Days.map((d: any) => (
            <div
              key={d.dateKey}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                d.isDone
                  ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-2xs'
                  : d.isToday
                  ? 'bg-amber-100/60 border-amber-400 ring-2 ring-amber-400/40 text-slate-800'
                  : 'bg-slate-50/70 border-slate-100 text-slate-400'
              }`}
            >
              <span className="text-[10px] font-semibold text-slate-500">{d.dayName}</span>
              <div className="my-1">
                {d.isDone ? (
                  <Flame className="w-4 h-4 text-amber-500 fill-current" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                )}
              </div>
              <span className="text-[9px] text-slate-400">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Streak Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Stat 1: Current Streak */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-amber-600 text-xs font-bold mb-0.5">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>连续天数</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {streakData.currentStreak}
            <span className="text-xs font-bold text-slate-400 ml-0.5">天</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {isDailyDoneToday ? '今日已点亮 🔥' : '今日待打卡'}
          </span>
        </div>

        {/* Stat 2: Longest Streak */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-blue-600 text-xs font-bold mb-0.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>历史最高</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {streakData.longestStreak}
            <span className="text-xs font-bold text-slate-400 ml-0.5">天</span>
          </div>
          <span className="text-[10px] text-slate-400">历史不懈记录</span>
        </div>

        {/* Stat 3: Total Completed Days */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mb-0.5">
            <Award className="w-3.5 h-3.5" />
            <span>累计打卡</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {streakData.historyDates.length}
            <span className="text-xs font-bold text-slate-400 ml-0.5">天</span>
          </div>
          <span className="text-[10px] text-slate-400">总专注积累</span>
        </div>
      </div>

      {/* 4. Daily Goals & Tasks */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900">今日专注目标</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            已达成 {dailyTasks.filter((t) => t.done).length} / {dailyTasks.length}
          </span>
        </div>

        <div className="space-y-2">
          {dailyTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                task.done
                  ? 'bg-emerald-50/70 border-emerald-200 text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    task.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {task.done ? <CheckCircle2 className="w-4 h-4" /> : '○'}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-2">
                    <span>{task.title}</span>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded">
                      {task.reward}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{task.desc}</p>
                </div>
              </div>

              {!task.done && (
                <button
                  type="button"
                  onClick={task.id === 'daily-schulte' ? onStartDailyChallenge : onGoToTraining}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 shrink-0 touch-manipulation active:scale-95 cursor-pointer"
                >
                  去完成
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Full Month Interactive Calendar Heatmap */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900">
              打卡日历 ({year}年{month + 1}月)
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 mr-2">本月 {monthCompletedCount} 天</span>
            <button
              type="button"
              onClick={() => setCurrentMonthOffset((o) => o - 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 active:scale-95 cursor-pointer"
              title="上一月"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={currentMonthOffset >= 0}
              onClick={() => setCurrentMonthOffset((o) => o + 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 active:scale-95 cursor-pointer"
              title="下一月"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
          <div>一</div>
          <div>二</div>
          <div>三</div>
          <div>四</div>
          <div>五</div>
          <div className="text-amber-600">六</div>
          <div className="text-amber-600">日</div>
        </div>

        {/* Grid of days */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {/* Empty cells before month start */}
          {Array.from({ length: startCol }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 rounded-xl" />
          ))}

          {/* Month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = dateKey === todayDateStr;
            const isDone = streakData.historyDates.includes(dateKey);

            return (
              <div
                key={dateKey}
                className={`h-10 rounded-xl flex flex-col items-center justify-center text-xs transition-all relative border ${
                  isDone
                    ? 'bg-emerald-500 text-white border-emerald-600 font-bold shadow-xs'
                    : isToday
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-black ring-2 ring-amber-400/50'
                    : 'bg-slate-50/70 border-slate-100 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-[11px] leading-none">{dayNum}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3 text-white mt-0.5" />
                ) : isToday ? (
                  <span className="text-[8px] font-black text-amber-700 leading-none mt-0.5">今天</span>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> 已打卡
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> 今日
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" /> 未打卡
            </span>
          </div>
          <button
            type="button"
            onClick={handleShareStreak}
            className="flex items-center gap-1 text-amber-600 font-bold hover:text-amber-700 active:scale-95 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShare ? '已复制分享文案' : '分享打卡成绩'}</span>
          </button>
        </div>
      </div>

      {/* 6. 连续打卡成就勋章馆 (Enriched Multi-Tiered Achievement Showcase) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3.5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-300 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 leading-tight flex items-center gap-1.5">
                <span>连胜成就殿堂</span>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-200 px-1.5 py-0.2 rounded-full">
                  已解锁 {unlockedMilestones.length}/{MILESTONES.length}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                基于视觉神经习惯重塑周期设定的段位阶梯 · 点击查看成就详情
              </p>
            </div>
          </div>

          {/* Quick Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 text-[11px] font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setMilestoneFilter('all')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                milestoneFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              全部 ({MILESTONES.length})
            </button>
            <button
              type="button"
              onClick={() => setMilestoneFilter('unlocked')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                milestoneFilter === 'unlocked'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              已解锁 ({unlockedMilestones.length})
            </button>
            <button
              type="button"
              onClick={() => setMilestoneFilter('locked')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                milestoneFilter === 'locked'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              未解锁
            </button>
          </div>
        </div>

        {/* Next Goal Progress Banner */}
        {nextTargetMilestone && (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-50/50 to-orange-500/10 p-3 rounded-xl border border-amber-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {nextTargetMilestone.days}d
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>下一目标：{nextTargetMilestone.label}</span>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/90 px-1.5 py-0.2 rounded border border-amber-200">
                    还需 {Math.max(0, nextTargetMilestone.days - streakData.currentStreak)} 天
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5 font-normal">
                  {nextTargetMilestone.rewardTitle} · {nextTargetMilestone.desc}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-black text-amber-700">{nextProgressPercent}%</span>
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${nextProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Badges Grid (Responsive 2 to 4 columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {filteredMilestones.map((item) => {
            const isUnlocked = maxStreak >= item.days;
            return (
              <button
                key={item.days}
                type="button"
                onClick={() => setSelectedMilestone(item)}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer group hover:scale-101 active:scale-98 shadow-2xs ${
                  isUnlocked
                    ? `${item.accentBg} ${item.accentBorder} text-slate-900 hover:shadow-xs`
                    : 'bg-slate-50/90 border-slate-200 text-slate-400 opacity-75 hover:opacity-100'
                }`}
              >
                {/* Top: Icon + Tier Pill */}
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div className="relative">
                    {isUnlocked ? (
                      <StreakFlameMedal size={36} className="shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isUnlocked
                        ? 'bg-white/80 border border-black/5 text-slate-800'
                        : 'bg-slate-200/80 text-slate-500'
                    }`}
                  >
                    {item.tierName}
                  </span>
                </div>

                {/* Title & Target */}
                <div>
                  <div className="flex items-baseline justify-between gap-1">
                    <h4
                      className={`text-xs sm:text-sm font-black leading-tight truncate ${
                        isUnlocked ? 'text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      {item.label}
                    </h4>
                    <span className="text-[10px] font-extrabold text-amber-700 shrink-0">
                      {item.days}天
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 leading-snug">
                    {item.rewardTitle}
                  </p>
                </div>

                {/* Bottom Status / Indicator */}
                <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center justify-between text-[9px]">
                  {isUnlocked ? (
                    <span className="text-emerald-700 font-extrabold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      已点亮勋章
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium">
                      差距 {Math.max(0, item.days - streakData.currentStreak)} 天
                    </span>
                  )}
                  <Info className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Milestone Detail Dialog (Cognitive Impact & Reward) */}
      {selectedMilestone && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMilestone(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm border border-slate-200 shadow-2xl overflow-hidden p-5 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <StreakFlameMedal size={40} className="shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-base text-slate-900 leading-tight">
                      {selectedMilestone.label}
                    </h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      {selectedMilestone.tierName}
                    </span>
                  </div>
                  <span className="text-xs text-amber-700 font-bold">
                    连续练习 {selectedMilestone.days} 天达成
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMilestone(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* Achievement Description */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>勋章释义与奖励</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-normal">
                  {selectedMilestone.desc}
                </p>
                <div className="mt-2 text-slate-900 font-bold bg-white p-2 rounded-lg border border-slate-200">
                  授予称号：{selectedMilestone.rewardTitle}
                </div>
              </div>

              {/* Cognitive Science Benefit */}
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
                <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-700" />
                  <span>眼动视觉与神经认知提升</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-normal">
                  {selectedMilestone.cognitiveEffect}
                </p>
              </div>

              {/* Status */}
              <div className="text-center pt-1">
                {maxStreak >= selectedMilestone.days ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>恭喜！您已成功点亮该成就勋章</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      当前连续 {streakData.currentStreak} 天，距离解锁还需{' '}
                      {Math.max(0, selectedMilestone.days - streakData.currentStreak)} 天
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedMilestone(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Daily Mindful Focus Quote */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
        <Quote className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
            "{todayQuote.text}"
          </p>
          <span className="text-[10px] text-slate-400 font-semibold block">
            —— {todayQuote.author}
          </span>
        </div>
      </div>
    </div>
  );
};
