import React from 'react';
import { Target, BarChart3, Flame, Compass } from 'lucide-react';
import { DailyStreakData } from '../types';

interface BottomNavigationProps {
  activeTab: 'training' | 'daily' | 'plans' | 'analytics';
  setActiveTab: (tab: 'training' | 'daily' | 'plans' | 'analytics') => void;
  streakData: DailyStreakData;
  isDailyDoneToday: boolean;
  isTrainingActive?: boolean;
}

const TABS = [
  { id: 'training', label: '训练', icon: Target },
  { id: 'daily', label: '打卡', icon: Flame },
  { id: 'plans', label: '计划', icon: Compass },
  { id: 'analytics', label: '统计', icon: BarChart3 },
] as const;

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  setActiveTab,
  streakData,
  isDailyDoneToday,
  isTrainingActive = false,
}) => {
  const triggerHaptic = () => {
    try {
      window.dispatchEvent(
        new CustomEvent('haptic-feedback', { detail: { type: 'selection' } })
      );
    } catch {
      // ignore
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // ignore
      }
    }
  };

  const handleTabClick = (tab: 'training' | 'daily' | 'plans' | 'analytics') => {
    if (tab !== activeTab) {
      triggerHaptic();
      setActiveTab(tab);
    }
  };

  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="主要底部导航"
      className={`fixed bottom-[max(env(safe-area-inset-bottom,10px),14px)] left-1/2 -translate-x-1/2 w-[calc(100%-28px)] max-w-[364px] z-40 md:hidden transition-all duration-300 ease-out select-none ${
        isTrainingActive
          ? 'translate-y-28 opacity-0 pointer-events-none scale-95'
          : 'translate-y-0 opacity-100 scale-100'
      }`}
    >
      {/* 
        Apple Liquid Glass (iOS 26 / HIG 原生液态玻璃) 悬浮底盘 
        - 超高透光光学折射玻璃层 (backdrop-blur-3xl + saturate)
        - 边缘微高光反射线 (Specular Sheen Edge)
        - 内部液态光感凸透镜浮动滑块 (Liquid Glass Lens Slider)
      */}
      <div className="relative rounded-full p-1 bg-white/45 dark:bg-slate-900/50 backdrop-blur-3xl backdrop-saturate-[210%] border border-white/65 dark:border-white/15 shadow-[0_16px_40px_-6px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.05),inset_0_1px_1.5px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Top Rim Specular Reflection */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/95 to-transparent pointer-events-none rounded-full" />

        {/* Tab Switcher Grid Track */}
        <div className="grid grid-cols-4 items-center relative z-10">
          {/* Authentic Liquid Glass Morphing Lens (液态平滑滑动玻璃透镜) */}
          <div
            aria-hidden="true"
            className="absolute top-0.5 bottom-0.5 rounded-full bg-white/80 dark:bg-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-white/85 dark:border-white/25 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
            style={{
              left: `calc(${activeIndex * 25}% + 2px)`,
              width: `calc(25% - 4px)`,
            }}
          />

          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            const Icon = tab.icon;

            return (
              <button
                id={`nav-tab-${tab.id}`}
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className="relative z-10 flex flex-col items-center justify-center py-1.5 transition-transform duration-150 active:scale-92 cursor-pointer select-none"
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-all duration-200 ${
                      isActive
                        ? tab.id === 'daily'
                          ? 'text-amber-500 fill-amber-500/20 scale-105'
                          : 'text-amber-600 dark:text-amber-400 scale-105'
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                    }`}
                    strokeWidth={isActive ? 2.3 : 1.8}
                  />
                </div>

                <span
                  className={`text-[10px] tracking-tight mt-0.5 transition-colors duration-200 ${
                    isActive
                      ? 'font-bold text-slate-900 dark:text-white'
                      : 'font-medium text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
