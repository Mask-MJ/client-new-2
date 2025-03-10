import type { Preferences, ThemeColor } from '@/config/preferences';

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
    const { css } = useStyleTag('', { id: 'theme-vars' });
    // 更新偏好设置
    const updatePreferences = (preferences: Partial<Preferences>) => {
      state.value = merge({}, state.value, preferences);
    };
    // 重置偏好设置
    function resetState() {
      state.value = DEFAULT_PREFERENCES;
    }
    // 设置主题颜色, 注入全局css变量
    function setupThemeVarsToGlobal(val: ThemeColor) {
      const { themeTokens, darkThemeTokens } = createThemeToken(val);
      const cssVarStr = getCssVarByTokens(themeTokens);
      const darkCssVarStr = getCssVarByTokens(darkThemeTokens);
      css.value = `:root{${cssVarStr}} html.dark{${darkCssVarStr}}`;
    }

    const themeColors = computed(() => {
      const { error, info, primary, success, warning } = state.value.theme;
      return { error, info, primary, success, warning };
    });

    const isDarkTheme = computed(() => state.value.theme.mode === 'dark');

    watch(
      themeColors,
      (val) => {
        setupThemeVarsToGlobal(val);
      },
      { immediate: true },
    );

    return {
      ...state.value,
      $reset: resetState,
      updatePreferences,
      isDarkTheme,
    };
  },
  { persist: true },
);
