import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.snugglykookaburraclimb',
  appName: 'PrintWise Calculator',
  webDir: 'dist',
  bundledWebRuntime: false, // Add this line
  version: "1.0.0", // Add this line
  plugins: {
    AdMob: {
      appId: "YOUR_ADMOB_APP_ID", // REPLACE WITH YOUR ACTUAL ADMOB APP ID
    },
  },
};

export default config;