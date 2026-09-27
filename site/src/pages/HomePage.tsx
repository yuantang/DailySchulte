import React, { useState } from 'react';
import {
  Zap,
  Eye,
  ShieldCheck,
  BellRing,
  BarChart3,
  ChevronDown,
  Apple,
  Grid3X3,
  Shuffle,
  EyeOff,
  Flame,
  ArrowRight,
  Brain,
  CheckCircle,
} from 'lucide-react';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { APP_CONFIG } from '../utils/constants';

export const HomePage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: '什么是舒尔特方格？为什么它被公认为最有效的注意力训练工具？',
      a: '舒尔特方格（Schulte Table）由德国神经精神病学家沃尔特·舒尔特（Walter Schulte）在 20 世纪中期研发，最早用于航天飞行员与特勤人员的注意力稳定性测试与视觉扫视范围拓展。练习者眼睛注视方格中心，利用周边余光快速寻找数字。大量心理学实证表明，定期训练可有效提升大脑短时记忆提取速度、拓宽有效视野（Useful Field of View, UFOV）并强化抑制无关干扰的能力。',
    },
    {
      q: '每天建议训练多长时间？会对眼睛造成疲劳吗？',
      a: '我们始终倡导“微习惯，大改变”。舒尔特方格属于高密度瞬时聚焦练习，推荐每日累计训练 5~15 分钟即可达到极佳的眼脑激活效果。App 内置了科学用眼健康提示，切忌长时间过度紧盯屏幕；若感到双眼酸胀，请立即停下极目远眺。',
    },
    {
      q: '我的成绩和个人数据是否安全？会被上传到服务器吗？',
      a: '绝对安全。「每日舒尔特」秉持 100% 本地优先（Local-First）原则。您的所有通关用时、热力分布、连胜天数与雷达图能力评估数据均完整保存在当前设备的加密沙盒存储中。应用内无任何第三方用户画像追踪、无商业广告脚本，即使完全断网也能全功能流畅运行。',
    },
    {
      q: 'App 内提供哪些进阶训练模式？',
      a: '除了经典的 3×3 至 9×9 阶数之外，每日舒尔特针对进阶挑战者独创了多项专注变式：① 动态乱序模式（每点一次整个棋盘随机重排）；② 记忆盲打模式（倒计时记忆后棋盘全隐，依靠空间暂存记忆盲搜）；③ 反向逆序模式（从最大数倒数至 1）；④ 双色干扰模式（红黑色彩交替抗干扰）。',
    },
    {
      q: '习惯提醒通知是如何工作的？会不会打扰我？',
      a: '每日舒尔特支持「智能免打扰」机制。您可以设定每日固定的专注时间（如每晚 20:00），系统会准时发送本地通知提醒打卡。若您在当天已经完成了一局训练，系统将自动保持静默，绝不重复打扰。',
    },
  ];

  const features = [
    {
      icon: Grid3X3,
      title: '3×3 至 9×9 全阶覆盖',
      desc: '专为手机端调优的自适应网格，从 9 格启蒙到 81 格极限挑战，毫秒级响应，平滑流畅。',
      badge: '经典心理学',
    },
    {
      icon: Shuffle,
      title: '动态乱序模式',
      desc: '每点击一个正确数字，方格随机重布！彻底打破位置记忆依赖，强迫眼球进行高频动态再定位。',
      badge: '瞬时重聚',
    },
    {
      icon: EyeOff,
      title: '空间记忆盲打模式',
      desc: '预留 4 秒呼吸凝视，开局后棋盘全部隐去。依靠大脑右脑空间位置表征进行精准盲打。',
      badge: '极限记忆',
    },
    {
      icon: BarChart3,
      title: '五维多轴认知雷达图',
      desc: '多维度量化评估：瞬时速度、有效视野、抗干扰稳定性、心流持久力与微跳控制，成长轨迹一目了然。',
      badge: '科学量化',
    },
    {
      icon: BellRing,
      title: '智能免打扰自律提醒',
      desc: '建立每日专注打卡闭环。今日已练则自动静默，零广告、零营销推送打扰。',
      badge: '纯粹习惯',
    },
    {
      icon: ShieldCheck,
      title: '100% 本地端侧隐私承诺',
      desc: '零云端上传、零用户画像追踪、零广告 SDK。数据全权由您自己掌控，离线即用。',
      badge: '绝对安全',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden bg-grid-pattern">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-lg shadow-amber-500/10 animate-in fade-in slide-in-from-top-4 duration-500">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>全新 2.4 版本已就绪 · 纯粹专注引擎</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15]">
              重塑深度专注 <br className="hidden sm:inline" />
              拓展<span className="text-gold-gradient">周边视觉广度</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-normal">
              源自飞行员与速读测试的经典心理学舒尔特方格。每天 5 分钟，以纯粹无扰的端侧训练，帮您在信息碎片化时代找回沉静聚焦的力量。
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#interactive-demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer active:scale-98"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>立即试玩 3x3 舒尔特</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={APP_CONFIG.appStoreUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-base border border-slate-700/80 hover:border-amber-500/50 shadow-lg transition-all"
            >
              <Apple className="w-5 h-5" />
              <span>App Store 即将上线</span>
            </a>
          </div>

          {/* Trust points */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>100% 本地沙盒数据</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400" />
              <span>零商业广告干扰</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-sky-400" />
              <span>离线运行零追踪</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-400" />
              <span>3×3 至 9×9 全阶数</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Schulte Demo */}
      <InteractiveDemo />

      {/* 3. Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>硬核专注 · 认知赋能</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            精心调优的<span className="text-gold-gradient">全维度训练矩阵</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            从经典入门到极限心流，每日舒尔特针对现代用眼与神经反射特征提供完整解决方案。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-4 transition-all hover:bg-slate-900/90 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Science & Principles */}
      <section id="science" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                <Brain className="w-3.5 h-3.5" />
                <span>神经科学与视力心理学</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                科学训练法：为什么<span className="text-gold-gradient">“余光搜视”</span>能够重塑大脑？
              </h2>
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p>
                  人类眼睛的中央凹（Fovea）负责高清晰度细节，而周边视网膜负责广域视野。传统阅读中，人们习惯频繁进行眼球跳视（Saccade），导致视野狭窄、信息摄入缓慢且容易疲劳。
                </p>
                <p>
                  在舒尔特方格训练中，视线保持在中央注视点，强迫眼球抑制无规律的盲目转动，主动调动周边视野（Peripheral Vision）识别数字。这能有效提升大脑初级视觉皮层（V1）对空间分布信息的瞬时并行解析能力。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1">
                  <div className="text-2xl font-black text-amber-400 font-mono">5~15 分钟</div>
                  <div className="text-xs text-slate-400">每日推荐训练时长</div>
                </div>
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1">
                  <div className="text-2xl font-black text-emerald-400 font-mono">0 云端追踪</div>
                  <div className="text-xs text-slate-400">100% 隐私安全保证</div>
                </div>
              </div>
            </div>

            {/* Visual simulation card */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-bold text-white">视野拓展 (Perceptual Span) 模型</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  UFOV 强化
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>周边余光覆盖度</span>
                  <span className="text-amber-400 font-mono font-bold">+68%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full w-[82%]" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>瞬时数字辨识延迟</span>
                  <span className="text-emerald-400 font-mono font-bold">-45% (更迅速)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full w-[76%]" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>抗外界视觉干扰能力</span>
                  <span className="text-indigo-400 font-mono font-bold">+52%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full w-[88%]" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 leading-relaxed">
                💡 科学护眼建议：训练时切勿强迫瞪眼，保持规律眨眼与自然呼吸。如双眼酸涩，请暂停训练并做眼保健操。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            常见问题与解答 (FAQ)
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            关于科学训练、隐私数据主权与使用指南
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-amber-400 transition-colors cursor-pointer"
              >
                <span className="text-base sm:text-lg">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/80 pt-4 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. Bottom CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-gradient-to-r from-amber-600/30 via-slate-900 to-amber-600/20 border border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20">
            舒
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              找回您的心流专注力
            </h3>
            <p className="text-sm sm:text-base text-slate-400">
              纯净无广告、本地化存储、毫秒级响应。立即开始今天的第 1 局舒尔特方格。
            </p>
          </div>
          <div className="pt-2">
            <a
              href="#interactive-demo"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-amber-500/25 active:scale-98 transition-all cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>立即在网页端试玩体验</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
