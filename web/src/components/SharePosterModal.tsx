import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Download,
  Share2,
  Copy,
  Check,
  X,
  Trophy,
  Flame,
  Target,
  Clock,
  Sparkles,
  ShieldCheck,
  Palette,
} from 'lucide-react';
import { SessionRecord } from '../types';
import { getPerformanceAssessment } from '../utils/analytics';
import { MODE_NAMES } from './AnalyticsDashboard';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import appIconUrl from '../assets/app-icon.png';

interface SharePosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: SessionRecord;
  isNewBest?: boolean;
  streakCount?: number;
}

type PosterTheme = 'obsidian' | 'zen' | 'gold';

export const SharePosterModal: React.FC<SharePosterModalProps> = ({
  isOpen,
  onClose,
  record,
  isNewBest = false,
  streakCount = 1,
}) => {
  const [theme, setTheme] = useState<PosterTheme>('obsidian');
  const [isExporting, setIsExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const assessment = getPerformanceAssessment(record);

  const timeSeconds = (record.totalTimeMs / 1000).toFixed(2);
  const avgTapSeconds = (record.averageTapMs / 1000).toFixed(2);
  const modeName = record.customTitle || MODE_NAMES[record.mode] || record.mode;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  /**
   * High-resolution HTML5 Canvas Drawing function (1080x1520) - Offscreen
   */
  const drawPosterOnCanvas = async (): Promise<HTMLCanvasElement | null> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const width = 1080;
    const height = 1520;
    canvas.width = width;
    canvas.height = height;

    // Preload App Icon for high-res canvas drawing with safe timeout fallback
    let appIconImg: HTMLImageElement | null = null;
    try {
      appIconImg = await new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        const timer = setTimeout(() => {
          console.warn('Poster icon load timeout, fallback to text logo');
          resolve(null);
        }, 1000);
        img.onload = () => {
          clearTimeout(timer);
          resolve(img);
        };
        img.onerror = () => {
          clearTimeout(timer);
          resolve(null);
        };
        img.src = appIconUrl;
      });
    } catch {
      appIconImg = null;
    }

    // 1. Background Theme styling
    if (theme === 'obsidian') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#090d16');
      grad.addColorStop(0.5, '#111827');
      grad.addColorStop(1, '#0b0f19');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Decorative mesh rings
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(width * 0.85, 200, 320, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width * 0.15, height * 0.8, 400, 0, Math.PI * 2);
      ctx.stroke();
    } else if (theme === 'zen') {
      ctx.fillStyle = '#f8f6f0';
      ctx.fillRect(0, 0, width, height);

      // Fine border frame
      ctx.strokeStyle = '#e2ded5';
      ctx.lineWidth = 2;
      ctx.strokeRect(36, 36, width - 72, height - 72);
      ctx.strokeStyle = 'rgba(180, 83, 9, 0.15)';
      ctx.strokeRect(44, 44, width - 88, height - 88);
    } else {
      // Gold theme
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#fffbeb');
      grad.addColorStop(0.4, '#fef3c7');
      grad.addColorStop(1, '#fde68a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(217, 119, 6, 0.12)';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, width - 80, height - 80);
    }

    // Colors according to theme
    const isDark = theme === 'obsidian';
    const textPrimary = isDark ? '#ffffff' : theme === 'zen' ? '#1c1917' : '#451a03';
    const textSecondary = isDark ? '#94a3b8' : theme === 'zen' ? '#78716c' : '#92400e';
    const accentColor = isDark ? '#f59e0b' : theme === 'zen' ? '#b45309' : '#d97706';
    const cardBg = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.7)';
    const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

    // 2. Top Header Brand & App Identity
    const iconSize = 64;
    const brandName = '每日舒尔特';
    ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const brandWidth = ctx.measureText(brandName).width;

    const badgeText = '官方认证';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const badgeWidth = ctx.measureText(badgeText).width + 24;

    const brandSpacing = 16;
    const badgeSpacing = 14;
    const totalBrandWidth = (appIconImg ? iconSize + brandSpacing : 0) + brandWidth + badgeSpacing + badgeWidth;
    const brandStartX = (width - totalBrandWidth) / 2;
    const brandTopY = 64;

    // A. Draw App Icon with rounded corners
    if (appIconImg) {
      ctx.save();
      roundRect(ctx, brandStartX, brandTopY, iconSize, iconSize, 16);
      ctx.clip();
      ctx.drawImage(appIconImg, brandStartX, brandTopY, iconSize, iconSize);
      ctx.restore();

      // Border around icon
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      roundRect(ctx, brandStartX, brandTopY, iconSize, iconSize, 16);
      ctx.stroke();
    }

    // B. Draw App Name "每日舒尔特"
    const textStartX = appIconImg ? brandStartX + iconSize + brandSpacing : brandStartX;
    ctx.textAlign = 'left';
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(brandName, textStartX, brandTopY + 48);

    // C. Draw "官方认证" Pill Badge
    const badgeX = textStartX + brandWidth + badgeSpacing;
    const badgeY = brandTopY + 16;
    ctx.fillStyle = isDark ? 'rgba(245, 158, 11, 0.18)' : 'rgba(217, 119, 6, 0.16)';
    roundRect(ctx, badgeX, badgeY, badgeWidth, 34, 12);
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY + 23);

    // D. Scientific Subtitle
    ctx.textAlign = 'center';
    ctx.fillStyle = textSecondary;
    ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('SCHULTE ATTENTION SYSTEM · 专注力神经效能认证', width / 2, brandTopY + 108);

    // 3. Session Tag Pill
    const tagText = `${record.size}×${record.size} 规格 · ${modeName} · ${record.totalTiles} 项任务`;
    ctx.fillStyle = isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(217, 119, 6, 0.12)';
    const tagWidth = ctx.measureText(tagText).width + 60;
    roundRect(ctx, width / 2 - tagWidth / 2, 206, tagWidth, 46, 23);
    ctx.fill();

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(tagText, width / 2, 237);

    // 4. Hero Score Section (Big Card)
    roundRect(ctx, 80, 275, width - 160, 310, 32);
    ctx.fillStyle = cardBg;
    ctx.fill();
    ctx.strokeStyle = cardBorder;
    ctx.lineWidth = 2;
    ctx.stroke();

    // PB Badge if applicable
    if (isNewBest) {
      ctx.fillStyle = '#10b981';
      roundRect(ctx, width / 2 - 130, 295, 260, 42, 21);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('★ 刷新个人历史最佳纪录 ★', width / 2, 323);
    } else {
      ctx.fillStyle = textSecondary;
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('挑战完成耗时', width / 2, 320);
    }

    // Huge Time Number
    ctx.fillStyle = textPrimary;
    ctx.font = 'bold 118px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${timeSeconds}`, width / 2 - 25, 450);
    ctx.fillStyle = textSecondary;
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('秒', width / 2 + (ctx.measureText(timeSeconds).width / 2) + 15, 450);

    // Tier badge
    const tierText = `${assessment.tier} · ${assessment.summary.slice(0, 16)}`;
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(tierText, width / 2, 520);

    // 5. Four Grid Highlights Cards
    const metricsY = 620;
    const boxW = (width - 160 - 36) / 4;
    const boxH = 150;
    const boxes = [
      { label: '平均单点', val: `${avgTapSeconds}s`, color: accentColor },
      { label: '点击准确率', val: `${record.accuracyRate.toFixed(1)}%`, color: '#10b981' },
      { label: '失误次数', val: `${record.errorsCount} 次`, color: record.errorsCount === 0 ? '#10b981' : '#ef4444' },
      { label: '综合专注分', val: `${record.metrics.overallScore} 分`, color: '#8b5cf6' },
    ];

    boxes.forEach((b, i) => {
      const bx = 80 + i * (boxW + 12);
      roundRect(ctx, bx, metricsY, boxW, boxH, 20);
      ctx.fillStyle = cardBg;
      ctx.fill();
      ctx.strokeStyle = cardBorder;
      ctx.stroke();

      ctx.fillStyle = textSecondary;
      ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(b.label, bx + boxW / 2, metricsY + 50);

      ctx.fillStyle = b.color;
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(b.val, bx + boxW / 2, metricsY + 105);
    });

    // 6. Five-Dimension Radar Bars Card
    const radarCardY = 810;
    roundRect(ctx, 80, radarCardY, width - 160, 360, 32);
    ctx.fillStyle = cardBg;
    ctx.fill();
    ctx.strokeStyle = cardBorder;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = textPrimary;
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('五维专注力神经效能图谱', 120, radarCardY + 55);

    const dims = [
      { name: '反应速度 (Reaction)', score: record.metrics.reactionSpeed, max: 100, color: '#f59e0b' },
      { name: '注意力稳定性 (Stability)', score: record.metrics.attentionStability, max: 100, color: '#3b82f6' },
      { name: '视野广度 (Visual Span)', score: record.metrics.visualSpan, max: 100, color: '#10b981' },
      { name: '心智耐力 (Endurance)', score: record.metrics.mentalEndurance, max: 100, color: '#8b5cf6' },
      { name: '辨识准确度 (Accuracy)', score: record.metrics.accuracy, max: 100, color: '#ec4899' },
    ];

    dims.forEach((d, idx) => {
      const dy = radarCardY + 95 + idx * 50;
      // Dim Label
      ctx.fillStyle = textSecondary;
      ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(d.name, 120, dy + 18);

      // Score Text
      ctx.textAlign = 'right';
      ctx.fillStyle = textPrimary;
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`${d.score} 分`, width - 120, dy + 18);
      ctx.textAlign = 'left';

      // Bar Track
      const barX = 420;
      const barW = width - 120 - barX - 100;
      roundRect(ctx, barX, dy + 4, barW, 16, 8);
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
      ctx.fill();

      // Bar Fill
      const fillW = Math.max(12, (d.score / 100) * barW);
      roundRect(ctx, barX, dy + 4, fillW, 16, 8);
      ctx.fillStyle = d.color;
      ctx.fill();
    });

    // 7. Habit & Coach Advice Quote Card
    const adviceY = 1200;
    roundRect(ctx, 80, adviceY, width - 160, 150, 24);
    ctx.fillStyle = isDark ? 'rgba(245, 158, 11, 0.06)' : 'rgba(217, 119, 6, 0.08)';
    ctx.fill();
    ctx.strokeStyle = isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(217, 119, 6, 0.3)';
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`“ 训练诊断与教练建议 ”`, 120, adviceY + 45);

    ctx.fillStyle = textSecondary;
    ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const adviceText = assessment.advice.length > 46 ? `${assessment.advice.slice(0, 46)}...` : assessment.advice;
    ctx.fillText(adviceText, 120, adviceY + 85);
    ctx.fillText(`🔥 每日专注坚持：已连续训练打卡 ${streakCount} 天`, 120, adviceY + 120);

    // 8. Footer Timestamp & Verification Seal
    const footerY = 1412;
    ctx.textAlign = 'left';
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('每日舒尔特 · 官方认知效能认证报告', 120, footerY);

    ctx.fillStyle = textSecondary;
    ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`认证时间: ${record.dateFormatted}    连续打卡: ${streakCount} 天`, 120, footerY + 28);
    ctx.fillText(`记录编码: ${record.id.slice(0, 18)}    官网: dailyschulte.1024ideas.com`, 120, footerY + 54);

    // Stamp circle on right
    ctx.textAlign = 'center';
    const stampX = width - 170;
    const stampY = footerY + 20;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(stampX, stampY, 56, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('每日舒尔特', stampX, stampY - 16);
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('OFFICIAL', stampX, stampY + 4);
    ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('VERIFIED SEAL', stampX, stampY + 22);

    return canvas;
  };

  // Helper: Canvas Rounded Rectangle
  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    if (typeof (ctx as any).roundRect === 'function') {
      ctx.beginPath();
      (ctx as any).roundRect(x, y, w, h, r);
      return;
    }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Helper: Write canvas image to temporary cache file and return local file:// URI
  const saveCanvasToLocalFile = async (canvas: HTMLCanvasElement): Promise<string> => {
    const dataUrl = canvas.toDataURL('image/png');
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const fileName = `daily-schulte-${record.size}x${record.size}-${timeSeconds}s-${Date.now()}.png`;

    const saved = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Cache,
    });
    return saved.uri;
  };

  // Handle Download Image (PNG) / Save to Photos
  const handleDownload = async () => {
    try {
      setIsExporting(true);
      showToast('正在生成超清海报...');
      const canvas = await drawPosterOnCanvas();
      if (!canvas) throw new Error('海报绘制失败');

      // Native iOS Capacitor: write to cache and invoke native sheet with "Save Image" action
      if (Capacitor.isNativePlatform()) {
        try {
          const fileUri = await saveCanvasToLocalFile(canvas);
          showToast('请在弹出菜单中点击【存储图像】保存至相册！');
          await Share.share({
            title: '保存海报至相册',
            files: [fileUri],
            dialogTitle: '保存海报至相册',
          });
        } catch (shareErr: any) {
          console.warn('Native share/save notice:', shareErr);
          const msg = String(shareErr?.message || shareErr || '');
          if (msg.includes('canceled') || msg.includes('dismissed') || msg.includes('cancelled')) {
            // User closed the share menu naturally
          } else {
            // Fallback: display high-res image preview so user can long-press to save directly
            const dataUrl = canvas.toDataURL('image/png');
            setPreviewImageUrl(dataUrl);
            showToast('已开启大图，长按海报可直接【存储图像】');
          }
        } finally {
          setIsExporting(false);
        }
        return;
      }

      // Web Fallback
      const dataUrl = canvas.toDataURL('image/png');
      const isMobileWeb = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobileWeb) {
        setPreviewImageUrl(dataUrl);
        showToast('长按下方海报即可直接【存储图像】到相册！');
      } else {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `schulte-achievement-${timeSeconds}s-${record.id.slice(-6)}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('海报图片已下载保存！');
      }
    } catch (err) {
      console.error('handleDownload error:', err);
      showToast('海报生成异常，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Copy to Clipboard
  const handleCopy = async () => {
    try {
      setIsExporting(true);
      const canvas = await drawPosterOnCanvas();
      if (!canvas) throw new Error('海报绘制失败');

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsExporting(false);
          return;
        }
        try {
          if (navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            showToast('海报已复制至剪贴板，可直接粘贴！');
          } else {
            handleDownload();
          }
        } catch {
          handleDownload();
        } finally {
          setIsExporting(false);
        }
      }, 'image/png');
    } catch {
      setIsExporting(false);
      showToast('复制失败，已转为下载模式');
    }
  };

  // Handle Native Share
  const handleShare = async () => {
    try {
      setIsExporting(true);
      showToast('正在准备分享海报...');
      const canvas = await drawPosterOnCanvas();
      if (!canvas) throw new Error('海报绘制失败');

      const title = `舒尔特专注力战报 · ${timeSeconds}秒`;
      const text = `我刚在「每日舒尔特」中以 ${timeSeconds} 秒完成了 ${record.size}×${record.size} 挑战，综合评级：${assessment.tier}！一起来测测你的注意力与视野广度！`;

      // On native iOS Capacitor, share the real image file instead of data: URI
      if (Capacitor.isNativePlatform()) {
        try {
          const fileUri = await saveCanvasToLocalFile(canvas);
          await Share.share({
            title,
            text,
            files: [fileUri],
            dialogTitle: '分享战报到…',
          });
        } catch (shareErr: any) {
          console.warn('Native share notice:', shareErr);
          const msg = String(shareErr?.message || shareErr || '');
          if (msg.includes('canceled') || msg.includes('dismissed') || msg.includes('cancelled')) {
            // Dismissed by user
          } else {
            const dataUrl = canvas.toDataURL('image/png');
            setPreviewImageUrl(dataUrl);
            showToast('已开启大图，长按海报可直接保存或发送');
          }
        } finally {
          setIsExporting(false);
        }
        return;
      }

      // Web Share API fallback
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsExporting(false);
          return;
        }
        const file = new File([blob], 'schulte-poster.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title,
              text,
              files: [file],
            });
          } catch {
            // ignore
          }
        } else {
          handleDownload();
        }
        setIsExporting(false);
      }, 'image/png');
    } catch (err) {
      console.error('handleShare error:', err);
      setIsExporting(false);
      showToast('分享组件启动失败，请使用保存功能');
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5 bg-black/65 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* High-res Image Preview Modal Fallback (for direct Long-Press Saving to Photos) */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div
            className="bg-slate-900 rounded-3xl p-4 max-w-[340px] w-full flex flex-col items-center space-y-3 shadow-2xl border border-white/10 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full pb-2 border-b border-white/10">
              <div className="text-white text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>长按图片保存相册</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full max-h-[58vh] overflow-y-auto rounded-xl flex justify-center bg-black/50 p-2">
              <img
                src={previewImageUrl}
                alt="舒尔特成就海报"
                className="max-h-[54vh] object-contain rounded-lg shadow-lg select-auto"
              />
            </div>

            <div className="w-full text-center space-y-1">
              <p className="text-xs font-semibold text-amber-400">
                👉 长按上方海报，选择【存储图像】即可存入相册
              </p>
              <p className="text-[11px] text-slate-400">
                保存成功后，可点击下方按钮关闭
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPreviewImageUrl(null)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer shadow-xs transition-colors"
            >
              完成
            </button>
          </div>
        </div>
      )}

      {/* Modal Dialog (Click stopped to prevent backdrop dismissal) */}
      <div
        className="bg-white rounded-3xl max-w-[350px] w-full max-h-[86vh] flex flex-col shadow-2xl border border-white/30 overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900">专注力成就认证海报</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Picker */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs shrink-0">
          <span className="font-medium text-slate-500 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5" />
            <span>海报风格:</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTheme('obsidian')}
              className={`px-2 py-0.8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'obsidian'
                  ? 'bg-slate-900 text-amber-400 ring-2 ring-amber-400/40'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              曜石黑
            </button>
            <button
              type="button"
              onClick={() => setTheme('zen')}
              className={`px-2 py-0.8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'zen'
                  ? 'bg-stone-200 text-stone-900 ring-2 ring-stone-400'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              极简白
            </button>
            <button
              type="button"
              onClick={() => setTheme('gold')}
              className={`px-2 py-0.8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'gold'
                  ? 'bg-amber-100 text-amber-900 ring-2 ring-amber-400'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              辉金版
            </button>
          </div>
        </div>

        {/* Live Poster Card Visual Preview */}
        <div className="flex-1 overflow-y-auto p-3 flex justify-center bg-slate-100/50">
          <div
            className={`w-full max-w-[310px] rounded-2xl p-3.5 shadow-md flex flex-col justify-between space-y-2.5 border transition-all ${
              theme === 'obsidian'
                ? 'bg-slate-950 text-white border-slate-800'
                : theme === 'zen'
                ? 'bg-[#faf8f5] text-stone-900 border-stone-200'
                : 'bg-gradient-to-b from-amber-50 via-amber-100/60 to-amber-200/50 text-slate-950 border-amber-200'
            }`}
          >
            {/* Top Brand */}
            <div className="flex flex-col items-center space-y-1 text-center">
              <div className="flex items-center gap-1.5 justify-center">
                <img
                  src={appIconUrl}
                  alt="每日舒尔特"
                  className="w-5 h-5 rounded-md shadow-2xs shrink-0 object-cover"
                />
                <span className="text-sm font-black tracking-wide text-amber-500">
                  每日舒尔特
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  官方认证
                </span>
              </div>
              <h4 className="text-[10px] font-medium opacity-75">
                专注力训练与神经效能认证报告
              </h4>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <span>{record.size}×{record.size} 规格</span>
                <span>·</span>
                <span>{modeName}</span>
              </div>
            </div>

            {/* Hero Number */}
            <div className="text-center py-1.5 px-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-0.5">
              {isNewBest && (
                <span className="inline-block text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  ★ 刷新个人最佳纪录 ★
                </span>
              )}
              <div className="text-3xl font-black tracking-tight flex items-baseline justify-center gap-1">
                <span>{timeSeconds}</span>
                <span className="text-xs font-semibold opacity-60">秒</span>
              </div>
              <div className="text-xs font-bold text-amber-500">{assessment.tier}</div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-1.5 text-center text-[10px]">
              <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5">
                <span className="opacity-60 block text-[9px]">平均单点</span>
                <span className="font-bold text-xs">{avgTapSeconds}s</span>
              </div>
              <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5">
                <span className="opacity-60 block text-[9px]">准确率</span>
                <span className="font-bold text-xs text-emerald-500">
                  {record.accuracyRate.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Mini Five-Dimension Bars */}
            <div className="space-y-1 p-2 rounded-xl bg-black/5 dark:bg-white/5 text-[9px]">
              <div className="font-bold opacity-80 text-[10px] mb-0.5">五维专注力效能</div>
              {[
                { name: '反应速度', val: record.metrics.reactionSpeed, col: 'bg-amber-500' },
                { name: '稳定性', val: record.metrics.attentionStability, col: 'bg-blue-500' },
                { name: '视野广度', val: record.metrics.visualSpan, col: 'bg-emerald-500' },
                { name: '准确度', val: record.metrics.accuracy, col: 'bg-pink-500' },
              ].map((m) => (
                <div key={m.name} className="flex items-center justify-between gap-1.5">
                  <span className="opacity-70 shrink-0">{m.name}</span>
                  <div className="flex-1 h-1 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.col}`}
                      style={{ width: `${m.val}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold shrink-0">{m.val}</span>
                </div>
              ))}
            </div>

            {/* Footer Seal */}
            <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[9px] opacity-75">
              <div>
                <p className="font-bold text-amber-500/90">每日舒尔特 · 官方认知测评</p>
                <p>认证时间: {record.dateFormatted}</p>
                <p>连续专注打卡: {streakCount} 天</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-amber-500/80 flex flex-col items-center justify-center text-amber-500 text-center leading-none p-0.5">
                <span className="text-[7px] font-bold tracking-tight">每日舒尔特</span>
                <span className="text-[6px] font-black scale-90 tracking-widest my-0.5">OFFICIAL</span>
                <span className="text-[5px] opacity-80">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Feedback */}
        {toastMsg && (
          <div className="mx-4 mb-2 p-1.5 rounded-xl bg-slate-900 text-white text-xs text-center font-bold animate-in fade-in duration-150">
            {toastMsg}
          </div>
        )}

        {/* Footer Export Action Buttons */}
        <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>复制</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>分享</span>
          </button>

          <button
            id="btn-download-share-poster"
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? '生成中...' : '保存相册'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};
