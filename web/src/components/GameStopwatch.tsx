import React, { useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from '../utils/formatTime';

interface GameStopwatchProps {
  isPlaying: boolean;
  isPaused: boolean;
  startTime: number;
  totalPausedMs: number;
  finalElapsedMs?: number;
  className?: string;
}

/**
 * High-performance stopwatch leaf component.
 * Uses direct DOM updates on animation frames to avoid triggering full tree re-renders.
 */
export const GameStopwatch: React.FC<GameStopwatchProps> = ({
  isPlaying,
  isPaused,
  startTime,
  totalPausedMs,
  finalElapsedMs,
  className = '',
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!spanRef.current) return;

    if (!isPlaying) {
      if (typeof finalElapsedMs === 'number' && finalElapsedMs > 0) {
        spanRef.current.textContent = formatTime(finalElapsedMs);
      } else {
        spanRef.current.textContent = '00:00.00';
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    if (isPaused) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const tick = () => {
      if (spanRef.current) {
        const now = Date.now();
        const elapsed = Math.max(0, now - startTime - totalPausedMs);
        spanRef.current.textContent = formatTime(elapsed);
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isPlaying, isPaused, startTime, totalPausedMs, finalElapsedMs]);

  return (
    <div
      className={`flex items-center gap-1 font-mono text-xl sm:text-2xl font-black text-slate-900 select-none ${className}`}
      role="timer"
      aria-label="训练计时"
    >
      <Clock className="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
      <span ref={spanRef} tabIndex={-1}>
        {finalElapsedMs ? formatTime(finalElapsedMs) : '00:00.00'}
      </span>
    </div>
  );
};
