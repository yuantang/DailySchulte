import React, { useState, useMemo } from 'react';
import {
  Compass,
  Target,
  Clock,
  Flame,
  Play,
  X,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { BoardShape, GridSize, SchulteMode } from '../types';
import { ProductPlanIcon } from './ProductIcons';
import {
  TRAINING_PLANS_100,
  PracticePlan,
  CATEGORIES,
} from '../utils/trainingPlansData';

export type { PracticePlan };

interface TrainingPlansViewProps {
  onSelectPlan: (config: {
    size: GridSize;
    shape: BoardShape;
    mode: SchulteMode;
    centerFocusDot?: boolean;
    planTitle?: string;
    planTarget?: string;
    autoStart?: boolean;
  }) => void;
  onGoToDaily: () => void;
  best5x5Time: string | null;
}

export const TrainingPlansView: React.FC<TrainingPlansViewProps> = ({
  onSelectPlan,
  onGoToDaily,
  best5x5Time,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<number | 'all'>('all');
  const [activeDetailPlan, setActiveDetailPlan] = useState<PracticePlan | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(30);

  const filteredPlans = useMemo(() => {
    let result = TRAINING_PLANS_100;

    // 1. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 2. Difficulty Filter
    if (difficultyFilter !== 'all') {
      result = result.filter((p) => p.difficulty === difficultyFilter);
    }

    return result;
  }, [selectedCategory, difficultyFilter]);

  const displayedPlans = useMemo(() => {
    return filteredPlans.slice(0, displayCount);
  }, [filteredPlans, displayCount]);

  const handleStartPlan = (plan: PracticePlan) => {
    setActiveDetailPlan(null);
    onSelectPlan({
      ...plan.config,
      planTitle: plan.title,
      planTarget: plan.targetDuration,
      autoStart: true,
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-3.5 pb-24">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                专项训练方案库
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                100 套科学方案
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              从入门唤醒到殿堂级极限 · 点击卡片查看科学要领
            </p>
          </div>
        </div>

        {best5x5Time && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-9 flex flex-col justify-center text-right shrink-0 bg-slate-50 px-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[9px] text-slate-500 font-semibold block leading-tight">5×5最佳</span>
              <span className="text-xs font-black text-amber-700 leading-tight">{best5x5Time}s</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Quick Filters Bar */}
      <div className="space-y-2">

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? TRAINING_PLANS_100.length
                : TRAINING_PLANS_100.filter((p) => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setDisplayCount(30);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-xs ring-1 ring-amber-400'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-slate-950/15 text-slate-900 font-black'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 text-xs px-1 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">难度:</span>
          {(['all', 1, 2, 3, 4, 5] as const).map((diff) => {
            const isSelected = difficultyFilter === diff;
            return (
              <button
                key={String(diff)}
                type="button"
                onClick={() => {
                  setDifficultyFilter(diff);
                  setDisplayCount(30);
                }}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {diff === 'all' ? '全部难度' : `${'★'.repeat(diff)}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Streamlined Clean Cards List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span>方案清单</span>
            <span className="text-amber-600 font-semibold font-mono">
              ({filteredPlans.length} / 100)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            按需选择 · 100关进阶强化
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {displayedPlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setActiveDetailPlan(plan)}
              className="bg-white hover:bg-slate-50/90 border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 shadow-2xs transition-all relative flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Header: Icon, Level Pill, Title, Subtitle, Info Icon */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
                      <ProductPlanIcon
                        id={plan.id}
                        category={plan.category}
                        size={28}
                        fallbackEmoji={plan.icon}
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-slate-900 text-white font-mono shrink-0">
                          L{String(plan.level).padStart(2, '0')}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 leading-tight group-hover:text-amber-700 transition-colors truncate">
                          {plan.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                        {plan.subtitle}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDetailPlan(plan);
                    }}
                    title="查看科学原理与步骤"
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {/* Brief description */}
                <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {plan.desc}
                </p>

                {/* Config & Tag Badges */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono font-bold">
                    {plan.config.size}×{plan.config.size}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${plan.tagColor}`}>
                    {plan.tag}
                  </span>
                  <span className="text-[10px] text-amber-500 font-mono tracking-tighter">
                    {'★'.repeat(plan.difficulty)}
                  </span>
                </div>
              </div>

              {/* Card Footer: Clean Goal & Single Start Action */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate font-medium">{plan.targetDuration}</span>
                </div>

                {/* Single clean start button on card */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartPlan(plan);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs shadow-2xs transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>开始</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button for 100 Plans */}
        {displayedPlans.length < filteredPlans.length && (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setDisplayCount((prev) => Math.min(prev + 30, filteredPlans.length))}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer"
            >
              加载更多方案 (剩余 {filteredPlans.length - displayedPlans.length} 套)
            </button>
          </div>
        )}
      </div>

      {/* 4. Quick Link to Daily Standard */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Flame className="w-5 h-5 text-amber-500 fill-current shrink-0" />
          <div>
            <h4 className="font-bold text-xs text-slate-900">想进行今日标准打卡？</h4>
            <p className="text-[11px] text-slate-600">练习标准 5×5 经典题型，点亮每日专注徽章</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onGoToDaily}
          className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs shadow-2xs hover:bg-amber-100 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          前往打卡 ➔
        </button>
      </div>

      {/* 5. Detail Bottom Sheet Drawer */}
      {activeDetailPlan && (
        <div
          className="fixed inset-0 z-60 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveDetailPlan(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg mx-auto bg-white rounded-t-3xl border-t border-x border-slate-200 text-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[82vh] animate-in slide-in-from-bottom duration-300 ease-out"
          >
            {/* Top Pull Handle Indicator */}
            <div
              className="pt-2.5 pb-1 flex justify-center shrink-0 cursor-pointer"
              onClick={() => setActiveDetailPlan(null)}
              title="点击关闭"
            >
              <div className="w-10 h-1.5 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors" />
            </div>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 rounded-2xl border border-amber-200 shrink-0 flex items-center justify-center">
                  <ProductPlanIcon
                    id={activeDetailPlan.id}
                    category={activeDetailPlan.category}
                    size={36}
                    fallbackEmoji={activeDetailPlan.icon}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-slate-900 text-white font-mono">
                      L{String(activeDetailPlan.level).padStart(2, '0')}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {activeDetailPlan.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${activeDetailPlan.tagColor}`}>
                      {activeDetailPlan.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{activeDetailPlan.subtitle}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveDetailPlan(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-1"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto px-5 sm:px-6 py-3.5 space-y-3.5 text-xs text-slate-600 leading-relaxed">
              {/* Target & Frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-slate-700 flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-bold">{activeDetailPlan.targetDuration}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-slate-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{activeDetailPlan.prescription}</span>
                </div>
              </div>

              {/* Audience & Key Target */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-900 shrink-0">适练人群:</span>
                  <span className="text-slate-600">{activeDetailPlan.audience}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-900 shrink-0">训练要点:</span>
                  <span className="text-slate-600 leading-normal">{activeDetailPlan.brainTarget}</span>
                </div>
              </div>

              {/* 3 Steps Advice */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  练习步骤建议
                </h4>
                <div className="space-y-2">
                  {activeDetailPlan.stages.map((stage) => (
                    <div
                      key={stage.step}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                        {stage.step}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{stage.name}</span>
                        <span className="text-slate-500 text-[11px] leading-relaxed">
                          {stage.detail}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer: Fixed at bottom with safe area padding */}
            <div className="px-5 sm:px-6 pt-3 pb-[max(1rem,env(safe-area-inset-bottom,16px))] bg-white border-t border-slate-100 flex items-center justify-between gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setActiveDetailPlan(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                返回列表
              </button>

              <button
                type="button"
                onClick={() => handleStartPlan(activeDetailPlan)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-black text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>立即开启本方案</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
