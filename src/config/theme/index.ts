import { themeSettings } from './settings';

export function initThemeState() {
  const isProd = import.meta.env.PROD;
  // if it is development mode, the theme State will not be cached, by update `themeState` in `src/theme/State.ts` to update theme State
  if (!isProd) return themeSettings;

  // if it is production mode, the theme settings will be cached in localStorage
  // if want to update theme settings when publish new version, please update `overrideThemeSettings` in `src/theme/settings.ts`
}
