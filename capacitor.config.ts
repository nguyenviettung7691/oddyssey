import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.oddyssey.app',
  appName: 'Oddyssey',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      launchShowDuration: 2000,
      backgroundColor: '#1e1e1e',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
      launchFadeOutDuration: 300,
    },
    StatusBar: {
      style: 'Dark' as const,
      backgroundColor: '#1e1e1e',
    },
    Keyboard: {
      resize: 'body' as const,
      scrollAssist: true,
    },
  },
};

export default config;
