/**
 * Formats milliseconds into standard stopwatch display: mm:ss.SS
 */
export function formatTime(ms: number): string {
  if (ms < 0 || isNaN(ms)) return '00:00.00';
  const totalSecs = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSecs / 60);
  const seconds = totalSecs % 60;
  const hundredths = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(
    hundredths
  ).padStart(2, '0')}`;
}

/**
 * Formats milliseconds into human-readable duration (e.g. "12.45 秒" or "1 分 23 秒")
 */
export function formatDurationChinese(ms: number): string {
  if (ms < 1000) return `${ms} 毫秒`;
  const totalSeconds = ms / 1000;
  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(2)} 秒`;
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = (totalSeconds % 60).toFixed(1);
  return `${mins} 分 ${secs} 秒`;
}
