import React from 'react';
import { FileText, Activity, Eye, ShieldAlert, Award, Scale, HelpCircle } from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';

export const TermsPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
          <FileText className="w-3.5 h-3.5" />
          <span>服务规范 · Terms of Service</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          用户服务协议与训练守则
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
          <span>生效日期：2026年9月1日</span>
          <span>•</span>
          <span>最新修订：2026年9月27日</span>
          <span>•</span>
          <span>适用版本：v2.0 及更高版本</span>
        </div>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
          欢迎您选择并使用「{APP_CONFIG.name}」（以下简称“本软件”或“本服务”）。本协议由您与「{APP_CONFIG.name}」独立开发者团队共同缔结。请您在下载、安装或使用本软件前，仔细阅读并充分理解本协议中的各项条款。
        </p>
      </div>

      {/* Health Disclaimer Callout */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base sm:text-lg">
          <Activity className="w-5 h-5" />
          <span>重要提示：科学认知训练与健康免责声明</span>
        </div>
        <div className="text-xs sm:text-sm text-amber-200/90 leading-relaxed space-y-2">
          <p>
            1. <strong>非医疗器械与非诊断工具</strong>：本软件基于经典舒尔特方格（Schulte Table）心理学测验范式设计，属于日常注意力、瞬时辨识反应与周边视野搜寻的辅助锻炼工具。软件内生成的完成用时、击打速度、雷达图等级仅供用户自我训练参考，<strong>绝不构成且不能替代任何医学眼科屈光、弱视、注意力缺陷多动障碍（ADHD）或神经认知临床诊断与治疗方案</strong>。
          </p>
          <p>
            2. <strong>防视疲劳与用眼自律</strong>：舒尔特方格训练需要眼球高密度搜寻与中枢神经高度集中。建议每位用户<strong>单次训练时间控制在 5~15 分钟以内</strong>，切勿长时间、高负荷过度紧盯屏幕。若在练习过程中感到眼睛干涩、酸胀、视物模糊或轻微眩晕，请立即暂停训练并闭目休息或眺望远方。
          </p>
        </div>
      </div>

      {/* Main Articles */}
      <div className="space-y-10 text-slate-300 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-400" />
            一、软件功能定位与使用许可
          </h2>
          <p>
            「{APP_CONFIG.name}」授予您一项个人的、不可转让、非独占且可撤销的软件使用许可，用于在兼容的个人智能移动设备（如 iPhone）上运行本软件，进行个人注意力习惯塑造与心理视力锻炼。您不得对本软件进行反向工程、反编译、破解或制作衍生产品。
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            二、专注诚信守则
          </h2>
          <p>
            我们倡导<strong>“静心专注、诚实记录、循序渐进”</strong>的科学训练精神。舒尔特方格的核心价值在于日积月累的真实神经反馈与视野拓展。任何使用自动化脚本、外挂辅助、截屏 OCR 辅助作弊的行为，均违背本软件的设计初衷，并使记录失去个人成长参照意义。
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            三、知识产权声明
          </h2>
          <p>
            本软件的整体界面设计、品牌标识（Logo）、算法逻辑、文案编排与程序代码的知识产权均归「{APP_CONFIG.name}」开发者所有并受《中华人民共和国著作权法》及国际版权条约保护。未经许可，任何个人或组织不得擅自克隆、仿冒或进行商业倒卖。
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-sky-400" />
            四、免责与责任限制
          </h2>
          <p>
            在法律允许的最大范围内，本软件按“现状”（As Is）提供。开发者不对软件在不可抗力、设备操作系统崩溃、用户自行清理本地缓存或误操作导致的数据丢失承担连带责任。但开发者承诺将持续维护软件稳定性，并竭诚修复已知缺陷。
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            五、协议修订与问题反馈
          </h2>
          <p>
            我们可能根据法律法规或功能迭代适时更新本协议。修改后的条款将在官网公布并即时生效。如您对本协议内容有任何异议或建议，请联系：
          </p>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl font-mono text-sm text-amber-400">
            开发者直通邮箱：
            <a href={`mailto:${APP_CONFIG.contactEmail}`} className="underline hover:text-amber-300 ml-1">
              {APP_CONFIG.contactEmail}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
