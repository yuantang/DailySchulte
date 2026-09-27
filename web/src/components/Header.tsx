import React from 'react';
import { Activity, BookOpen, Volume2, VolumeX, Eye, Flame, PlayCircle, BarChart3, Settings } from 'lucide-react';
import { DailyStreakData, TrainingSettings } from '../types';
import { SchulteBrandLogo } from './ProductIcons';

interface HeaderProps {
  activeTab: 'training' | 'daily' | 'plans' | 'analytics';
  setActiveTab: (tab: 'training' | 'daily' | 'plans' | 'analytics') => void;
  streakData: DailyStreakData;
  settings: TrainingSettings;
  onUpdateSettings: (newSettings: Partial<TrainingSettings>) => void;
  onOpenDailyChallenge: () => void;
  isDailyDoneToday: boolean;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  streakData,
  settings,
  onUpdateSettings,
  onOpenDailyChallenge,
  isDailyDoneToday,
  onOpenSettings,
}) => {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-sm pt-safe-header pb-[5px]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-11 sm:h-13 flex items-center justify-between gap-2">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <SchulteBrandLogo size={36} className="shrink-0 shadow-sm" />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-[17px] sm:text-lg font-black tracking-tight text-white leading-none">
                每日舒尔特
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 hidden lg:block">
              专注力与视野广度训练
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Hidden on mobile, bottom bar used instead) */}
        <nav className="hidden md:flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/60">
          <button
            id="tab-btn-training"
            type="button"
            onClick={() => setActiveTab('training')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'training'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>训练</span>
          </button>

          <button
            id="tab-btn-daily"
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'daily'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>每日打卡</span>
          </button>

          <button
            id="tab-btn-plans"
            type="button"
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'plans'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>专项计划</span>
          </button>

          <button
            id="tab-btn-analytics"
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>数据统计</span>
          </button>
        </nav>

        {/* Right Tools: Daily Streak, Focus Dot, Audio Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Daily Streak Button */}
          <button
            id="btn-daily-streak"
            type="button"
            onClick={onOpenDailyChallenge}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold transition-all active:scale-95 ${
              isDailyDoneToday
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25'
            }`}
            title="今日打卡挑战"
          >
            <Flame className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>{streakData.currentStreak}天</span>
            <span className="hidden sm:inline font-normal text-slate-300">
              {isDailyDoneToday ? '已打卡' : '打卡'}
            </span>
          </button>

          {/* Center Focus Dot Toggle */}
          <button
            id="btn-toggle-focus-dot"
            type="button"
            onClick={() => onUpdateSettings({ centerFocusDot: !settings.centerFocusDot })}
            className={`p-1.5 rounded-lg border text-xs transition-all active:scale-95 ${
              settings.centerFocusDot
                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={settings.centerFocusDot ? '中心注视点已开启' : '开启中心注视点'}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            id="btn-toggle-sound"
            type="button"
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`p-1.5 rounded-lg border text-xs transition-all active:scale-95 cursor-pointer ${
              settings.soundEnabled
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-red-950/40 border-red-800/50 text-red-400'
            }`}
            title={settings.soundEnabled ? '音效开启' : '音效静音'}
          >
            {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Settings Modal Button */}
          <button
            id="btn-header-settings"
            type="button"
            onClick={onOpenSettings}
            className={`p-1.5 rounded-lg border text-xs transition-all active:scale-95 relative cursor-pointer ${
              settings.reminder?.enabled
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="训练设置与习惯提醒"
          >
            <Settings className="w-3.5 h-3.5" />
            {settings.reminder?.enabled && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-1" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
