import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  ChevronRight,
  Clock,
  Eye,
  Flame,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import {
  BoardShape,
  GridSize,
  SchulteMode,
  SessionRecord,
  TrainingSettings,
  DailyStreakData,
  CustomDeck,
} from './types';
import { getActiveCustomDeck } from './utils/customDecks';
import {
  calculateRadarMetrics,
  getDailyStreakData,
  getStoredSessions,
  saveSessionRecord,
} from './utils/analytics';
import { Header } from './components/Header';
import { SchulteBoard } from './components/SchulteBoard';
import { GameControls, SHAPES, MODE_CATEGORIES } from './components/GameControls';
import { ResultModal } from './components/ResultModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { DailyCheckInView } from './components/DailyCheckInView';
import { TrainingPlansView } from './components/TrainingPlansView';
import { BottomNavigation } from './components/BottomNavigation';
import { SettingsModal } from './components/SettingsModal';
import { CustomContentModal } from './components/CustomContentModal';
import { SharePosterModal } from './components/SharePosterModal';
import { GameStopwatch } from './components/GameStopwatch';
import { formatTime } from './utils/formatTime';
import { useSchulteGame, GameCompleteStats } from './hooks/useSchulteGame';
import {
  shouldTriggerReminder,
  sendTrainingNotification,
  saveStoredReminder,
} from './utils/reminder';
import {
  getStoredUserSettings,
  saveStoredUserSettings,
} from './utils/settingsStorage';
import {
  initNativeTabBarSupport,
  showNativeTabBar,
  hideNativeTabBar,
  setNativeSelectedTab,
  onNativeTabSelected,
  getNativeTabBarLayout,
  onNativeTabBarLayoutChanged,
  waitForNativeStartupReady,
  updateNativeTabBadge,
  NATIVE_TAB_ITEMS,
} from './utils/nativeTabBar';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'training' | 'daily' | 'plans' | 'analytics'>('training');

  // Native Liquid Glass TabBar Support (iOS 26+)
  const [hasNativeTabBar, setHasNativeTabBar] = useState<boolean>(false);
  const [hasGlobalDomModal, setHasGlobalDomModal] = useState<boolean>(false);

  // Game Configuration State
  const [size, setSize] = useState<GridSize>(5);
  const [shape, setShape] = useState<BoardShape>('grid');
  const [mode, setMode] = useState<SchulteMode>('numbers_asc');
  const [isDailyChallengeActive, setIsDailyChallengeActive] = useState<boolean>(false);

  // Training Settings (Auto-persisted via localStorage)
  const [settings, setSettings] = useState<TrainingSettings>(() => getStoredUserSettings());

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Today Date String
  const todayDateStr = new Date().toISOString().split('T')[0];

  // Daily Streak Data & Stored History
  const [streakData, setStreakData] = useState<DailyStreakData>(getDailyStreakData());
  const [sessions, setSessions] = useState<SessionRecord[]>(getStoredSessions());
  const [isDailyModalOpen, setIsDailyModalOpen] = useState<boolean>(false);
  const [inspectSessionId, setInspectSessionId] = useState<string | null>(null);

  // Active Plan Mission context
  const [activePlanInfo, setActivePlanInfo] = useState<{
    title: string;
    targetDuration?: string;
  } | null>(null);

  // UGC Custom Deck & Modals
  const [activeCustomDeck, setActiveCustomDeck] = useState<CustomDeck | null>(() => getActiveCustomDeck());
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isSharePosterModalOpen, setIsSharePosterModalOpen] = useState<boolean>(false);

  const isDailyDoneToday = streakData.historyDates.includes(todayDateStr);

  // Finished Session & Result Modal
  const [completedRecord, setCompletedRecord] = useState<SessionRecord | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);

  // Finish session callback from useSchulteGame
  const handleFinishSession = useCallback(
    (stats: GameCompleteStats) => {
      const finalElapsed = stats.elapsedMs;
      const finalPenalty = stats.penaltyTimeMs;
      const effectiveTime = stats.effectiveTimeMs;

      const correctLogs = stats.clickLogs.filter((l) => l.isCorrect);
      const avgTapMs =
        correctLogs.length > 0
          ? Math.round(
              correctLogs.reduce((a, b) => a + b.latencyMs, 0) / correctLogs.length
            )
          : 0;

      const totalTaps = stats.clickLogs.length;
      const accuracyRate =
        totalTaps > 0
          ? ((totalTaps - stats.errorsCount) / totalTaps) * 100
          : 100;

      const radarMetrics = calculateRadarMetrics(
        stats.clickLogs,
        effectiveTime,
        stats.size,
        stats.errorsCount
      );

      const now = new Date();
      const dateFormatted = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
        now.getHours()
      ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // Check if new personal best for this size
      const prevSessionsForSize = sessions.filter((s) => s.size === stats.size);
      const prevBestTime =
        prevSessionsForSize.length > 0
          ? Math.min(...prevSessionsForSize.map((s) => s.totalTimeMs))
          : Infinity;
      const isPB = effectiveTime < prevBestTime;
      setIsNewBest(isPB);

      const newRecord: SessionRecord = {
        id: `session-${Date.now()}`,
        date: now.toISOString(),
        dateFormatted,
        dayKey: todayDateStr,
        size: stats.size,
        shape: stats.shape,
        mode: stats.mode,
        totalTiles: stats.size * stats.size,
        totalTimeMs: effectiveTime,
        penaltyTimeMs: finalPenalty,
        effectiveTimeMs: effectiveTime,
        averageTapMs: avgTapMs,
        errorsCount: stats.errorsCount,
        accuracyRate,
        clickLogs: stats.clickLogs,
        metrics: radarMetrics,
        isDailyChallenge: isDailyChallengeActive,
        planTitle: activePlanInfo?.title,
        customTitle:
          stats.mode === 'custom_text'
            ? activeCustomDeck?.title || '自定义题库'
            : undefined,
      };

      saveSessionRecord(newRecord);
      setCompletedRecord(newRecord);
      setSessions(getStoredSessions());
      setStreakData(getDailyStreakData());
      setIsResultModalOpen(true);
    },
    [
      sessions,
      todayDateStr,
      isDailyChallengeActive,
      activePlanInfo?.title,
      activeCustomDeck?.title,
    ]
  );

  // Schulte Game Engine Hook (Decoupled & High Performance)
  const {
    tiles,
    targetSequence,
    currentStepIndex,
    descriptionText,
    isPlaying,
    isPaused,
    countdownNumber,
    startTime,
    totalPausedMs,
    errorsCount,
    penaltyTimeMs,
    errorTileId,
    lastCorrectTileId,
    isBlindHidden,
    resetBoard,
    handleStart,
    startRealGame,
    handlePauseToggle,
    cancelCountdown,
    skipCountdown,
    handleTileClick,
  } = useSchulteGame({
    size,
    shape,
    mode,
    isDailyChallengeActive,
    todayDateStr,
    activeCustomDeck,
    settings,
    onFinishSession: handleFinishSession,
  });

  const isTrainingActive =
    activeTab === 'training' && (isPlaying || countdownNumber !== null) && !isPaused;

  // 全局全量弹窗感知（覆盖 App.tsx 以及所有子组件内部的 Portal / Modal 弹窗）
  useEffect(() => {
    const checkModals = () => {
      const modals = document.querySelectorAll('.fixed.inset-0, [data-modal="true"]');
      let found = false;
      for (let i = 0; i < modals.length; i++) {
        const el = modals[i] as HTMLElement;
        if (el.id === 'mobile-bottom-navigation') continue;
        if (el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0) {
          found = true;
          break;
        }
      }
      setHasGlobalDomModal(found);
    };

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        checkModals();
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const isAnyModalActive =
    isResultModalOpen ||
    isSettingsOpen ||
    isDailyModalOpen ||
    isCustomModalOpen ||
    isSharePosterModalOpen ||
    hasGlobalDomModal;

  // 1. 初始化原生 Liquid Glass 支持 (iOS 26+)
  useEffect(() => {
    let active = true;
    void waitForNativeStartupReady()
      .then(initNativeTabBarSupport)
      .then((enabled) => {
        if (active) setHasNativeTabBar(enabled);
      });
    return () => {
      active = false;
    };
  }, []);

  // 2. 原生底栏布局尺寸动态同步至 CSS 变量 --tab-bar-clearance
  useEffect(() => {
    const root = document.documentElement;
    if (!hasNativeTabBar) {
      root.style.setProperty('--tab-bar-clearance', '80px');
      return;
    }

    root.style.setProperty(
      '--tab-bar-clearance',
      'calc(54px + env(safe-area-inset-bottom, 16px))'
    );

    let active = true;
    let listener: { remove: () => void } | undefined;

    void getNativeTabBarLayout().then((layout) => {
      if (active && layout && layout.height > 0) {
        root.style.setProperty('--tab-bar-clearance', `${Math.ceil(layout.height)}px`);
      }
    });

    void onNativeTabBarLayoutChanged((layout) => {
      if (active && layout && layout.height > 0) {
        root.style.setProperty('--tab-bar-clearance', `${Math.ceil(layout.height)}px`);
      }
    }).then((h) => {
      listener = h;
    });

    return () => {
      active = false;
      listener?.remove();
    };
  }, [hasNativeTabBar]);

  // 3. 原生 TabBar 挂载、弹窗与全神贯注训练避让控制
  useEffect(() => {
    if (!hasNativeTabBar) return;
    if (isAnyModalActive || isTrainingActive) {
      void waitForNativeStartupReady().then(hideNativeTabBar);
    } else {
      void waitForNativeStartupReady().then(() => {
        void showNativeTabBar(NATIVE_TAB_ITEMS, activeTab);
        void setNativeSelectedTab(activeTab);
        // 方案 B：保持液态玻璃 TabBar 纯净优雅，不显示红点角标
        void updateNativeTabBadge('daily', '');
      });
    }
  }, [hasNativeTabBar, isAnyModalActive, isTrainingActive, activeTab]);

  // 4. 监听原生底栏点击事件
  useEffect(() => {
    if (!hasNativeTabBar) return;
    let active = true;
    let handle: { remove: () => void } | undefined;
    void waitForNativeStartupReady().then(() =>
      onNativeTabSelected((id) => {
        if (['training', 'daily', 'plans', 'analytics'].includes(id)) {
          if (id !== 'analytics') {
            setInspectSessionId(null);
          }
          setActiveTab(id as any);
        }
      })
    ).then((h) => {
      if (!active) {
        h?.remove();
        return;
      }
      handle = h;
    });
    return () => {
      active = false;
      handle?.remove();
    };
  }, [hasNativeTabBar]);

  // Background check for scheduled daily training reminder via browser Notification API
  useEffect(() => {
    if (!settings.reminder?.enabled) return;

    const checkReminder = () => {
      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;
      const currentDateStr = now.toISOString().split('T')[0];

      if (
        shouldTriggerReminder(
          settings.reminder,
          isDailyDoneToday,
          currentDateStr,
          currentHHMM
        )
      ) {
        const sent = sendTrainingNotification({
          title: '每日舒尔特：专注力训练时刻！🎯',
          body: `您设定的训练时间（${settings.reminder.time}）已到。花 3 分钟练一组舒尔特方格，保持思维敏锐与每日连击！`,
          onClick: () => {
            setActiveTab('training');
          },
        });

        if (sent) {
          const updatedReminder = {
            ...settings.reminder,
            lastNotifiedDate: currentDateStr,
          };
          setSettings((prev) => ({
            ...prev,
            reminder: updatedReminder,
          }));
          saveStoredReminder(updatedReminder);
        }
      }
    };

    // Run check immediately and every 25 seconds
    checkReminder();
    const intervalId = setInterval(checkReminder, 25000);
    return () => clearInterval(intervalId);
  }, [settings.reminder, isDailyDoneToday]);

  // Global Keyboard Shortcuts (Space to start/pause/replay, Esc to close/cancel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (isResultModalOpen) {
          setIsResultModalOpen(false);
          handleStart();
        } else if (activeTab === 'training') {
          if (countdownNumber !== null) {
            startRealGame();
          } else if (!isPlaying) {
            handleStart();
          } else {
            handlePauseToggle();
          }
        }
      } else if (e.code === 'Escape') {
        if (countdownNumber !== null) {
          cancelCountdown();
        } else if (isResultModalOpen) {
          setIsResultModalOpen(false);
        } else if (isDailyModalOpen) {
          setIsDailyModalOpen(false);
        } else if (isSettingsOpen) {
          setIsSettingsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isResultModalOpen,
    activeTab,
    countdownNumber,
    isPlaying,
    isDailyModalOpen,
    isSettingsOpen,
    handleStart,
    handlePauseToggle,
    startRealGame,
    cancelCountdown,
  ]);

  // Launch daily challenge
  const handleStartDailyChallenge = () => {
    setIsDailyChallengeActive(true);
    setActivePlanInfo({
      title: '今日每日打卡挑战',
      targetDuration: '标准 5×5 飞行员常模',
    });
    setSize(5);
    setShape('grid');
    setMode('numbers_asc');
    setActiveTab('training');
    setTimeout(() => {
      handleStart();
    }, 120);
  };

  const handleUpdateSettings = (newSettings: Partial<TrainingSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveStoredUserSettings(updated);
      return updated;
    });
  };

  const refreshHistoryData = () => {
    setSessions(getStoredSessions());
    setStreakData(getDailyStreakData());
  };

  const currentTarget = targetSequence[currentStepIndex];

  const bestTimeForCurrent = useMemo(() => {
    const matches = sessions.filter(
      (s) => s.size === size && s.shape === shape && s.mode === mode
    );
    if (matches.length === 0) return null;
    const bestMs = Math.min(...matches.map((s) => s.totalTimeMs));
    return (bestMs / 1000).toFixed(2);
  }, [sessions, size, shape, mode]);

  const todayTrainingCount = useMemo(() => {
    return sessions.filter((s) => s.dayKey === todayDateStr).length;
  }, [sessions, todayDateStr]);

  const currentShapeLabel = useMemo(() => {
    return SHAPES.find((s) => s.value === shape)?.label || '经典方格';
  }, [shape]);

  const currentModeLabel = useMemo(() => {
    return (
      MODE_CATEGORIES.flatMap((c) => c.modes).find((m) => m.value === mode)?.label ||
      '经典正序'
    );
  }, [mode]);

  return (
    <div
      className={`w-full bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-amber-200 ${
        activeTab === 'training'
          ? 'h-[100dvh] max-h-[100dvh] overflow-hidden'
          : 'min-h-screen'
      }`}
    >
      {/* 1. Universal Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streakData={streakData}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenDailyChallenge={() => setActiveTab('daily')}
        isDailyDoneToday={isDailyDoneToday}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Main Body Container */}
      <main
        className={`flex-1 w-full max-w-7xl mx-auto px-2 sm:px-3 pt-1 pb-0 transition-all flex flex-col min-h-0 ${
          activeTab === 'training'
            ? 'overflow-hidden'
            : 'pb-32 overflow-y-auto'
        }`}
      >
        {activeTab === 'training' && (
          <div
            className={`w-full h-full flex-1 flex flex-col items-center max-w-[min(98vw,520px)] mx-auto min-h-0 ${
              isPlaying
                ? 'justify-start pt-1 gap-2.5 sm:gap-3'
                : 'justify-between gap-2.5 sm:gap-3'
            }`}
            style={{
              paddingBottom: isTrainingActive
                ? 'env(safe-area-inset-bottom, 16px)'
                : 'calc(var(--tab-bar-clearance, 80px) + 8px)',
            }}
          >
            {/* Top: Active Plan Banner & Target Prompt Bar */}
            <div className="w-full shrink-0 space-y-1">
              {activePlanInfo && !isPlaying && (
                <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-2xl px-3 py-1.5 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Target className="w-4 h-4 text-amber-600 shrink-0" />
                    <div className="truncate text-xs">
                      <span className="font-bold text-slate-900">{activePlanInfo.title}</span>
                      {activePlanInfo.targetDuration && (
                        <span className="text-amber-800 ml-1.5 font-semibold">({activePlanInfo.targetDuration})</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePlanInfo(null)}
                    className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white hover:bg-slate-50 text-slate-500 hover:text-rose-600 border border-slate-200 shrink-0 cursor-pointer transition-colors"
                    title="退出当前方案，切换为自由训练"
                  >
                    退出方案
                  </button>
                </div>
              )}

              {/* Real-time Game Status & Target Prompt Bar */}
              <div className="w-full bg-white rounded-2xl p-2 sm:p-2.5 border border-slate-200 shadow-xs flex flex-col gap-1 shrink-0">
                <div className="w-full flex items-center justify-between gap-2">
                  {/* Left: Target Pill */}
                  <div className="flex items-center gap-1.5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      目标:
                    </div>
                    {currentTarget ? (
                      <div
                        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl font-black text-sm sm:text-base shadow-xs border transition-all ${
                          currentTarget.colorTag === 'red'
                            ? 'bg-rose-600 text-white border-rose-700 shadow-rose-200'
                            : currentTarget.colorTag === 'black'
                            ? 'bg-slate-900 text-white border-slate-950'
                            : currentTarget.colorTag && currentTarget.colorTag.startsWith('#')
                            ? 'bg-slate-900 text-white border-slate-800'
                            : 'bg-amber-500 text-slate-950 border-amber-600'
                        }`}
                      >
                        {currentTarget.colorTag && currentTarget.colorTag.startsWith('#') && (
                          <span
                            className="w-2.5 h-2.5 rounded-full ring-1 ring-white/70"
                            style={{ backgroundColor: currentTarget.colorTag }}
                          />
                        )}
                        <span>{currentTarget.label}</span>
                        {currentTarget.subLabel && (
                          <span className="text-[10px] font-bold opacity-85 bg-black/20 text-white px-1.5 py-0.2 rounded-full">
                            {currentTarget.subLabel}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600">完成</span>
                    )}
                  </div>

                  {/* Center: Stopwatch Timer (Isolated Leaf Component, 0 Root Re-renders) */}
                  <GameStopwatch
                    isPlaying={isPlaying}
                    isPaused={isPaused}
                    startTime={startTime}
                    totalPausedMs={totalPausedMs}
                    finalElapsedMs={completedRecord?.totalTimeMs}
                  />

                  {/* Right: Progress step count & errors */}
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <div className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                      {currentStepIndex}/{targetSequence.length}
                    </div>
                    {errorsCount > 0 && (
                      <div className="px-1.5 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200" title="误触次数">
                        +{errorsCount}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-bar: Active Dimension Alignment Indicator */}
                {isPlaying && (
                  <div className="flex items-center justify-between pt-0.5 border-t border-slate-100 text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-400">当前维度配置:</span>
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60">
                      <span>{size}×{size}</span>
                      <span className="text-amber-300">·</span>
                      <span>{currentShapeLabel}</span>
                      <span className="text-amber-300">·</span>
                      <span>{currentModeLabel}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle: Schulte Training Stage (Adaptive Square Board!) */}
            <div
              className={`w-full min-w-0 flex items-center justify-center overflow-hidden ${
                isPlaying
                  ? 'h-auto shrink-0 p-0.5'
                  : 'flex-1 min-h-0'
              }`}
            >
              <SchulteBoard
                tiles={tiles}
                size={size}
                shape={shape}
                mode={mode}
                isPlaying={isPlaying}
                isPaused={isPaused}
                isCompleted={currentStepIndex >= targetSequence.length && targetSequence.length > 0}
                isBlindHidden={isBlindHidden}
                centerFocusDot={settings.centerFocusDot}
                onTileClick={handleTileClick}
                errorTileId={errorTileId}
                lastCorrectTileId={lastCorrectTileId}
                countdownNumber={countdownNumber}
                onSkipCountdown={skipCountdown}
              />
            </div>

            {/* Bottom: GameControls (Start Training is right above Tab Bar!) */}
            <div className="w-full shrink-0">
              <GameControls
                size={size}
                onSizeChange={(newSize) => {
                  setSize(newSize);
                  setIsDailyChallengeActive(false);
                }}
                shape={shape}
                onShapeChange={(newShape) => {
                  setShape(newShape);
                  setIsDailyChallengeActive(false);
                }}
                mode={mode}
                onModeChange={(newMode) => {
                  setMode(newMode);
                  setIsDailyChallengeActive(false);
                }}
                isPlaying={isPlaying}
                isPaused={isPaused}
                onStart={handleStart}
                onPauseToggle={handlePauseToggle}
                onReset={() => resetBoard(size, shape, mode, isDailyChallengeActive)}
                onOpenDaily={() => setActiveTab('daily')}
                isDailyChallengeActive={isDailyChallengeActive}
                descriptionText={descriptionText}
                bestTimeForCurrent={bestTimeForCurrent}
                todayTrainingCount={todayTrainingCount}
                centerFocusDot={settings.centerFocusDot}
                onToggleCenterFocusDot={() =>
                  setSettings((prev) => ({ ...prev, centerFocusDot: !prev.centerFocusDot }))
                }
                showNextTarget={settings.showNextTarget}
                onToggleShowNextTarget={() =>
                  setSettings((prev) => ({ ...prev, showNextTarget: !prev.showNextTarget }))
                }
                soundEnabled={settings.soundEnabled}
                onToggleSound={() =>
                  setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
                }
                countdownEnabled={settings.countdownEnabled}
                onToggleCountdown={() =>
                  setSettings((prev) => ({ ...prev, countdownEnabled: !prev.countdownEnabled }))
                }
                onOpenCustomModal={() => setIsCustomModalOpen(true)}
                activeCustomDeck={activeCustomDeck}
              />
            </div>
          </div>
        )}

        {/* 2. Daily Check-in Full View Tab */}
        {activeTab === 'daily' && (
          <div className="w-full" style={{ paddingBottom: 'calc(var(--tab-bar-clearance, 80px) + 24px)' }}>
            <DailyCheckInView
              streakData={streakData}
              isDailyDoneToday={isDailyDoneToday}
              onStartDailyChallenge={handleStartDailyChallenge}
              todayDateStr={todayDateStr}
              sessions={sessions}
              onGoToTraining={() => setActiveTab('training')}
              onOpenSettings={() => setIsSettingsOpen(true)}
              reminderConfig={settings.reminder}
            />
          </div>
        )}

        {/* 3. Specialized Training Plans Tab */}
        {activeTab === 'plans' && (
          <div className="w-full" style={{ paddingBottom: 'calc(var(--tab-bar-clearance, 80px) + 24px)' }}>
            <TrainingPlansView
              onSelectPlan={(planConfig) => {
                setSize(planConfig.size);
                setShape(planConfig.shape);
                setMode(planConfig.mode);
                if (planConfig.centerFocusDot !== undefined) {
                  setSettings((prev) => ({ ...prev, centerFocusDot: Boolean(planConfig.centerFocusDot) }));
                }
                if (planConfig.planTitle) {
                  setActivePlanInfo({
                    title: planConfig.planTitle,
                    targetDuration: planConfig.planTarget,
                  });
                } else {
                  setActivePlanInfo(null);
                }
                setIsDailyChallengeActive(false);
                setActiveTab('training');
                if (planConfig.autoStart !== false) {
                  setTimeout(() => {
                    handleStart();
                  }, 140);
                }
              }}
              onGoToDaily={() => setActiveTab('daily')}
              best5x5Time={
                sessions.filter((s) => s.size === 5).length > 0
                  ? (Math.min(...sessions.filter((s) => s.size === 5).map((s) => s.totalTimeMs)) / 1000).toFixed(2)
                  : null
              }
            />
          </div>
        )}

        {/* 4. Graphical Cognitive Analytics Dashboard Tab */}
        {activeTab === 'analytics' && (
          <div className="w-full" style={{ paddingBottom: 'calc(var(--tab-bar-clearance, 80px) + 24px)' }}>
            <AnalyticsDashboard
              sessions={sessions}
              onRefreshData={refreshHistoryData}
              onSelectSessionToPlay={(s) => {
                setSize(s);
                setActiveTab('training');
              }}
              initialSelectedSessionId={inspectSessionId}
            />
          </div>
        )}
      </main>

      {/* 3. Mobile Fixed Bottom Navigation Bar (Hidden when iOS 26+ Native Liquid Glass is active) */}
      {!hasNativeTabBar && (
        <BottomNavigation
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab !== 'analytics') {
              setInspectSessionId(null);
            }
            setActiveTab(tab);
          }}
          streakData={streakData}
          isDailyDoneToday={isDailyDoneToday}
          isTrainingActive={isTrainingActive}
        />
      )}

      {/* Result Modal */}
      {isResultModalOpen && completedRecord && (
        <ResultModal
          record={completedRecord}
          isNewBest={isNewBest}
          onPlayAgain={() => {
            setIsResultModalOpen(false);
            handleStart();
          }}
          onViewDeepAnalytics={() => {
            setInspectSessionId(completedRecord.id);
            setIsResultModalOpen(false);
            setActiveTab('analytics');
          }}
          onOpenSharePoster={() => setIsSharePosterModalOpen(true)}
          onClose={() => setIsResultModalOpen(false)}
        />
      )}

      {/* 成绩海报一键导出弹窗 */}
      {isSharePosterModalOpen && completedRecord && (
        <SharePosterModal
          isOpen={isSharePosterModalOpen}
          onClose={() => setIsSharePosterModalOpen(false)}
          record={completedRecord}
          isNewBest={isNewBest}
          streakCount={streakData.currentStreak}
        />
      )}

      {/* UGC 自定义文本/词汇导入生成器 */}
      <CustomContentModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSelectAndStart={(deck, recommendedSize) => {
          setActiveCustomDeck(deck);
          setSize(recommendedSize);
          setMode('custom_text');
          setIsDailyChallengeActive(false);
          setActiveTab('training');
          resetBoard(recommendedSize, shape, 'custom_text', false);
        }}
      />

      {/* Daily Challenge Modal */}
      <DailyChallengeModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        streakData={streakData}
        isCompletedToday={isDailyDoneToday}
        onStartDailyChallenge={handleStartDailyChallenge}
        todayDateStr={todayDateStr}
      />

      {/* Settings & Habit Reminder Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        isDailyDoneToday={isDailyDoneToday}
      />
    </div>
  );
}
