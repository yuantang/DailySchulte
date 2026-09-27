import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Target,
  Eye,
  Sliders,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Timer,
  FileText,
  Info,
  Mail,
  Star,
  ChevronRight,
} from 'lucide-react';
import { TrainingSettings, DailyReminderConfig } from '../types';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendTrainingNotification,
  saveStoredReminder,
} from '../utils/reminder';
import { Capacitor } from '@capacitor/core';
import { SettingsDetailModal, SettingsDetailType } from './SettingsDetailModals';
import { Switch } from './ui/Switch';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TrainingSettings;
  onUpdateSettings: (newSettings: Partial<TrainingSettings>) => void;
  isDailyDoneToday: boolean;
}

const PRESET_TIMES = [
  { time: '08:30', label: '早晨晨醒 🌅', desc: '开启一天清醒专注' },
  { time: '13:30', label: '午后提神 ⚡', desc: '击退午后昏睡疲乏' },
  { time: '20:00', label: '晚间练习 🌙', desc: '黄金专注训练时段' },
  { time: '21:30', label: '睡前复盘 📖', desc: '静心专注反思训练' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  isDailyDoneToday,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState<boolean>(true);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });
  const [detailType, setDetailType] = useState<SettingsDetailType>(null);
  const [isTimePickerModalOpen, setIsTimePickerModalOpen] = useState(false);
  const [tempHour, setTempHour] = useState('20');
  const [tempMinute, setTempMinute] = useState('00');

  const openTimePicker = () => {
    const parts = (settings.reminder.time || '20:00').split(':');
    setTempHour(parts[0] || '20');
    setTempMinute(parts[1] || '00');
    setIsTimePickerModalOpen(true);
  };

  const handleConfirmTime = () => {
    handleTimeChange(`${tempHour}:${tempMinute}`);
    setIsTimePickerModalOpen(false);
  };

  const handleResetToDefaultTime = () => {
    setTempHour('20');
    setTempMinute('00');
  };

  // Refresh notification status on open
  useEffect(() => {
    if (isOpen) {
      const isSupp = isNotificationSupported();
      setSupported(isSupp);
      if (isSupp) {
        getNotificationPermission().then(setPermission);
      }
      setTestResult({ status: 'idle', message: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const reminder = settings.reminder;

  const handleToggleReminder = async (enabled: boolean) => {
    let nextPermission = permission;
    if (enabled && permission !== 'granted') {
      nextPermission = await requestNotificationPermission();
      setPermission(nextPermission);
      if (nextPermission !== 'granted') {
        setTestResult({
          status: 'error',
          message: Capacitor.isNativePlatform()
            ? '未授予通知权限。请前往 iOS「设置 - 每日舒尔特」开启通知权限。'
            : '未授予通知权限。请在浏览器地址栏或系统设置中允许通知。',
        });
      }
    }

    const updatedReminder: DailyReminderConfig = {
      ...reminder,
      enabled: enabled && nextPermission === 'granted',
    };

    onUpdateSettings({ reminder: updatedReminder });
    saveStoredReminder(updatedReminder);
  };

  const handleTimeChange = (newTime: string) => {
    const updatedReminder: DailyReminderConfig = {
      ...reminder,
      time: newTime,
    };
    onUpdateSettings({ reminder: updatedReminder });
    saveStoredReminder(updatedReminder);
  };

  const handleToggleOnlyIfNotCompleted = (val: boolean) => {
    const updatedReminder: DailyReminderConfig = {
      ...reminder,
      onlyIfNotCompleted: val,
    };
    onUpdateSettings({ reminder: updatedReminder });
    saveStoredReminder(updatedReminder);
  };

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      setTestResult({
        status: 'success',
        message: '通知权限已成功开启！您可以正常接收每日训练提醒。',
      });
      const updatedReminder = { ...reminder, enabled: true };
      onUpdateSettings({ reminder: updatedReminder });
      saveStoredReminder(updatedReminder);
    } else {
      setTestResult({
        status: 'error',
        message: Capacitor.isNativePlatform()
          ? '通知权限未开启。若要开启，请前往 iOS「设置 - 每日舒尔特」开启通知。'
          : '通知权限被拒绝或取消。若要开启，请检查浏览器地址栏权限设置。',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative overflow-y-auto max-h-[92vh] pb-safe space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  训练设置与习惯提醒
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  修改自动保存
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                修改即时生效 · 零手动保存负担
              </p>
            </div>
          </div>

          <button
            id="btn-close-settings-modal"
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Daily Reminder Section (FEATURED HIGHLIGHT) */}
        <div className="bg-gradient-to-br from-amber-500/5 via-slate-50 to-amber-500/10 rounded-2xl p-4 sm:p-5 border border-amber-500/30 shadow-2xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Bell className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    每日固定训练提醒
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    习惯养成
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  设定每天固定的专注练习时间，应用将通过系统通知准时提醒，助您形成每日打卡闭环。
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="shrink-0 mt-1">
              <Switch
                id="toggle-daily-reminder-switch"
                checked={reminder.enabled}
                onChange={handleToggleReminder}
                label="每日固定训练提醒"
                colorScheme="amber"
              />
            </div>
          </div>

          {/* Notification Permission Status Banner */}
          <div className="p-3 rounded-xl bg-white border border-slate-200/90 text-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">
                  {Capacitor.isNativePlatform() ? '系统通知权限状态:' : '浏览器通知权限状态:'}
                </span>
              </div>
              {permission === 'granted' ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  已授权正常
                </span>
              ) : permission === 'denied' ? (
                <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  已被禁止
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 text-[11px]">
                  待授权
                </span>
              )}
            </div>

            {/* If not granted, offer direct permission button */}
            {permission !== 'granted' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
                <p className="text-[11px] text-slate-500">
                  {permission === 'denied'
                    ? Capacitor.isNativePlatform()
                      ? '通知已被拦截。请前往 iPhone「设置 - 每日舒尔特 - 通知」开启通知权限。'
                      : '通知被拦截。请点击浏览器地址栏左侧的“网站设置/锁头”图标，手动将“通知”设为“允许”。'
                    : '需要您的授权才能按时推送每日专注力训练提醒。'}
                </p>
                {permission !== 'denied' && (
                  <button
                    type="button"
                    onClick={handleRequestPermission}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                  >
                    授权通知权限
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Time Picker and Quick Presets */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="input-reminder-time" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>设定每日提醒时间</span>
              </label>
              <span className="text-[11px] text-slate-400">24小时制 (HH:mm)</span>
            </div>

            {/* Time Picker Card (Clean & Focused) */}
            <div className="w-full">
              <button
                id="btn-open-time-picker"
                type="button"
                onClick={openTimePicker}
                className="w-full bg-white text-slate-900 font-mono text-base font-bold px-4 py-3 rounded-2xl border border-slate-300 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer flex items-center justify-between shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-base font-bold text-slate-900 font-mono tracking-wide">{reminder.time}</div>
                    <div className="text-[11px] font-sans text-slate-400 font-normal">每日准时提醒</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-sans text-amber-700 font-semibold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/70 group-hover:bg-amber-100 transition-colors">
                  <span>修改时间</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
              {PRESET_TIMES.map((preset) => {
                const isCurrent = reminder.time === preset.time;
                return (
                  <button
                    key={preset.time}
                    type="button"
                    onClick={() => handleTimeChange(preset.time)}
                    className={`px-2.5 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs font-bold'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold leading-tight">{preset.time}</div>
                    <div className="text-[10px] opacity-80 truncate">{preset.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Smart Rule: Only notify if today not completed */}
          <div className="pt-2 border-t border-amber-500/20">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={reminder.onlyIfNotCompleted}
                onChange={(e) => handleToggleOnlyIfNotCompleted(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900">
                  智能免打扰：仅在今日未打卡时发送提醒
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  若当天您已完成至少一局练习或每日打卡，设定的时间将自动保持静默，不重复打扰。
                  {isDailyDoneToday && (
                    <span className="text-emerald-600 font-semibold ml-1">
                      (今日已完成打卡，今晚将免打扰)
                    </span>
                  )}
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* 2. Visual & Focus Fixation Options */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              视觉凝视与辅助提示
            </h3>
          </div>

          <div className="space-y-2">
            {/* Center Focus Dot */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="pr-3">
                <div className="text-xs sm:text-sm font-bold text-slate-900">红心凝视定点 (Center Dot)</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed font-normal">
                  在棋盘中心保持红色注视锚点，强迫眼球利用周边余光扫视
                </div>
              </div>
              <div className="shrink-0">
                <Switch
                  id="switch-center-focus-dot"
                  checked={settings.centerFocusDot}
                  onChange={(val) => onUpdateSettings({ centerFocusDot: val })}
                  label="红心凝视定点"
                  colorScheme="rose"
                />
              </div>
            </div>

            {/* Next Target Prompt */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="pr-3">
                <div className="text-xs sm:text-sm font-bold text-slate-900">目标提示 (Target Prompt)</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed font-normal">
                  在训练区上方实时提示下一个目标项，新手推荐开启
                </div>
              </div>
              <div className="shrink-0">
                <Switch
                  id="switch-next-target-prompt"
                  checked={settings.showNextTarget}
                  onChange={(val) => onUpdateSettings({ showNextTarget: val })}
                  label="目标提示"
                  colorScheme="amber"
                />
              </div>
            </div>

            {/* 3-2-1 Countdown */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="pr-3">
                <div className="text-xs sm:text-sm font-bold text-slate-900">3-2-1 聚焦倒计时</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed font-normal">
                  开始前预留 3 秒呼吸定睛时间，平息心率再切入计时
                </div>
              </div>
              <div className="shrink-0">
                <Switch
                  id="switch-321-countdown"
                  checked={settings.countdownEnabled}
                  onChange={(val) => onUpdateSettings({ countdownEnabled: val })}
                  label="3-2-1 聚焦倒计时"
                  colorScheme="amber"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Audio & Penalty Rules */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              音效与严谨惩罚机制
            </h3>
          </div>

          <div className="space-y-2">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="pr-3">
                <div className="text-xs sm:text-sm font-bold text-slate-900">音效反馈 (Audio FX)</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed font-normal">
                  点击正向音频激励与点错阻断音
                </div>
              </div>
              <div className="shrink-0">
                <Switch
                  id="switch-sound-feedback"
                  checked={settings.soundEnabled}
                  onChange={(val) => onUpdateSettings({ soundEnabled: val })}
                  label="音效反馈"
                  colorScheme="emerald"
                />
              </div>
            </div>

            {/* Error Penalty selector */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="pr-3">
                <div className="text-xs sm:text-sm font-bold text-slate-900">点错惩罚罚时</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed font-normal">
                  错误点击追加至总计时中的惩罚时间
                </div>
              </div>
              <select
                value={settings.errorPenaltyMs}
                onChange={(e) => onUpdateSettings({ errorPenaltyMs: Number(e.target.value) })}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs sm:text-sm font-bold rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer transition-all shadow-2xs"
              >
                <option value={0}>无惩罚 (0s)</option>
                <option value={500}>轻微 (+0.5s)</option>
                <option value={1000}>标准 (+1.0s)</option>
                <option value={2000}>严苛 (+2.0s)</option>
              </select>
            </div>

            {/* Memory mode hide delay */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="pr-3">
                <div className="text-xs sm:text-sm font-bold text-slate-900">记忆盲打隐退延时</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed font-normal">
                  盲打模式开始后棋盘保持可见的时长
                </div>
              </div>
              <select
                value={settings.blindHideDelaySeconds}
                onChange={(e) => onUpdateSettings({ blindHideDelaySeconds: Number(e.target.value) })}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs sm:text-sm font-bold rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer transition-all shadow-2xs"
              >
                <option value={2}>2秒 (超速记忆)</option>
                <option value={3}>3秒 (快速记忆)</option>
                <option value={4}>4秒 (标准记忆)</option>
                <option value={6}>6秒 (从容观察)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Policies, Agreements, About & Feedback Card (tailored for 每日舒尔特 with cohesive light design) */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              关于、合规与反馈支持
            </h3>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100 shadow-2xs">
            {/* 1. 隐私保护政策 */}
            <button
              id="btn-settings-privacy"
              type="button"
              onClick={() => setDetailType('privacy')}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left hover:bg-slate-50/80 active:bg-slate-100/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                    隐私保护政策
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">
                    100% 端侧存储 · 零云端追踪 · 专注数据安全
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* 2. 用户服务协议 */}
            <button
              id="btn-settings-terms"
              type="button"
              onClick={() => setDetailType('terms')}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left hover:bg-slate-50/80 active:bg-slate-100/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                    用户服务协议
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">
                    服务条款 · 科学训练与健康免责 · 专注训练守则
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* 3. 关于每日舒尔特 */}
            <button
              id="btn-settings-about"
              type="button"
              onClick={() => setDetailType('about')}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left hover:bg-slate-50/80 active:bg-slate-100/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200/80 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Info className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-sky-700 transition-colors">
                    关于每日舒尔特
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">
                    版本信息 · 科学原理与理念 · 独立开发致谢
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* 4. 联系与反馈建议 */}
            <button
              id="btn-settings-feedback"
              type="button"
              onClick={() => setDetailType('feedback')}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left hover:bg-slate-50/80 active:bg-slate-100/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-amber-700 transition-colors">
                    联系与反馈建议
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">
                    开发直通邮箱 · 题型建议征集 · 问题上报
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* 5. 给每日舒尔特好评鼓励 */}
            <button
              id="btn-settings-rating"
              type="button"
              onClick={() => setDetailType('rating')}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left hover:bg-amber-50/40 active:bg-amber-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div className="truncate">
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-amber-700 transition-colors">
                    给每日舒尔特好评鼓励
                  </div>
                  <div className="text-xs text-amber-600 font-medium mt-0.5 truncate">
                    支持纯粹专注训练 · 为每日舒尔特点亮五星好评 ✨
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-500 shrink-0 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>

        {/* Detail Modals */}
        <SettingsDetailModal
          type={detailType}
          onClose={() => setDetailType(null)}
        />

        {/* 纯中文时间选择弹窗 (彻底杜绝系统原生 Reset 英文控件) */}
        {isTimePickerModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
            onClick={() => setIsTimePickerModalOpen(false)}
          >
            <div
              className="w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
                <button
                  type="button"
                  onClick={() => setIsTimePickerModalOpen(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  取消
                </button>
                <h4 className="text-sm font-bold text-slate-900">选择每日提醒时间</h4>
                <button
                  type="button"
                  onClick={handleConfirmTime}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-colors cursor-pointer"
                >
                  完成
                </button>
              </div>

              {/* Time Display */}
              <div className="py-3 text-center bg-slate-50/40 border-b border-slate-100">
                <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-wider">
                  {tempHour} : {tempMinute}
                </div>
                <p className="text-xs text-slate-500 mt-1">24小时制 · 每日准时推送训练提醒</p>
              </div>

              {/* Hour & Minute Picker Columns */}
              <div className="p-3.5 grid grid-cols-2 gap-3">
                {/* Hours Column */}
                <div>
                  <div className="text-xs font-bold text-slate-600 mb-1 text-center flex items-center justify-center gap-1">
                    <span>小时</span>
                    <span className="text-[10px] text-slate-400 font-normal">(00~23)</span>
                  </div>
                  <div className="h-44 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-1 space-y-1">
                    {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map((hour) => {
                      const isSelected = tempHour === hour;
                      return (
                        <button
                          key={hour}
                          type="button"
                          onClick={() => setTempHour(hour)}
                          className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'text-slate-700 hover:bg-white'
                          }`}
                        >
                          {hour} 时
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Minutes Column */}
                <div>
                  <div className="text-xs font-bold text-slate-600 mb-1 text-center flex items-center justify-center gap-1">
                    <span>分钟</span>
                    <span className="text-[10px] text-slate-400 font-normal">(00~59)</span>
                  </div>
                  <div className="h-44 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-1 space-y-1">
                    {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')).map((minute) => {
                      const isSelected = tempMinute === minute;
                      return (
                        <button
                          key={minute}
                          type="button"
                          onClick={() => setTempMinute(minute)}
                          className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'text-slate-700 hover:bg-white'
                          }`}
                        >
                          {minute} 分
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Reset to Default */}
              <div className="px-3.5 pb-3.5">
                <button
                  type="button"
                  onClick={handleResetToDefaultTime}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  重置为默认时间 (20:00)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
