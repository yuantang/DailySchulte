import { useState, useRef, useCallback, useEffect } from 'react';
import {
  BoardShape,
  ClickLog,
  GridSize,
  SchulteMode,
  SchulteTile,
  TrainingSettings,
  CustomDeck,
} from '../types';
import { generateSchulteBoard } from '../utils/schulteGenerator';
import { soundFx } from '../utils/audio';

export interface GameCompleteStats {
  elapsedMs: number;
  penaltyTimeMs: number;
  effectiveTimeMs: number;
  errorsCount: number;
  clickLogs: ClickLog[];
  size: GridSize;
  shape: BoardShape;
  mode: SchulteMode;
}

interface UseSchulteGameOptions {
  size: GridSize;
  shape: BoardShape;
  mode: SchulteMode;
  isDailyChallengeActive: boolean;
  todayDateStr: string;
  activeCustomDeck: CustomDeck | null;
  settings: TrainingSettings;
  onFinishSession: (stats: GameCompleteStats) => void;
}

export function useSchulteGame({
  size,
  shape,
  mode,
  isDailyChallengeActive,
  todayDateStr,
  activeCustomDeck,
  settings,
  onFinishSession,
}: UseSchulteGameOptions) {
  // Board Content State
  const [tiles, setTiles] = useState<SchulteTile[]>([]);
  const [targetSequence, setTargetSequence] = useState<
    { key: string; label: string; subLabel?: string; colorTag?: string }[]
  >([]);
  const [descriptionText, setDescriptionText] = useState<string>('');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Playback & Timing State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [countdownNumber, setCountdownNumber] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [totalPausedMs, setTotalPausedMs] = useState<number>(0);

  // Error & Penalty State
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [penaltyTimeMs, setPenaltyTimeMs] = useState<number>(0);
  const [errorTileId, setErrorTileId] = useState<string | null>(null);
  const [lastCorrectTileId, setLastCorrectTileId] = useState<string | null>(null);
  const [isBlindHidden, setIsBlindHidden] = useState<boolean>(false);

  // Timing & Metric Refs (Ref-based for max accuracy without unnecessary re-renders)
  const clickLogsRef = useRef<ClickLog[]>([]);
  const lastTapTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pauseStartRef = useRef<number>(0);
  const totalPausedMsRef = useRef<number>(0);
  const countdownTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Synchronize soundFx
  useEffect(() => {
    soundFx.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Blind memory hide timer
  useEffect(() => {
    if (isPlaying && mode === 'blind_memory' && !isBlindHidden) {
      const timer = setTimeout(() => {
        setIsBlindHidden(true);
      }, settings.blindHideDelaySeconds * 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, mode, isBlindHidden, settings.blindHideDelaySeconds]);

  // Generate / Reset board
  const resetBoard = useCallback(
    (newSize = size, newShape = shape, newMode = mode, isDaily = isDailyChallengeActive) => {
      // Cancel timers
      countdownTimersRef.current.forEach(clearTimeout);
      countdownTimersRef.current = [];
      setCountdownNumber(null);

      setIsPlaying(false);
      setIsPaused(false);
      setStartTime(0);
      setTotalPausedMs(0);
      startTimeRef.current = 0;
      totalPausedMsRef.current = 0;
      pauseStartRef.current = 0;

      setPenaltyTimeMs(0);
      setErrorsCount(0);
      setCurrentStepIndex(0);
      setIsBlindHidden(false);
      setErrorTileId(null);
      setLastCorrectTileId(null);
      clickLogsRef.current = [];

      const seed = isDaily ? todayDateStr : undefined;
      const data = generateSchulteBoard(
        newSize,
        newShape,
        newMode,
        seed,
        activeCustomDeck || undefined
      );
      setTiles(data.tiles);
      setTargetSequence(data.targetSequence);
      setDescriptionText(data.description);
    },
    [size, shape, mode, isDailyChallengeActive, todayDateStr, activeCustomDeck]
  );

  // Initialize board on config change
  useEffect(() => {
    resetBoard(size, shape, mode, isDailyChallengeActive);
  }, [size, shape, mode, isDailyChallengeActive, resetBoard]);

  // Real game startup
  const startRealGame = useCallback(() => {
    countdownTimersRef.current.forEach(clearTimeout);
    countdownTimersRef.current = [];
    setCountdownNumber(null);

    const now = Date.now();
    startTimeRef.current = now;
    lastTapTimeRef.current = now;
    totalPausedMsRef.current = 0;

    setStartTime(now);
    setTotalPausedMs(0);
    setIsPlaying(true);
    setIsPaused(false);
  }, []);

  const cancelCountdown = useCallback(() => {
    countdownTimersRef.current.forEach(clearTimeout);
    countdownTimersRef.current = [];
    setCountdownNumber(null);
    setIsPlaying(false);
  }, []);

  const skipCountdown = useCallback(() => {
    startRealGame();
  }, [startRealGame]);

  // Start training (with optional 3-2-1 focus countdown)
  const handleStart = useCallback(() => {
    resetBoard(size, shape, mode, isDailyChallengeActive);

    if (!settings.countdownEnabled) {
      soundFx.playTick();
      startRealGame();
      return;
    }

    countdownTimersRef.current.forEach(clearTimeout);
    countdownTimersRef.current = [];

    setCountdownNumber(3);
    soundFx.playTick();

    const t1 = setTimeout(() => {
      setCountdownNumber(2);
      soundFx.playTick();
    }, 700);

    const t2 = setTimeout(() => {
      setCountdownNumber(1);
      soundFx.playTick();
    }, 1400);

    const t3 = setTimeout(() => {
      setCountdownNumber(0);
      soundFx.playCorrect(1.0);
    }, 2100);

    const t4 = setTimeout(() => {
      startRealGame();
    }, 2500);

    countdownTimersRef.current = [t1, t2, t3, t4];
  }, [
    size,
    shape,
    mode,
    isDailyChallengeActive,
    settings.countdownEnabled,
    resetBoard,
    startRealGame,
  ]);

  // Pause / Resume training
  const handlePauseToggle = useCallback(() => {
    if (!isPlaying) return;
    if (!isPaused) {
      pauseStartRef.current = Date.now();
      setIsPaused(true);
    } else {
      const pausedDuration = Date.now() - pauseStartRef.current;
      totalPausedMsRef.current += pausedDuration;
      lastTapTimeRef.current += pausedDuration;
      setTotalPausedMs(totalPausedMsRef.current);
      setIsPaused(false);
    }
  }, [isPlaying, isPaused]);

  // Tile tap handler
  const handleTileClick = useCallback(
    (tile: SchulteTile, index: number) => {
      if (tile.isClicked) return;
      if (!isPlaying) {
        const firstTarget = targetSequence[0];
        if (firstTarget && tile.targetKey === firstTarget.key) {
          handleStart();
        }
        return;
      }
      if (isPaused) return;

      const currentTarget = targetSequence[currentStepIndex];
      if (!currentTarget) return;

      const now = Date.now();
      const latency = Math.max(20, now - lastTapTimeRef.current);

      if (tile.targetKey === currentTarget.key) {
        // CORRECT TAP
        lastTapTimeRef.current = now;
        setLastCorrectTileId(tile.id);
        setTimeout(() => setLastCorrectTileId(null), 250);

        const progress = (currentStepIndex + 1) / targetSequence.length;
        soundFx.playCorrect(progress);

        if (
          settings.hapticEnabled &&
          typeof navigator !== 'undefined' &&
          'vibrate' in navigator
        ) {
          try {
            navigator.vibrate(12);
          } catch {
            // ignore
          }
        }

        const logItem: ClickLog = {
          step: currentStepIndex + 1,
          targetKey: currentTarget.key,
          tileDisplayText: tile.displayText,
          timestamp: now,
          latencyMs: latency,
          isCorrect: true,
          tileIndex: index,
          coord: { x: tile.x ?? 50, y: tile.y ?? 50 },
        };
        clickLogsRef.current.push(logItem);

        const nextTiles = tiles.map((t) =>
          t.id === tile.id ? { ...t, isClicked: true } : t
        );

        // Dynamic shift mode perturbation
        if (mode === 'dynamic_shift' && currentStepIndex + 1 < targetSequence.length) {
          const unclicked = nextTiles.filter((t) => !t.isClicked && t.id !== tile.id);
          if (unclicked.length >= 2) {
            const idx1 = Math.floor(Math.random() * unclicked.length);
            let idx2 = Math.floor(Math.random() * unclicked.length);
            if (idx1 === idx2) idx2 = (idx1 + 1) % unclicked.length;
            const t1 = unclicked[idx1];
            const t2 = unclicked[idx2];
            const tempX = t1.x;
            const tempY = t1.y;
            t1.x = t2.x;
            t1.y = t2.y;
            t2.x = tempX;
            t2.y = tempY;
          }
        }

        setTiles(nextTiles);
        const nextStep = currentStepIndex + 1;
        setCurrentStepIndex(nextStep);

        // Check if finished
        if (nextStep >= targetSequence.length) {
          setIsPlaying(false);
          soundFx.playComplete();
          if (
            settings.hapticEnabled &&
            typeof navigator !== 'undefined' &&
            'vibrate' in navigator
          ) {
            try {
              navigator.vibrate([25, 40, 35, 50, 80]);
            } catch {
              // ignore
            }
          }

          const finalElapsed = Math.max(
            0,
            now - startTimeRef.current - totalPausedMsRef.current
          );
          const finalPenalty = penaltyTimeMs;
          const effectiveTime = finalElapsed + finalPenalty;

          onFinishSession({
            elapsedMs: finalElapsed,
            penaltyTimeMs: finalPenalty,
            effectiveTimeMs: effectiveTime,
            errorsCount,
            clickLogs: [...clickLogsRef.current],
            size,
            shape,
            mode,
          });
        }
      } else {
        // ERROR TAP
        soundFx.playError();
        if (
          settings.hapticEnabled &&
          typeof navigator !== 'undefined' &&
          'vibrate' in navigator
        ) {
          try {
            navigator.vibrate([40, 40]);
          } catch {
            // ignore
          }
        }
        setErrorTileId(tile.id);
        setTimeout(() => setErrorTileId(null), 300);

        setErrorsCount((prev) => prev + 1);
        setPenaltyTimeMs((prev) => prev + settings.errorPenaltyMs);

        clickLogsRef.current.push({
          step: currentStepIndex + 1,
          targetKey: currentTarget.key,
          tileDisplayText: tile.displayText,
          timestamp: now,
          latencyMs: latency,
          isCorrect: false,
          tileIndex: index,
          coord: { x: tile.x ?? 50, y: tile.y ?? 50 },
        });
      }
    },
    [
      isPlaying,
      isPaused,
      tiles,
      targetSequence,
      currentStepIndex,
      settings.hapticEnabled,
      settings.errorPenaltyMs,
      mode,
      penaltyTimeMs,
      errorsCount,
      size,
      shape,
      handleStart,
      onFinishSession,
    ]
  );

  return {
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
  };
}
