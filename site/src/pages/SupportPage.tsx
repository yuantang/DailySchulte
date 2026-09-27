import React, { useState } from 'react';
import {
  HelpCircle,
  Mail,
  Check,
  Copy,
  Send,
  MessageSquare,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';

export const SupportPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState<'suggestion' | 'bug' | 'question'>('suggestion');
  const [feedbackContent, setFeedbackContent] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(APP_CONFIG.contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComposeMail = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryLabels = {
      suggestion: '【功能/题型建议】',
      bug: '【异常/缺陷上报】',
      question: '【使用咨询】',
    };
    const subject = encodeURIComponent(`${categoryLabels[feedbackCategory]} 每日舒尔特用户反馈`);
    const body = encodeURIComponent(
      `您好！\n\n我对「每日舒尔特」有如下反馈：\n${feedbackContent || '（请在此补充您的建议或遇到的问题）'}\n\n---\n系统环境：iOS / Web\nApp版本：v${APP_CONFIG.version}`
    );
    window.location.href = `mailto:${APP_CONFIG.contactEmail}?subject=${subject}&body=${body}`;
  };

  const troubleshooting = [
    {
      q: '为什么到了设定的打卡时间，手机没有收到提醒通知？',
      a: '请依次核查：① iOS「设置 - 每日舒尔特 - 通知」是否已开启「允许通知」；② 检查您当天是否已经玩过一局练习，本应用特设「智能免打扰」机制——若您当天已完成至少一局练习，提醒会自动保持静默，避免不必要的打扰；③ 检查是否开启了 iOS「专注模式 / 勿扰模式」。',
    },
    {
      q: '点击方格时没有声音反馈或振动效果？',
      a: '请确认：① 手机侧边静音实体拨片（或操作按钮）未处于静音状态；② 应用内「设置 - 音效与严谨惩罚机制」中的「音效反馈」开关是否保持开启；③ iOS「设置 - 声音与触感」中的「系统触感反馈」是否已开启。',
    },
    {
      q: '高阶数（如 7×7、8×8、9×9）方格为什么变小了？',
      a: '这是经过视光学专家与人体工学计算的自适应保护设计。高阶数如果强行撑大，不仅会超出单手操作舒适区，还会迫使练习者频繁大幅度转动眼球，破坏舒尔特方格以「中心定点周边视野搜视」为核心的训练目标。让全盘完整纳入余光扫视范畴，方能发挥最大心理学效用。',
    },
    {
      q: '更换新 iPhone 后，我的历史训练成绩如何迁移？',
      a: '由于「每日舒尔特」采用纯粹的 100% 端侧隐私架构，无云端账户中转，当您更换新手机时，推荐使用苹果官方的「快速开始」（手机对手机近距离无线迁移）或 iCloud / 电脑加密整机备份。在整机恢复时，应用沙盒内的全部专注记录与设置将原封不动无缝迁移至新手机。',
    },
  ];

  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>技术支持中心 · Support & Contact</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          技术支持与使用反馈
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          我们高度重视每一位用户的真实专注体验。如果您在使用「{APP_CONFIG.name}」时遇到任何异常，或有宝贵的题型拓展构想，欢迎随时与开发者直通联系。
        </p>
      </div>

      {/* 1. Developer Direct Mail Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Mail className="w-5 h-5 text-amber-400" />
              <span>开发者直通支持邮箱</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              邮件通常在 24 小时内由作者亲自回复，为您解决使用中的任何疑难。
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
            <span className="font-mono text-sm sm:text-base text-amber-400 font-bold select-all">
              {APP_CONFIG.contactEmail}
            </span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="复制邮箱地址"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-400">
          <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>24小时内极速响应</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <span>采纳即获更新致谢</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>无机器人自动化敷衍</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Feedback Generator */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            快速起草反馈邮件
          </h2>
          <p className="text-xs text-slate-400">
            在下方选择反馈类别并输入要点，点击后可直接唤起您的系统邮件客户端并预填好内容。
          </p>
        </div>

        <form onSubmit={handleComposeMail} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">反馈类别</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'suggestion', label: '💡 题型与功能建议' },
                { id: 'bug', label: '🐛 异常缺陷上报' },
                { id: 'question', label: '❓ 使用与规则咨询' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFeedbackCategory(item.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    feedbackCategory === item.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">反馈详细内容（选填）</label>
            <textarea
              rows={4}
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
              placeholder="欢迎输入您希望增加的新题型（如罗马数字、字母方格）、关于雷达图指标的想法，或您在使用时遇到的问题细节..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 cursor-pointer active:scale-98 transition-all"
          >
            <Send className="w-4 h-4 fill-slate-950" />
            <span>拉起邮件客户端直接发送至 {APP_CONFIG.contactEmail}</span>
          </button>
        </form>
      </div>

      {/* 3. Common Troubleshooting */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-indigo-400" />
          常见使用故障排查 (Troubleshooting)
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {troubleshooting.map((item, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {item.q}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pl-4">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
