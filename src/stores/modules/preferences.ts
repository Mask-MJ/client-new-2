import type { Preferences } from '@/config/preferences';

import { DEFAULT_PREFERENCES, getNaiveTheme } from '@/config/preferences';
import { merge } from 'lodash-es';
import { defineStore } from 'pinia';

export const usePreferencesStore = defineStore(
  'preferences-store',
  () => {
    const state = ref<Preferences>(DEFAULT_PREFERENCES);

    // 更新偏好设置
    const updatePreferences = (preferences: Partial<Preferences>) => {
      state.value = merge({}, state.value, preferences);
    };
    // 重置偏好设置
    function resetPreferences() {
      state.value = DEFAULT_PREFERENCES;
    }

    const naiveTheme = computed(() => {
      const { primaryColor, infoColor, successColor, warningColor, errorColor } = state.value.theme;
      return getNaiveTheme({ primaryColor, infoColor, successColor, warningColor, errorColor });
    });

    return {
      state,
      naiveTheme,
      updatePreferences,
      $reset: resetPreferences,
    };
  },
  { persist: true },
);
