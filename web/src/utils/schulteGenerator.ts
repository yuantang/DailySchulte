import { BoardShape, CustomDeck, GridSize, SchulteMode, SchulteTile } from '../types';
import { getActiveCustomDeck } from './customDecks';

// Chinese texts for cultural Schulte
export const THOUSAND_CHARACTER_CLASSIC = [
  '天', '地', '玄', '黄', '宇', '宙', '洪', '荒',
  '日', '月', '盈', '昃', '辰', '宿', '列', '张',
  '寒', '来', '暑', '往', '秋', '收', '冬', '藏',
  '闰', '余', '成', '岁', '律', '吕', '调', '阳',
  '云', '腾', '致', '雨', '露', '结', '为', '霜',
  '金', '生', '丽', '水', '玉', '出', '昆', '冈',
  '剑', '号', '巨', '阙', '珠', '称', '夜', '光',
  '果', '珍', '李', '柰', '菜', '重', '芥', '姜',
  '海', '咸', '河', '淡', '鳞', '潜', '羽', '翔',
  '龙', '师', '火', '帝', '鸟', '官', '人', '皇'
];

export const HEAVENLY_STEMS_BRANCHES = [
  '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸',
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'
];

// Color definitions for Stroop Effect
export const STROOP_COLORS = [
  { name: '红', hex: '#ef4444', tag: 'red' as const },
  { name: '蓝', hex: '#3b82f6', tag: 'blue' as const },
  { name: '绿', hex: '#10b981', tag: 'emerald' as const },
  { name: '黄', hex: '#f59e0b', tag: 'amber' as const },
  { name: '紫', hex: '#8b5cf6', tag: 'purple' as const },
  { name: '黑', hex: '#1e293b', tag: 'black' as const }
];

// Roman numerals converter (1 to 100)
export function toRoman(num: number): string {
  const map: [number, string][] = [
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  let res = '';
  let n = Math.max(1, Math.min(100, num));
  for (const [val, sym] of map) {
    while (n >= val) {
      res += sym;
      n -= val;
    }
  }
  return res;
}

// Classical poems for Chinese poetry Schulte
export const CLASSICAL_POEMS = [
  {
    title: '静夜思',
    author: '李白',
    text: '床前明月光疑是地上霜举头望明月低头思故乡静夜思李白唐诗五言绝句千古名篇思乡明月',
    lines: ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
  },
  {
    title: '登鹳雀楼',
    author: '王之涣',
    text: '白日依山尽黄河入海流欲穷千里目更上一层楼登鹳雀楼王之涣盛唐名篇登高壮怀黄河万里',
    lines: ['白日依山尽', '黄河入海流', '欲穷千里目', '更上一层楼'],
  },
  {
    title: '春晓',
    author: '孟浩然',
    text: '春眠不觉晓处处闻啼鸟夜来风雨声花落知多少春晓孟浩然唐代山水名句春意盎然啼鸟落花',
    lines: ['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少'],
  },
  {
    title: '望庐山瀑布',
    author: '李白',
    text: '日照香炉生紫烟遥看瀑布挂前川飞流直下三千尺疑是银河落九天李白望庐山瀑布唐代诗仙',
    lines: ['日照香炉生紫烟', '遥看瀑布挂前川', '飞流直下三千尺', '疑是银河落九天'],
  },
  {
    title: '江雪',
    author: '柳宗元',
    text: '千山鸟飞绝万径人踪灭孤舟蓑笠翁独钓寒江雪柳宗元江雪绝句千古名篇寒江独钓孤舟清旷',
    lines: ['千山鸟飞绝', '万径人踪灭', '孤舟蓑笠翁', '独钓寒江雪'],
  },
];

// Chinese 4-character idioms
export const CHINESE_IDIOMS = [
  '一心一意', '两全其美', '三心二意', '四平八稳',
  '五湖四海', '六六大顺', '七上八下', '八面威风',
  '九牛一毛', '十全十美', '百发百中', '千方百计',
  '万紫千红', '自强不息', '厚德载物', '海纳百川',
  '宁静致远', '上善若水', '行胜于言', '精益求精',
  '志存高远', '水滴石穿', '见贤思齐', '知行合一',
  '博学笃行', '持之以恒', '温故知新', '大巧若拙'
];

// Pinyin initials
export const PINYIN_INITIALS = [
  'b', 'p', 'm', 'f', 'd', 't', 'n', 'l',
  'g', 'k', 'h', 'j', 'q', 'x',
  'zh', 'ch', 'sh', 'r', 'z', 'c', 's',
  'y', 'w'
];

// Geometric & visual symbols
export const GEOMETRIC_SYMBOLS = [
  { char: '★', name: '五角星', color: '#f59e0b' },
  { char: '●', name: '实心圆', color: '#3b82f6' },
  { char: '▲', name: '正三角', color: '#10b981' },
  { char: '■', name: '实心方', color: '#8b5cf6' },
  { char: '◆', name: '实心菱', color: '#ef4444' },
  { char: '✦', name: '闪烁星', color: '#f59e0b' },
  { char: '✿', name: '五瓣花', color: '#ec4899' },
  { char: '⬢', name: '六角形', color: '#06b6d4' },
  { char: '✚', name: '十字星', color: '#14b8a6' },
  { char: '♠', name: '黑桃纹', color: '#1e293b' },
  { char: '♥', name: '红心印', color: '#e11d48' },
  { char: '♣', name: '梅花迹', color: '#0f766e' },
  { char: '♦', name: '红方片', color: '#ea580c' },
  { char: '☀', name: '耀阳纹', color: '#d97706' },
  { char: '☁', name: '行云印', color: '#0284c7' },
  { char: '⚡', name: '闪电符', color: '#eab308' },
  { char: '❄', name: '雪花痕', color: '#38bdf8' },
  { char: '✪', name: '圆星盾', color: '#6366f1' },
  { char: '❂', name: '光轮星', color: '#8b5cf6' },
  { char: '❖', name: '菱花纹', color: '#be185d' },
  { char: '◎', name: '同心圈', color: '#0d9488' },
  { char: '▼', name: '倒三角', color: '#4f46e5' },
  { char: '◄', name: '左指尖', color: '#b45309' },
  { char: '►', name: '右指尖', color: '#047857' },
];

// Spectrum Color list for color gradient Schulte
export const SPECTRUM_COLORS = [
  { name: '赤红', hex: '#ef4444', label: '1·红', tag: 'red' },
  { name: '橙红', hex: '#f97316', label: '2·橙', tag: 'orange' },
  { name: '琥珀', hex: '#f59e0b', label: '3·珀', tag: 'amber' },
  { name: '亮黄', hex: '#eab308', label: '4·黄', tag: 'yellow' },
  { name: '青柠', hex: '#84cc16', label: '5·柠', tag: 'lime' },
  { name: '翠绿', hex: '#10b981', label: '6·绿', tag: 'emerald' },
  { name: '青绿', hex: '#14b8a6', label: '7·青', tag: 'teal' },
  { name: '湖蓝', hex: '#06b6d4', label: '8·湖', tag: 'cyan' },
  { name: '天蓝', hex: '#0ea5e9', label: '9·天', tag: 'sky' },
  { name: '湛蓝', hex: '#3b82f6', label: '10·蓝', tag: 'blue' },
  { name: '靛青', hex: '#6366f1', label: '11·靛', tag: 'indigo' },
  { name: '紫罗', hex: '#8b5cf6', label: '12·紫', tag: 'violet' },
  { name: '幽紫', hex: '#a855f7', label: '13·幽', tag: 'purple' },
  { name: '洋红', hex: '#d946ef', label: '14·洋', tag: 'fuchsia' },
  { name: '枚红', hex: '#ec4899', label: '15·枚', tag: 'pink' },
  { name: '赤玫', hex: '#f43f5e', label: '16·玫', tag: 'rose' },
];

// Simple deterministic PRNG for daily seeds
export function createPRNG(seedStr: string) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// Generate simple math expressions whose evaluation is equal to `targetVal`
function generateMathEquation(targetVal: number, randomFn: () => number): string {
  const operations = ['add', 'sub', 'mul'];
  const op = operations[Math.floor(randomFn() * (targetVal <= 20 ? 3 : 2))];

  if (op === 'add') {
    const a = Math.floor(randomFn() * (targetVal - 1)) + 1;
    const b = targetVal - a;
    return `${a}+${b}`;
  } else if (op === 'sub') {
    const delta = Math.floor(randomFn() * 6) + 1;
    const a = targetVal + delta;
    return `${a}-${delta}`;
  } else {
    // Multiplication if target has factors
    const factors: number[] = [];
    for (let f = 2; f <= Math.min(9, targetVal); f++) {
      if (targetVal % f === 0 && targetVal / f <= 9) {
        factors.push(f);
      }
    }
    if (factors.length > 0) {
      const chosen = factors[Math.floor(randomFn() * factors.length)];
      return `${chosen}×${targetVal / chosen}`;
    }
    // Fallback to addition
    const a = Math.max(1, Math.floor(targetVal / 2));
    return `${a}+${targetVal - a}`;
  }
}

export interface GeneratedBoardData {
  tiles: SchulteTile[];
  targetSequence: { key: string; label: string; subLabel?: string; colorTag?: string }[];
  description: string;
}

/**
 * Generate full Schulte Board data based on size, shape, mode and optional seed
 */
export function generateSchulteBoard(
  size: GridSize,
  shape: BoardShape,
  mode: SchulteMode,
  seed?: string,
  customDeck?: CustomDeck
): GeneratedBoardData {
  const count = size * size;
  const random = seed ? createPRNG(seed) : Math.random;

  const rawTiles: Omit<SchulteTile, 'x' | 'y'>[] = [];
  const targetSequence: { key: string; label: string; subLabel?: string; colorTag?: string }[] = [];

  let description = '';

  // 1. Generate items according to Mode
  switch (mode) {
    case 'numbers_asc': {
      description = `按正序依次寻找：1 至 ${count}`;
      for (let i = 1; i <= count; i++) {
        const key = String(i);
        targetSequence.push({ key, label: key });
        rawTiles.push({
          id: `tile-${i}`,
          originalIndex: i - 1,
          displayText: key,
          targetKey: key,
          isClicked: false
        });
      }
      break;
    }

    case 'numbers_desc': {
      description = `按逆序依次寻找：${count} 倒数至 1`;
      for (let i = count; i >= 1; i--) {
        const key = String(i);
        targetSequence.push({ key, label: key });
      }
      for (let i = 1; i <= count; i++) {
        const key = String(i);
        rawTiles.push({
          id: `tile-${i}`,
          originalIndex: i - 1,
          displayText: key,
          targetKey: key,
          isClicked: false
        });
      }
      break;
    }

    case 'letters_asc': {
      description = `按英文字母表顺序依次寻找：A 至 ${String.fromCharCode(65 + count - 1)}`;
      for (let i = 0; i < count; i++) {
        const char = String.fromCharCode(65 + (i % 26)) + (i >= 26 ? Math.floor(i / 26) : '');
        const key = char;
        targetSequence.push({ key, label: key });
        rawTiles.push({
          id: `tile-${i}`,
          originalIndex: i,
          displayText: char,
          targetKey: key,
          isClicked: false
        });
      }
      break;
    }

    case 'trail_making': {
      // 1 -> A -> 2 -> B -> 3 -> C ...
      description = '数字与字母双轨交替寻找：1 ➔ A ➔ 2 ➔ B ...';
      const half = Math.ceil(count / 2);
      let numCounter = 1;
      let letterIndex = 0;
      for (let step = 0; step < count; step++) {
        if (step % 2 === 0) {
          const key = `N_${numCounter}`;
          const label = String(numCounter);
          targetSequence.push({ key, label, subLabel: '数字' });
          rawTiles.push({
            id: `tile-${step}`,
            originalIndex: step,
            displayText: label,
            targetKey: key,
            isClicked: false
          });
          numCounter++;
        } else {
          const letter = String.fromCharCode(65 + (letterIndex % 26));
          const key = `L_${letter}_${letterIndex}`;
          targetSequence.push({ key, label: letter, subLabel: '字母' });
          rawTiles.push({
            id: `tile-${step}`,
            originalIndex: step,
            displayText: letter,
            targetKey: key,
            isClicked: false
          });
          letterIndex++;
        }
      }
      break;
    }

    case 'red_black': {
      // Classic psychological Red-Black Schulte table:
      // Red 1, Black 1, Red 2, Black 2...
      description = '红黑双轨专注交替：红 1 ➔ 黑 1 ➔ 红 2 ➔ 黑 2 ...';
      const pairs = Math.floor(count / 2);
      let idx = 0;
      for (let i = 1; i <= pairs; i++) {
        // Red
        const redKey = `R_${i}`;
        targetSequence.push({ key: redKey, label: `${i}`, subLabel: '红', colorTag: 'red' });
        rawTiles.push({
          id: `tile-r-${i}`,
          originalIndex: idx++,
          displayText: `${i}`,
          targetKey: redKey,
          colorTag: 'red',
          fontColor: '#ef4444',
          isClicked: false
        });

        // Black
        const blackKey = `B_${i}`;
        targetSequence.push({ key: blackKey, label: `${i}`, subLabel: '黑', colorTag: 'black' });
        rawTiles.push({
          id: `tile-b-${i}`,
          originalIndex: idx++,
          displayText: `${i}`,
          targetKey: blackKey,
          colorTag: 'black',
          fontColor: '#0f172a',
          isClicked: false
        });
      }
      // If odd tile remains
      if (idx < count) {
        const extraNum = pairs + 1;
        const extraKey = `R_${extraNum}`;
        targetSequence.push({ key: extraKey, label: `${extraNum}`, subLabel: '红', colorTag: 'red' });
        rawTiles.push({
          id: `tile-r-extra`,
          originalIndex: idx,
          displayText: `${extraNum}`,
          targetKey: extraKey,
          colorTag: 'red',
          fontColor: '#ef4444',
          isClicked: false
        });
      }
      break;
    }

    case 'chinese_chars': {
      description = '千字文国风专注训练：按文段顺序依次寻找汉字';
      for (let i = 0; i < count; i++) {
        const char = THOUSAND_CHARACTER_CLASSIC[i % THOUSAND_CHARACTER_CLASSIC.length];
        const key = `C_${i}_${char}`;
        targetSequence.push({ key, label: char, subLabel: `第${i + 1}字` });
        rawTiles.push({
          id: `tile-${i}`,
          originalIndex: i,
          displayText: char,
          targetKey: key,
          isClicked: false
        });
      }
      break;
    }

    case 'chinese_stems': {
      description = '天干地支顺序训练：甲乙丙丁...子丑寅卯...';
      for (let i = 0; i < count; i++) {
        const char = HEAVENLY_STEMS_BRANCHES[i % HEAVENLY_STEMS_BRANCHES.length];
        const key = `S_${i}_${char}`;
        targetSequence.push({ key, label: char, subLabel: `第${i + 1}位` });
        rawTiles.push({
          id: `tile-${i}`,
          originalIndex: i,
          displayText: char,
          targetKey: key,
          isClicked: false
        });
      }
      break;
    }

    case 'stroop_color': {
      // Word is one color name, but displayed with mismatched font color.
      // Instructions: Tap the tile whose FONT COLOR matches the sequence target!
      description = '斯特鲁普视知觉抗干扰：根据提示颜色，寻找对应【字体颜色】的字块';
      for (let i = 0; i < count; i++) {
        const colorTarget = STROOP_COLORS[i % STROOP_COLORS.length];
        // Pick an incongruent text word
        const textWord = STROOP_COLORS[(i + 1 + Math.floor(random() * (STROOP_COLORS.length - 1))) % STROOP_COLORS.length].name;
        const key = `STR_${i}`;
        targetSequence.push({
          key,
          label: colorTarget.name,
          subLabel: '颜色',
          colorTag: colorTarget.tag
        });
        rawTiles.push({
          id: `tile-str-${i}`,
          originalIndex: i,
          displayText: textWord,
          secondaryText: `字:${textWord}`,
          targetKey: key,
          fontColor: colorTarget.hex,
          colorTag: colorTarget.tag,
          isClicked: false
        });
      }
      break;
    }

    case 'math_calc': {
      description = '心算算式舒尔特：依次按 1 至 N 寻找对应计算结果的算式';
      for (let i = 1; i <= count; i++) {
        const key = String(i);
        const eq = generateMathEquation(i, random);
        targetSequence.push({ key, label: String(i), subLabel: `算式=${i}` });
        rawTiles.push({
          id: `tile-math-${i}`,
          originalIndex: i - 1,
          displayText: eq,
          secondaryText: `=${i}`,
          targetKey: key,
          isClicked: false
        });
      }
      break;
    }

    case 'blind_memory': {
      description = '记忆盲打舒尔特：记忆所有数字位置，开始后逐渐盖牌/隐退';
      for (let i = 1; i <= count; i++) {
        const key = String(i);
        targetSequence.push({ key, label: key });
        rawTiles.push({
          id: `tile-blind-${i}`,
          originalIndex: i - 1,
          displayText: key,
          targetKey: key,
          isClicked: false
        });
      }
      break;
    }

    case 'dynamic_shift': {
      description = '动态重排舒尔特：每次点击正确后，其余卡牌将发生轻微重排位移';
      for (let i = 1; i <= count; i++) {
        const key = String(i);
        targetSequence.push({ key, label: key });
        rawTiles.push({
          id: `tile-dyn-${i}`,
          originalIndex: i - 1,
          displayText: key,
          targetKey: key,
          isClicked: false
        });
      }
      break;
    }

    case 'numbers_odd': {
      description = '奇数筛选挑战：仅按序寻找奇数 (1, 3, 5...)，排除偶数干扰项！';
      for (let i = 1; i <= count; i++) {
        const isOdd = i % 2 === 1;
        const key = isOdd ? String(i) : `distractor_${i}`;
        if (isOdd) {
          targetSequence.push({ key, label: String(i), subLabel: '奇数' });
        }
        rawTiles.push({
          id: `tile-odd-${i}`,
          originalIndex: i - 1,
          displayText: String(i),
          targetKey: key,
          isDistractor: !isOdd,
          isClicked: false,
        });
      }
      break;
    }

    case 'numbers_even': {
      description = '偶数筛选挑战：仅按序寻找偶数 (2, 4, 6...)，排除奇数干扰项！';
      for (let i = 1; i <= count; i++) {
        const isEven = i % 2 === 0;
        const key = isEven ? String(i) : `distractor_${i}`;
        if (isEven) {
          targetSequence.push({ key, label: String(i), subLabel: '偶数' });
        }
        rawTiles.push({
          id: `tile-even-${i}`,
          originalIndex: i - 1,
          displayText: String(i),
          targetKey: key,
          isDistractor: !isEven,
          isClicked: false,
        });
      }
      break;
    }

    case 'numbers_skip': {
      const stepVal = 2;
      const endVal = 1 + (count - 1) * stepVal;
      description = `步长跳跃训练 (+2 跨步)：由 1 开始按 +2 跨步依次寻找至 ${endVal}`;
      for (let i = 0; i < count; i++) {
        const val = 1 + i * stepVal;
        const key = String(val);
        targetSequence.push({ key, label: key, subLabel: `+${stepVal}` });
        rawTiles.push({
          id: `tile-skip-${i}`,
          originalIndex: i,
          displayText: key,
          targetKey: key,
          isClicked: false,
        });
      }
      break;
    }

    case 'roman_numerals': {
      const maxRoman = toRoman(count);
      description = `罗马数字视觉转码：按正序依次寻找罗马数字 I 至 ${maxRoman}`;
      for (let i = 1; i <= count; i++) {
        const roman = toRoman(i);
        const key = `ROMAN_${i}`;
        targetSequence.push({ key, label: roman, subLabel: `${i}` });
        rawTiles.push({
          id: `tile-roman-${i}`,
          originalIndex: i - 1,
          displayText: roman,
          secondaryText: String(i),
          targetKey: key,
          isClicked: false,
        });
      }
      break;
    }

    case 'letters_desc': {
      const lastChar = String.fromCharCode(65 + count - 1);
      description = `英文字母逆向倒序：由 ${lastChar} 逆向倒数寻找至 A`;
      for (let i = count - 1; i >= 0; i--) {
        const char = String.fromCharCode(65 + (i % 26)) + (i >= 26 ? Math.floor(i / 26) : '');
        const key = `L_DESC_${i}`;
        targetSequence.push({ key, label: char });
      }
      for (let i = 0; i < count; i++) {
        const char = String.fromCharCode(65 + (i % 26)) + (i >= 26 ? Math.floor(i / 26) : '');
        const key = `L_DESC_${i}`;
        rawTiles.push({
          id: `tile-ldesc-${i}`,
          originalIndex: i,
          displayText: char,
          targetKey: key,
          isClicked: false,
        });
      }
      break;
    }

    case 'letters_case': {
      description = '大小写双轨交替：大写 ➔ 小写 ➔ 大写 ➔ 小写 (A ➔ a ➔ B ➔ b...)';
      let letterIdx = 0;
      for (let step = 0; step < count; step++) {
        const isUpper = step % 2 === 0;
        const baseChar = String.fromCharCode(65 + (letterIdx % 26));
        const char = isUpper ? baseChar : baseChar.toLowerCase();
        const key = `CASE_${step}_${char}`;
        targetSequence.push({
          key,
          label: char,
          subLabel: isUpper ? '大写' : '小写',
        });
        rawTiles.push({
          id: `tile-case-${step}`,
          originalIndex: step,
          displayText: char,
          targetKey: key,
          isClicked: false,
        });
        if (!isUpper) {
          letterIdx++;
        }
      }
      break;
    }

    case 'chinese_pinyin': {
      description = '汉语拼音声母训练：按声母表顺序依次寻找 (b, p, m, f...)';
      for (let i = 0; i < count; i++) {
        const pinyin = PINYIN_INITIALS[i % PINYIN_INITIALS.length];
        const loop = Math.floor(i / PINYIN_INITIALS.length);
        const display = loop > 0 ? `${pinyin}${loop + 1}` : pinyin;
        const key = `PINYIN_${i}_${display}`;
        targetSequence.push({ key, label: display, subLabel: `第${i + 1}音` });
        rawTiles.push({
          id: `tile-pinyin-${i}`,
          originalIndex: i,
          displayText: display,
          targetKey: key,
          isClicked: false,
        });
      }
      break;
    }

    case 'chinese_poetry': {
      const poemIndex = Math.floor(random() * CLASSICAL_POEMS.length);
      const poem = CLASSICAL_POEMS[poemIndex];
      description = `经典古诗《${poem.title}》·${poem.author}：按绝句韵律逐字依次寻找`;
      for (let i = 0; i < count; i++) {
        const char = poem.text[i % poem.text.length];
        const key = `POEM_${i}_${char}`;
        const lineIdx = Math.floor(i / 5);
        const lineLabel = lineIdx < poem.lines.length ? `第${lineIdx + 1}句` : poem.title;
        targetSequence.push({
          key,
          label: char,
          subLabel: lineLabel,
        });
        rawTiles.push({
          id: `tile-poem-${i}`,
          originalIndex: i,
          displayText: char,
          secondaryText: lineLabel,
          targetKey: key,
          isClicked: false,
        });
      }
      break;
    }

    case 'chinese_idioms': {
      description = '成语连环寻踪训练：按经典四字成语字序逐字寻找';
      let charCount = 0;
      let idiomIdx = 0;
      while (charCount < count) {
        const idiom = CHINESE_IDIOMS[idiomIdx % CHINESE_IDIOMS.length];
        for (let c = 0; c < 4 && charCount < count; c++) {
          const char = idiom[c];
          const key = `IDIOM_${charCount}_${char}`;
          targetSequence.push({
            key,
            label: char,
            subLabel: idiom,
          });
          rawTiles.push({
            id: `tile-idiom-${charCount}`,
            originalIndex: charCount,
            displayText: char,
            secondaryText: idiom,
            targetKey: key,
            isClicked: false,
          });
          charCount++;
        }
        idiomIdx++;
      }
      break;
    }

    case 'custom_text': {
      const activeDeck = customDeck || getActiveCustomDeck();
      const items =
        activeDeck.items && activeDeck.items.length > 0
          ? activeDeck.items
          : [{ text: '无内容', secondaryText: '请导入' }];
      description = `自定义记忆《${activeDeck.title}》：按顺序依次寻找`;
      for (let i = 0; i < count; i++) {
        const item = items[i % items.length];
        const loop = Math.floor(i / items.length);
        const displayLabel = item.text;
        const subLabel = loop > 0 && item.secondaryText ? `${item.secondaryText}·${loop + 1}` : item.secondaryText;
        const key = `CUST_${i}_${displayLabel}`;
        targetSequence.push({
          key,
          label: displayLabel,
          subLabel: subLabel || `第${i + 1}项`,
        });
        rawTiles.push({
          id: `tile-cust-${i}`,
          originalIndex: i,
          displayText: displayLabel,
          secondaryText: subLabel,
          targetKey: key,
          isClicked: false,
        });
      }
      break;
    }

    case 'red_asc_black_desc': {
      // Gorbov Red-Black Attention Test: Red Ascending + Black Descending
      const pairs = Math.floor(count / 2);
      description = `格尔波夫红黑舒尔特：红升黑降交替 (红 1 ➔ 黑 ${pairs} ➔ 红 2 ➔ 黑 ${pairs - 1} ...)`;
      let r = 1;
      let b = pairs;
      let step = 0;

      while (r <= pairs || b >= 1) {
        if (r <= pairs) {
          const redKey = `GORBOV_R_${r}`;
          targetSequence.push({
            key: redKey,
            label: `${r}`,
            subLabel: '红升',
            colorTag: 'red',
          });
          rawTiles.push({
            id: `tile-gorbov-r-${r}`,
            originalIndex: step++,
            displayText: `${r}`,
            targetKey: redKey,
            colorTag: 'red',
            fontColor: '#dc2626',
            isClicked: false,
          });
          r++;
        }
        if (b >= 1) {
          const blackKey = `GORBOV_B_${b}`;
          targetSequence.push({
            key: blackKey,
            label: `${b}`,
            subLabel: '黑降',
            colorTag: 'black',
          });
          rawTiles.push({
            id: `tile-gorbov-b-${b}`,
            originalIndex: step++,
            displayText: `${b}`,
            targetKey: blackKey,
            colorTag: 'black',
            fontColor: '#0f172a',
            isClicked: false,
          });
          b--;
        }
      }

      if (rawTiles.length < count) {
        const extraNum = pairs + 1;
        const extraKey = `GORBOV_R_${extraNum}`;
        targetSequence.push({
          key: extraKey,
          label: `${extraNum}`,
          subLabel: '红尾',
          colorTag: 'red',
        });
        rawTiles.push({
          id: `tile-gorbov-extra`,
          originalIndex: step,
          displayText: `${extraNum}`,
          targetKey: extraKey,
          colorTag: 'red',
          fontColor: '#dc2626',
          isClicked: false,
        });
      }
      break;
    }

    case 'odd_even_switch': {
      description = '奇偶双轨交替寻数：奇 1 ➔ 偶 2 ➔ 奇 3 ➔ 偶 4 ...';
      for (let i = 1; i <= count; i++) {
        const isOdd = i % 2 === 1;
        const key = `SW_${i}`;
        targetSequence.push({
          key,
          label: String(i),
          subLabel: isOdd ? '奇数' : '偶数',
          colorTag: isOdd ? 'amber' : 'blue',
        });
        rawTiles.push({
          id: `tile-sw-${i}`,
          originalIndex: i - 1,
          displayText: String(i),
          targetKey: key,
          colorTag: isOdd ? 'amber' : 'blue',
          isClicked: false,
        });
      }
      break;
    }

    case 'symbols': {
      description = '几何星象特征辨识：按目标符号序列依次寻找，纯视觉知觉训练';
      for (let i = 0; i < count; i++) {
        const item = GEOMETRIC_SYMBOLS[i % GEOMETRIC_SYMBOLS.length];
        const loop = Math.floor(i / GEOMETRIC_SYMBOLS.length);
        const key = `SYM_${i}_${item.name}`;
        targetSequence.push({
          key,
          label: item.char,
          subLabel: item.name,
          colorTag: item.color,
        });
        rawTiles.push({
          id: `tile-sym-${i}`,
          originalIndex: i,
          displayText: item.char,
          secondaryText: loop > 0 ? `${item.name}${loop + 1}` : item.name,
          targetKey: key,
          fontColor: item.color,
          symbolIcon: item.char,
          isClicked: false,
        });
      }
      break;
    }

    case 'color_gradient': {
      description = '光谱色彩谱系训练：按彩虹光谱由赤红至青紫依次寻找';
      for (let i = 0; i < count; i++) {
        const item = SPECTRUM_COLORS[i % SPECTRUM_COLORS.length];
        const loop = Math.floor(i / SPECTRUM_COLORS.length);
        const key = `SPEC_${i}_${item.name}`;
        targetSequence.push({
          key,
          label: item.label,
          subLabel: item.name,
          colorTag: item.hex,
        });
        rawTiles.push({
          id: `tile-spec-${i}`,
          originalIndex: i,
          displayText: item.label,
          secondaryText: loop > 0 ? `第${loop + 1}轮` : undefined,
          targetKey: key,
          fontColor: '#ffffff',
          bgColor: item.hex,
          colorTag: item.hex,
          isClicked: false,
        });
      }
      break;
    }

    default: {
      description = `按正序依次寻找：1 至 ${count}`;
      for (let i = 1; i <= count; i++) {
        const key = String(i);
        targetSequence.push({ key, label: key });
        rawTiles.push({
          id: `tile-${i}`,
          originalIndex: i - 1,
          displayText: key,
          targetKey: key,
          isClicked: false
        });
      }
    }
  }

  // Shuffle the raw tiles using Fisher-Yates with the seeded or standard random
  const shuffled = [...rawTiles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 2. Assign spatial coordinates based on BoardShape
  const tiles: SchulteTile[] = assignShapeCoordinates(shuffled, size, shape, random);

  return {
    tiles,
    targetSequence,
    description
  };
}

/**
 * Assign coordinates (x, y in %) and geometry layout for various shapes
 */
function assignShapeCoordinates(
  tiles: Omit<SchulteTile, 'x' | 'y'>[],
  size: GridSize,
  shape: BoardShape,
  random: () => number
): SchulteTile[] {
  const count = tiles.length;

  if (shape === 'grid') {
    return tiles.map((tile, idx) => {
      const row = Math.floor(idx / size);
      const col = idx % size;
      const step = 100 / size;
      return {
        ...tile,
        x: (col + 0.5) * step,
        y: (row + 0.5) * step
      };
    });
  }

  if (shape === 'honeycomb') {
    // Staggered hexagonal rows
    return tiles.map((tile, idx) => {
      const row = Math.floor(idx / size);
      const col = idx % size;
      const xOffset = (row % 2 === 1) ? 25 / size : 0;
      const stepX = 100 / (size + 0.5);
      const stepY = 100 / (size + 0.2);
      return {
        ...tile,
        x: Math.min(95, Math.max(5, (col + 0.5) * stepX + xOffset)),
        y: Math.min(95, Math.max(5, (row + 0.5) * stepY))
      };
    });
  }

  if (shape === 'circle') {
    // Concentric radial rings around center (0 to N rings)
    // Center point is (50, 50)
    // Ring 0: 1 item (if odd), or rings with 6, 12, 18 items...
    const result: SchulteTile[] = [];
    const rings = Math.ceil(size / 1.5);
    const ringRadii: number[] = [];
    for (let r = 1; r <= rings; r++) {
      ringRadii.push((r / (rings + 0.3)) * 44); // max radius ~44%
    }

    // Distribute tiles proportionally across rings
    let tileIndex = 0;
    for (let r = 0; r < rings && tileIndex < count; r++) {
      const radius = ringRadii[r];
      // Tiles in this ring
      const remainingTiles = count - tileIndex;
      const remainingRings = rings - r;
      const countInRing = Math.min(
        remainingTiles,
        Math.max(4, Math.round(remainingTiles / remainingRings))
      );

      for (let i = 0; i < countInRing && tileIndex < count; i++) {
        const angle = (i / countInRing) * 2 * Math.PI - Math.PI / 2 + (r * 0.3);
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        result.push({
          ...tiles[tileIndex],
          x: Math.round(x * 10) / 10,
          y: Math.round(y * 10) / 10
        });
        tileIndex++;
      }
    }

    // Safety fallback if any leftover
    while (tileIndex < count) {
      result.push({
        ...tiles[tileIndex],
        x: 50,
        y: 50
      });
      tileIndex++;
    }

    return result;
  }

  if (shape === 'diamond') {
    // 45-degree diamond rotated coordinates
    return tiles.map((tile, idx) => {
      const row = Math.floor(idx / size);
      const col = idx % size;
      // Normal grid normalized -1 to +1
      const nx = (col / (size - 1) - 0.5) * 2;
      const ny = (row / (size - 1) - 0.5) * 2;
      // Rotate by 45 degrees: x' = (nx - ny) / sqrt(2), y' = (nx + ny) / sqrt(2)
      const rx = (nx - ny) / 1.414;
      const ry = (nx + ny) / 1.414;
      // Scale back to 10..90%
      const x = 50 + rx * 40;
      const y = 50 + ry * 40;
      return {
        ...tile,
        x: Math.min(94, Math.max(6, Math.round(x * 10) / 10)),
        y: Math.min(94, Math.max(6, Math.round(y * 10) / 10))
      };
    });
  }

  if (shape === 'triangle') {
    // Tiered pyramid layout
    // Row 0 has 1 tile, row 1 has 2 tiles...
    // Or segmented pyramid
    const result: SchulteTile[] = [];
    const rows = Math.ceil((Math.sqrt(1 + 8 * count) - 1) / 2);
    let tileIdx = 0;

    for (let r = 0; r < rows && tileIdx < count; r++) {
      const inThisRow = Math.min(r + 1, count - tileIdx);
      const y = 12 + (r / Math.max(1, rows - 1)) * 76;
      for (let c = 0; c < inThisRow && tileIdx < count; c++) {
        const offset = (c - (inThisRow - 1) / 2);
        const x = 50 + offset * (80 / Math.max(1, rows));
        result.push({
          ...tiles[tileIdx],
          x: Math.min(94, Math.max(6, Math.round(x * 10) / 10)),
          y: Math.min(94, Math.max(6, Math.round(y * 10) / 10))
        });
        tileIdx++;
      }
    }

    while (tileIdx < count) {
      result.push({
        ...tiles[tileIdx],
        x: 50,
        y: 50
      });
      tileIdx++;
    }

    return result;
  }

  if (shape === 'scatter') {
    // Organic constellation scatter with Poisson-like minimum distance
    const result: SchulteTile[] = [];
    const minDistance = 75 / Math.sqrt(count); // minimum distance in %

    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let placed = false;
      let px = 50;
      let py = 50;

      while (attempts < 60 && !placed) {
        attempts++;
        px = 8 + random() * 84;
        py = 8 + random() * 84;

        // Check distance against already placed tiles
        let collision = false;
        for (const existing of result) {
          const dx = px - (existing.x || 0);
          const dy = py - (existing.y || 0);
          if (Math.hypot(dx, dy) < minDistance * 0.75) {
            collision = true;
            break;
          }
        }
        if (!collision) {
          placed = true;
        }
      }

      result.push({
        ...tiles[i],
        x: Math.round(px * 10) / 10,
        y: Math.round(py * 10) / 10
      });
    }

    return result;
  }

  if (shape === 'heart') {
    // Parametric nested heart curves
    const result: SchulteTile[] = [];
    const layers = count <= 9 ? 1 : count <= 25 ? 2 : count <= 49 ? 3 : 4;
    const layerScales = layers === 1 ? [0.85] : layers === 2 ? [0.90, 0.52] : layers === 3 ? [0.92, 0.64, 0.35] : [0.94, 0.72, 0.48, 0.25];

    let tileIdx = 0;
    for (let l = 0; l < layers && tileIdx < count; l++) {
      const remainingTiles = count - tileIdx;
      const remainingLayers = layers - l;
      const inThisLayer = Math.min(
        remainingTiles,
        Math.max(3, Math.round(remainingTiles / remainingLayers))
      );

      const scale = layerScales[l];
      for (let i = 0; i < inThisLayer && tileIdx < count; i++) {
        const t = (i / inThisLayer) * 2 * Math.PI - Math.PI / 2;
        // Standard heart curve parametric equation
        const hx = Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16.5;
        
        const x = 50 + hx * 44 * scale;
        const y = 47 + (hy + 0.12) * 44 * scale;

        result.push({
          ...tiles[tileIdx],
          x: Math.min(94, Math.max(6, Math.round(x * 10) / 10)),
          y: Math.min(94, Math.max(6, Math.round(y * 10) / 10)),
        });
        tileIdx++;
      }
    }

    while (tileIdx < count) {
      result.push({ ...tiles[tileIdx], x: 50, y: 50 });
      tileIdx++;
    }
    return result;
  }

  if (shape === 'star') {
    // 5-Pointed Star layout with outer contour and inner core
    const result: SchulteTile[] = [];
    const layers = count <= 16 ? 1 : count <= 49 ? 2 : 3;
    const scales = layers === 1 ? [1.0] : layers === 2 ? [1.0, 0.5] : [1.0, 0.65, 0.35];

    let tileIdx = 0;
    for (let l = 0; l < layers && tileIdx < count; l++) {
      const remainingTiles = count - tileIdx;
      const remainingLayers = layers - l;
      const inThisLayer = Math.min(
        remainingTiles,
        Math.max(5, Math.round(remainingTiles / remainingLayers))
      );

      const scale = scales[l];
      const rOuter = 44 * scale;
      const rInner = 19 * scale;

      for (let i = 0; i < inThisLayer && tileIdx < count; i++) {
        // Continuous fraction around 10 star points
        const segProgress = (i / inThisLayer) * 10;
        const segIndex = Math.floor(segProgress);
        const frac = segProgress - segIndex;

        const a1 = -Math.PI / 2 + (segIndex * Math.PI) / 5;
        const a2 = -Math.PI / 2 + ((segIndex + 1) * Math.PI) / 5;
        const r1 = segIndex % 2 === 0 ? rOuter : rInner;
        const r2 = (segIndex + 1) % 2 === 0 ? rOuter : rInner;

        const p1x = 50 + r1 * Math.cos(a1);
        const p1y = 50 + r1 * Math.sin(a1);
        const p2x = 50 + r2 * Math.cos(a2);
        const p2y = 50 + r2 * Math.sin(a2);

        const x = p1x + (p2x - p1x) * frac;
        const y = p1y + (p2y - p1y) * frac;

        result.push({
          ...tiles[tileIdx],
          x: Math.min(94, Math.max(6, Math.round(x * 10) / 10)),
          y: Math.min(94, Math.max(6, Math.round(y * 10) / 10)),
        });
        tileIdx++;
      }
    }

    while (tileIdx < count) {
      result.push({ ...tiles[tileIdx], x: 50, y: 50 });
      tileIdx++;
    }
    return result;
  }

  if (shape === 'spiral') {
    // Archimedean Spiral from center outwards
    const result: SchulteTile[] = [];
    const totalTurns = count <= 16 ? 2.5 : count <= 36 ? 3.5 : 4.5;
    const maxRadius = 43;
    const minRadius = 8;

    for (let i = 0; i < count; i++) {
      // Non-linear progression for balanced spacing
      const t = (i + 0.5) / count;
      const r = minRadius + Math.pow(t, 0.68) * (maxRadius - minRadius);
      const angle = -Math.PI / 2 + t * totalTurns * 2 * Math.PI;

      const x = 50 + r * Math.cos(angle);
      const y = 50 + r * Math.sin(angle);

      result.push({
        ...tiles[i],
        x: Math.min(94, Math.max(6, Math.round(x * 10) / 10)),
        y: Math.min(94, Math.max(6, Math.round(y * 10) / 10)),
      });
    }
    return result;
  }

  if (shape === 'butterfly') {
    // Dual Wing Lemniscate / Butterfly silhouette
    const result: SchulteTile[] = [];
    const bodyTiles = Math.max(1, Math.min(5, Math.floor(count * 0.12)));
    const wingTiles = count - bodyTiles;
    const leftWingCount = Math.ceil(wingTiles / 2);
    const rightWingCount = wingTiles - leftWingCount;

    let tileIdx = 0;
    // Left Wing
    for (let i = 0; i < leftWingCount && tileIdx < count; i++) {
      const t = (i / leftWingCount) * 2 * Math.PI;
      // Wing profile
      const rw = 16 + 7 * Math.cos(t) + 5 * Math.sin(2 * t);
      const x = 28 + rw * Math.cos(t) * 0.85;
      const y = 50 + rw * Math.sin(t) * 1.15;
      result.push({
        ...tiles[tileIdx],
        x: Math.min(46, Math.max(6, Math.round(x * 10) / 10)),
        y: Math.min(94, Math.max(6, Math.round(y * 10) / 10)),
      });
      tileIdx++;
    }

    // Central Body
    for (let i = 0; i < bodyTiles && tileIdx < count; i++) {
      const y = bodyTiles === 1 ? 50 : 25 + (i / (bodyTiles - 1)) * 50;
      result.push({
        ...tiles[tileIdx],
        x: 50,
        y: Math.round(y * 10) / 10,
      });
      tileIdx++;
    }

    // Right Wing (Mirrored)
    for (let i = 0; i < rightWingCount && tileIdx < count; i++) {
      const t = (i / rightWingCount) * 2 * Math.PI;
      const rw = 16 + 7 * Math.cos(t) + 5 * Math.sin(2 * t);
      const leftX = 28 + rw * Math.cos(t) * 0.85;
      const x = 50 + (50 - leftX); // mirror
      const y = 50 + rw * Math.sin(t) * 1.15;
      result.push({
        ...tiles[tileIdx],
        x: Math.min(94, Math.max(54, Math.round(x * 10) / 10)),
        y: Math.min(94, Math.max(6, Math.round(y * 10) / 10)),
      });
      tileIdx++;
    }

    while (tileIdx < count) {
      result.push({ ...tiles[tileIdx], x: 50, y: 50 });
      tileIdx++;
    }
    return result;
  }

  if (shape === 'cross') {
    // Cross / Quadrant pattern (vertical and horizontal arms)
    const result: SchulteTile[] = [];
    const armTiles = Math.floor(count / 4);
    const centerRemaining = count - armTiles * 4;

    let tileIdx = 0;
    // North Arm (y from 8 to 40, x centered)
    for (let i = 0; i < armTiles && tileIdx < count; i++) {
      const y = 8 + (i / Math.max(1, armTiles - 0.5)) * 32;
      const x = 50 + (armTiles > 6 && i % 2 === 1 ? (i % 4 === 1 ? -6 : 6) : 0);
      result.push({ ...tiles[tileIdx], x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
      tileIdx++;
    }
    // South Arm (y from 60 to 92, x centered)
    for (let i = 0; i < armTiles && tileIdx < count; i++) {
      const y = 60 + (i / Math.max(1, armTiles - 0.5)) * 32;
      const x = 50 + (armTiles > 6 && i % 2 === 1 ? (i % 4 === 1 ? -6 : 6) : 0);
      result.push({ ...tiles[tileIdx], x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
      tileIdx++;
    }
    // West Arm (x from 8 to 40, y centered)
    for (let i = 0; i < armTiles && tileIdx < count; i++) {
      const x = 8 + (i / Math.max(1, armTiles - 0.5)) * 32;
      const y = 50 + (armTiles > 6 && i % 2 === 1 ? (i % 4 === 1 ? -6 : 6) : 0);
      result.push({ ...tiles[tileIdx], x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
      tileIdx++;
    }
    // East Arm (x from 60 to 92, y centered)
    for (let i = 0; i < armTiles && tileIdx < count; i++) {
      const x = 60 + (i / Math.max(1, armTiles - 0.5)) * 32;
      const y = 50 + (armTiles > 6 && i % 2 === 1 ? (i % 4 === 1 ? -6 : 6) : 0);
      result.push({ ...tiles[tileIdx], x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
      tileIdx++;
    }
    // Center Hub (around 50, 50)
    for (let i = 0; i < centerRemaining && tileIdx < count; i++) {
      const angle = (i / Math.max(1, centerRemaining)) * 2 * Math.PI;
      const rad = centerRemaining === 1 ? 0 : 7;
      result.push({
        ...tiles[tileIdx],
        x: Math.round((50 + rad * Math.cos(angle)) * 10) / 10,
        y: Math.round((50 + rad * Math.sin(angle)) * 10) / 10,
      });
      tileIdx++;
    }

    while (tileIdx < count) {
      result.push({ ...tiles[tileIdx], x: 50, y: 50 });
      tileIdx++;
    }
    return result;
  }

  if (shape === 'wave') {
    // Serpentine sinusoidal wave (S-curve stream)
    const result: SchulteTile[] = [];
    const ribbons = count <= 25 ? 1 : count <= 49 ? 2 : 3;

    for (let i = 0; i < count; i++) {
      const ribbonIdx = i % ribbons;
      const stepInRibbon = Math.floor(i / ribbons);
      const totalSteps = Math.ceil(count / ribbons);

      const progress = (stepInRibbon + 0.5) / totalSteps;
      const y = 8 + progress * 84;
      const baseWave = 50 + 34 * Math.sin(progress * 2.8 * Math.PI);
      const ribbonOffset = (ribbonIdx - (ribbons - 1) / 2) * 11;
      const x = baseWave + ribbonOffset;

      result.push({
        ...tiles[i],
        x: Math.min(94, Math.max(6, Math.round(x * 10) / 10)),
        y: Math.min(94, Math.max(6, Math.round(y * 10) / 10)),
      });
    }
    return result;
  }

  if (shape === 'crescent') {
    // Crescent Moon curved arc
    const result: SchulteTile[] = [];
    const layers = count <= 16 ? 1 : count <= 36 ? 2 : 3;

    let tileIdx = 0;
    for (let l = 0; l < layers && tileIdx < count; l++) {
      const remainingTiles = count - tileIdx;
      const remainingLayers = layers - l;
      const inThisLayer = Math.min(
        remainingTiles,
        Math.max(4, Math.round(remainingTiles / remainingLayers))
      );

      const layerOffset = (l / Math.max(1, layers - 1 || 1)) * 12;
      for (let i = 0; i < inThisLayer && tileIdx < count; i++) {
        // Arc from top to bottom on left-center
        const t = (i / Math.max(1, inThisLayer - 1)) * Math.PI * 0.85 - Math.PI * 0.425;
        // Crescent thickness profile: thickest in center (cos(t))
        const thickness = Math.cos(t) * (14 - layerOffset);
        const radius = 38 - layerOffset;

        const x = 58 - radius * Math.cos(t) + thickness;
        const y = 50 + radius * 1.15 * Math.sin(t);

        result.push({
          ...tiles[tileIdx],
          x: Math.min(94, Math.max(6, Math.round(x * 10) / 10)),
          y: Math.min(94, Math.max(6, Math.round(y * 10) / 10)),
        });
        tileIdx++;
      }
    }

    while (tileIdx < count) {
      result.push({ ...tiles[tileIdx], x: 50, y: 50 });
      tileIdx++;
    }
    return result;
  }

  if (shape === 'irregular') {
    // Amorphous organic blob with pebble-like coordinates & random soft scale
    const result: SchulteTile[] = [];
    const minDistance = 72 / Math.sqrt(count);

    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let placed = false;
      let px = 50;
      let py = 50;

      while (attempts < 80 && !placed) {
        attempts++;
        const angle = random() * 2 * Math.PI;
        // Multi-frequency organic boundary
        const boundaryR =
          36 +
          8 * Math.sin(3 * angle + 0.7) +
          5 * Math.cos(5 * angle - 0.4) +
          4 * Math.sin(2 * angle + 1.2);
        
        // Random distance inside boundary
        const rad = Math.sqrt(random()) * boundaryR;
        px = 50 + rad * Math.cos(angle);
        py = 50 + rad * Math.sin(angle);

        // Collision check
        let collision = false;
        for (const existing of result) {
          const dx = px - (existing.x || 0);
          const dy = py - (existing.y || 0);
          if (Math.hypot(dx, dy) < minDistance * 0.72) {
            collision = true;
            break;
          }
        }
        if (!collision) {
          placed = true;
        }
      }

      // Slightly perturb tile size for pebble organic look
      const sizeMultiplier = Math.round((0.92 + random() * 0.18) * 100) / 100;

      result.push({
        ...tiles[i],
        x: Math.min(94, Math.max(6, Math.round(px * 10) / 10)),
        y: Math.min(94, Math.max(6, Math.round(py * 10) / 10)),
        sizeMultiplier,
      });
    }
    return result;
  }

  return tiles.map((t) => ({ ...t, x: 50, y: 50 }));
}
