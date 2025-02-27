import type { Preferences } from '@/config/preferences';

import {
  createThemeToken,
  DEFAULT_PREFERENCES,
  getCssVarByTokens,
  initPreferences,
} from '@/config/preferences';
import { useStyleTag } from '@vueuse/core';
import { merge } from 'lodash-es';
import { defineStore } from 'pinia';

export const usePreferencesStore = defineStore(
  'preferences-store',
  () => {
    const state = ref<Preferences>(initPreferences());

    // 更新偏好设置
    const updatePreferences = (preferences: Partial<Preferences>) => {
      state.value = merge({}, state.value, preferences);
    };
    // 重置偏好设置
    function resetPreferences() {
      state.value = DEFAULT_PREFERENCES;
    }

    /** Setup theme vars to global */
    function setupThemeVarsToGlobal() {
      const { themeTokens, darkThemeTokens } = createThemeToken(themeColors.value);
      // addThemeVarsToGlobal(themeTokens, darkThemeTokens);
      const cssVarStr = getCssVarByTokens(themeTokens);
      const darkCssVarStr = getCssVarByTokens(darkThemeTokens);
      const css = `:root{${cssVarStr}}`;

      const darkCss = `html.dark{${darkCssVarStr}}`;
      useStyleTag(css + darkCss, { id: 'theme-vars' });
    }

    const appConfig = computed(() => state.value.app);
    const themeConfig = computed(() => state.value.theme);
    const themeColors = computed(() => {
      const { error, info, primary, success, warning } = state.value.theme;
      return { error, info, primary, success, warning };
    });

    watch(
      themeColors,
      (val) => {
        console.log('themeColors', val);
        setupThemeVarsToGlobal();
      },
      { immediate: true },
    );

    return {
      ...state,
      appConfig,
      themeConfig,
      $reset: resetPreferences,
      updatePreferences,
    };
  },
  { persist: true },
);
