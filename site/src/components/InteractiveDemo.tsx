import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export const InteractiveDemo: React.FC = () => {
  const [numbers, setNumbers] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [currentTarget, setCurrentTarget] = useState<number>(1);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'completed'>('idle');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Shuffle numbers for 3x3 grid
  const shuffleGrid = () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setNumbers(arr);
  };

  const handleStart = () => {
    shuffleGrid();
    setCurrentTarget(1);
    setElapsedTime(0);
    setGameState('playing');
    startTimeRef.current = performance.now();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setElapsedTime(performance.now() - startTimeRef.current);
    }, 30);
  };

  const handleCellClick = (num: number) => {
    if (gameState !== 'playing') return;

    if (num === currentTarget) {
      if (currentTarget === 9) {
        // Completed!
        if (timerRef.current) clearInterval(timerRef.current);
        const finalTime = performance.now() - startTimeRef.current;
        setElapsedTime(finalTime);
        setLastScore(finalTime);
        setGameState('completed');
      } else {
        setCurrentTarget((prev) => prev + 1);
      }
    }
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('idle');
    setCurrentTarget(1);
    setElapsedTime(0);
    shuffleGrid();
  };

  useEffect(() => {
    shuffleGrid();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${s}.${millis < 10 ? '0' : ''}${millis}s`;
  };

  return (
    <div id="interactive-demo" className="py-20 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>免安装 · 网页端实时沉浸体验</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            亲自测试您的<span className="text-gold-gradient">瞬时专注与视野搜寻速度</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            视线聚焦方格中央，依靠周边余光快速搜寻。请按顺序点击数字 1 至 9。
          </p>
        </div>

        {/* Game Box */}
        <div className="max-w-md mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          {/* Status Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <div className="text-xs text-slate-400 font-medium">寻找目标数字</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                {gameState === 'playing' ? currentTarget : gameState === 'completed' ? '🎉 完成' : '1'}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">当前耗时</div>
              <div className="text-2xl font-black text-white font-mono mt-0.5">
                {formatTime(elapsedTime)}
              </div>
            </div>
          </div>

          {/* 3x3 Grid */}
          <div className="grid grid-cols-3 gap-3 my-6 aspect-square max-w-[320px] mx-auto relative">
            {/* Center Anchor Dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500/80 shadow-md shadow-red-500/50 pointer-events-none z-10" />

            {numbers.map((num) => {
              const isPassed = gameState === 'playing' && num < currentTarget;
              const isTarget = gameState === 'playing' && num === currentTarget;

              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleCellClick(num)}
                  disabled={gameState !== 'playing'}
                  className={`rounded-2xl font-black text-2xl sm:text-3xl flex items-center justify-center transition-all select-none cursor-pointer ${
                    gameState !== 'playing'
                      ? 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                      : isPassed
                      ? 'bg-emerald-950/40 text-emerald-500/40 border border-emerald-900/30'
                      : isTarget
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-lg shadow-amber-500/20 scale-[1.02]'
                      : 'bg-slate-800/90 text-white border border-slate-700 hover:border-amber-500/40 active:scale-95'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="pt-2">
            {gameState === 'idle' && (
              <button
                type="button"
                onClick={handleStart}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer active:scale-98 transition-all"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>开始专注测试</span>
              </button>
            )}

            {gameState === 'playing' && (
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重新开始</span>
              </button>
            )}

            {gameState === 'completed' && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>挑战成功！极佳的周边视觉扫视表现</span>
                  </div>
                  <div className="text-slate-300 text-xs">
                    本次成绩：<strong className="text-white font-mono text-sm">{formatTime(lastScore || 0)}</strong>
                    {lastScore && lastScore < 5000 && '（达到飞行员优秀专注标准 🚀）'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStart}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer active:scale-98 transition-all"
                >
                  <Award className="w-5 h-5" />
                  <span>再测一次挑战极限</span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <span className="text-[11px] text-slate-500">
              💡 提示：App 内包含 3×3 至 9×9 阶数、动态乱序、记忆盲打与雷达图能力评估。
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
