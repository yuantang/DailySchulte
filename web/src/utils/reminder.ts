import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { DailyReminderConfig } from '../types';

export const REMINDER_STORAGE_KEY = 'schulte_daily_reminder_v1';
export const SCHULTE_LOCAL_NOTIF_ID = 1001;

export const DEFAULT_REMINDER_CONFIG: DailyReminderConfig = {
  enabled: false,
  time: '20:00',
  onlyIfNotCompleted: true,
  lastNotifiedDate: '',
};

/**
 * Checks if notification is supported by the current environment (Native or Web).
 */
export const isNotificationSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (Capacitor.isNativePlatform()) return true;
  return 'Notification' in window;
};

/**
 * Gets current notification permission status: 'default' | 'granted' | 'denied'.
 */
export const getNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined') return 'denied';

  if (Capacitor.isNativePlatform()) {
    try {
      const status = await LocalNotifications.checkPermissions();
      if (status.display === 'granted') return 'granted';
      if (status.display === 'denied') return 'denied';
      return 'default';
    } catch {
      return 'denied';
    }
  }

  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
};

/**
 * Requests notification permission from user.
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined') return 'denied';

  if (Capacitor.isNativePlatform()) {
    try {
      const res = await LocalNotifications.requestPermissions();
      return res.display === 'granted' ? 'granted' : 'denied';
    } catch (e) {
      console.warn('[LocalNotification] Permission request failed:', e);
      return 'denied';
    }
  }

  if (!('Notification' in window)) return 'denied';

  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.warn('[Notification] Failed to request permission:', error);
    return 'denied';
  }
};

/**
 * Syncs the schedule with iOS Native Local Notifications.
 */
export const syncNativeReminderSchedule = async (config: DailyReminderConfig): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // 1. Cancel previous recurring notification
    await LocalNotifications.cancel({
      notifications: [{ id: SCHULTE_LOCAL_NOTIF_ID }],
    });

    if (!config.enabled) return;

    // 2. Request permission if not already granted
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') return;

    // 3. Schedule daily recurring notification at the specified hour and minute
    const [hours, minutes] = config.time.split(':').map(Number);

    await LocalNotifications.schedule({
      notifications: [
        {
          id: SCHULTE_LOCAL_NOTIF_ID,
          title: '每日舒尔特：专注力训练时刻到了！🎯',
          body: '花 3 分钟完成一组舒尔特方格挑战，保持敏锐视界与每日连续打卡！',
          schedule: {
            on: {
              hour: isNaN(hours) ? 20 : hours,
              minute: isNaN(minutes) ? 0 : minutes,
            },
            repeats: true,
            allowWhileIdle: true,
          },
          sound: undefined,
          actionTypeId: '',
          extra: {
            type: 'daily_training',
          },
        },
      ],
    });
  } catch (e) {
    console.warn('[LocalNotification] Failed to sync schedule:', e);
  }
};

/**
 * Sends an immediate notification for Schulte training.
 */
export const sendTrainingNotification = (options?: {
  title?: string;
  body?: string;
  onClick?: () => void;
}): boolean => {
  const title = options?.title || '每日舒尔特：专注力训练时刻到了！🎯';
  const body =
    options?.body ||
    '您设定的每日训练时间已到。花 3 分钟进行一组舒尔特方格练习，保持敏锐视界与连续打卡！';

  if (Capacitor.isNativePlatform()) {
    void LocalNotifications.schedule({
      notifications: [
        {
          id: Math.floor(Date.now() % 100000),
          title,
          body,
          schedule: { at: new Date(Date.now() + 500) },
        },
      ],
    });
    return true;
  }

  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: 'schulte-daily-training-reminder',
      badge: '/favicon.ico',
    });

    notification.onclick = () => {
      try {
        window.focus();
      } catch (e) {
        // ignore
      }
      notification.close();
      if (options?.onClick) {
        options.onClick();
      }
    };

    return true;
  } catch (error) {
    console.warn('[Notification] Failed to create Notification:', error);
    return false;
  }
};

/**
 * Retrieve saved reminder config from localStorage.
 */
export const getStoredReminder = (): DailyReminderConfig => {
  if (typeof window === 'undefined') return DEFAULT_REMINDER_CONFIG;
  try {
    const raw = localStorage.getItem(REMINDER_STORAGE_KEY);
    if (!raw) return DEFAULT_REMINDER_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_REMINDER_CONFIG,
      ...parsed,
    };
  } catch (e) {
    return DEFAULT_REMINDER_CONFIG;
  }
};

/**
 * Save reminder config to localStorage and sync native iOS scheduler.
 */
export const saveStoredReminder = (config: DailyReminderConfig): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(config));
    void syncNativeReminderSchedule(config);
  } catch (e) {
    console.error('Failed to save reminder config', e);
  }
};

/**
 * Evaluates whether a notification should be fired right now (Web polling fallback).
 */
export const shouldTriggerReminder = (
  config: DailyReminderConfig,
  isDailyDoneToday: boolean,
  currentDateStr: string,
  currentTimeHHMM: string
): boolean => {
  if (!config.enabled) return false;
  if (config.lastNotifiedDate === currentDateStr) return false;
  if (config.onlyIfNotCompleted && isDailyDoneToday) return false;

  return config.time === currentTimeHHMM;
};

