import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  Check,
  X,
  Play,
  Trash2,
  Plus,
  FileText,
  FolderOpen,
  Layers,
  ArrowRight,
  Download,
  Upload,
  Copy,
  SlidersHorizontal,
} from 'lucide-react';
import { CustomDeck, CustomDeckItem, GridSize } from '../types';
import {
  PRESET_DECKS,
  getStoredCustomDecks,
  saveCustomDeck,
  deleteCustomDeck,
  parseCustomInput,
  recommendGridSize,
  setActiveCustomDeckId,
} from '../utils/customDecks';

interface CustomContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAndStart: (deck: CustomDeck, recommendedSize: GridSize) => void;
}

export const CustomContentModal: React.FC<CustomContentModalProps> = ({
  isOpen,
  onClose,
  onSelectAndStart,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'library'>('create');
  const [allDecks, setAllDecks] = useState<CustomDeck[]>([]);

  // Form State
  const [title, setTitle] = useState('');
  const [rawText, setRawText] = useState('');
  const [parseMode, setParseMode] = useState<'auto' | 'lines' | 'characters' | 'spaces'>('lines');
  const [category, setCategory] = useState<'english' | 'chinese' | 'science' | 'custom'>('english');
  const [customSizeOverride, setCustomSizeOverride] = useState<GridSize | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Load stored decks on open
  useEffect(() => {
    if (isOpen) {
      setAllDecks(getStoredCustomDecks());
    }
  }, [isOpen]);

  // Real-time parsed items
  const parsedItems: CustomDeckItem[] = useMemo(() => {
    return parseCustomInput(rawText, parseMode);
  }, [rawText, parseMode]);

  const recommendedSize = useMemo(() => {
    return recommendGridSize(parsedItems.length || 25);
  }, [parsedItems.length]);

  const effectiveSize = customSizeOverride || recommendedSize;

  // Load a preset or existing deck into the editor
  const handleLoadDeck = (deck: CustomDeck) => {
    setTitle(deck.title);
    setRawText(deck.rawContent);
    setCategory(deck.category);
    setCustomSizeOverride(deck.recommendedSize);
    setActiveTab('create');
    showToast(`已载入《${deck.title}》模板`);
  };

  const handleSaveOnly = () => {
    if (!title.trim() || parsedItems.length === 0) return;
    saveCustomDeck({
      title: title.trim(),
      category,
      rawContent: rawText,
      items: parsedItems,
      recommendedSize: effectiveSize,
    });
    setAllDecks(getStoredCustomDecks());
    setActiveTab('library');
    showToast('题库保存成功！');
  };

  const handleSaveAndLaunch = () => {
    if (!title.trim() || parsedItems.length === 0) return;
    const saved = saveCustomDeck({
      title: title.trim(),
      category,
      rawContent: rawText,
      items: parsedItems,
      recommendedSize: effectiveSize,
    });
    setAllDecks(getStoredCustomDecks());
    setActiveCustomDeckId(saved.id);
    onSelectAndStart(saved, effectiveSize);
    onClose();
  };

  const handleDeleteDeck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomDeck(id);
    setAllDecks(getStoredCustomDecks());
    showToast('题库已删除');
  };

  // Copy deck data as JSON
  const handleCopyDeckJson = (deck: CustomDeck, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const dataStr = JSON.stringify(deck, null, 2);
      navigator.clipboard.writeText(dataStr);
      showToast(`已复制《${deck.title}》JSON数据`);
    } catch {
      showToast('复制失败，请手动选择');
    }
  };

  // Import JSON Deck
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        // Plain items array
        const items = parseCustomInput(jsonInput);
        setRawText(items.map((i) => (i.secondaryText ? `${i.text} ${i.secondaryText}` : i.text)).join('\n'));
        setTitle('导入题库 ' + new Date().toLocaleDateString());
        setParseMode('lines');
        setShowJsonImport(false);
        showToast(`成功解析 ${items.length} 条数据`);
      } else if (parsed && parsed.title && parsed.items) {
        setTitle(parsed.title);
        setRawText(parsed.rawContent || parsed.items.map((i: any) => `${i.text} ${i.secondaryText || ''}`).join('\n'));
        setCategory(parsed.category || 'custom');
        if (parsed.recommendedSize) setCustomSizeOverride(parsed.recommendedSize);
        setShowJsonImport(false);
        showToast(`成功导入《${parsed.title}》`);
      } else {
        showToast('JSON 格式未识别，请检查');
      }
    } catch {
      showToast('JSON 解析错误，请检查语法');
    }
  };

  // Quick fill samples
  const handleFillSample = (sampleType: 'en_postgrad' | 'en_toefl' | 'poem' | 'prose') => {
    if (sampleType === 'en_postgrad') {
      const p = PRESET_DECKS.find((d) => d.id === 'preset-postgrad-en');
      if (p) handleLoadDeck(p);
    } else if (sampleType === 'en_toefl') {
      const p = PRESET_DECKS.find((d) => d.id === 'preset-toefl-academic');
      if (p) handleLoadDeck(p);
    } else if (sampleType === 'poem') {
      const p = PRESET_DECKS.find((d) => d.id === 'preset-ancient-chinese');
      if (p) handleLoadDeck(p);
    } else if (sampleType === 'prose') {
      const p = PRESET_DECKS.find((d) => d.id === 'preset-tengwangge');
      if (p) handleLoadDeck(p);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden pb-safe">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <span>自定义题库导入 / UGC 生成器</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                  背词神器
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                背英语单词 · 背古文诗词 · 医学/考点词条，一键生成舒尔特深度训练盘面
              </p>
            </div>
          </div>
          <button
            id="btn-close-custom-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 bg-slate-50/70">
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'create'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新建导入 / 编辑</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'library'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>题库库藏 ({allDecks.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowJsonImport(!showJsonImport)}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3 h-3 text-amber-600" />
              <span>JSON导入</span>
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="mx-4 mt-2 p-2 rounded-xl bg-slate-900 text-amber-400 text-xs text-center font-bold animate-in fade-in duration-150">
            {toastMsg}
          </div>
        )}

        {/* JSON Import Drawer / Box */}
        {showJsonImport && (
          <div className="p-4 bg-amber-50/70 border-b border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>粘贴 JSON 题库数据或单词数组</span>
              <button
                type="button"
                onClick={() => setShowJsonImport(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                收起
              </button>
            </div>
            <textarea
              rows={3}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[{"text":"apple","secondaryText":"苹果"},{"text":"banana","secondaryText":"香蕉"}] 或 ["apple","banana"...]'
              className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl font-mono"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleImportJson}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
              >
                立即导入解析
              </button>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 max-h-[62vh]">
          {activeTab === 'create' ? (
            <div className="space-y-4">
              {/* Presets Quick Load Row */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    官方精选背词/背文题库 (点击一键载入)
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-amber-700 font-medium">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>即选即练</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {PRESET_DECKS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleLoadDeck(preset)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/70 text-slate-700 text-xs font-medium transition-all cursor-pointer shadow-2xs group"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-slate-800">{preset.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({preset.items.length}项 · {preset.recommendedSize}×{preset.recommendedSize})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Category Input */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">题库名称</label>
                  <input
                    type="text"
                    placeholder="例如：考研高频词 Unit 1、高考必背名句、医学病理..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">内容分类</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-900"
                  >
                    <option value="english">外语与高频词汇</option>
                    <option value="chinese">文言与古诗名篇</option>
                    <option value="science">理化与医学病理</option>
                    <option value="custom">通用考试与自定义</option>
                  </select>
                </div>
              </div>

              {/* Parsing Mode Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">智能解析模式</label>
                  <span className="text-[10px] text-slate-400">
                    支持单词+释义、逐字古文切分或空格逗号隔开
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setParseMode('lines')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      parseMode === 'lines'
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    📝 按行解析 (含释义)
                  </button>
                  <button
                    type="button"
                    onClick={() => setParseMode('characters')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      parseMode === 'characters'
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🔡 逐字切分 (诗文/名篇)
                  </button>
                  <button
                    type="button"
                    onClick={() => setParseMode('spaces')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      parseMode === 'spaces'
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🔠 逗号/空格分隔
                  </button>
                </div>
              </div>

              {/* Content Textarea */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">输入或粘贴词条文本</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleFillSample('en_postgrad')}
                      className="text-amber-600 hover:text-amber-700 text-[11px] font-medium"
                    >
                      填入考研单词示例
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => handleFillSample('prose')}
                      className="text-emerald-600 hover:text-emerald-700 text-[11px] font-medium"
                    >
                      填入滕王阁序
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setRawText('')}
                      className="text-slate-400 hover:text-rose-500 text-[11px]"
                    >
                      清空
                    </button>
                  </div>
                </div>
                <textarea
                  rows={5}
                  placeholder={
                    parseMode === 'lines'
                      ? '每行一个词条，例如：\nabandon 放弃\nability 能力\nabnormal 异常\n（支持空格、冒号、破折号或等号分隔单词与释义）'
                      : parseMode === 'characters'
                      ? '直接粘贴整段古文或现代诗歌，例如：\n落霞与孤鹜齐飞，秋水共长天一色。\n渔舟唱晚，响穷彭蠡之滨。\n（系统自动清洗标点，按句切分字块并标注句数）'
                      : '输入用逗号或空格分开的单词列表，例如：catalyst, hypothesis, paradigm, cognitive, ecosystem...'
                  }
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 font-mono text-slate-900 leading-relaxed"
                />
              </div>

              {/* Board Size Custom Override */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                    <span>挑战盘面规格设定</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    系统根据词条数智能推荐，亦可手动指定
                  </span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {[3, 4, 5, 6, 7, 8].map((sz) => {
                    const isSelected = effectiveSize === sz;
                    const isAuto = recommendedSize === sz && !customSizeOverride;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setCustomSizeOverride(sz as GridSize)}
                        className={`flex-1 py-1 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div>{sz}×{sz}</div>
                        <div className="text-[9px] font-normal opacity-75">
                          {isAuto ? '推荐' : `${sz * sz}格`}
                        </div>
                      </button>
                    );
                  })}
                  {customSizeOverride && (
                    <button
                      type="button"
                      onClick={() => setCustomSizeOverride(null)}
                      className="px-2 py-1 text-[10px] text-slate-500 hover:text-amber-700 underline shrink-0 cursor-pointer"
                    >
                      恢复默认
                    </button>
                  )}
                </div>
              </div>

              {/* Parsed Items Real-time Feedback & Preview */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      解析成功: {parsedItems.length} 项
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      当前盘面: {effectiveSize}×{effectiveSize} ({effectiveSize * effectiveSize}格)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    舒尔特盘面按 1 至 {effectiveSize * effectiveSize} 顺序寻找
                  </span>
                </div>

                {parsedItems.length > 0 ? (
                  <div className="max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {parsedItems.slice(0, 36).map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-1.5 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 font-bold text-[9px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-800 truncate">{item.text}</span>
                        </div>
                        {item.secondaryText && (
                          <span className="text-[10px] text-slate-400 truncate ml-1 scale-90">
                            {item.secondaryText}
                          </span>
                        )}
                      </div>
                    ))}
                    {parsedItems.length > 36 && (
                      <div className="col-span-full text-center text-[10px] text-slate-400 py-1 font-medium">
                        ... 剩余 {parsedItems.length - 36} 项已就绪
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    在上方输入或点击官方预设模板，此处将实时呈现解析后的词条切片
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Library Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">题库库藏列表</span>
                <span className="text-[10px] text-slate-400">点击任意卡片即可直接载入训练</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {allDecks.map((deck) => {
                  const isPreset = deck.id.startsWith('preset-');
                  return (
                    <div
                      key={deck.id}
                      onClick={() => {
                        setActiveCustomDeckId(deck.id);
                        onSelectAndStart(deck, deck.recommendedSize);
                        onClose();
                      }}
                      className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/30 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between space-y-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-800 transition-colors flex items-center gap-1.5">
                            <span>{deck.title}</span>
                            {isPreset && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                                官方
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 shrink-0 font-medium">
                            {deck.recommendedSize}×{deck.recommendedSize}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {deck.items.map((i) => i.text).slice(0, 10).join(' · ')}...
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-400">共 {deck.items.length} 词条</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleCopyDeckJson(deck, e)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                            title="复制题库JSON"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoadDeck(deck);
                            }}
                            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                          >
                            编辑
                          </button>
                          {!isPreset && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteDeck(deck.id, e)}
                              className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="删除此题库"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
          {activeTab === 'create' ? (
            <>
              <button
                type="button"
                onClick={handleSaveOnly}
                disabled={!title.trim() || parsedItems.length === 0}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors disabled:opacity-40 cursor-pointer"
              >
                仅保存题库
              </button>
              <button
                id="btn-start-custom-training"
                type="button"
                onClick={handleSaveAndLaunch}
                disabled={!title.trim() || parsedItems.length === 0}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-black text-xs shadow-xs transition-all disabled:opacity-40 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>保存并立即开始训练 ({effectiveSize}×{effectiveSize})</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className="w-full flex items-center justify-center gap-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>新建自定义题库</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

