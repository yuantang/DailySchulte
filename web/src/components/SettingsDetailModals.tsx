import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Info,
  Mail,
  Star,
  Check,
  Copy,
  Heart,
  Sparkles,
  Lock,
  Database,
  EyeOff,
  Activity,
  Send,
  Eye,
  Brain,
  Award,
  ExternalLink,
  Globe,
} from 'lucide-react';
import appIconUrl from '../assets/app-icon.png';

export const OFFICIAL_SITE_URL = 'https://dailyschulte.vercel.app';

export type SettingsDetailType = 'privacy' | 'terms' | 'about' | 'feedback' | 'rating' | null;

interface SettingsDetailModalProps {
  type: SettingsDetailType;
  onClose: () => void;
}

export const SettingsDetailModal: React.FC<SettingsDetailModalProps> = ({ type, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState<'suggestion' | 'bug' | 'other'>('suggestion');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  if (!type) return null;

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText('');
      onClose();
    }, 1800);
  };

  const handleRating = (stars: number) => {
    setRatingStars(stars);
    setRatingSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 text-slate-800 rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[88vh] animate-in slide-in-from-bottom duration-300 ease-out"
      >
        {/* Mobile Pull Handle */}
        <div
          className="pb-2.5 -mt-2 flex justify-center shrink-0 cursor-pointer sm:hidden"
          onClick={onClose}
          title="点击关闭"
        >
          <div className="w-10 h-1.5 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors" />
        </div>

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            {type === 'privacy' && (
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
            {type === 'terms' && (
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            )}
            {type === 'about' && (
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200/80 text-sky-600 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
            )}
            {type === 'feedback' && (
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
            )}
            {type === 'rating' && (
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
            )}

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {type === 'privacy' && '隐私保护政策'}
                {type === 'terms' && '用户服务协议'}
                {type === 'about' && '关于每日舒尔特'}
                {type === 'feedback' && '联系与反馈建议'}
                {type === 'rating' && '给每日舒尔特好评鼓励'}
              </h3>
              <p className="text-xs text-slate-500">
                {type === 'privacy' && '100% 端侧存储 · 零云端追踪 · 专注数据安全'}
                {type === 'terms' && '服务条款 · 科学训练与健康免责 · 专注训练守则'}
                {type === 'about' && '版本信息 · 科学原理与理念 · 独立开发致谢'}
                {type === 'feedback' && '开发直通邮箱 · 题型建议征集 · 问题上报'}
                {type === 'rating' && '支持纯粹专注训练 · 为每日舒尔特点亮五星好评 ✨'}
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

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto py-4 space-y-4 text-xs text-slate-600 leading-relaxed pr-1">
          {/* PRIVACY POLICY */}
          {type === 'privacy' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>纯粹端侧承诺与数据主权</span>
                </div>
                <p className="text-emerald-900/90 text-[11px] leading-relaxed">
                  「每日舒尔特」坚持纯粹的端侧优先（Local-First）架构设计。您的所有舒尔特方格成绩、用时分布、连击天数与注意力能力雷达评估数据，均仅存储在您当前设备的本地安全沙盒与存储中。
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    1. 100% 本地存储 (Local-Only Storage)
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-normal">
                    每一轮舒尔特方格的点击耗时、反向与盲打记录、自设习惯提醒时间等，完整存储于本机的安全本地存储中，离线可用，数据完全由您掌控。
                  </p>
                </div>

                <div className="space-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-emerald-600" />
                    2. 零云端上传与零商业追踪
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-normal">
                    本工具不包含任何第三方商业广告 SDK、跨站追踪 Cookie 或用户画像采集脚本。我们不收集手机号、邮箱、通讯录或任何设备硬件指纹。
                  </p>
                </div>

                <div className="space-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    3. 专注力与数字健康伦理规范
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-normal">
                    训练计时器与打卡提醒完全为辅助自律养成而设计，无任何沉迷机制或诱导消费，遵循透明严格的专注力健康规范。
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">官方网站公示与合规备案</span>
                <a
                  href={`${OFFICIAL_SITE_URL}/privacy`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>在浏览器中查看官网在线隐私政策</span>
                  <ExternalLink className="w-3 h-3 text-emerald-600" />
                </a>
              </div>
            </div>
          )}

          {/* TERMS OF SERVICE */}
          {type === 'terms' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  <span>服务协议与训练守则</span>
                </div>
                <p className="text-indigo-900/90 text-[11px] leading-relaxed">
                  欢迎使用「每日舒尔特」专注力训练系统。本协议旨在明确训练定位、用眼健康指引以及科学免责声明，保障良好的认知提升体验。
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    一、功能定位与训练目标
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-normal">
                    本产品基于经典舒尔特方格（Schulte Table）视觉心理学范式构建，用于辅助锻炼周边视野扫视广度、视觉稳定性与瞬时专注反应速度。
                  </p>
                </div>

                <div className="space-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    二、科学用眼与健康免责声明
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-normal">
                    1. <strong>非医疗器械</strong>：本应用属于日常认知专注练习工具，所呈现的用时、能力雷达评级仅作为个人训练参照，不作为眼科屈光、多动障碍（ADHD）或神经认知医学诊断依据。<br />
                    2. <strong>防视疲劳建议</strong>：舒尔特方格属于高密度视野搜视训练，建议每次连续训练控制在 <strong>5~15 分钟</strong>以内。若双眼感到干涩、酸胀或视物模糊，请立即停止练习并极目远眺。
                  </p>
                </div>

                <div className="space-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-600" />
                    三、专注诚信守则
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-normal">
                    倡导“静心专注、诚实记录、循序渐进”。鼓励通过真实的眼动训练与耐力积累提升注意力，拒绝借助脚本或自动化辅助篡改成绩，维护真实的个人成长轨迹。
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">条款永久在线可查</span>
                <a
                  href={`${OFFICIAL_SITE_URL}/terms`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>在浏览器中查看官网在线服务条款</span>
                  <ExternalLink className="w-3 h-3 text-indigo-600" />
                </a>
              </div>
            </div>
          )}

          {/* ABOUT */}
          {type === 'about' && (
            <div className="space-y-4">
              <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 shadow-2xs">
                <img
                  src={appIconUrl}
                  alt="每日舒尔特"
                  className="w-14 h-14 rounded-2xl mx-auto shadow-md border border-slate-200/60 object-cover"
                />
                <div className="text-sm font-bold text-slate-900">每日舒尔特 · Schulte Table Focus</div>
                <div className="text-[11px] font-mono text-slate-500">版本 Version 2.4.0 · 纯净专注引擎</div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    科学渊源与设计理念
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-normal">
                    舒尔特方格由德国精神病学家舒尔特（Walter Schulte）发明，最初用于航天飞行员与特种人员快速搜寻目标及周边视野广度的严谨测试，后被广泛应用于速读训练与注意力塑造。
                  </p>
                </div>

                <div className="space-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-sky-600" />
                    专业功能特色
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-normal">
                    • <strong>全阶网格</strong>：覆盖 3×3 至 9×9 阶多难度梯度。<br />
                    • <strong>丰富题型</strong>：经典阿拉伯数字、26英文字母、汉字及拼音题库。<br />
                    • <strong>进阶模式</strong>：反向倒序、颜色干扰、盲打记忆及动态随机换位。<br />
                    • <strong>维度评估</strong>：多维专注力雷达图、年度打卡热力矩阵与定时习惯提醒。
                  </p>
                </div>

                <div className="space-y-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    独立开发致谢
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-normal">
                    感谢每一位坚持每日专注打卡、提供改进建议的用户伙伴。在这个算法信息泛滥的时代，愿「每日舒尔特」陪伴您沉淀心神，找回高度聚焦的笃定力量。
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">官方发布主页与更新动态</span>
                <a
                  href={OFFICIAL_SITE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>访问每日舒尔特官方网站</span>
                  <ExternalLink className="w-3 h-3 text-sky-600" />
                </a>
              </div>
            </div>
          )}

          {/* FEEDBACK */}
          {type === 'feedback' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="text-[11px] text-slate-500 font-medium">舒尔特专注训练直通反馈邮箱</div>
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs text-amber-700 shadow-2xs">
                  <a
                    href="mailto:moreless1025@gmail.com"
                    className="hover:underline hover:text-amber-800 transition-colors"
                    title="点击直接发送邮件"
                  >
                    moreless1025@gmail.com
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail('moreless1025@gmail.com')}
                    className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>复制</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendFeedback} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">反馈类别</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { key: 'suggestion', label: '💡 题型建议' },
                      { key: 'bug', label: '🐛 异常上报' },
                      { key: 'other', label: '💬 操作体验' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setFeedbackCategory(item.key as any)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          feedbackCategory === item.key
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">详细反馈与建议</label>
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="欢迎提出您希望加入的新题库（如罗马数字、特殊符号）、更丰富的热力分析指标或训练体验问题..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white resize-none"
                  />
                </div>

                {feedbackSent ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-1.5 font-bold animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>感谢您的支持！反馈已记录，我们将持续优化训练体验。</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={!feedbackText.trim()}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>提交训练反馈</span>
                  </button>
                )}
              </form>

              <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">遇到故障？查阅排障指引</span>
                <a
                  href={`${OFFICIAL_SITE_URL}/support`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>访问官网技术支持与排查中心</span>
                  <ExternalLink className="w-3 h-3 text-amber-600" />
                </a>
              </div>
            </div>
          )}

          {/* RATING */}
          {type === 'rating' && (
            <div className="space-y-4 text-center">
              <div className="py-2">
                <div className="text-slate-900 text-sm font-bold flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>为「每日舒尔特」点赞鼓励</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1">
                  如果这款纯粹无广告的专注力工具切实帮助到了您的周边视野与注意力养成，欢迎点亮好评支持我们！
                </p>
              </div>

              {/* Star Selector */}
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleRating(s)}
                    className="p-1 text-slate-300 hover:text-amber-400 transition-transform active:scale-125 cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        s <= ratingStars
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.35)]'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {ratingSubmitted && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 space-y-1 animate-in zoom-in-95 duration-200">
                  <div className="font-bold flex items-center justify-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>感谢您点亮的 {ratingStars} 星好评！</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    您的认可与温暖支持，是我们坚持打磨高质感、纯粹自律训练体验的最大源泉。
                  </p>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleRating(5);
                    setTimeout(onClose, 1200);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>点亮五星好评并支持 ✨</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
