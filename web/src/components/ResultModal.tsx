import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Zap,
  Target,
  Clock,
  AlertTriangle,
  RotateCcw,
  BarChart2,
  X,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { SessionRecord } from '../types';
import { getPerformanceAssessment } from '../utils/analytics';
import { MODE_NAMES } from './AnalyticsDashboard';

interface ResultModalProps {
  record: SessionRecord;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onViewDeepAnalytics: () => void;
  onOpenSharePoster: () => void;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  record,
  isNewBest,
  onPlayAgain,
  onViewDeepAnalytics,
  onOpenSharePoster,
  onClose,
}) => {
  useEffect(() => {
    // Fire celebratory confetti on victory
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
      });
    } catch {
      // ignore
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onPlayAgain();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayAgain, onClose]);

  const assessment = getPerformanceAssessment(record);
  const timeSeconds = (record.totalTimeMs / 1000).toFixed(2);
  const avgTapSeconds = (record.averageTapMs / 1000).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative overflow-y-auto max-h-[90vh] pb-safe">
        {/* Close icon */}
        <button
          id="btn-close-result-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Badge */}
        <div className="text-center space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold tracking-wide uppercase">
            <Trophy className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>训练圆满完成</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {timeSeconds} <span className="text-base font-semibold text-slate-500">秒</span>
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              <span>{record.size}×{record.size}</span>
              <span className="text-slate-400">·</span>
              <span>{MODE_NAMES[record.mode] || record.mode}</span>
            </span>
            {isNewBest && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>刷新个人最好成绩！</span>
              </span>
            )}
            {record.isDailyChallenge && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <span>🔥 今日打卡已达成</span>
              </span>
            )}
            {record.customTitle && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                <span>📚 题库: {record.customTitle}</span>
              </span>
            )}
            {record.planTitle && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                <span>🎯 {record.planTitle}</span>
              </span>
            )}
          </div>
        </div>

        {/* Assessment Card */}
        <div className={`p-4 rounded-2xl border mb-5 ${assessment.badgeColor}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">专注力评级</span>
            <span className="text-sm font-black">{assessment.tier}</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-700 mb-2">
            {assessment.summary}
          </p>
          <div className="text-[11px] text-slate-600 bg-white/70 p-2 rounded-lg border border-current/10 flex items-start gap-1.5">
            <span className="font-bold shrink-0">训练建议:</span>
            <span>{assessment.advice}</span>
          </div>
        </div>

        {/* Core Metric Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">平均间隔</span>
            </div>
            <p className="text-base font-black text-slate-900">{avgTapSeconds}s</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <Target className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">准确率</span>
            </div>
            <p className="text-base font-black text-emerald-600">
              {record.accuracyRate.toFixed(1)}%
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">稳定性得分</span>
            </div>
            <p className="text-base font-black text-blue-600">
              {record.metrics.attentionStability}分
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">误触罚时</span>
            </div>
            <p className="text-base font-black text-slate-900">
              {record.errorsCount > 0 ? `+${(record.penaltyTimeMs / 1000).toFixed(1)}s` : '0'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <button
            id="btn-result-share-poster"
            type="button"
            onClick={onOpenSharePoster}
            className="w-full sm:flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-current text-slate-950" />
            <span>成绩海报一键导出</span>
          </button>

          <button
            id="btn-result-play-again"
            type="button"
            onClick={onPlayAgain}
            className="w-full sm:flex-1 py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>再来一局</span>
          </button>

          <button
            id="btn-result-deep-analytics"
            type="button"
            onClick={onViewDeepAnalytics}
            className="w-full sm:flex-1 py-3 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-purple-600" />
            <span>复盘看板</span>
          </button>
        </div>

        <div className="mt-3 text-center">
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            快捷键提示：按 <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700 font-mono text-[10px]">空格</kbd> 立即再来一局，按 <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700 font-mono text-[10px]">Esc</kbd> 关闭
          </span>
        </div>
      </div>
    </div>
  );
};
