import React, { useState } from 'react';
import {
  Grid,
  Hexagon,
  Circle,
  Diamond,
  Triangle,
  Shuffle,
  Heart,
  Star,
  Orbit,
  Infinity,
  Crosshair,
  Waves,
  Moon,
  Fingerprint,
  RotateCcw,
  Play,
  Pause,
  SlidersHorizontal,
  HelpCircle,
  Flame,
  Check,
  X,
  Target,
  Eye,
  Volume2,
  VolumeX,
  Trophy,
  Clock,
  Binary,
  Type,
  BookOpen,
  Sparkles,
  Search,
  Plus,
  ChevronDown,
  Shapes,
} from 'lucide-react';
import { BoardShape, GridSize, SchulteMode, CustomDeck } from '../types';

interface GameControlsProps {
  size: GridSize;
  onSizeChange: (size: GridSize) => void;
  shape: BoardShape;
  onShapeChange: (shape: BoardShape) => void;
  mode: SchulteMode;
  onModeChange: (mode: SchulteMode) => void;
  isPlaying: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPauseToggle: () => void;
  onReset: () => void;
  onOpenDaily: () => void;
  isDailyChallengeActive: boolean;
  descriptionText: string;
  bestTimeForCurrent?: string | null;
  todayTrainingCount?: number;
  centerFocusDot?: boolean;
  onToggleCenterFocusDot?: () => void;
  showNextTarget?: boolean;
  onToggleShowNextTarget?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  countdownEnabled?: boolean;
  onToggleCountdown?: () => void;
  onOpenCustomModal?: () => void;
  activeCustomDeck?: CustomDeck | null;
}

const SIZES: { value: GridSize; label: string; badge: string; desc: string }[] = [
  { value: 3, label: '3×3', badge: '入门', desc: '9项 · 快速热身' },
  { value: 4, label: '4×4', badge: '初级', desc: '16项 · 日常练习' },
  { value: 5, label: '5×5', badge: '标准', desc: '25项 · 经典题型' },
  { value: 6, label: '6×6', badge: '进阶', desc: '36项 · 强化扫描' },
  { value: 7, label: '7×7', badge: '挑战', desc: '49项 · 深度专注' },
  { value: 8, label: '8×8', badge: '高阶', desc: '64项 · 极限视野' },
  { value: 9, label: '9×9', badge: '极限', desc: '81项 · 广角扫视' },
];

export const SHAPES: {
  value: BoardShape;
  label: string;
  badge: string;
  icon: React.ReactNode;
  desc: string;
  category: 'classic' | 'irregular';
}[] = [
  // 1. 不规则与有机异形形态 (用户重点需求)
  {
    value: 'heart',
    label: '爱心轮廓',
    badge: '异形',
    icon: <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />,
    desc: '浪漫心形有机轮廓，强化外围广角扫描',
    category: 'irregular',
  },
  {
    value: 'star',
    label: '五角星芒',
    badge: '异形',
    icon: <Star className="w-4 h-4 text-amber-500 fill-amber-500/20" />,
    desc: '五角星芒尖端放射，强化边缘定位与跳跃',
    category: 'irregular',
  },
  {
    value: 'spiral',
    label: '螺旋星系',
    badge: '异形',
    icon: <Orbit className="w-4 h-4 text-indigo-500" />,
    desc: '阿基米德旋涡渐进扩散，训练螺旋圆周眼跳',
    category: 'irregular',
  },
  {
    value: 'butterfly',
    label: '蝶翼双环',
    badge: '异形',
    icon: <Infinity className="w-4 h-4 text-purple-500" />,
    desc: '莫比乌斯双翼结构，训练左右半视野快速交替',
    category: 'irregular',
  },
  {
    value: 'cross',
    label: '十字星阵',
    badge: '异形',
    icon: <Crosshair className="w-4 h-4 text-blue-500" />,
    desc: '纵横四象限十字骨架，强化垂直与水平经纬扫描',
    category: 'irregular',
  },
  {
    value: 'wave',
    label: '波浪流水',
    badge: '异形',
    icon: <Waves className="w-4 h-4 text-cyan-500" />,
    desc: 'S型蜿蜒蛇形流水，提升曲线视觉追踪连贯性',
    category: 'irregular',
  },
  {
    value: 'crescent',
    label: '弯月弧形',
    badge: '异形',
    icon: <Moon className="w-4 h-4 text-amber-400 fill-amber-400/20" />,
    desc: '上弦月牙弯弧聚散，中间丰盈尖端聚拢',
    category: 'irregular',
  },
  {
    value: 'irregular',
    label: '异形卵石',
    badge: '纯不规则',
    icon: <Fingerprint className="w-4 h-4 text-teal-500" />,
    desc: '自然溪流卵石自由团簇，打破任何对称性依赖',
    category: 'irregular',
  },
  {
    value: 'scatter',
    label: '随机散落',
    badge: '不规则',
    icon: <Shuffle className="w-4 h-4 text-emerald-500" />,
    desc: '空间泊松散点排布，消除行列定势思维',
    category: 'irregular',
  },

  // 2. 经典规则几何形态
  {
    value: 'grid',
    label: '经典方格',
    badge: '经典',
    icon: <Grid className="w-4 h-4 text-slate-700" />,
    desc: '正交矩形经典排布，科学舒尔特基准标准测验',
    category: 'classic',
  },
  {
    value: 'honeycomb',
    label: '蜂巢六边',
    badge: '几何',
    icon: <Hexagon className="w-4 h-4 text-violet-500" />,
    desc: '错位蜂窝阵列，强化斜向死角防隧道视野',
    category: 'classic',
  },
  {
    value: 'circle',
    label: '同心圆盘',
    badge: '几何',
    icon: <Circle className="w-4 h-4 text-sky-500" />,
    desc: '同心圆周径向辐射，锻炼圆周与向外发散注意力',
    category: 'classic',
  },
  {
    value: 'diamond',
    label: '菱形斜阵',
    badge: '几何',
    icon: <Diamond className="w-4 h-4 text-teal-600" />,
    desc: '45°对角斜向旋转矩阵，打破横纵常规视觉惯性',
    category: 'classic',
  },
  {
    value: 'triangle',
    label: '金字塔三角',
    badge: '几何',
    icon: <Triangle className="w-4 h-4 text-amber-600" />,
    desc: '自上而下层级递增，训练由窄至宽的视野扩展',
    category: 'classic',
  },
];

export const MODE_CATEGORIES = [
  {
    id: 'numbers',
    category: '基础数字类',
    shortName: '数字',
    icon: <Binary className="w-3.5 h-3.5 text-blue-500" />,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    modes: [
      {
        value: 'numbers_asc' as SchulteMode,
        label: '经典正序',
        tag: '1➔N',
        badge: '经典基准',
        desc: '由小到大正序寻找，科学舒尔特基准常模测试',
        example: '1 ➔ 2 ➔ 3 ➔ 4 ➔ ...',
      },
      {
        value: 'numbers_desc' as SchulteMode,
        label: '逆向倒序',
        tag: 'N➔1',
        badge: '逆向思维',
        desc: '由大到小倒数寻找，突破正向思维惯性与预读定势',
        example: '25 ➔ 24 ➔ 23 ➔ ...',
      },
      {
        value: 'numbers_odd' as SchulteMode,
        label: '奇数筛选',
        tag: '奇数抑制',
        badge: '抑制控制',
        desc: '全盘数字中只按序点奇数，偶数作为强抑制干扰项',
        example: '1 ➔ 3 ➔ 5 ➔ 7 (避开偶数)',
      },
      {
        value: 'numbers_even' as SchulteMode,
        label: '偶数筛选',
        tag: '偶数抑制',
        badge: '抑制控制',
        desc: '全盘数字中只按序点偶数，奇数作为抑制干扰项',
        example: '2 ➔ 4 ➔ 6 ➔ 8 (避开奇数)',
      },
      {
        value: 'numbers_skip' as SchulteMode,
        label: '步长跳跃',
        tag: '+2递增',
        badge: '心算跨步',
        desc: '由1开始按+2跨步递增跳跃寻找，强化动态工作记忆',
        example: '1 ➔ 3 ➔ 5 ➔ 7 ➔ 9 ...',
      },
      {
        value: 'roman_numerals' as SchulteMode,
        label: '罗马数字',
        tag: 'I➔XXV',
        badge: '视觉转码',
        desc: '经典古罗马数字正序寻找，激活脑内符号转码回路',
        example: 'I ➔ II ➔ III ➔ IV ➔ V ...',
      },
    ],
  },
  {
    id: 'letters',
    category: '字母与拼音类',
    shortName: '字母',
    icon: <Type className="w-3.5 h-3.5 text-violet-500" />,
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
    modes: [
      {
        value: 'letters_asc' as SchulteMode,
        label: '英文大写',
        tag: 'A➔Z',
        badge: '字母正序',
        desc: '按大写英文字母表顺序依次寻找，训练字母广角扫描',
        example: 'A ➔ B ➔ C ➔ D ➔ E ...',
      },
      {
        value: 'letters_desc' as SchulteMode,
        label: '字母倒序',
        tag: 'Z➔A',
        badge: '字母逆序',
        desc: '英文字母表逆向倒序寻找，强化反向认知处理速度',
        example: 'Y ➔ X ➔ W ➔ V ➔ U ...',
      },
      {
        value: 'letters_case' as SchulteMode,
        label: '大小写交替',
        tag: 'A-a-B-b',
        badge: '精细特征',
        desc: '大写与小写交替寻觅，锻炼对字母微细笔画的瞬时辨识',
        example: 'A ➔ a ➔ B ➔ b ➔ C ➔ c ...',
      },
      {
        value: 'chinese_pinyin' as SchulteMode,
        label: '汉语拼音',
        tag: '声母表',
        badge: '语言启蒙',
        desc: '按汉语拼音声母表顺序寻找，视听读认知整合',
        example: 'b ➔ p ➔ m ➔ f ➔ d ➔ t ...',
      },
    ],
  },
  {
    id: 'culture',
    category: '国风与文雅诗词类',
    shortName: '国风',
    icon: <BookOpen className="w-3.5 h-3.5 text-emerald-600" />,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    modes: [
      {
        value: 'chinese_poetry' as SchulteMode,
        label: '经典古诗绝句',
        tag: '唐诗名篇',
        badge: '诗词名篇',
        desc: '收录《静夜思》《登鹳雀楼》《春晓》，按韵律逐字寻索',
        example: '床 ➔ 前 ➔ 明 ➔ 月 ➔ 光 ...',
      },
      {
        value: 'chinese_chars' as SchulteMode,
        label: '国风千字文',
        tag: '天地玄黄',
        badge: '千字古韵',
        desc: '中华蒙学经典《千字文》，按文段句序依次寻找汉字',
        example: '天 ➔ 地 ➔ 玄 ➔ 黄 ➔ 宇 ➔ 宙 ...',
      },
      {
        value: 'chinese_stems' as SchulteMode,
        label: '天干地支',
        tag: '甲乙丙丁',
        badge: '传统时序',
        desc: '天干十干与地支十二支时序规律寻索，传承文化时序',
        example: '甲 ➔ 乙 ➔ 丙 ➔ 丁 ... 子 ➔ 丑 ...',
      },
      {
        value: 'chinese_idioms' as SchulteMode,
        label: '成语接力寻踪',
        tag: '四字成语',
        badge: '连环接力',
        desc: '经典四字成语连环接力，逐字顺畅寻找，寓教于乐',
        example: '一 ➔ 心 ➔ 一 ➔ 意 ➔ 两 ➔ 全 ...',
      },
      {
        value: 'custom_text' as SchulteMode,
        label: '自定义题库',
        tag: 'UGC导入',
        badge: '背词神器',
        desc: '支持导入背英语单词、背古诗文段、理化医学考点，一键生成专属盘面',
        example: '自由粘贴文本/单词释义列表',
      },
    ],
  },
  {
    id: 'switching',
    category: '双轨与认知转换类',
    shortName: '双轨',
    icon: <Infinity className="w-3.5 h-3.5 text-rose-500" />,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    modes: [
      {
        value: 'red_asc_black_desc' as SchulteMode,
        label: '格尔波夫红黑表',
        tag: '红升黑降',
        badge: '宇航员核心',
        desc: '前苏联飞行员与宇航员核心测试！红升黑降交替搜索，极限抗分心',
        example: '红 1 ➔ 黑 25 ➔ 红 2 ➔ 黑 24 ...',
      },
      {
        value: 'red_black' as SchulteMode,
        label: '红黑同向双轨',
        tag: '红黑交替',
        badge: '平行注意',
        desc: '红1-黑1-红2-黑2 双色交替寻找，心理学经典注意分配表',
        example: '红 1 ➔ 黑 1 ➔ 红 2 ➔ 黑 2 ...',
      },
      {
        value: 'trail_making' as SchulteMode,
        label: '数字字母连线',
        tag: '1-A-2-B',
        badge: 'Trail Making',
        desc: '国际神经心理学标准 Trail Making Test B，数字与字母交替',
        example: '1 ➔ A ➔ 2 ➔ B ➔ 3 ➔ C ...',
      },
      {
        value: 'odd_even_switch' as SchulteMode,
        label: '奇偶双轨交替',
        tag: '奇偶交替',
        badge: '双规转换',
        desc: '奇数与偶数交叉交替寻索，锻炼心智在两个规则系统间的切换',
        example: '奇 1 ➔ 偶 2 ➔ 奇 3 ➔ 偶 4 ...',
      },
    ],
  },
  {
    id: 'visual',
    category: '视知觉与抗干扰类',
    shortName: '视知觉',
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    modes: [
      {
        value: 'symbols' as SchulteMode,
        label: '几何星象符号',
        tag: '纯视觉特征',
        badge: '几何特征',
        desc: '纯非语言几何图形与象形符号，剥离语义概念，纯粹视觉特征比对',
        example: '★ ➔ ● ➔ ▲ ➔ ■ ➔ ◆ ...',
      },
      {
        value: 'color_gradient' as SchulteMode,
        label: '光谱色彩谱系',
        tag: '彩虹光序',
        badge: '色彩辨别',
        desc: '按彩虹光谱波长与色相由红至紫依次寻找，锻炼视网膜色敏度',
        example: '赤红 ➔ 橙红 ➔ 琥珀 ➔ 亮黄 ...',
      },
      {
        value: 'stroop_color' as SchulteMode,
        label: '斯特鲁普抗干扰',
        tag: '色彩抗干扰',
        badge: 'Stroop效应',
        desc: '字义与字体色彩冲突，依提示找出对应颜色，科学克服自动化阅读干扰',
        example: '文字写“蓝”但字是红色，点击红字',
      },
      {
        value: 'math_calc' as SchulteMode,
        label: '心算速算算式',
        tag: '速算思维',
        badge: '心算速算',
        desc: '根据目标数依次点击对应算式（如目标为5，寻找 2+3 或 9-4）',
        example: '目标 1 ➔ 寻找 2-1 ➔ 目标 2 ➔ 寻找 1+1',
      },
      {
        value: 'blind_memory' as SchulteMode,
        label: '记忆盲打隐退',
        tag: '空间记忆',
        badge: '短时记忆',
        desc: '开局短暂浏览全盘后所有字块隐退，仅凭空间记忆盲打点击',
        example: '3秒记忆全盘位置 ➔ 盲点 1, 2, 3...',
      },
      {
        value: 'dynamic_shift' as SchulteMode,
        label: '动态微移重排',
        tag: '动态重排',
        badge: '动态搜寻',
        desc: '每次点击正确后剩余卡牌微调漂移，破除静态位置记忆依赖',
        example: '每点中一个，周围卡片轻微滑动换位',
      },
    ],
  },
];

export const GameControls: React.FC<GameControlsProps> = ({
  size,
  onSizeChange,
  shape,
  onShapeChange,
  mode,
  onModeChange,
  isPlaying,
  isPaused,
  onStart,
  onPauseToggle,
  onReset,
  onOpenDaily,
  isDailyChallengeActive,
  descriptionText,
  bestTimeForCurrent,
  todayTrainingCount = 0,
  centerFocusDot = true,
  onToggleCenterFocusDot,
  showNextTarget = true,
  onToggleShowNextTarget,
  soundEnabled = true,
  onToggleSound,
  countdownEnabled = true,
  onToggleCountdown,
  onOpenCustomModal,
  activeCustomDeck,
}) => {
  const [isModeDrawerOpen, setIsModeDrawerOpen] = useState(false);
  const [isShapeDrawerOpen, setIsShapeDrawerOpen] = useState(false);
  const [drawerCategoryFilter, setDrawerCategoryFilter] = useState<string>('all');
  const [drawerModeSearch, setDrawerModeSearch] = useState<string>('');

  const currentSizeObj = SIZES.find((s) => s.value === size) || SIZES[2];
  const currentShapeObj = SHAPES.find((s) => s.value === shape) || SHAPES[9];
  const currentModeObj =
    MODE_CATEGORIES.flatMap((c) => c.modes).find((m) => m.value === mode) ||
    MODE_CATEGORIES[0].modes[0];

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-3.5">
      {/* Custom Deck Active Banner */}
      {mode === 'custom_text' && !isPlaying && (
        <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-300 flex items-center justify-between gap-2 text-xs shadow-2xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="p-1 rounded-lg bg-amber-500/20 text-amber-800 shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <span className="font-bold text-slate-900 truncate">
                当前词库: 《{activeCustomDeck?.title || '自定义背词题库'}》
              </span>
              <span className="text-[10px] text-amber-800 font-medium ml-1.5">
                ({activeCustomDeck?.items?.length || 0} 词条)
              </span>
            </div>
          </div>
          {onOpenCustomModal && (
            <button
              type="button"
              onClick={onOpenCustomModal}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-2xs transition-all flex items-center gap-1"
            >
              <span>更换/导入</span>
            </button>
          )}
        </div>
      )}

      {/* 1. Uncompressed Dimension Bar: Full-Width Grid Sizes & Dual-Channel Direct Access */}
      {!isPlaying && (
        <div className="w-full flex flex-col gap-3 sm:gap-3.5">
          {/* Row 1: Full-Width Grid Sizes Segmented Bar */}
          <div className="w-full bg-slate-200/60 p-1 rounded-xl flex items-center justify-between gap-1 shadow-2xs">
            {SIZES.map((item) => {
              const isSelected = size === item.value;
              return (
                <button
                  id={`quick-size-btn-${item.value}`}
                  key={item.value}
                  type="button"
                  onClick={() => onSizeChange(item.value)}
                  className={`flex-1 py-1.5 px-0.5 rounded-lg text-center font-black transition-all touch-manipulation cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 active:scale-95 text-xs'
                  } ${size >= 7 ? 'text-[11px]' : 'text-xs'}`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Row 2: Dual-Channel Direct Access Cards (Mode & Shape) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5 w-full">
            {/* Left Channel: Mode Selector Button */}
            <button
              id="btn-open-mode-drawer"
              type="button"
              onClick={() => {
                setIsModeDrawerOpen(true);
                setIsShapeDrawerOpen(false);
              }}
              className="flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-amber-50/40 active:scale-98 border border-slate-200 hover:border-amber-400/50 shadow-2xs transition-all touch-manipulation cursor-pointer group text-left relative overflow-hidden"
              title="点击切换训练题型（正序、逆序、红黑表、诗词等）"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">
                  <Target className="w-3 h-3 text-amber-600" />
                  <span>训练题型</span>
                </div>
                <div className="flex items-center text-slate-400 group-hover:text-amber-600 transition-colors">
                  <span className="text-[10px] font-semibold mr-0.5">切换</span>
                  <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </div>
              <div className="text-sm font-black text-slate-900 truncate w-full">
                {currentModeObj.label}
              </div>
              <div className="text-[11px] text-slate-500 font-medium truncate w-full mt-0.5 flex items-center gap-1">
                <span className="text-amber-800 font-semibold">{currentModeObj.tag}</span>
                <span className="text-slate-300">·</span>
                <span>{currentModeObj.badge}</span>
              </div>
            </button>

            {/* Right Channel: Shape Selector Button */}
            <button
              id="btn-open-shape-drawer"
              type="button"
              onClick={() => {
                setIsShapeDrawerOpen(true);
                setIsModeDrawerOpen(false);
              }}
              className="flex flex-col items-start p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-amber-50/40 active:scale-98 border border-slate-200 hover:border-amber-400/50 shadow-2xs transition-all touch-manipulation cursor-pointer group text-left relative overflow-hidden"
              title="点击切换盘面形态（方格、蜂巢、爱心、星芒等）"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200/70">
                  <Shapes className="w-3 h-3 text-slate-600" />
                  <span>盘面形态</span>
                </div>
                <div className="flex items-center text-slate-400 group-hover:text-slate-800 transition-colors">
                  <span className="text-[10px] font-semibold mr-0.5">更换</span>
                  <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-black text-slate-900 truncate w-full">
                <span className="shrink-0">{currentShapeObj.icon}</span>
                <span className="truncate">{currentShapeObj.label}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium truncate w-full mt-0.5 flex items-center gap-1">
                <span className="text-slate-700 font-semibold">{currentShapeObj.badge}</span>
                <span className="text-slate-300">·</span>
                <span>{currentShapeObj.category === 'irregular' ? '拓展视野' : '规则几何'}</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 2. Primary Action Card (处于最底部，严格坐落在 Tab 栏紧邻上方) */}
      <div
        className={`w-full bg-white rounded-2xl border border-slate-200 shadow-2xs transition-all ${
          isPlaying ? 'p-2 sm:p-2.5' : 'p-3 sm:p-3.5 space-y-2'
        }`}
      >
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <>
              <button
                id="btn-start-training"
                type="button"
                onClick={onStart}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-black shadow-sm transition-all text-base touch-manipulation cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>开始训练</span>
                <span className="text-[11px] font-normal text-slate-900/60 font-mono hidden sm:inline">(Space)</span>
              </button>

              {/* Daily challenge button */}
              <button
                id="btn-daily-challenge-shortcut"
                type="button"
                onClick={onOpenDaily}
                className={`flex items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-bold transition-all touch-manipulation border shrink-0 cursor-pointer ${
                  isDailyChallengeActive
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-900'
                    : 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-700 hover:text-amber-800'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-500 fill-current" />
                <span>今日打卡</span>
              </button>
            </>
          ) : (
            <>
              <button
                id="btn-pause-training"
                type="button"
                onClick={onPauseToggle}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold transition-all text-sm touch-manipulation shadow-sm cursor-pointer"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 fill-current text-amber-400" />
                    <span>继续训练</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 text-slate-300" />
                    <span>暂停</span>
                  </>
                )}
              </button>

              <button
                id="btn-reset-training"
                type="button"
                onClick={onReset}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 active:scale-98 text-slate-700 font-semibold transition-all text-sm touch-manipulation border border-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重置</span>
              </button>
            </>
          )}
        </div>

        {/* Pre-challenge Benchmark & Streak pill (仅在未开局时展示) */}
        {!isPlaying && (
          <div className="flex items-center justify-between text-[11px] px-1 text-slate-500 pt-0.5">
            <span className="flex items-center gap-1.5 font-medium truncate">
              <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              {bestTimeForCurrent ? (
                <>
                  当前组合最佳: <strong className="text-slate-900">{bestTimeForCurrent}秒</strong>
                </>
              ) : (
                <span className="text-slate-400">暂无该组合成绩</span>
              )}
            </span>
            <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shrink-0">
              今日已练 {todayTrainingCount} 局
            </span>
          </div>
        )}
      </div>

      {/* 3. Dedicated Mode Selection Drawer (即选即关，极速体验) */}
      {isModeDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden pb-safe">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" />
                <h3 className="font-black text-base text-slate-900">选择训练题型</h3>
                <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-200/60">
                  点选即生效
                </span>
              </div>
              <button
                id="btn-close-mode-drawer"
                type="button"
                onClick={() => setIsModeDrawerOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Category Chips Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-4 py-2 bg-slate-50/80 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setDrawerCategoryFilter('all')}
                className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  drawerCategoryFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                全部题型 (25款)
              </button>
              {MODE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setDrawerCategoryFilter(cat.id)}
                  className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    drawerCategoryFilter === cat.id
                      ? 'bg-amber-500 text-slate-950 shadow-2xs ring-1 ring-amber-600/30'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.shortName}</span>
                  <span className="text-[10px] opacity-75">({cat.modes.length})</span>
                </button>
              ))}
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[60vh]">
              {/* UGC Banner */}
              {onOpenCustomModal && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>自定义题库 / 英语背词·考点文段 UGC</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      支持自由粘贴单词释义、古诗文段，自动切分盘面
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModeDrawerOpen(false);
                      onOpenCustomModal();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0 shadow-xs cursor-pointer transition-all"
                  >
                    立即导入
                  </button>
                </div>
              )}

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="搜索题型 (如：格尔波夫、奇数、唐诗、罗马、Stroop...)"
                  value={drawerModeSearch}
                  onChange={(e) => setDrawerModeSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900 placeholder:text-slate-400"
                />
                {drawerModeSearch && (
                  <button
                    type="button"
                    onClick={() => setDrawerModeSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Categorized Mode List */}
              {MODE_CATEGORIES.filter(
                (catGroup) =>
                  drawerCategoryFilter === 'all' || catGroup.id === drawerCategoryFilter
              ).map((catGroup) => {
                const filteredModes = catGroup.modes.filter((m) => {
                  if (!drawerModeSearch.trim()) return true;
                  const q = drawerModeSearch.toLowerCase();
                  return (
                    m.label.toLowerCase().includes(q) ||
                    m.tag.toLowerCase().includes(q) ||
                    m.badge.toLowerCase().includes(q) ||
                    m.desc.toLowerCase().includes(q) ||
                    (m.example && m.example.toLowerCase().includes(q))
                  );
                });

                if (filteredModes.length === 0) return null;

                return (
                  <div key={catGroup.category} className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        {catGroup.icon}
                        <span>{catGroup.category}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {filteredModes.length} 种题型
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {filteredModes.map((m) => {
                        const isSelected = mode === m.value;
                        return (
                          <button
                            key={m.value}
                            type="button"
                            onClick={() => {
                              onModeChange(m.value);
                              setIsModeDrawerOpen(false);
                            }}
                            className={`flex items-start justify-between p-3 rounded-2xl border text-left transition-all touch-manipulation cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-500 text-slate-900 shadow-xs ring-1 ring-amber-500/30'
                                : 'bg-white hover:bg-slate-50/80 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="space-y-1 flex-1 pr-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-sm font-bold text-slate-900">{m.label}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-semibold">
                                  {m.tag}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-medium">
                                  {m.badge}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-snug">{m.desc}</p>
                              {m.example && (
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100/80 text-[10px] text-slate-500 font-mono">
                                  <span className="font-sans text-[9px] text-slate-400">范例:</span>
                                  <span>{m.example}</span>
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 shrink-0 mt-0.5 shadow-2xs">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. Dedicated Shape Selection Drawer (即选即关，极速体验) */}
      {isShapeDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden pb-safe">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shapes className="w-4 h-4 text-amber-500" />
                <h3 className="font-black text-base text-slate-900">选择盘面形态</h3>
                <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-200/60">
                  点选即生效
                </span>
              </div>
              <button
                id="btn-close-shape-drawer"
                type="button"
                onClick={() => setIsShapeDrawerOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shape List Grouped */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[60vh]">
              {/* Category 1: 经典规则几何 */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block px-1">
                  经典规则几何形态
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SHAPES.filter((s) => s.category === 'classic').map((sh) => {
                    const isSelected = shape === sh.value;
                    return (
                      <button
                        key={sh.value}
                        type="button"
                        onClick={() => {
                          onShapeChange(sh.value);
                          setIsShapeDrawerOpen(false);
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all touch-manipulation cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-slate-900 font-bold shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {sh.icon}
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold">{sh.label}</span>
                              <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                                {sh.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">{sh.desc}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0 ml-1.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category 2: 不规则与有机异形 */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    不规则与有机异形形态
                  </span>
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-medium border border-amber-200/50">
                    拓宽视野角度
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SHAPES.filter((s) => s.category === 'irregular').map((sh) => {
                    const isSelected = shape === sh.value;
                    return (
                      <button
                        key={sh.value}
                        type="button"
                        onClick={() => {
                          onShapeChange(sh.value);
                          setIsShapeDrawerOpen(false);
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all touch-manipulation cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-slate-900 font-bold shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {sh.icon}
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold">{sh.label}</span>
                              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100/70 text-amber-800 font-medium">
                                {sh.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">{sh.desc}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0 ml-1.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
