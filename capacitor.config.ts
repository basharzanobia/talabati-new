import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.services.talabat',
  appName: 'talabat',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
		allowNavigation: [],
		cleartext: true
	},
	android: {
		allowMixedContent: true
	}
};

export default config;
