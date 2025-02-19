import type { PartialDeep } from 'type-fest';

import { isMacOs } from '@/utils';
import { breakpointsTailwind, useBreakpoints, useDebounceFn, useStorage } from '@vueuse/core';
import { merge } from 'lodash-es';
import { markRaw, reactive, readonly, watch } from 'vue';

import type { Preferences } from './types';

import { defaultPreferences } from './config';
import { updateCSSVariables } from './update-css-variables';

const STORAGE_KEY = 'preferences';
const STORAGE_KEY_LOCALE = `${STORAGE_KEY}-locale`;
const STORAGE_KEY_THEME = `${STORAGE_KEY}-theme`;

class PreferenceManager {
  private initialPreferences: Preferences = defaultPreferences;
  private isInitialized: boolean = false;
  private savePreferences: (preference: Preferences) => void;
  private state: Preferences = reactive<Preferences>({
    ...this.loadPreferences(),
  });

  private storage_key = useStorage(STORAGE_KEY, this.state);
  private storage_key_locale = useStorage(STORAGE_KEY_LOCALE, this.state.app.locale);
  private storage_key_theme = useStorage(STORAGE_KEY_THEME, this.state.theme.mode);

  constructor() {
    // 避免频繁的操作缓存
    this.savePreferences = useDebounceFn(
      (preference: Preferences) => this._savePreferences(preference),
      150,
    );
  }

  clearCache() {
    this.storage_key.value = null;
    this.storage_key_locale.value = null;
    this.storage_key_theme.value = null;
  }

  public getInitialPreferences() {
    return this.initialPreferences;
  }

  public getPreferences() {
    return readonly(this.state);
  }

  /**
   * 覆盖偏好设置
   * overrides  要覆盖的偏好设置
   * namespace  命名空间
   */
  public async initPreferences(overrides: PartialDeep<Preferences>) {
    // 是否初始化过
    if (this.isInitialized) {
      return;
    }
    // 合并初始偏好设置
    this.initialPreferences = merge({}, overrides, defaultPreferences);

    // 加载并合并当前存储的偏好设置
    const mergedPreference = merge({}, this.loadCachedPreferences() || {}, this.initialPreferences);

    // 更新偏好设置
    this.updatePreferences(mergedPreference);

    this.setupWatcher();

    this.initPlatform();
    // 标记为已初始化
    this.isInitialized = true;
  }

  /**
   * 重置偏好设置
   * 偏好设置将被重置为初始值，并从 localStorage 中移除。
   *
   * @example
   * 假设 initialPreferences 为 { theme: 'light', language: 'en' }
   * 当前 state 为 { theme: 'dark', language: 'fr' }
   * this.resetPreferences();
   * 调用后，state 将被重置为 { theme: 'light', language: 'en' }
   * 并且 localStorage 中的对应项将被移除
   */
  resetPreferences() {
    // 将状态重置为初始偏好设置
    Object.assign(this.state, this.initialPreferences);
    // 保存重置后的偏好设置
    this.savePreferences(this.state);
    // 从存储中移除偏好设置项
    this.clearCache();
    this.updatePreferences(this.state);
  }

  /**
   * 更新偏好设置
   * @param updates - 要更新的偏好设置
   */
  public updatePreferences(updates: PartialDeep<Preferences>) {
    const mergedState = merge({}, updates, markRaw(this.state));

    Object.assign(this.state, mergedState);

    // 根据更新的键值执行相应的操作
    this.handleUpdates(updates);
    this.savePreferences(this.state);
  }

  /**
   * 保存偏好设置
   * @param {Preferences} preference - 需要保存的偏好设置
   */
  private _savePreferences(preference: Preferences) {
    this.storage_key.value = preference;
    this.storage_key_locale.value = preference.app.locale;
    this.storage_key_theme.value = preference.theme.mode;
  }

  /**
   * 处理更新的键值
   * 根据更新的键值执行相应的操作。
   * @param {DeepPartial<Preferences>} updates - 部分更新的偏好设置
   */
  private handleUpdates(updates: PartialDeep<Preferences>) {
    const themeUpdates = updates.theme || {};
    const appUpdates = updates.app || {};
    if (themeUpdates && Object.keys(themeUpdates).length > 0) {
      updateCSSVariables(this.state);
    }

    if (Reflect.has(appUpdates, 'colorGrayMode') || Reflect.has(appUpdates, 'colorWeakMode')) {
      this.updateColorMode(this.state);
    }
  }

  private initPlatform() {
    const dom = document.documentElement;
    dom.dataset.platform = isMacOs() ? 'macOs' : 'window';
  }

  /**
   *  从缓存中加载偏好设置。如果缓存中没有找到对应的偏好设置，则返回默认偏好设置。
   */
  private loadCachedPreferences() {
    return this.storage_key?.value;
  }

  /**
   * 加载偏好设置
   * @returns {Preferences} 加载的偏好设置
   */
  private loadPreferences(): Preferences {
    return this.loadCachedPreferences() || { ...defaultPreferences };
  }

  /**
   * 监听状态和系统偏好设置的变化。
   */
  private setupWatcher() {
    if (this.isInitialized) {
      return;
    }

    // 监听断点，判断是否移动端
    const breakpoints = useBreakpoints(breakpointsTailwind);
    const isMobile = breakpoints.smaller('md');
    watch(
      () => isMobile.value,
      (val) => {
        this.updatePreferences({
          app: { isMobile: val },
        });
      },
      { immediate: true },
    );

    // 监听系统主题偏好设置变化
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', ({ matches: isDark }) => {
        this.updatePreferences({
          theme: { mode: isDark ? 'dark' : 'light' },
        });
      });
  }

  /**
   * 更新页面颜色模式（灰色、色弱）
   * @param preference
   */
  private updateColorMode(preference: Preferences) {
    if (preference.app) {
      const { colorGrayMode, colorWeakMode } = preference.app;
      const dom = document.documentElement;
      const COLOR_WEAK = 'invert-mode';
      const COLOR_GRAY = 'grayscale-mode';
      if (colorWeakMode) {
        dom.classList.add(COLOR_WEAK);
      } else {
        dom.classList.remove(COLOR_WEAK);
      }
      if (colorGrayMode) {
        dom.classList.add(COLOR_GRAY);
      } else {
        dom.classList.remove(COLOR_GRAY);
      }
    }
  }
}

const preferencesManager = new PreferenceManager();
export { PreferenceManager, preferencesManager };
