import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.printwise.calculator',
  appName: 'PrintWise Calculator',
  webDir: 'dist',
  bundledWebRuntime: false,
  version: "2025.10.05",
  plugins: {
    AdMob: {
      appId: "YOUR_ADMOB_APP_ID", // REPLACE WITH YOUR ACTUAL ADMOB APP ID
    },
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;