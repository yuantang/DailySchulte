import { TrainingSettings } from '../types';
import { getStoredReminder, saveStoredReminder } from './reminder';

export const USER_SETTINGS_STORAGE_KEY = 'schulte_user_settings_v1';

export const DEFAULT_TRAINING_SETTINGS: TrainingSettings = {
  soundEnabled: true,
  hapticEnabled: true,
  centerFocusDot: false,
  showNextTarget: true,
  errorPenaltyMs: 1000,
  blindHideDelaySeconds: 4,
  highContrast: false,
  dynamicShuffleLevel: 'low',
  countdownEnabled: true,
  reminder: getStoredReminder(),
};

/**
 * Retrieve saved user settings from localStorage
 */
export const getStoredUserSettings = (): TrainingSettings => {
  if (typeof window === 'undefined') return DEFAULT_TRAINING_SETTINGS;
  try {
    const raw = localStorage.getItem(USER_SETTINGS_STORAGE_KEY);
    const reminder = getStoredReminder();
    if (!raw) {
      return {
        ...DEFAULT_TRAINING_SETTINGS,
        reminder,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_TRAINING_SETTINGS,
      ...parsed,
      reminder: parsed.reminder ? { ...reminder, ...parsed.reminder } : reminder,
    };
  } catch (e) {
    return DEFAULT_TRAINING_SETTINGS;
  }
};

/**
 * Automatically persist user settings to localStorage
 */
export const saveStoredUserSettings = (settings: TrainingSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    if (settings.reminder) {
      saveStoredReminder(settings.reminder);
    }
  } catch (e) {
    console.error('Failed to save user settings', e);
  }
};
