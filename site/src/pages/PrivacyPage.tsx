import React from 'react';
import { Shield, Lock, Database, EyeOff, Bell, CheckCircle, Mail, AlertTriangle } from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <Shield className="w-3.5 h-3.5" />
          <span>合规与隐私承诺 · Privacy Policy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          隐私保护政策
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
          <span>生效日期：2026年9月1日</span>
          <span>•</span>
          <span>最新修订：2026年9月27日</span>
          <span>•</span>
          <span>适用版本：v2.0 及更高版本</span>
        </div>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
          欢迎使用「{APP_CONFIG.name}」（以下简称“本应用”或“我们”）。我们深知个人隐私与专注空间的珍贵。本政策旨在以公开、严谨且通俗透明的原则，阐述本应用在数据收集、本地存储与系统权限使用方面的规范。
        </p>
      </div>

      {/* Summary Highlight Box */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base sm:text-lg">
          <Lock className="w-5 h-5" />
          <span>核心隐私准则：100% 端侧优先 (Local-First)</span>
        </div>
        <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
          「{APP_CONFIG.name}」坚持纯粹的端侧本地运行理念。您的舒尔特方格完成用时、击打记录、连击习惯天数及能力评级，<strong>全部仅保存在您当前设备的本地安全沙盒（Local Storage）中</strong>。我们没有用户注册机制，不架设用于收集用户个人画像的云端数据库，亦不包含任何第三方商业广告与追踪 SDK。
        </p>
      </div>

      {/* Detail Articles */}
      <div className="space-y-10 text-slate-300 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-amber-400" />
            一、我们不收集的信息清单
          </h2>
          <p>
            为确保纯粹的数字健康体验，在您使用本应用的过程中，我们<strong>绝不</strong>收集、上传或索取以下任何数据：
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400 text-xs sm:text-sm">
            <li><strong>个人身份信息</strong>：不收集姓名、身份证号、手机号码、电子邮件、社交账号或头像；</li>
            <li><strong>生物识别与通讯信息</strong>：不访问面容 ID、指纹数据、手机通讯录、通话记录或短信；</li>
            <li><strong>地理位置与相册</strong>：不请求 GPS 精准或大致地理位置，不读取或修改您的照片图库；</li>
            <li><strong>商业画像与跨站标识符</strong>：不使用 IDFA（广告标识符）、IDFV 用于广告投放，不进行跨应用追踪。</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            二、本地存储的数据及用途
          </h2>
          <p>
            为了向您提供科学的专注力训练记录与习惯闭环，本应用在您手机本地安全沙盒中存储以下配置：
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <h4 className="font-bold text-white text-xs sm:text-sm">1. 训练记录与用时</h4>
              <p className="text-xs text-slate-400">
                每局 3×3~9×9 完成耗时、失误惩罚计次及雷达图五维评估指标，用于在本地图表中展示个人成长趋势。
              </p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <h4 className="font-bold text-white text-xs sm:text-sm">2. 训练偏好配置</h4>
              <p className="text-xs text-slate-400">
                中心注视点（红心锚点）、目标数字实时提示、音效与触觉反馈开关、记忆盲打预留时长等个性化参数。
              </p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <h4 className="font-bold text-white text-xs sm:text-sm">3. 每日打卡提醒时间</h4>
              <p className="text-xs text-slate-400">
                您设定的习惯提醒时分（如 20:00），仅供设备系统本地定时器生成闹钟式本地通知。
              </p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <h4 className="font-bold text-white text-xs sm:text-sm">4. 每日打卡状态</h4>
              <p className="text-xs text-slate-400">
                记录当天是否已完成至少 1 局练习，用于智能免打扰静默判断，避免过度打扰。
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-400" />
            三、系统权限的申请与透明说明
          </h2>
          <div className="space-y-2">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="font-bold text-white text-sm">本地通知权限 (Local Notifications)</span>
              <p className="text-xs text-slate-400">
                <strong>目的</strong>：用于在您指定的每日自律时间提醒您进行专注练习。<br />
                <strong>透明性</strong>：此提醒由 iOS 系统内部调度，绝无远程推送服务器参与，完全离线运行。您可以随时在应用设置或 iOS「设置 - 每日舒尔特」中关闭该权限。
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="font-bold text-white text-sm">触觉反馈 (Haptics)</span>
              <p className="text-xs text-slate-400">
                <strong>目的</strong>：在点击正确或误触方格时通过 Taptic Engine 触发微弱震动以增强确认感，无需网络且不产生任何数据交换。
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            四、数据主权与完全清除权
          </h2>
          <p>
            您享有对自身数据的完全控制权：
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs sm:text-sm">
            <li><strong>一键清除</strong>：您可以在应用内的「设置 - 清理训练数据」中一键抹掉历史用时与打卡记录；</li>
            <li><strong>卸载销毁</strong>：如果您从设备中删除「{APP_CONFIG.name}」，iOS 系统将自动销毁属于本应用沙盒的全部数据，不留存任何痕迹。</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            五、儿童与青少年隐私特别保护
          </h2>
          <p>
            本应用非常重视未成年人及儿童的健康与隐私。由于本应用不搜集任何可识别个人身份的信息，亦不包含任何社交、开放聊天或付费内购诱导，完全符合《儿童在线隐私保护法》（COPPA）及相关个人信息保护法律法规要求，适合全年龄段用户在监护人指导下进行视力与注意力锻炼。
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-400" />
            六、联系我们与隐私疑问
          </h2>
          <p>
            如果您对本隐私政策或个人数据安全有任何疑问、意见或申诉，欢迎随时通过开发者直通邮箱与我们联系：
          </p>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl font-mono text-sm text-amber-400">
            开发者直通邮箱：
            <a href={`mailto:${APP_CONFIG.contactEmail}`} className="underline hover:text-amber-300 ml-1">
              {APP_CONFIG.contactEmail}
            </a>
          </div>
          <p className="text-xs text-slate-400">
            我们将在收到您的邮件后的 3 个工作日内予以回复和处理。
          </p>
        </section>
      </div>
    </div>
  );
};
