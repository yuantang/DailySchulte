import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { InAppReview } from '@capacitor-community/in-app-review';
import { Share } from '@capacitor/share';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

let appReadyPromise: Promise<void> | undefined;
function waitForAppReady(): Promise<void> {
  const win = window as Window & { __schulteAppReady?: boolean };
  if (win.__schulteAppReady) return Promise.resolve();
  if (appReadyPromise) return appReadyPromise;

  appReadyPromise = new Promise((resolve) => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.removeEventListener('app-ready', finish);
      resolve();
    };
    window.addEventListener('app-ready', finish);
    // Fallback: don't wait indefinitely if app-ready event isn't dispatched
    window.setTimeout(finish, 1200);
  });
  return appReadyPromise;
}

let safeNativeBridgePromise: Promise<void> | undefined;
function waitForSafeNativeBridge(): Promise<void> {
  if (safeNativeBridgePromise) return safeNativeBridgePromise;
  safeNativeBridgePromise = waitForAppReady().then(() => {
    const win = window as Window & { __schulteAppReadyAt?: number };
    const readyAt = win.__schulteAppReadyAt ?? window.performance.now();
    const elapsed = window.performance.now() - readyAt;
    return delay(Math.max(0, 200 - elapsed));
  });
  return safeNativeBridgePromise;
}

function revealApp(): void {
  document.documentElement.classList.remove('splash-active');
  const bootHint = document.getElementById('boot-hint');
  if (bootHint) bootHint.remove();
}

function hideSplashWhenReady(): void {
  let hidden = false;
  const hide = async () => {
    if (hidden) return;
    hidden = true;
    try {
      await SplashScreen.hide({ fadeOutDuration: 0 });
    } catch {
      // ignore
    }
    revealApp();
  };

  void waitForSafeNativeBridge().then(hide);
}

async function configureStatusBar(): Promise<void> {
  try {
    await StatusBar.setOverlaysWebView({ overlay: true });
  } catch {
    // ignore
  }
  try {
    // Style.Light = dark icons for light background
    await StatusBar.setStyle({ style: Style.Light });
  } catch {
    // ignore
  }
}

async function initNativeShell(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  document.documentElement.classList.add('capacitor-native');

  hideSplashWhenReady();
  await waitForSafeNativeBridge();
  void configureStatusBar();

  try {
    await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
  } catch {
    // ignore
  }

  void App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) window.history.back();
  });

  // Taptic Engine Haptic Feedback Listener
  window.addEventListener('haptic-feedback', async (e: Event) => {
    const customEvent = e as CustomEvent<{
      type?: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';
    }>;
    const type = customEvent.detail?.type || 'light';
    try {
      if (type === 'success' || type === 'warning' || type === 'error') {
        const map = {
          success: NotificationType.Success,
          warning: NotificationType.Warning,
          error: NotificationType.Error,
        } as const;
        await Haptics.notification({ type: map[type] });
      } else if (type === 'selection') {
        await Haptics.selectionStart();
        await Haptics.selectionChanged();
      } else {
        const styleMap = {
          light: ImpactStyle.Light,
          medium: ImpactStyle.Medium,
          heavy: ImpactStyle.Heavy,
        } as const;
        await Haptics.impact({ style: styleMap[type] });
      }
    } catch {
      // ignore
    }
  });

  // Native In-App Review
  window.addEventListener('app-review-request', () => {
    void InAppReview.requestReview().catch(() => {
      // System may suppress dialogue according to Apple policy
    });
  });

  // Native Share Sheet
  window.addEventListener('native-share', async (e: Event) => {
    const customEvent = e as CustomEvent<{
      title?: string;
      text?: string;
      url?: string;
      files?: string[];
    }>;
    if (!customEvent.detail) return;
    try {
      await Share.share({
        title: customEvent.detail.title,
        text: customEvent.detail.text,
        url: customEvent.detail.url,
        files: customEvent.detail.files,
        dialogTitle: customEvent.detail.title || '分享训练成果',
      });
    } catch {
      // User cancelled or share failed
    }
  });
}

void initNativeShell();
