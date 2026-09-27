/// <reference types="@capacitor/local-notifications" />
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dailyschulte.app',
  appName: '每日舒尔特',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
  },
  ios: {
    contentInset: 'never',
    scrollEnabled: false,
    backgroundColor: '#F8FAFC',
    allowsLinkPreview: false,
  },
  plugins: {
    SplashScreen: {
      backgroundColor: '#F8FAFC',
      launchAutoHide: true,
      launchShowDuration: 0,
      showSpinner: false,
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
    StatusBar: {
      overlaysWebView: true,
      style: 'LIGHT',
      backgroundColor: '#00000000',
    },
    LocalNotifications: {
      presentationOptions: ['badge', 'sound', 'banner', 'list'],
    },
  },
};

export default config;
