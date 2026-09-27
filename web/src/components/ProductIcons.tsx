import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  X,
  Layers,
  Palette,
  Eye,
  Sliders,
  Maximize2,
} from 'lucide-react';

import appIconUrl from '../assets/app-icon.png';

export interface IconProps {
  size?: number;
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  useImage?: boolean;
}

// 1. 每日舒尔特 - 品牌主标志 (Schulte Brand Logo)
// 全新品牌图标：深色质感底座、3×3 舒尔特方格矩阵、中心多层光晕靶心焦点与横向视野弧线
export const SchulteBrandLogo: React.FC<IconProps> = ({
  size = 36,
  className = '',
  primaryColor = '#F59E0B', // Amber 500
  secondaryColor = '#0F172A', // Slate 900
  accentColor = '#EF4444', // Red 500 (Center dot)
  useImage = true,
}) => {
  if (useImage) {
    return (
      <img
        src={appIconUrl}
        alt="每日舒尔特"
        width={size}
        height={size}
        className={`rounded-[22%] object-cover select-none shrink-0 shadow-xs ${className}`}
        style={{ width: size, height: size }}
        loading="eager"
        decoding="async"
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-[22%] overflow-hidden shrink-0 ${className}`}
      aria-label="每日舒尔特标志"
    >
      {/* Background Dark Canvas */}
      <rect width="1024" height="1024" rx="225" fill="#0C1222" />

      {/* Ambient Center Glow */}
      <circle cx="512" cy="512" r="280" fill="#FFA500" fillOpacity="0.12" filter="blur(60px)" />

      {/* Row 1 */}
      <rect x="212" y="212" width="150" height="150" rx="42" fill="#4B5162" />
      <rect x="437" y="212" width="150" height="150" rx="42" fill="#4B5162" />
      <rect x="662" y="212" width="150" height="150" rx="42" fill="#4B5162" />

      {/* Peripheral Gaze Dash Arc Line */}
      <path
        d="M115 510 C 260 480, 764 480, 909 510"
        stroke="#8B6914"
        strokeWidth="32"
        strokeLinecap="round"
        strokeDasharray="48 48"
        strokeOpacity="0.75"
      />

      {/* Row 2 */}
      <rect x="212" y="437" width="150" height="150" rx="42" fill="#4B5162" />

      {/* Center Tile (Focus Target with concentric halos) */}
      <rect x="404" y="404" width="216" height="216" rx="60" fill="#FFA500" />
      <circle cx="512" cy="512" r="88" fill="#FFFBEB" />
      <circle cx="512" cy="512" r="66" fill="#F97316" />
      <circle cx="512" cy="512" r="50" fill="#E11D48" />

      <rect x="662" y="437" width="150" height="150" rx="42" fill="#4B5162" />

      {/* Row 3 */}
      <rect x="212" y="662" width="150" height="150" rx="42" fill="#4B5162" />
      <rect x="437" y="662" width="150" height="150" rx="42" fill="#4B5162" />
      {/* Bottom Right Highlight Block */}
      <rect x="662" y="662" width="150" height="150" rx="42" fill="#D97706" />
    </svg>
  );
};

// 2. 广角视野 / 余光拓展 (Visual Span)
// 包含聚焦视线、径向扫描雷达、两侧广角扩散波纹
export const VisualSpanIcon: React.FC<IconProps> = ({
  size = 32,
  className = '',
  primaryColor = '#F59E0B',
  secondaryColor = '#0284C7',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="10" fill="#F8FAFC" />
    <circle cx="20" cy="20" r="16" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
    
    {/* Peripheral Span Radar Waves (Left & Right) */}
    <path
      d="M7 20C7 13 13 8 20 8M33 20C33 13 27 8 20 8"
      stroke={secondaryColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeOpacity="0.5"
    />
    <path
      d="M4 20C4 11 11 4 20 4M36 20C36 11 29 4 20 4"
      stroke={secondaryColor}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeOpacity="0.3"
      strokeDasharray="2 2"
    />
    
    {/* Central Pupil & Focal Dot */}
    <circle cx="20" cy="20" r="7" fill="#FEF3C7" stroke={primaryColor} strokeWidth="1.8" />
    <circle cx="20" cy="20" r="3" fill="#EF4444" />
    
    {/* Crosshair Target Marks */}
    <path d="M20 9V12M20 28V31M9 20H12M28 20H31" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 3. 思维切换 / 双轨执行 (Executive Switch & Trail Making)
// 1与A交替路径连线、双轨交叉跃迁
export const ExecutiveSwitchIcon: React.FC<IconProps> = ({
  size = 32,
  className = '',
  primaryColor = '#2563EB', // Blue 600
  accentColor = '#F59E0B', // Amber 500
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="10" fill="#EFF6FF" />
    
    {/* S-curve Intertwined Flow Line */}
    <path
      d="M10 28C14 28 15 12 20 12C25 12 26 28 30 28"
      stroke={primaryColor}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M10 12C14 12 15 28 20 28C25 28 26 12 30 12"
      stroke={accentColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="3 2"
    />
    
    {/* Node 1: Number (Circle) */}
    <circle cx="10" cy="28" r="4.5" fill={primaryColor} />
    <circle cx="10" cy="28" r="2" fill="white" />
    
    {/* Node A: Letter (Square) */}
    <rect x="17.5" y="9.5" width="5" height="5" rx="1.5" fill={accentColor} />
    
    {/* Node 2: Number */}
    <circle cx="20" cy="28" r="4" fill={accentColor} />
    <circle cx="20" cy="28" r="1.5" fill="white" />
    
    {/* Node B: Final target */}
    <rect x="27.5" y="25.5" width="5" height="5" rx="1.5" fill={primaryColor} />
  </svg>
);

// 4. 汉字速读 / 韵文感知 (Fast Reading & Linguistic Flow)
// 典籍、方块字形骨架与高速横向扫描波
export const FastReadingIcon: React.FC<IconProps> = ({
  size = 32,
  className = '',
  primaryColor = '#059669', // Emerald 600
  accentColor = '#D97706', // Amber 600
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="10" fill="#ECFDF5" />
    
    {/* Book Pages Contour */}
    <path
      d="M8 29C13 27 17 28 20 30C23 28 27 27 32 29V12C27 10 23 11 20 13C17 11 13 10 8 12V29Z"
      fill="white"
      stroke={primaryColor}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M20 13V30" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Left Page: Chinese character radicals "文/字" stylized lines */}
    <path d="M12 17H16M14 15V22M12 24L16 20" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Right Page: Rapid reading scanning ray (Eye tracking) */}
    <path d="M23 16H29M23 20H28M23 24H26" stroke={accentColor} strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="28" cy="20" r="1.8" fill="#EF4444" />
  </svg>
);

// 5. 瞬时记忆 / 脑图盲打 (Spatial Memory & Flash Blind)
// 大脑轮廓结合点阵快照、隐退虚线方块
export const SpatialMemoryIcon: React.FC<IconProps> = ({
  size = 32,
  className = '',
  primaryColor = '#6366F1', // Indigo 500
  accentColor = '#EC4899', // Pink 500
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="10" fill="#EEF2FF" />
    
    {/* Brain Contour Silhouette */}
    <path
      d="M13 26C10.5 26 9 24 9 21.5C9 19 11 17.5 11 15.5C11 11.5 15 9 20 9C25 9 29 11.5 29 15.5C29 17.5 31 19 31 21.5C31 24 29.5 26 27 26"
      stroke={primaryColor}
      strokeWidth="2"
      strokeLinecap="round"
    />
    
    {/* Flash Memory Eye Pupil */}
    <circle cx="20" cy="18" r="4.5" fill="#E0E7FF" stroke={primaryColor} strokeWidth="1.5" />
    <circle cx="20" cy="18" r="2" fill={accentColor} />
    
    {/* Blind Hidden Grid Dots at bottom */}
    <circle cx="14" cy="30" r="1.8" fill={primaryColor} />
    <circle cx="18" cy="30" r="1.8" fill={primaryColor} fillOpacity="0.4" />
    <circle cx="22" cy="30" r="1.8" stroke={primaryColor} strokeWidth="1" strokeDasharray="1 1" />
    <circle cx="26" cy="30" r="1.8" fill={primaryColor} />
  </svg>
);

// 6. 斯特鲁普抗扰 / 色彩冲突 (Stroop Interference & Agility)
// 双色棱镜色散、字色矛盾冲突闪电
export const StroopAgilityIcon: React.FC<IconProps> = ({
  size = 32,
  className = '',
  primaryColor = '#E11D48', // Rose 600
  secondaryColor = '#2563EB', // Blue 600
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="10" fill="#FFF1F2" />
    
    {/* Left Color Block (Red text saying "BLUE") */}
    <path d="M10 12L20 8V32L10 28V12Z" fill={primaryColor} fillOpacity="0.85" />
    
    {/* Right Color Block (Blue text saying "RED") */}
    <path d="M30 12L20 8V32L30 28V12Z" fill={secondaryColor} fillOpacity="0.85" />
    
    {/* Central Conflict Bolt */}
    <path
      d="M21 11L16 21H21L19 29L25 18H20L21 11Z"
      fill="#FBBF24"
      stroke="white"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

// 7. 极限耐力 / 航天心流 (Endurance & High Load)
// 航天轨道阶梯、高负荷超密矩阵与持续心流环
export const EnduranceFlowIcon: React.FC<IconProps> = ({
  size = 32,
  className = '',
  primaryColor = '#D97706', // Amber 600
  secondaryColor = '#0F172A', // Slate 900
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="10" fill="#FFFBEB" />
    
    {/* High Density 7x7 Matrix Mesh Background */}
    <rect x="8" y="8" width="24" height="24" rx="4" stroke="#CBD5E1" strokeWidth="1" fill="white" />
    <path d="M8 14H32M8 20H32M8 26H32M14 8V32M20 8V32M26 8V32" stroke="#F1F5F9" strokeWidth="1" />
    
    {/* Rocket Launch Orbit Curve */}
    <path
      d="M10 28C13 25 18 20 22 14C24 11 27 9 29 8"
      stroke={primaryColor}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    
    {/* Stylized Rocket Head / Arrow */}
    <path
      d="M27 9L31 8L30 12L28 11L27 9Z"
      fill={secondaryColor}
    />
    
    {/* Pulsing Energy Rings on Path */}
    <circle cx="16" cy="22" r="3" stroke={primaryColor} strokeWidth="1.2" strokeDasharray="1.5 1.5" />
    <circle cx="22" cy="14" r="2.2" fill={primaryColor} />
  </svg>
);

// 8. 每日打卡 / 专注连胜徽章 (Streak Flame Medal)
// 层次分明的火焰、金色桂冠勋章
export const StreakFlameMedal: React.FC<IconProps> = ({
  size = 32,
  className = '',
  primaryColor = '#F59E0B',
  accentColor = '#EF4444',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="10" fill="#FEF3C7" />
    
    {/* Medal Base Ribbon */}
    <path d="M14 26L11 34L16 32L20 34L20 26" fill="#FBBF24" fillOpacity="0.7" />
    <path d="M26 26L29 34L24 32L20 34L20 26" fill="#F59E0B" />
    
    {/* Outer Badge Rim */}
    <circle cx="20" cy="18" r="12" fill="white" stroke={primaryColor} strokeWidth="2" />
    <circle cx="20" cy="18" r="9.5" fill="#FFFBEB" />
    
    {/* Inner Energetic Flame */}
    <path
      d="M20 11C20.5 13 22 14.5 23.5 15.5C24.8 16.5 25.5 18 25.5 19.5C25.5 22.5 23 24.5 20 24.5C17 24.5 14.5 22.5 14.5 19.5C14.5 17.5 15.5 15.8 17 14.8C17.5 16 18.5 17 19.5 17C20 17 20 14 20 11Z"
      fill={accentColor}
    />
    <path
      d="M20 16.5C20.8 17.5 21.5 18.5 21.5 19.8C21.5 21.5 20.8 22.5 20 22.5C19.2 22.5 18.5 21.5 18.5 19.8C18.5 18.8 19 18 20 16.5Z"
      fill="#FBBF24"
    />
  </svg>
);

// 9. 极限测速 / 毫秒计时 (Speed Chronometer)
// 高精刻度表盘、速度电弧与毫秒指针
export const SpeedChronometerIcon: React.FC<IconProps> = ({
  size = 32,
  className = '',
  primaryColor = '#0EA5E9', // Sky 500
  accentColor = '#F59E0B',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="10" fill="#F0F9FF" />
    
    {/* Watch Top Button */}
    <rect x="18" y="5" width="4" height="3" rx="1" fill="#64748B" />
    <path d="M16 6H24" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Outer Stopwatch Ring */}
    <circle cx="20" cy="22" r="13" stroke={primaryColor} strokeWidth="2" fill="white" />
    
    {/* Dials / Speed arc */}
    <path
      d="M11 22C11 17.0294 15.0294 13 20 13C24.9706 13 29 17.0294 29 22"
      stroke={accentColor}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="2 3"
    />
    
    {/* Center Pin and Fast Needle */}
    <circle cx="20" cy="22" r="2.5" fill="#0F172A" />
    <path d="M20 22L25 16" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 10. 同心圆辐射 (Radial Circle Grid)
export const RadialCircleIcon: React.FC<IconProps> = ({
  size = 32,
  className = '',
  primaryColor = '#0284C7',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="10" fill="#F0F9FF" />
    <circle cx="20" cy="20" r="14" stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.4" />
    <circle cx="20" cy="20" r="9.5" stroke={primaryColor} strokeWidth="1.5" strokeOpacity="0.7" />
    <circle cx="20" cy="20" r="5" fill="#BAE6FD" stroke={primaryColor} strokeWidth="1.8" />
    <circle cx="20" cy="20" r="2" fill="#EF4444" />
    <path d="M8 20H12M28 20H32M20 8V12M20 28V32" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 11. 蜂巢六边形错位 (Honeycomb Hexagon)
export const HoneycombIcon: React.FC<IconProps> = ({
  size = 32,
  className = '',
  primaryColor = '#8B5CF6', // Purple 500
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="10" fill="#F5F3FF" />
    {/* Center Hexagon */}
    <path
      d="M20 13L26 16.5V23.5L20 27L14 23.5V16.5L20 13Z"
      fill="#DDD6FE"
      stroke={primaryColor}
      strokeWidth="1.8"
    />
    <circle cx="20" cy="20" r="2.2" fill="#EF4444" />
    {/* Top Right Hex outline */}
    <path d="M26 16.5L32 13V6L26 9.5" stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.5" />
    {/* Bottom Left Hex outline */}
    <path d="M14 23.5L8 27V34L14 30.5" stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.5" />
  </svg>
);

// 12. 菱形 45° 斜角 (Diamond 45 Deg Shift)
export const DiamondShiftIcon: React.FC<IconProps> = ({
  size = 32,
  className = '',
  primaryColor = '#06B6D4', // Cyan 500
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="10" fill="#ECFEFF" />
    <rect
      x="20"
      y="7"
      width="18"
      height="18"
      rx="3"
      transform="rotate(45 20 7)"
      fill="white"
      stroke={primaryColor}
      strokeWidth="1.8"
    />
    <rect
      x="20"
      y="13"
      width="10"
      height="10"
      rx="2"
      transform="rotate(45 20 13)"
      fill="#CFFAFE"
      stroke={primaryColor}
      strokeWidth="1.4"
    />
    <circle cx="20" cy="20" r="2.5" fill="#EF4444" />
  </svg>
);

// 13. 心算速算矩阵 (Mental Math)
export const MentalMathIcon: React.FC<IconProps> = ({
  size = 32,
  className = '',
  primaryColor = '#EAB308', // Yellow 500
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="40" height="40" rx="10" fill="#FEFCE8" />
    {/* 4 Math Block Tiles */}
    <rect x="9" y="9" width="10" height="10" rx="2.5" fill="#FEF08A" stroke={primaryColor} strokeWidth="1.5" />
    <path d="M12 14H16M14 12V16" stroke="#854D0E" strokeWidth="1.5" strokeLinecap="round" />
    
    <rect x="21" y="9" width="10" height="10" rx="2.5" fill="white" stroke={primaryColor} strokeWidth="1.5" />
    <path d="M24 14H28" stroke="#854D0E" strokeWidth="1.5" strokeLinecap="round" />
    
    <rect x="9" y="21" width="10" height="10" rx="2.5" fill="white" stroke={primaryColor} strokeWidth="1.5" />
    <path d="M12 26L16 26M12 28L16 28" stroke="#854D0E" strokeWidth="1.2" strokeLinecap="round" />
    
    <rect x="21" y="21" width="10" height="10" rx="2.5" fill="#CA8A04" />
    <circle cx="26" cy="26" r="2" fill="white" />
  </svg>
);

// Helper function to resolve suitable vector icon for a training plan
export const ProductPlanIcon: React.FC<{
  id: string;
  category: string;
  size?: number;
  fallbackEmoji?: string;
  className?: string;
}> = ({ id, category, size = 32, fallbackEmoji, className = '' }) => {
  switch (id) {
    case 'pilot-standard':
      return <SchulteBrandLogo size={size} className={className} />;
    case 'radial-circle':
      return <RadialCircleIcon size={size} className={className} />;
    case 'honeycomb-anti-tunnel':
    case 'stroop-honeycomb-storm':
      return <HoneycombIcon size={size} className={className} />;
    case 'diamond-executive-shift':
      return <DiamondShiftIcon size={size} className={className} />;
    case 'cognitive-dual-track':
    case 'red-black-dual':
      return <ExecutiveSwitchIcon size={size} className={className} />;
    case 'rapid-reading':
    case 'chinese-stems':
    case 'english-alphabet-flow':
      return <FastReadingIcon size={size} className={className} />;
    case 'blind-flash-memory':
    case 'blind-memory-5x5':
      return <SpatialMemoryIcon size={size} className={className} />;
    case 'math-speed-calc':
      return <MentalMathIcon size={size} className={className} />;
    case 'stroop-inhibition':
    case 'dynamic-shift-focus':
      return <StroopAgilityIcon size={size} className={className} />;
    case 'astronaut-endurance-7x7':
    case 'endurance-6x6-desc':
      return <EnduranceFlowIcon size={size} className={className} />;
    case 'warmup-sprint':
      return <SpeedChronometerIcon size={size} className={className} />;
    case 'scatter-constellation':
      return <VisualSpanIcon size={size} className={className} />;
    default:
      // Category fallback
      if (category === 'vision') return <VisualSpanIcon size={size} className={className} />;
      if (category === 'executive') return <ExecutiveSwitchIcon size={size} className={className} />;
      if (category === 'reading') return <FastReadingIcon size={size} className={className} />;
      if (category === 'cognitive') return <SpatialMemoryIcon size={size} className={className} />;
      if (category === 'stroop') return <StroopAgilityIcon size={size} className={className} />;
      if (category === 'endurance') return <EnduranceFlowIcon size={size} className={className} />;
      return <span className="text-xl leading-none">{fallbackEmoji || '🎯'}</span>;
  }
};

// Complete Definition of Generated Product Icons for the Interactive Icon Suite Modal
export interface ProductIconItem {
  id: string;
  name: string;
  category: 'brand' | 'dimension' | 'board' | 'gamification';
  description: string;
  usageContext: string;
  render: (props: IconProps) => React.ReactNode;
  svgCode: string;
}

export const PRODUCT_ICON_LIST: ProductIconItem[] = [
  {
    id: 'brand-main',
    name: '每日舒尔特 · 经典品牌主标',
    category: 'brand',
    description: '3×3 舒尔特矩阵结合中心凝视焦点红点与暗色柔光衬底，传递专业与专注。',
    usageContext: '应用启动图标、顶部导航 Logo、品牌认证',
    render: (p) => <SchulteBrandLogo {...p} />,
    svgCode: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="12" fill="#0F172A"/>
  <circle cx="24" cy="24" r="14" fill="#F59E0B" fill-opacity="0.18" filter="blur(4px)"/>
  <rect x="10" y="10" width="7" height="7" rx="2" fill="white" fill-opacity="0.15"/>
  <rect x="20.5" y="10" width="7" height="7" rx="2" fill="white" fill-opacity="0.25"/>
  <rect x="31" y="10" width="7" height="7" rx="2" fill="white" fill-opacity="0.15"/>
  <rect x="10" y="20.5" width="7" height="7" rx="2" fill="white" fill-opacity="0.25"/>
  <rect x="19" y="19" width="10" height="10" rx="3" fill="#F59E0B"/>
  <circle cx="24" cy="24" r="2.5" fill="#EF4444"/>
  <circle cx="24" cy="24" r="4.2" stroke="white" stroke-width="1" stroke-opacity="0.8"/>
  <rect x="31" y="20.5" width="7" height="7" rx="2" fill="white" fill-opacity="0.2"/>
  <rect x="10" y="31" width="7" height="7" rx="2" fill="white" fill-opacity="0.2"/>
  <rect x="20.5" y="31" width="7" height="7" rx="2" fill="white" fill-opacity="0.15"/>
  <rect x="31" y="31" width="7" height="7" rx="2" fill="#F59E0B" fill-opacity="0.85"/>
  <path d="M6 24C11 24 16 22 24 22C32 22 37 24 42 24" stroke="#F59E0B" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.3" stroke-dasharray="2 3"/>
</svg>`,
  },
  {
    id: 'dimension-vision',
    name: '广角视野 · 周边余光拓展',
    category: 'dimension',
    description: '中心瞳孔聚焦，两侧余光雷达波纹水平扩张，抑制大幅度眼球跳视。',
    usageContext: '广角视野方案、周边视幅测量、注视点指南',
    render: (p) => <VisualSpanIcon {...p} />,
    svgCode: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="10" fill="#F8FAFC"/>
  <circle cx="20" cy="20" r="16" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3 3"/>
  <path d="M7 20C7 13 13 8 20 8M33 20C33 13 27 8 20 8" stroke="#0284C7" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.5"/>
  <circle cx="20" cy="20" r="7" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.8"/>
  <circle cx="20" cy="20" r="3" fill="#EF4444"/>
  <path d="M20 9V12M20 28V31M9 20H12M28 20H31" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,
  },
  {
    id: 'dimension-executive',
    name: '思维切换 · 双轨交替控制',
    category: 'dimension',
    description: '源自经典连线测验 Trail Making Test，交替连接数字与字母的流动轨迹。',
    usageContext: '数字字母双轨、红黑双色交替、前额叶认知切换',
    render: (p) => <ExecutiveSwitchIcon {...p} />,
    svgCode: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="10" fill="#EFF6FF"/>
  <path d="M10 28C14 28 15 12 20 12C25 12 26 28 30 28" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M10 12C14 12 15 28 20 28C25 28 26 12 30 12" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 2"/>
  <circle cx="10" cy="28" r="4.5" fill="#2563EB"/>
  <rect x="17.5" y="9.5" width="5" height="5" rx="1.5" fill="#F59E0B"/>
  <circle cx="20" cy="28" r="4" fill="#F59E0B"/>
  <rect x="27.5" y="25.5" width="5" height="5" rx="1.5" fill="#2563EB"/>
</svg>`,
  },
  {
    id: 'dimension-reading',
    name: '汉字速读 · 整体字形韵文',
    category: 'dimension',
    description: '翻开的典籍与快速水平扫描流线，象征跳过默读声带震动、字词图形化摄入。',
    usageContext: '千字文速读、天干地支韵文、外文字母流',
    render: (p) => <FastReadingIcon {...p} />,
    svgCode: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="10" fill="#ECFDF5"/>
  <path d="M8 29C13 27 17 28 20 30C23 28 27 27 32 29V12C27 10 23 11 20 13C17 11 13 10 8 12V29Z" fill="white" stroke="#059669" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M20 13V30" stroke="#059669" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M12 17H16M14 15V22M12 24L16 20" stroke="#059669" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M23 16H29M23 20H28M23 24H26" stroke="#D97706" stroke-width="1.6" stroke-linecap="round"/>
</svg>`,
  },
  {
    id: 'dimension-memory',
    name: '瞬时记忆 · 脑图空间盲打',
    category: 'dimension',
    description: '大脑皮层轮廓融合 4 秒开局全景拍照与空间暗格隐退坐标。',
    usageContext: '闪现记忆盲打、工作记忆容量极限测验',
    render: (p) => <SpatialMemoryIcon {...p} />,
    svgCode: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="10" fill="#EEF2FF"/>
  <path d="M13 26C10.5 26 9 24 9 21.5C9 19 11 17.5 11 15.5C11 11.5 15 9 20 9C25 9 29 11.5 29 15.5C29 17.5 31 19 31 21.5C31 24 29.5 26 27 26" stroke="#6366F1" stroke-width="2" stroke-linecap="round"/>
  <circle cx="20" cy="18" r="4.5" fill="#E0E7FF" stroke="#6366F1" stroke-width="1.5"/>
  <circle cx="20" cy="18" r="2" fill="#EC4899"/>
</svg>`,
  },
  {
    id: 'dimension-stroop',
    name: '抗扰追踪 · 斯特鲁普色彩冲突',
    category: 'dimension',
    description: '红蓝双色棱镜碰撞与中间判定闪电，考验前扣带回皮层对视觉直觉的压制。',
    usageContext: '色彩抗干扰、字色矛盾、动态微位移追踪',
    render: (p) => <StroopAgilityIcon {...p} />,
    svgCode: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="10" fill="#FFF1F2"/>
  <path d="M10 12L20 8V32L10 28V12Z" fill="#E11D48" fill-opacity="0.85"/>
  <path d="M30 12L20 8V32L30 28V12Z" fill="#2563EB" fill-opacity="0.85"/>
  <path d="M21 11L16 21H21L19 29L25 18H20L21 11Z" fill="#FBBF24" stroke="white" stroke-width="1.2" stroke-linejoin="round"/>
</svg>`,
  },
  {
    id: 'dimension-endurance',
    name: '极限耐力 · 航天高负荷心流',
    category: 'dimension',
    description: '49 阶致密舒尔特阵列与升空上升轨道，象征克服注意力中途衰退。',
    usageContext: '7×7 航天耐力、6×6 逆向长途挑战',
    render: (p) => <EnduranceFlowIcon {...p} />,
    svgCode: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="10" fill="#FFFBEB"/>
  <rect x="8" y="8" width="24" height="24" rx="4" stroke="#CBD5E1" stroke-width="1" fill="white"/>
  <path d="M8 14H32M8 20H32M8 26H32M14 8V32M20 8V32M26 8V32" stroke="#F1F5F9" stroke-width="1"/>
  <path d="M10 28C13 25 18 20 22 14C24 11 27 9 29 8" stroke="#D97706" stroke-width="2.2" stroke-linecap="round"/>
</svg>`,
  },
  {
    id: 'board-radial',
    name: '同心圆环 · 径向辐射视野',
    category: 'board',
    description: '同心圈层阵列与径向十字标尺，破除矩形边角限制。',
    usageContext: '同心圆棋盘、径向搜寻',
    render: (p) => <RadialCircleIcon {...p} />,
    svgCode: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="10" fill="#F0F9FF"/>
  <circle cx="20" cy="20" r="14" stroke="#0284C7" stroke-width="1.2" stroke-opacity="0.4"/>
  <circle cx="20" cy="20" r="9.5" stroke="#0284C7" stroke-width="1.5" stroke-opacity="0.7"/>
  <circle cx="20" cy="20" r="5" fill="#BAE6FD" stroke="#0284C7" stroke-width="1.8"/>
  <circle cx="20" cy="20" r="2" fill="#EF4444"/>
</svg>`,
  },
  {
    id: 'board-honeycomb',
    name: '蜂巢错位 · 六边形防隧道视野',
    category: 'board',
    description: '非正交蜂窝排列，锻炼斜向与非对称视线检索。',
    usageContext: '蜂巢棋盘、斜向死角排查',
    render: (p) => <HoneycombIcon {...p} />,
    svgCode: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="10" fill="#F5F3FF"/>
  <path d="M20 13L26 16.5V23.5L20 27L14 23.5V16.5L20 13Z" fill="#DDD6FE" stroke="#8B5CF6" stroke-width="1.8"/>
  <circle cx="20" cy="20" r="2.2" fill="#EF4444"/>
</svg>`,
  },
  {
    id: 'board-diamond',
    name: '菱形旋转 · 45° 空间认知刷新',
    category: 'board',
    description: '对角线旋转 45 度的方格矩阵，重组视觉空间坐标。',
    usageContext: '菱形阵列、斜向思维跃迁',
    render: (p) => <DiamondShiftIcon {...p} />,
    svgCode: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="10" fill="#ECFEFF"/>
  <rect x="20" y="7" width="18" height="18" rx="3" transform="rotate(45 20 7)" fill="white" stroke="#06B6D4" stroke-width="1.8"/>
  <circle cx="20" cy="20" r="2.5" fill="#EF4444"/>
</svg>`,
  },
  {
    id: 'gamify-streak',
    name: '连胜徽章 · 每日打卡炽热火苗',
    category: 'gamification',
    description: '金属外圈金牌与内部双层跃动火苗，见证每天自律坚持。',
    usageContext: '每日签到打卡、连续专注天数里程碑',
    render: (p) => <StreakFlameMedal {...p} />,
    svgCode: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="10" fill="#FEF3C7"/>
  <circle cx="20" cy="18" r="12" fill="white" stroke="#F59E0B" stroke-width="2"/>
  <path d="M20 11C20.5 13 22 14.5 23.5 15.5C24.8 16.5 25.5 18 25.5 19.5C25.5 22.5 23 24.5 20 24.5C17 24.5 14.5 22.5 14.5 19.5C14.5 17.5 15.5 15.8 17 14.8C17.5 16 18.5 17 19.5 17C20 17 20 14 20 11Z" fill="#EF4444"/>
</svg>`,
  },
  {
    id: 'gamify-chronometer',
    name: '毫秒测速 · 神经反射极速秒表',
    category: 'gamification',
    description: '0.01 秒高精刻度表盘与闪电指针，点燃毫秒级突破冲刺。',
    usageContext: '3×3 极速冲刺、最佳纪录破局、用时突破',
    render: (p) => <SpeedChronometerIcon {...p} />,
    svgCode: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="10" fill="#F0F9FF"/>
  <circle cx="20" cy="22" r="13" stroke="#0EA5E9" stroke-width="2" fill="white"/>
  <circle cx="20" cy="22" r="2.5" fill="#0F172A"/>
  <path d="M20 22L25 16" stroke="#EF4444" stroke-width="1.8" stroke-linecap="round"/>
</svg>`,
  },
];

// Interactive Icon Gallery & Exporter Modal
export const ProductIconGalleryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState<number>(44);
  const [activeTheme, setActiveTheme] = useState<'amber' | 'slate' | 'colorful'>('colorful');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: '全部图标' },
    { id: 'brand', label: '品牌主标' },
    { id: 'dimension', label: '专注维度' },
    { id: 'board', label: '几何棋盘' },
    { id: 'gamification', label: '打卡勋章' },
  ];

  const filteredIcons =
    selectedCategory === 'all'
      ? PRODUCT_ICON_LIST
      : PRODUCT_ICON_LIST.filter((item) => item.category === selectedCategory);

  const handleCopySvg = (item: ProductIconItem) => {
    navigator.clipboard.writeText(item.svgCode);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleDownloadSvg = (item: ProductIconItem) => {
    const blob = new Blob([item.svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.id}-schulte-icon.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-70 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 text-slate-800 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom duration-300 ease-out"
      >
        {/* Mobile Pull Handle */}
        <div
          className="pb-2.5 -mt-2 flex justify-center shrink-0 cursor-pointer sm:hidden"
          onClick={onClose}
        >
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  每日舒尔特 · 专属产品图标库
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {PRODUCT_ICON_LIST.length} 枚纯矢量
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                严谨契合认知心理学与周边视野科学 · 支持 1 键复制 SVG / 下载
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Controls */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 shrink-0 text-xs">
          {/* Categories */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Size & Theme */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400 text-[11px]">尺寸:</span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
              {[32, 44, 56].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPreviewSize(s)}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    previewSize === s
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {s}px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Icon Grid */}
        <div className="overflow-y-auto py-4 space-y-3 pr-1 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredIcons.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-amber-300 rounded-2xl p-3.5 transition-all flex flex-col justify-between shadow-2xs group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-xl border border-slate-200/80 shrink-0 shadow-2xs group-hover:scale-105 transition-transform flex items-center justify-center">
                    {item.render({ size: previewSize })}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <span className="inline-block mt-1.5 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70 font-medium truncate max-w-full">
                      应用: {item.usageContext}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDownloadSvg(item)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    title="下载 SVG 矢量文件"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>下载 SVG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopySvg(item)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      copiedId === item.id
                        ? 'bg-emerald-500 text-white shadow-2xs'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-2xs'
                    }`}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>已复制 SVG</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>复制 SVG 代码</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>图标遵循 MIT 开源及产品定制规范，可直接用于网页与原生客户端</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            完成查看
          </button>
        </div>
      </div>
    </div>
  );
};
