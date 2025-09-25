import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.snugglykookaburraclimb',
  appName: 'PrintWise Calculator',
  webDir: 'dist',
  plugins: {
    AdMob: {
      appId: "YOUR_ADMOB_APP_ID", // REPLACE WITH YOUR ACTUAL ADMOB APP ID
    },
  },
};

export default config;