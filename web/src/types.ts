export type GridSize = 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type BoardShape = 
  | 'grid'        // 经典方格
  | 'honeycomb'   // 蜂巢六边形
  | 'circle'      // 同心圆环
  | 'diamond'     // 菱形斜阵
  | 'triangle'    // 金字塔三角
  | 'scatter'     // 散落星象
  | 'heart'       // 爱心轮廓 (不规则心形)
  | 'star'        // 五角星芒 (不规则尖角放射)
  | 'spiral'      // 螺旋星系 (阿基米德旋涡)
  | 'butterfly'   // 蝶翼双环 (莫比乌斯双翼)
  | 'cross'       // 十字星阵 (纵横象限)
  | 'wave'        // 波浪流线 (S型蛇形曲线)
  | 'crescent'    // 弯月弧形 (上弦弧线)
  | 'irregular';  // 自由异形卵石 (有机不对称散落)

export type SchulteMode =
  // 1. 基础数字序列
  | 'numbers_asc'          // 经典正序 (1..N)
  | 'numbers_desc'         // 逆向倒序 (N..1)
  | 'numbers_odd'          // 奇数筛选 (仅按序点奇数，偶数干扰)
  | 'numbers_even'         // 偶数筛选 (仅按序点偶数，奇数干扰)
  | 'numbers_skip'         // 步长跳跃 (+2 递增跨步)
  | 'roman_numerals'       // 罗马数字 (I, II, III, IV...)
  // 2. 字母与拼音语言
  | 'letters_asc'          // 英文大写 (A..Z)
  | 'letters_desc'         // 字母倒序 (Z..A)
  | 'letters_case'         // 大小写交替 (A ➔ a ➔ B ➔ b...)
  | 'chinese_pinyin'       // 汉语拼音声母 (b, p, m, f...)
  // 3. 国风文雅与诗词
  | 'chinese_chars'        // 国风千字文 (天地玄黄宇宙洪荒...)
  | 'chinese_poetry'       // 经典古诗绝句 (静夜思/登鹳雀楼/春晓)
  | 'chinese_stems'        // 天干地支 (甲乙丙丁/子丑寅卯)
  | 'chinese_idioms'       // 成语接力寻踪 (四字成语连环)
  | 'custom_text'          // UGC 自定义词条/文段导入 (背单词/背文段/医学化学考点)
  // 4. 双轨与认知转换
  | 'red_asc_black_desc'   // 格尔波夫红黑舒尔特 (红升黑降交替：红1-黑N-红2-黑N-1...)
  | 'red_black'            // 红黑双轨同向 (红1-黑1-红2-黑2...)
  | 'trail_making'         // 数字字母连线 (1-A-2-B-3-C...)
  | 'odd_even_switch'      // 奇偶双轨交替 (奇1-偶2-奇3-偶4...)
  // 5. 视知觉与挑战
  | 'symbols'              // 几何星象符号 (★, ●, ■, ▲, ◆...)
  | 'color_gradient'       // 光谱色彩谱系 (红橙黄绿青蓝紫渐变)
  | 'stroop_color'         // 斯特鲁普色彩抗干扰 (看字读色/看色点字)
  | 'math_calc'            // 算术速算 (按1..N点对应算式，如 2+3=5)
  | 'blind_memory'         // 盲打记忆 (翻转记忆/点后隐退)
  | 'dynamic_shift';       // 动态位移 (点中后随机微调排布)

export interface SchulteTile {
  id: string;
  originalIndex: number;
  displayText: string;
  secondaryText?: string;
  targetKey: string;      // What step this corresponds to in sequence
  colorTag?: 'red' | 'black' | 'blue' | 'emerald' | 'amber' | 'purple' | string;
  fontColor?: string;
  bgColor?: string;
  symbolIcon?: string;
  isDistractor?: boolean; // For odd/even filter modes where some tiles shouldn't be clicked
  // Spatial coordinates for non-grid layouts (percentage 0..100)
  x?: number;
  y?: number;
  sizeMultiplier?: number;
  isClicked: boolean;
  isCurrentTarget?: boolean;
}

export interface ClickLog {
  step: number;
  targetKey: string;
  tileDisplayText: string;
  timestamp: number;
  latencyMs: number; // Time since previous tap
  isCorrect: boolean;
  tileIndex: number;
  coord?: { x: number; y: number };
}

export interface DailyReminderConfig {
  enabled: boolean;
  time: string;                  // 'HH:mm' e.g. '20:00'
  onlyIfNotCompleted: boolean;   // Only remind if today's check-in has not been done
  lastNotifiedDate?: string;     // YYYY-MM-DD
}

export interface TrainingSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  centerFocusDot: boolean;     // Center visual fixation point for peripheral training
  showNextTarget: boolean;     // Display "Next: X" prompt
  errorPenaltyMs: number;      // Penalty time for wrong taps (ms)
  blindHideDelaySeconds: number; // For memory mode: hide after N seconds (0 = immediate)
  highContrast: boolean;
  dynamicShuffleLevel: 'low' | 'high';
  countdownEnabled: boolean;   // 3-2-1 countdown before game starts
  reminder: DailyReminderConfig;
}

export interface RadarMetrics {
  reactionSpeed: number;     // 反应速度 (0-100)
  attentionStability: number;// 注意力稳定性 (0-100)
  visualSpan: number;        // 视野广度 (0-100)
  mentalEndurance: number;   // 心智耐力 (0-100)
  accuracy: number;          // 准确率 (0-100)
  overallScore: number;      // 综合专注力分 (0-100)
}

export interface CustomDeckItem {
  text: string;
  secondaryText?: string;
}

export interface CustomDeck {
  id: string;
  title: string;
  category: 'english' | 'chinese' | 'science' | 'custom';
  rawContent: string;
  items: CustomDeckItem[];
  recommendedSize: GridSize;
  createdAt: string;
  updatedAt: string;
}

export interface SessionRecord {
  id: string;
  date: string;               // ISO date
  dateFormatted: string;      // YYYY-MM-DD HH:mm
  dayKey: string;             // YYYY-MM-DD for daily streaks
  size: GridSize;
  shape: BoardShape;
  mode: SchulteMode;
  totalTiles: number;
  totalTimeMs: number;        // Total duration in ms
  penaltyTimeMs: number;
  effectiveTimeMs: number;    // totalTimeMs + penaltyTimeMs
  averageTapMs: number;
  errorsCount: number;
  accuracyRate: number;       // e.g. 98.2%
  clickLogs: ClickLog[];
  metrics: RadarMetrics;
  isDailyChallenge?: boolean;
  planTitle?: string;
  customTitle?: string;
}

export interface DailyStreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;  // YYYY-MM-DD
  historyDates: string[];     // Array of completed YYYY-MM-DD
}
