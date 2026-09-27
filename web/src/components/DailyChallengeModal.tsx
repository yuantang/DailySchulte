import React from 'react';
import { Flame, Calendar, Award, CheckCircle2, X, Play, Zap } from 'lucide-react';
import { DailyStreakData } from '../types';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakData: DailyStreakData;
  isCompletedToday: boolean;
  onStartDailyChallenge: () => void;
  todayDateStr: string;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  streakData,
  isCompletedToday,
  onStartDailyChallenge,
  todayDateStr,
}) => {
  if (!isOpen) return null;

  // Generate last 14 days list for streak visualizer
  const recentDays = [];
  const now = new Date(todayDateStr);
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const isToday = i === 0;
    const isDone = streakData.historyDates.includes(dateKey);
    recentDays.push({
      dateKey,
      dayNum: d.getDate(),
      month: d.getMonth() + 1,
      isToday,
      isDone,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative overflow-y-auto max-h-[90vh] pb-safe">
        <button
          id="btn-close-daily-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold tracking-wide uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>每日专注一练 · 每日打卡</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {todayDateStr}
          </h2>
          <p className="text-xs text-slate-500">
            保持连续训练，激活前额叶注意神经网络与周边知觉广度
          </p>
        </div>

        {/* Streak Counters */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1 text-amber-800 text-xs font-bold mb-1">
              <Flame className="w-4 h-4 text-amber-500 fill-current" />
              <span>当前连胜天数</span>
            </div>
            <p className="text-3xl font-black text-amber-600">
              {streakData.currentStreak} <span className="text-xs font-semibold">天</span>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1 text-slate-600 text-xs font-bold mb-1">
              <Award className="w-4 h-4 text-blue-500" />
              <span>历史最长连胜</span>
            </div>
            <p className="text-3xl font-black text-slate-900">
              {streakData.longestStreak} <span className="text-xs font-semibold">天</span>
            </p>
          </div>
        </div>

        {/* 14-Day Calendar Heatmap Grid */}
        <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>近 14 日打卡足迹</span>
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              已完成 {streakData.historyDates.length} 天
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {recentDays.map((day) => (
              <div
                key={day.dateKey}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center text-xs border transition-all ${
                  day.isDone
                    ? 'bg-emerald-500 text-white border-emerald-600 font-bold shadow-xs'
                    : day.isToday
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold ring-2 ring-amber-400/50'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                <span className="text-[10px] leading-tight">
                  {day.month}/{day.dayNum}
                </span>
                {day.isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Rule Brief */}
        <div className="p-3.5 bg-slate-100 rounded-2xl text-xs text-slate-600 mb-6 flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p>
            今日打卡采用 <strong className="text-slate-900">5×5 国际标准规格</strong>
            ，所有用户在当天共享统一随机种子，训练完成即可计入连胜记录！
          </p>
        </div>

        {/* Action Button */}
        <button
          id="btn-start-daily-challenge-action"
          type="button"
          onClick={() => {
            onClose();
            onStartDailyChallenge();
          }}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isCompletedToday
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
          }`}
        >
          {isCompletedToday ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>今日已达成！再次挑战刷新成绩</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>开始今日打卡挑战</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
