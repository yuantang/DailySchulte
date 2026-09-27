import React, { useState } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, FileText, HelpCircle, Sparkles } from 'lucide-react';
import { RoutePath } from '../types';
import { APP_CONFIG } from '../utils/constants';

interface NavbarProps {
  currentPath: RoutePath;
  onNavigate: (path: RoutePath) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (path: RoutePath, hash?: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-500/10"></div>
                <div className="grid grid-cols-2 gap-1 p-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-amber-400/90"></div>
                  <div className="w-2.5 h-2.5 rounded-sm bg-amber-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-sm bg-amber-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-sm bg-amber-400"></div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  {APP_CONFIG.name}
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  v{APP_CONFIG.version}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-wider hidden sm:block">
                DAILY SCHULTE FOCUS
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('/', '#features')}
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-900/60 transition-colors"
            >
              核心特性
            </button>
            <button
              onClick={() => handleNavClick('/', '#interactive-demo')}
              className="px-3 py-2 rounded-lg hover:text-amber-400 hover:bg-slate-900/60 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              在线试玩
            </button>
            <button
              onClick={() => handleNavClick('/', '#science')}
              className="px-3 py-2 rounded-lg hover:text-white hover:bg-slate-900/60 transition-colors"
            >
              科学原理
            </button>
            <button
              onClick={() => handleNavClick('/privacy')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentPath === '/privacy'
                  ? 'text-amber-400 bg-amber-500/10 font-bold'
                  : 'hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              隐私政策
            </button>
            <button
              onClick={() => handleNavClick('/terms')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentPath === '/terms'
                  ? 'text-amber-400 bg-amber-500/10 font-bold'
                  : 'hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              服务协议
            </button>
            <button
              onClick={() => handleNavClick('/support')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentPath === '/support'
                  ? 'text-amber-400 bg-amber-500/10 font-bold'
                  : 'hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              技术支持
            </button>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('/', '#interactive-demo')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-98 transition-all cursor-pointer"
            >
              <span>立即体验</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
              aria-label="打开菜单"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('/', '#features')}
              className="w-full text-left p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 text-sm font-medium"
            >
              核心特性
            </button>
            <button
              onClick={() => handleNavClick('/', '#interactive-demo')}
              className="w-full text-left p-2.5 rounded-xl text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-sm font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              在线试玩
            </button>
            <button
              onClick={() => handleNavClick('/', '#science')}
              className="w-full text-left p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 text-sm font-medium"
            >
              科学原理
            </button>
            <button
              onClick={() => handleNavClick('/', '#faq')}
              className="w-full text-left p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 text-sm font-medium"
            >
              常见问题
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <button
              onClick={() => handleNavClick('/privacy')}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium ${
                currentPath === '/privacy'
                  ? 'bg-amber-500/15 text-amber-400 font-bold'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              隐私保护政策 (Privacy Policy)
            </button>
            <button
              onClick={() => handleNavClick('/terms')}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium ${
                currentPath === '/terms'
                  ? 'bg-amber-500/15 text-amber-400 font-bold'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              用户服务协议 (Terms of Service)
            </button>
            <button
              onClick={() => handleNavClick('/support')}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium ${
                currentPath === '/support'
                  ? 'bg-amber-500/15 text-amber-400 font-bold'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              技术支持与反馈 (Support & Contact)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
