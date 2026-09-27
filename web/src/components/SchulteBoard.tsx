import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { BoardShape, GridSize, SchulteMode, SchulteTile } from '../types';

interface SchulteBoardProps {
  tiles: SchulteTile[];
  size: GridSize;
  shape: BoardShape;
  mode: SchulteMode;
  isPlaying: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  isBlindHidden: boolean;
  centerFocusDot: boolean;
  onTileClick: (tile: SchulteTile, index: number) => void;
  errorTileId: string | null;
  lastCorrectTileId: string | null;
  countdownNumber?: number | null;
  onSkipCountdown?: () => void;
}

export const SchulteBoard: React.FC<SchulteBoardProps> = ({
  tiles,
  size,
  shape,
  mode,
  isPlaying,
  isPaused,
  isCompleted,
  isBlindHidden,
  centerFocusDot,
  onTileClick,
  errorTileId,
  lastCorrectTileId,
  countdownNumber = null,
  onSkipCountdown,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSizePx, setBoardSizePx] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const availW = window.innerWidth - 16;
      const availH = window.innerHeight - 440;
      return Math.floor(Math.max(200, Math.min(availW, availH, 440)));
    }
    return 340;
  });

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (!containerRef.current) return;
      const parent = containerRef.current.parentElement;
      const availW = parent ? Math.floor(parent.clientWidth) : Math.floor(containerRef.current.clientWidth);
      const availH = parent ? Math.floor(parent.clientHeight) : Math.floor(containerRef.current.clientHeight);
      if (availW > 0 && availH > 0) {
        // Enforce strict 1:1 square: dimension is strictly identical on both axes
        const side = Math.min(availW, availH);
        setBoardSizePx((prev) => (Math.abs(prev - side) > 1 ? side : prev));
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }
    observer.observe(containerRef.current);
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, [isPlaying]);

  // Dynamic font sizing tuned for small mobile viewports (e.g. 360px - 430px)
  const getFontSizeClass = () => {
    if (
      mode === 'chinese_chars' ||
      mode === 'chinese_stems' ||
      mode === 'chinese_poetry' ||
      mode === 'chinese_idioms'
    ) {
      if (size <= 3) return 'text-2xl sm:text-3xl font-bold font-serif';
      if (size === 4) return 'text-xl sm:text-2xl font-bold font-serif';
      if (size === 5) return 'text-base sm:text-lg font-bold font-serif';
      if (size === 6) return 'text-xs sm:text-sm font-bold font-serif';
      if (size === 7) return 'text-[11px] sm:text-xs font-semibold';
      if (size === 8) return 'text-[9px] sm:text-[10px] font-semibold';
      return 'text-[8px] sm:text-[9px] font-semibold';
    }
    if (mode === 'roman_numerals') {
      if (size <= 3) return 'text-xl sm:text-2xl font-extrabold tracking-tight';
      if (size === 4) return 'text-lg sm:text-xl font-extrabold tracking-tight';
      if (size === 5) return 'text-xs sm:text-sm font-bold';
      if (size === 6) return 'text-[11px] sm:text-xs font-bold';
      if (size === 7) return 'text-[9px] sm:text-[10px] font-bold';
      return 'text-[8px] sm:text-[9px] font-bold';
    }
    if (mode === 'symbols') {
      if (size <= 3) return 'text-3xl sm:text-4xl';
      if (size === 4) return 'text-2xl sm:text-3xl';
      if (size === 5) return 'text-xl sm:text-2xl';
      if (size === 6) return 'text-base sm:text-lg';
      if (size === 7) return 'text-xs sm:text-sm';
      return 'text-[10px] sm:text-xs';
    }
    if (mode === 'math_calc') {
      if (size <= 3) return 'text-base sm:text-lg font-bold';
      if (size === 4) return 'text-sm sm:text-base font-bold';
      if (size === 5) return 'text-xs sm:text-sm font-bold';
      if (size === 6) return 'text-[11px] sm:text-xs font-bold';
      return 'text-[9px] sm:text-[10px] font-semibold';
    }
    if (mode === 'custom_text') {
      if (size <= 3) return 'text-sm sm:text-base font-bold';
      if (size === 4) return 'text-xs sm:text-sm font-bold';
      if (size === 5) return 'text-[11px] sm:text-xs font-bold';
      if (size === 6) return 'text-[10px] sm:text-[11px] font-bold';
      return 'text-[8px] sm:text-[9px] font-semibold';
    }
    if (size <= 3) return 'text-3xl sm:text-4xl font-black';
    if (size === 4) return 'text-2xl sm:text-3xl font-black';
    if (size === 5) return 'text-lg sm:text-2xl font-black';
    if (size === 6) return 'text-sm sm:text-base font-extrabold';
    if (size === 7) return 'text-xs sm:text-sm font-bold';
    if (size === 8) return 'text-[11px] sm:text-xs font-bold';
    return 'text-[9px] sm:text-[10px] font-bold tracking-tighter';
  };

  // Dynamic rounded corners tuned for tile density
  const getTileRoundedClass = () => {
    if (size <= 3) return 'rounded-xl sm:rounded-2xl';
    if (size <= 5) return 'rounded-lg sm:rounded-xl';
    if (size <= 7) return 'rounded-md sm:rounded-lg';
    return 'rounded-xs sm:rounded-sm';
  };

  // Geometric tile size in percentage relative to container width
  const getTileSizePercent = () => {
    if (size <= 3) return 24;
    if (size === 4) return 18;
    if (size === 5) return 14.5;
    if (size === 6) return 12.5;
    if (size === 7) return 10.5;
    if (size === 8) return 9.2;
    return 8;
  };

  const tilePercent = getTileSizePercent();

  // Render individual tile button content
  const renderTileContent = (tile: SchulteTile) => {
    if (tile.isClicked) {
      return (
        <span className="opacity-20 scale-75 transition-all text-slate-400 select-none">
          {tile.displayText}
        </span>
      );
    }

    // In blind memory mode, if hidden
    if (isBlindHidden && isPlaying) {
      return (
        <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-slate-400/60 animate-pulse select-none" />
      );
    }

    // Red-Black dual tests: classic Gorbov Table or red_black
    if (mode === 'red_black' || mode === 'red_asc_black_desc') {
      const isRed = tile.colorTag === 'red';
      return (
        <span className={`font-black select-none ${isRed ? 'text-rose-600' : 'text-slate-950'}`}>
          {tile.displayText}
        </span>
      );
    }

    // Symbols mode: colorful visual icon
    if (mode === 'symbols') {
      return (
        <span
          className="select-none transition-transform hover:scale-110 drop-shadow-2xs leading-none"
          style={{ color: tile.fontColor || '#1e293b' }}
        >
          {tile.displayText}
        </span>
      );
    }

    // Color gradient spectrum mode
    if (mode === 'color_gradient') {
      return (
        <div className="flex flex-col items-center justify-center gap-0.5 select-none w-full h-full p-0.5">
          <div
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full shadow-xs ring-1 ring-black/10"
            style={{ backgroundColor: tile.bgColor || '#3b82f6' }}
          />
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-800 leading-tight">
            {tile.displayText}
          </span>
        </div>
      );
    }

    // Classical poetry mode with optional sub-label
    if (mode === 'chinese_poetry' && size <= 5 && tile.secondaryText) {
      return (
        <div className="flex flex-col items-center justify-center leading-tight select-none">
          <span className="text-slate-900 font-serif font-black">{tile.displayText}</span>
          <span className="text-[8px] text-amber-700/70 font-sans scale-90">{tile.secondaryText}</span>
        </div>
      );
    }

    // UGC Custom text / vocabulary deck mode with dual-language or sentence sublabel
    if (mode === 'custom_text') {
      const isLong = tile.displayText.length > 6;
      return (
        <div className="flex flex-col items-center justify-center leading-tight select-none w-full px-0.5 text-center">
          <span
            className={`text-slate-900 font-bold transition-transform ${
              isLong ? 'text-[9px] sm:text-[11px] tracking-tighter break-all line-clamp-1' : ''
            }`}
          >
            {tile.displayText}
          </span>
          {tile.secondaryText && size <= 6 && (
            <span className="text-[8px] sm:text-[9px] text-amber-700 font-medium scale-90 truncate max-w-full leading-none mt-0.5">
              {tile.secondaryText}
            </span>
          )}
        </div>
      );
    }

    if (mode === 'stroop_color') {
      return (
        <span
          className="font-extrabold select-none transition-colors"
          style={{ color: tile.fontColor || '#0f172a' }}
        >
          {tile.displayText}
        </span>
      );
    }

    if (mode === 'math_calc') {
      return (
        <span className="font-bold tracking-tight text-slate-900 select-none text-center leading-none">
          {tile.displayText}
        </span>
      );
    }

    return (
      <span className="text-slate-900 select-none font-bold">
        {tile.displayText}
      </span>
    );
  };

  // Base tile style classes
  const getTileClasses = (tile: SchulteTile) => {
    const isError = errorTileId === tile.id;
    const isLastCorrect = lastCorrectTileId === tile.id;

    let base =
      'flex items-center justify-center select-none cursor-pointer transition-transform duration-100 active:scale-90 shadow-2xs border touch-manipulation ';

    if (tile.isClicked) {
      base += 'bg-slate-100/80 border-slate-200/70 text-slate-300 cursor-default shadow-none ';
    } else if (isError) {
      base += 'bg-rose-500 text-white border-rose-600 scale-105 shadow-md animate-shake ';
    } else if (isLastCorrect) {
      base += 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-400/40 text-emerald-900 ';
    } else {
      // Default unclicked tile styling based on modes
      if (mode === 'red_black' || mode === 'red_asc_black_desc') {
        if (tile.colorTag === 'red') {
          base += 'bg-rose-50/95 hover:bg-rose-100/90 border-rose-300 text-rose-700 hover:border-rose-400 shadow-2xs ';
        } else {
          base += 'bg-slate-100 hover:bg-slate-200 border-slate-400 text-slate-950 hover:border-slate-500 shadow-2xs ';
        }
      } else if (mode === 'color_gradient' && tile.bgColor) {
        base += 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-2xs ';
      } else if (mode === 'odd_even_switch') {
        if (tile.colorTag === 'amber') {
          base += 'bg-amber-50/70 hover:bg-amber-100/70 border-amber-200 hover:border-amber-300 text-amber-900 ';
        } else {
          base += 'bg-sky-50/70 hover:bg-sky-100/70 border-sky-200 hover:border-sky-300 text-sky-900 ';
        }
      } else if (mode === 'chinese_poetry' || mode === 'chinese_chars' || mode === 'chinese_idioms') {
        base += 'bg-stone-50/90 hover:bg-amber-50/80 border-stone-200 hover:border-amber-400/60 text-slate-900 ';
      } else {
        base += 'bg-white hover:bg-amber-50/70 border-slate-200 hover:border-amber-300 text-slate-800 hover:shadow-xs ';
      }
    }

    return base;
  };

  const getGapClass = () => {
    if (size <= 3) return 'gap-2 sm:gap-2.5';
    if (size === 4) return 'gap-1.5 sm:gap-2';
    if (size === 5) return 'gap-1 sm:gap-1.5';
    if (size === 6) return 'gap-1';
    if (size === 7) return 'gap-0.5 sm:gap-1';
    return 'gap-0.5';
  };

  return (
    <div
      ref={containerRef}
      className={`w-full flex items-center justify-center overflow-hidden ${
        isPlaying ? 'h-auto shrink-0' : 'h-full min-h-0 min-w-0'
      }`}
    >
      <div
        id="schulte-board-container"
        style={{
          width: `${boardSizePx}px`,
          height: `${boardSizePx}px`,
          maxWidth: '100%',
          maxHeight: '100%',
          aspectRatio: '1 / 1',
        }}
        className={`relative mx-auto bg-slate-900/5 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden select-none transition-all duration-150 ${
          isPlaying ? 'touch-none overscroll-none' : 'touch-pan-y'
        }`}
      >
        {/* 3-2-1 Mindful Focus Countdown Overlay */}
        {countdownNumber !== null && (
          <div
            onClick={onSkipCountdown}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs z-30 flex flex-col items-center justify-center text-white p-4 text-center cursor-pointer select-none animate-in fade-in duration-150 touch-manipulation"
          >
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/20 animate-pulse">
              <span className="text-3xl sm:text-4xl font-black text-amber-400">
                {countdownNumber === 0 ? 'GO!' : countdownNumber}
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-100 mb-1">
              {countdownNumber === 0 ? '视线就位 · 全幅展开！' : '视线锁定中心 · 余光捕捉全幅'}
            </p>
            <span className="text-[10px] text-slate-400">轻触任意处即可跳过倒计时</span>
          </div>
        )}

        {/* Paused Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xs z-20 flex flex-col items-center justify-center text-white p-4 text-center select-none touch-manipulation">
            <p className="text-lg sm:text-xl font-bold mb-1">训练已暂停</p>
            <p className="text-xs sm:text-sm text-slate-300">点击下方按钮随时继续</p>
          </div>
        )}

        {/* Center Fixation Focus Dot (Scientific Schulte Feature) */}
        {centerFocusDot && (
          <div
            id="center-focus-dot"
            className="absolute z-10 pointer-events-none flex items-center justify-center"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-red-600 ring-4 ring-red-400/30 shadow-md animate-ping absolute" />
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-md relative" />
          </div>
        )}

        {/* Accessible Live Region for Screen Readers (WCAG 2.1 AA) */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {countdownNumber !== null && (countdownNumber === 0 ? '开始！' : `倒计时 ${countdownNumber}`)}
          {isPaused && '训练已暂停'}
          {isCompleted && '训练完成！'}
        </div>

        {/* 1. Standard Square Grid Layout */}
        {shape === 'grid' ? (
          <div
            role="grid"
            aria-label="舒尔特训练方格矩阵"
            className={`w-full h-full grid ${getGapClass()} p-0.5`}
            style={{
              gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
            }}
          >
            {tiles.map((tile, idx) => (
              <button
                id={`schulte-tile-${tile.displayText}`}
                key={tile.id}
                type="button"
                role="gridcell"
                aria-label={`方格 ${tile.displayText}${tile.secondaryText ? ' ' + tile.secondaryText : ''}${tile.isClicked ? ' 已完成' : ''}`}
                aria-pressed={tile.isClicked}
                aria-disabled={isPaused || tile.isClicked}
                disabled={isPaused || tile.isClicked}
                onClick={() => onTileClick(tile, idx)}
                className={`${getTileClasses(tile)} ${getFontSizeClass()} ${getTileRoundedClass()} w-full h-full min-w-0 min-h-0 aspect-square p-0 touch-manipulation`}
              >
                {renderTileContent(tile)}
              </button>
            ))}
          </div>
      ) : (
        /* 2. Geometric & Irregular Coordinate Layouts */
        <div className="relative w-full h-full">
          {/* Ambient Silhouette Watermark for Irregular / Non-grid Shapes */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-20 select-none"
            viewBox="0 0 100 100"
            fill="none"
          >
            {shape === 'heart' && (
              <path
                d="M50 85 C26 65 10 50 10 32 C10 18 20 10 33 10 C42 10 47 15 50 20 C53 15 58 10 67 10 C80 10 90 18 90 32 C90 50 74 65 50 85 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="text-rose-500"
              />
            )}
            {shape === 'star' && (
              <polygon
                points="50,6 61,33 93,34 67,54 77,85 50,67 23,85 33,54 7,34 39,33"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="text-amber-500"
              />
            )}
            {shape === 'spiral' && (
              <path
                d="M50,50 A4,4 0 0,1 54,50 A8,8 0 0,1 46,50 A13,13 0 0,1 59,50 A19,19 0 0,1 41,50 A26,26 0 0,1 66,50 A33,33 0 0,1 34,50 A40,40 0 0,1 74,50"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeDasharray="2 3"
                className="text-indigo-500"
              />
            )}
            {shape === 'butterfly' && (
              <path
                d="M50 20 C42 10 12 12 12 36 C12 55 42 50 50 78 C58 50 88 55 88 36 C88 12 58 10 50 20 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="text-purple-500"
              />
            )}
            {shape === 'cross' && (
              <path
                d="M38 8 H62 V38 H92 V62 H62 V92 H38 V62 H8 V38 H38 Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeDasharray="3 3"
                className="text-blue-500"
              />
            )}
            {shape === 'wave' && (
              <path
                d="M50 8 C16 28 84 48 50 68 C20 84 70 90 50 94"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeDasharray="3 3"
                className="text-cyan-500"
              />
            )}
            {shape === 'crescent' && (
              <path
                d="M56 12 C32 22 22 50 36 82 C16 62 20 30 56 12 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="text-amber-500"
              />
            )}
            {shape === 'irregular' && (
              <path
                d="M48 10 C70 8 90 26 86 50 C82 74 68 88 46 90 C22 92 10 74 12 52 C14 28 26 12 48 10 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="text-emerald-500"
              />
            )}
          </svg>

          {tiles.map((tile, idx) => {
            const x = tile.x ?? 50;
            const y = tile.y ?? 50;
            const effectiveTilePercent = tilePercent * (tile.sizeMultiplier || 1);

            // Shape-specific aesthetic border-radius for distinct tactile personality
            let shapeSpecificRadius = 'rounded-xl';
            if (shape === 'circle' || shape === 'spiral' || shape === 'crescent') {
              shapeSpecificRadius = 'rounded-full';
            } else if (shape === 'honeycomb') {
              shapeSpecificRadius = 'rounded-xl sm:rounded-2xl';
            } else if (shape === 'diamond') {
              shapeSpecificRadius = 'rounded-lg sm:rounded-xl';
            } else if (shape === 'cross') {
              shapeSpecificRadius = 'rounded-lg';
            } else if (shape === 'star') {
              shapeSpecificRadius = 'rounded-[32%_68%_32%_68%/68%_32%_68%_32%]';
            } else if (shape === 'heart') {
              shapeSpecificRadius = 'rounded-[46%_46%_50%_50%/50%_50%_48%_48%]';
            } else if (shape === 'butterfly') {
              shapeSpecificRadius =
                idx % 2 === 0
                  ? 'rounded-[65%_35%_40%_60%/65%_40%_60%_35%]'
                  : 'rounded-[35%_65%_60%_40%/40%_65%_35%_60%]';
            } else if (shape === 'wave') {
              shapeSpecificRadius = 'rounded-[50%_50%_30%_70%/50%_30%_70%_50%]';
            } else if (shape === 'irregular') {
              const pebbleRadii = [
                'rounded-[40%_60%_70%_30%/40%_50%_60%_50%]',
                'rounded-[60%_40%_30%_70%/50%_60%_40%_50%]',
                'rounded-[52%_48%_65%_35%/45%_55%_45%_55%]',
                'rounded-[48%_52%_35%_65%/55%_45%_55%_45%]',
              ];
              shapeSpecificRadius = pebbleRadii[idx % pebbleRadii.length];
            }

            return (
              <button
                id={`schulte-tile-geo-${idx}`}
                key={tile.id}
                type="button"
                aria-label={`方格 ${tile.displayText}${tile.secondaryText ? ' ' + tile.secondaryText : ''}${tile.isClicked ? ' 已完成' : ''}`}
                aria-pressed={tile.isClicked}
                aria-disabled={isPaused || tile.isClicked}
                disabled={isPaused || tile.isClicked}
                onClick={() => onTileClick(tile, idx)}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${effectiveTilePercent}%`,
                  height: `${effectiveTilePercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`${getTileClasses(tile)} ${getFontSizeClass()} ${shapeSpecificRadius}`}
              >
                {renderTileContent(tile)}
              </button>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
};
