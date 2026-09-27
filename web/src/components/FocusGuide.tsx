import React from 'react';
import { BookOpen, Eye, Award, VolumeX, Zap, CheckCircle, Target } from 'lucide-react';

export const FocusGuide: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-16">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>训练原理与建议</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
          舒尔特方格（Schulte Table）专注力训练指南
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          舒尔特方格由心理学者沃尔特·舒尔特（Walter Schulte）于1962年发明，常用于训练与评估注意力的分配与集中速度，也是速读与视野训练的经典练习方法。
        </p>
      </div>

      {/* 3 Core Mechanisms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">拓展周边视野</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            人类中心注视视野角度有限，而周边余光范围更宽广。舒尔特方格练习引导视线定格于中心区域，使用余光扫描捕捉周边数字。
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <VolumeX className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">减少心智默读</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            初学者在寻找数字时往往下意识在脑中默念发音。熟练后可尝试减少默念，将目光所见直接转化为快速的点击定位。
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">保持专注稳定性</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            通过连续的目标检索，帮助在多重数字分布中保持平稳的寻找节奏与高度集中的注意力。
          </p>
        </div>
      </div>

      {/* Benchmarks */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>标准 5×5 舒尔特成绩参考表</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">顶尖水平</span>
            <p className="text-2xl font-black">≤ 15 秒</p>
            <p className="text-xs text-amber-800">视野开阔，极少大幅扫视，余光感知敏锐</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">优秀水平</span>
            <p className="text-2xl font-black">16 - 25 秒</p>
            <p className="text-xs text-emerald-800">反应迅速，点击节奏连贯平稳，停顿少</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">良好水平</span>
            <p className="text-2xl font-black">26 - 40 秒</p>
            <p className="text-xs text-blue-800">具备扎实基础，局部寻找迅速，整体稳定</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">基础水平</span>
            <p className="text-2xl font-black">&gt; 40 秒</p>
            <p className="text-xs text-slate-600">眼球跳动较频繁，坚持日常练习可快速提升</p>
          </div>
        </div>
      </div>

      {/* Actionable Training Techniques */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-500" />
          <span>实用训练技巧</span>
        </h3>

        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">开启中心注视点，视线凝视中心：</strong>
              <span>
                点击顶部工具栏的眼睛图标开启红点辅助。将视线锚定在中心，不要让眼珠逐个追逐数字，练习用周边视野感知并点击边缘的目标。
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">交替题型与蜂巢形态挑战：</strong>
              <span>
                当正序数字熟练后，可切换为 <strong>双轨交替 (1-A-2-B)</strong>、<strong>蜂巢六边</strong> 或 <strong>抗干扰色彩</strong> 题型，增加思维灵活性与抗干扰能力。
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">利用数据统计定位盲区：</strong>
              <span>
                训练完成后可在【数据统计】中查看点击用时曲线与热力图，了解自己是否存在某个方向扫视停顿较长的情况。
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">保持规律练习，避免过度疲劳：</strong>
              <span>
                每日坚持 3-5 组练习，比单次过度用眼效果更明显，同时避免眼睛产生疲劳。
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
