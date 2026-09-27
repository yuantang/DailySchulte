import { CustomDeck, CustomDeckItem, GridSize } from '../types';

const STORAGE_KEY = 'schulte_custom_decks_v1';
const ACTIVE_DECK_KEY = 'schulte_active_custom_deck_id_v1';

export const PRESET_DECKS: CustomDeck[] = [
  {
    id: 'preset-postgrad-en',
    title: '考研英语核心高频词汇',
    category: 'english',
    rawContent: `abandon 放弃
ability 能力
abnormal 异常
abolish 废除
abrupt 突然
abstract 抽象
absurd 荒谬
abundance 丰富
academic 学术
accelerate 加速
access 通道
accommodate 容纳
accomplish 完成
accurate 准确
accuse 指控
achieve 达到
acknowledge 承认
acquire 获取
adapt 适应
adequate 充足
adhere 坚持
adjust 调整
administration 管理
admire 钦佩
adopt 采纳`,
    items: [
      { text: 'abandon', secondaryText: '放弃' },
      { text: 'ability', secondaryText: '能力' },
      { text: 'abnormal', secondaryText: '异常' },
      { text: 'abolish', secondaryText: '废除' },
      { text: 'abrupt', secondaryText: '突然' },
      { text: 'abstract', secondaryText: '抽象' },
      { text: 'absurd', secondaryText: '荒谬' },
      { text: 'abundance', secondaryText: '丰富' },
      { text: 'academic', secondaryText: '学术' },
      { text: 'accelerate', secondaryText: '加速' },
      { text: 'access', secondaryText: '通道' },
      { text: 'accommodate', secondaryText: '容纳' },
      { text: 'accomplish', secondaryText: '完成' },
      { text: 'accurate', secondaryText: '准确' },
      { text: 'accuse', secondaryText: '指控' },
      { text: 'achieve', secondaryText: '达到' },
      { text: 'acknowledge', secondaryText: '承认' },
      { text: 'acquire', secondaryText: '获取' },
      { text: 'adapt', secondaryText: '适应' },
      { text: 'adequate', secondaryText: '充足' },
      { text: 'adhere', secondaryText: '坚持' },
      { text: 'adjust', secondaryText: '调整' },
      { text: 'administration', secondaryText: '管理' },
      { text: 'admire', secondaryText: '钦佩' },
      { text: 'adopt', secondaryText: '采纳' },
    ],
    recommendedSize: 5,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'preset-ancient-chinese',
    title: '必背古文名句·岳阳楼记',
    category: 'chinese',
    rawContent: '先天下之忧而忧后天下之乐而乐范仲淹岳阳楼记名篇清绝',
    items: [
      { text: '先', secondaryText: '第1句' },
      { text: '天', secondaryText: '第1句' },
      { text: '下', secondaryText: '第1句' },
      { text: '之', secondaryText: '第1句' },
      { text: '忧', secondaryText: '第1句' },
      { text: '而', secondaryText: '第1句' },
      { text: '忧', secondaryText: '第1句' },
      { text: '后', secondaryText: '第2句' },
      { text: '天', secondaryText: '第2句' },
      { text: '下', secondaryText: '第2句' },
      { text: '之', secondaryText: '第2句' },
      { text: '乐', secondaryText: '第2句' },
      { text: '而', secondaryText: '第2句' },
      { text: '乐', secondaryText: '第2句' },
      { text: '范', secondaryText: '作者' },
      { text: '仲', secondaryText: '作者' },
      { text: '淹', secondaryText: '作者' },
      { text: '岳', secondaryText: '篇目' },
      { text: '阳', secondaryText: '篇目' },
      { text: '楼', secondaryText: '篇目' },
      { text: '记', secondaryText: '篇目' },
      { text: '千', secondaryText: '警句' },
      { text: '古', secondaryText: '警句' },
      { text: '名', secondaryText: '警句' },
      { text: '篇', secondaryText: '警句' },
    ],
    recommendedSize: 5,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'preset-toefl-academic',
    title: '托福/雅思学科高频核心词',
    category: 'english',
    rawContent: `catalyst 催化剂;促成因素
hypothesis 假说;猜想
paradigm 范式;典范
cognitive 认知的
ecosystem 生态系统
empirical 经验主义的
biodiversity 生物多样性
mitigate 缓解;减轻
volatile 易挥发的;不稳定的
resilient 有弹性的;坚韧的
ubiquitous 无所不在的
pragmatic 务实的;讲究实效的
synthesis 综合;合成
arbitrary 任意的;武断的
ambiguous 模棱两可的
equilibrium 平衡状态
infrastructure 基础设施
phenomenon 现象
hierarchy 层级结构;阶层
precedent 先例;前例
coincide 同时发生;巧合
intrinsic 内在的;固有的
scrutinize 仔细审查
fluctuate 波动;起伏
prevalent 普遍的;盛行的`,
    items: [
      { text: 'catalyst', secondaryText: '催化剂' },
      { text: 'hypothesis', secondaryText: '假说' },
      { text: 'paradigm', secondaryText: '范式' },
      { text: 'cognitive', secondaryText: '认知的' },
      { text: 'ecosystem', secondaryText: '生态系统' },
      { text: 'empirical', secondaryText: '经验主义' },
      { text: 'biodiversity', secondaryText: '生物多样' },
      { text: 'mitigate', secondaryText: '缓解减轻' },
      { text: 'volatile', secondaryText: '易挥发波动' },
      { text: 'resilient', secondaryText: '坚韧复原' },
      { text: 'ubiquitous', secondaryText: '无所不在' },
      { text: 'pragmatic', secondaryText: '务实求真' },
      { text: 'synthesis', secondaryText: '综合合成' },
      { text: 'arbitrary', secondaryText: '任意武断' },
      { text: 'ambiguous', secondaryText: '模棱两可' },
      { text: 'equilibrium', secondaryText: '平衡状态' },
      { text: 'infrastructure', secondaryText: '基础设施' },
      { text: 'phenomenon', secondaryText: '自然现象' },
      { text: 'hierarchy', secondaryText: '层级结构' },
      { text: 'precedent', secondaryText: '历史先例' },
      { text: 'coincide', secondaryText: '巧合发生' },
      { text: 'intrinsic', secondaryText: '内在固有' },
      { text: 'scrutinize', secondaryText: '精细审查' },
      { text: 'fluctuate', secondaryText: '波动起伏' },
      { text: 'prevalent', secondaryText: '盛行普遍' },
    ],
    recommendedSize: 5,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'preset-tengwangge',
    title: '必背传世骈文·滕王阁序',
    category: 'chinese',
    rawContent: '落霞与孤鹜齐飞秋水共长天一色渔舟唱晚响穷彭蠡之滨雁阵惊寒声断衡阳之浦',
    items: [
      { text: '落', secondaryText: '落霞齐飞' },
      { text: '霞', secondaryText: '落霞齐飞' },
      { text: '与', secondaryText: '落霞齐飞' },
      { text: '孤', secondaryText: '落霞齐飞' },
      { text: '鹜', secondaryText: '落霞齐飞' },
      { text: '齐', secondaryText: '落霞齐飞' },
      { text: '飞', secondaryText: '落霞齐飞' },
      { text: '秋', secondaryText: '秋水长天' },
      { text: '水', secondaryText: '秋水长天' },
      { text: '共', secondaryText: '秋水长天' },
      { text: '长', secondaryText: '秋水长天' },
      { text: '天', secondaryText: '秋水长天' },
      { text: '一', secondaryText: '秋水长天' },
      { text: '色', secondaryText: '秋水长天' },
      { text: '渔', secondaryText: '渔舟唱晚' },
      { text: '舟', secondaryText: '渔舟唱晚' },
      { text: '唱', secondaryText: '渔舟唱晚' },
      { text: '晚', secondaryText: '渔舟唱晚' },
      { text: '响', secondaryText: '渔舟唱晚' },
      { text: '穷', secondaryText: '渔舟唱晚' },
      { text: '彭', secondaryText: '彭蠡之滨' },
      { text: '蠡', secondaryText: '彭蠡之滨' },
      { text: '之', secondaryText: '彭蠡之滨' },
      { text: '滨', secondaryText: '彭蠡之滨' },
      { text: '雁', secondaryText: '雁阵惊寒' },
      { text: '阵', secondaryText: '雁阵惊寒' },
      { text: '惊', secondaryText: '雁阵惊寒' },
      { text: '寒', secondaryText: '雁阵惊寒' },
      { text: '声', secondaryText: '衡阳之浦' },
      { text: '断', secondaryText: '衡阳之浦' },
      { text: '衡', secondaryText: '衡阳之浦' },
      { text: '阳', secondaryText: '衡阳之浦' },
      { text: '之', secondaryText: '衡阳之浦' },
      { text: '浦', secondaryText: '衡阳之浦' },
      { text: '名', secondaryText: '千古骈俪' },
      { text: '篇', secondaryText: '千古骈俪' },
    ],
    recommendedSize: 6,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'preset-idioms-chain',
    title: '常用经典成语连环记忆',
    category: 'chinese',
    rawContent: `一心一意 专心致志
两全其美 各得其所
三足鼎立 稳固抗衡
四海为家 志在四方
五谷丰登 岁稔年丰
六六大顺 万事顺遂
七星高照 福星高照
八面威风 气势雄浑
九霄云外 荡然无存
十全十美 无懈可击
百折不挠 坚忍不拔
千锤百炼 精益求精
万象更新 生机盎然
自强不息 奋发向上
敏而好学 乐在其中
博闻强识 见多识广`,
    items: [
      { text: '一心一意', secondaryText: '专心致志' },
      { text: '两全其美', secondaryText: '各得其所' },
      { text: '三足鼎立', secondaryText: '稳固抗衡' },
      { text: '四海为家', secondaryText: '志在四方' },
      { text: '五谷丰登', secondaryText: '岁稔年丰' },
      { text: '六六大顺', secondaryText: '万事顺遂' },
      { text: '七星高照', secondaryText: '福星高照' },
      { text: '八面威风', secondaryText: '气势雄浑' },
      { text: '九霄云外', secondaryText: '荡然无存' },
      { text: '十全十美', secondaryText: '无懈可击' },
      { text: '百折不挠', secondaryText: '坚忍不拔' },
      { text: '千锤百炼', secondaryText: '精益求精' },
      { text: '万象更新', secondaryText: '生机盎然' },
      { text: '自强不息', secondaryText: '奋发向上' },
      { text: '敏而好学', secondaryText: '乐在其中' },
      { text: '博闻强识', secondaryText: '见多识广' },
    ],
    recommendedSize: 4,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'preset-periodic-table',
    title: '化学元素周期表前25号',
    category: 'science',
    rawContent: `H 氢
He 氦
Li 锂
Be 铍
B 硼
C 碳
N 氮
O 氧
F 氟
Ne 氖
Na 钠
Mg 镁
Al 铝
Si 硅
P 磷
S 硫
Cl 氯
Ar 氩
K 钾
Ca 钙
Sc 钪
Ti 钛
V 钒
Cr 铬
Mn 锰`,
    items: [
      { text: 'H', secondaryText: '1号 氢' },
      { text: 'He', secondaryText: '2号 氦' },
      { text: 'Li', secondaryText: '3号 锂' },
      { text: 'Be', secondaryText: '4号 铍' },
      { text: 'B', secondaryText: '5号 硼' },
      { text: 'C', secondaryText: '6号 碳' },
      { text: 'N', secondaryText: '7号 氮' },
      { text: 'O', secondaryText: '8号 氧' },
      { text: 'F', secondaryText: '9号 氟' },
      { text: 'Ne', secondaryText: '10号 氖' },
      { text: 'Na', secondaryText: '11号 钠' },
      { text: 'Mg', secondaryText: '12号 镁' },
      { text: 'Al', secondaryText: '13号 铝' },
      { text: 'Si', secondaryText: '14号 硅' },
      { text: 'P', secondaryText: '15号 磷' },
      { text: 'S', secondaryText: '16号 硫' },
      { text: 'Cl', secondaryText: '17号 氯' },
      { text: 'Ar', secondaryText: '18号 氩' },
      { text: 'K', secondaryText: '19号 钾' },
      { text: 'Ca', secondaryText: '20号 钙' },
      { text: 'Sc', secondaryText: '21号 钪' },
      { text: 'Ti', secondaryText: '22号 钛' },
      { text: 'V', secondaryText: '23号 钒' },
      { text: 'Cr', secondaryText: '24号 铬' },
      { text: 'Mn', secondaryText: '25号 锰' },
    ],
    recommendedSize: 5,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'preset-medical-clinical',
    title: '临床医学常见病症词库',
    category: 'science',
    rawContent: `心肌梗死 急重症
脑卒中 神经内科
糖尿病 内分泌科
高血压 心血管内科
大叶性肺炎 呼吸内科
支气管哮喘 变态反应
缺铁性贫血 血液科
急性胰腺炎 消化内科
肝硬化 消化内科
慢性肾衰竭 肾内科
脓毒败血症 重症医学
急性阑尾炎 普通外科
病毒脑膜炎 感染科
急性痛风 风湿免疫
结石胆囊炎 肝胆外科
甲状腺机能亢进 内分泌科`,
    items: [
      { text: '心肌梗死', secondaryText: '急重症' },
      { text: '脑卒中', secondaryText: '神经内科' },
      { text: '糖尿病', secondaryText: '内分泌科' },
      { text: '高血压', secondaryText: '心血管内科' },
      { text: '大叶肺炎', secondaryText: '呼吸内科' },
      { text: '支气管哮喘', secondaryText: '变态反应' },
      { text: '缺铁性贫血', secondaryText: '血液科' },
      { text: '急性胰腺炎', secondaryText: '消化内科' },
      { text: '肝硬化', secondaryText: '消化内科' },
      { text: '慢性肾衰', secondaryText: '肾内科' },
      { text: '脓毒败血症', secondaryText: '重症医学' },
      { text: '急性阑尾炎', secondaryText: '普通外科' },
      { text: '病毒脑膜炎', secondaryText: '感染科' },
      { text: '急性痛风', secondaryText: '风湿免疫' },
      { text: '结石胆囊炎', secondaryText: '肝胆外科' },
      { text: '甲状腺亢进', secondaryText: '内分泌科' },
    ],
    recommendedSize: 4,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
];

/**
 * Recommend optimal grid size for a given count of items
 */
export function recommendGridSize(count: number): GridSize {
  if (count <= 9) return 3;
  if (count <= 16) return 4;
  if (count <= 25) return 5;
  if (count <= 36) return 6;
  if (count <= 49) return 7;
  if (count <= 64) return 8;
  return 9;
}

/**
 * Smart parser for custom user text
 */
export function parseCustomInput(
  raw: string,
  mode: 'auto' | 'lines' | 'characters' | 'spaces' = 'auto'
): CustomDeckItem[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  // Check if user pasted a JSON array of items or full deck
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (typeof parsed[0] === 'string') {
          return parsed.map((item: string, idx: number) => ({
            text: String(item),
            secondaryText: `第${idx + 1}项`,
          }));
        } else if (parsed[0] && typeof parsed[0] === 'object' && parsed[0].text) {
          return parsed.map((item: any) => ({
            text: String(item.text),
            secondaryText: item.secondaryText ? String(item.secondaryText) : undefined,
          }));
        }
      }
    } catch {
      // Fall through to regular parsers
    }
  }

  // Determine parse mode if auto
  let selectedMode = mode;
  if (selectedMode === 'auto') {
    const lines = trimmed.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length >= 4) {
      selectedMode = 'lines';
    } else if (trimmed.includes(',') || trimmed.includes('，') || trimmed.includes('、') || trimmed.includes(';')) {
      selectedMode = 'spaces';
    } else {
      selectedMode = 'characters';
    }
  }

  if (selectedMode === 'lines') {
    const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
    return lines.map((line, idx) => {
      // Match first delimiter: tab, colon, dash, equal sign, or whitespace
      const firstDelimIdx = line.search(/[:：=＝\t\-—－]|\s+/);
      if (firstDelimIdx > 0) {
        const text = line.slice(0, firstDelimIdx).trim();
        const rest = line.slice(firstDelimIdx).replace(/^[:：=＝\t\-—－\s]+/, '').trim();
        if (text && rest) {
          return { text, secondaryText: rest };
        }
      }
      return { text: line, secondaryText: `第${idx + 1}项` };
    });
  }

  if (selectedMode === 'spaces') {
    const tokens = trimmed
      .split(/[,，、;；\s\n\t]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    return tokens.map((token, idx) => ({
      text: token,
      secondaryText: `第${idx + 1}项`,
    }));
  }

  // Character by character (ideal for Chinese poems, passages, formulas)
  // Sentence-aware slicing: splits text by line or sentence delimiters first
  const sentenceDelimiters = /[\n\r,，。！？!?;；]/;
  const rawSentences = trimmed.split(sentenceDelimiters).map((s) => s.trim()).filter(Boolean);

  if (rawSentences.length > 1) {
    const items: CustomDeckItem[] = [];
    rawSentences.forEach((sentence, sIdx) => {
      const cleanChars = sentence.replace(/[\s\t、“”"':：;；（）()《》—－]/g, '');
      for (let i = 0; i < cleanChars.length; i++) {
        items.push({
          text: cleanChars[i],
          secondaryText: `第${sIdx + 1}句`,
        });
      }
    });
    if (items.length > 0) return items;
  }

  // Fallback flat character slicing
  const cleanChars = trimmed.replace(/[\s\r\n\t,，。！？、“”"':：;；（）()《》—－]/g, '');
  const items: CustomDeckItem[] = [];
  for (let i = 0; i < cleanChars.length; i++) {
    items.push({
      text: cleanChars[i],
      secondaryText: `第${i + 1}字`,
    });
  }
  return items;
}

/**
 * Get all stored decks (built-ins + user created)
 */
export function getStoredCustomDecks(): CustomDeck[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...PRESET_DECKS];
    const userDecks: CustomDeck[] = JSON.parse(raw);
    return [...userDecks, ...PRESET_DECKS];
  } catch {
    return [...PRESET_DECKS];
  }
}

/**
 * Save user custom deck
 */
export function saveCustomDeck(deck: Omit<CustomDeck, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): CustomDeck {
  const existing = getStoredUserOnlyDecks();
  const now = new Date().toISOString();

  if (deck.id) {
    const index = existing.findIndex((d) => d.id === deck.id);
    if (index >= 0) {
      const updated: CustomDeck = {
        ...existing[index],
        ...deck,
        id: deck.id,
        updatedAt: now,
      };
      existing[index] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      setActiveCustomDeckId(updated.id);
      return updated;
    }
  }

  const newDeck: CustomDeck = {
    ...deck,
    id: `custom-deck-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  const updatedList = [newDeck, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  setActiveCustomDeckId(newDeck.id);
  return newDeck;
}

function getStoredUserOnlyDecks(): CustomDeck[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteCustomDeck(id: string): void {
  const existing = getStoredUserOnlyDecks();
  const updated = existing.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getActiveCustomDeckId(): string {
  try {
    return localStorage.getItem(ACTIVE_DECK_KEY) || PRESET_DECKS[0].id;
  } catch {
    return PRESET_DECKS[0].id;
  }
}

export function setActiveCustomDeckId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_DECK_KEY, id);
  } catch {
    // ignore
  }
}

export function getActiveCustomDeck(): CustomDeck {
  const activeId = getActiveCustomDeckId();
  const allDecks = getStoredCustomDecks();
  return allDecks.find((d) => d.id === activeId) || PRESET_DECKS[0];
}
