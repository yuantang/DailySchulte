import React, { useState } from 'react';
import { Mail, Check, Copy, Shield, FileText, Heart, Github, ExternalLink } from 'lucide-react';
import { RoutePath } from '../types';
import { APP_CONFIG } from '../utils/constants';
import appIconUrl from '../assets/app-icon.png';

interface FooterProps {
  onNavigate: (path: RoutePath) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(APP_CONFIG.contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNavigate = (path: RoutePath) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-850 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-850">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={appIconUrl}
                alt="每日舒尔特"
                width={36}
                height={36}
                className="w-9 h-9 rounded-[22%] object-cover shadow-sm border border-slate-800 shrink-0"
              />
              <span className="text-lg font-black text-white">{APP_CONFIG.name}</span>
              <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                v{APP_CONFIG.version}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {APP_CONFIG.description}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                100% 本地端侧沙盒
              </span>
              <span>•</span>
              <span>零商业广告 SDK</span>
              <span>•</span>
              <span>零云端追踪</span>
            </div>
          </div>

          {/* Legal and Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">合规与法律协议</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNavigate('/privacy')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  隐私保护政策 (Privacy Policy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/terms')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  用户服务协议 (Terms of Service)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/support')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  技术支持与故障排查
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">开发直通与联系</h4>
            <p className="text-xs text-slate-400">
              任何功能建议、题型扩展想法或体验问题，欢迎直接联系开发者：
            </p>
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                <a
                  href={`mailto:${APP_CONFIG.contactEmail}`}
                  className="hover:underline flex items-center gap-1.5"
                  title="点击发邮件"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{APP_CONFIG.contactEmail}</span>
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                  title="复制邮箱"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <a
                href={APP_CONFIG.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub 开源与代码仓库</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {APP_CONFIG.name} · All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <span>用心打造纯粹专注工具</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </div>
          <div>
            Apple, the Apple logo, and iPhone are trademarks of Apple Inc.
          </div>
        </div>
      </div>
    </footer>
  );
};
