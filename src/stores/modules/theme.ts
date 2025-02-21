import type {
  ResetCacheStrategy,
  ThemeLayoutMode,
  ThemeOtherColor,
  ThemePageAnimateMode,
  ThemeScheme,
  ThemeScrollMode,
  ThemeSettingToken,
  ThemeTabMode,
} from '@/config/theme/types';

import { defineStore } from 'pinia';

export interface ThemeState {
  /**
   * @zh_CN 主题模式
   * @en_US Theme scheme
   */
  themeScheme: ThemeScheme;
  /**
   * @zh_CN 灰度模式
   * @en_US grayscale mode
   */
  grayscale: boolean;
  /** colour weakness mode */
  colourWeakness: boolean;
  /** Whether to recommend color */
  recommendColor: boolean;
  /** Theme color */
  themeColor: string;
  /** Other color */
  otherColor: ThemeOtherColor;
  /** Whether info color is followed by the primary color */
  isInfoFollowPrimary: boolean;
  /** Reset cache strategy */
  resetCacheStrategy: ResetCacheStrategy;
  /** Layout */
  layout: {
    /** Layout mode */
    mode: ThemeLayoutMode;
    /** Scroll mode */
    scrollMode: ThemeScrollMode;
    /**
     * Whether to reverse the horizontal mix
     *
     * if true, the vertical child level menus in left and horizontal first level menus in top
     */
    reverseHorizontalMix: boolean;
  };
  /** Page */
  page: {
    /** Whether to show the page transition */
    animate: boolean;
    /** Page animate mode */
    animateMode: ThemePageAnimateMode;
  };
  /** Header */
  header: {
    /** Header height */
    height: number;
    /** Header breadcrumb */
    breadcrumb: {
      /** Whether to show the breadcrumb */
      visible: boolean;
      /** Whether to show the breadcrumb icon */
      showIcon: boolean;
    };
    /** Multilingual */
    multilingual: {
      /** Whether to show the multilingual */
      visible: boolean;
    };
  };
  /** Tab */
  tab: {
    /** Whether to show the tab */
    visible: boolean;
    /**
     * Whether to cache the tab
     *
     * If cache, the tabs will get from the local storage when the page is refreshed
     */
    cache: boolean;
    /** Tab height */
    height: number;
    /** Tab mode */
    mode: ThemeTabMode;
  };
  /** Fixed header and tab */
  fixedHeaderAndTab: boolean;
  /** Sider */
  sider: {
    /** Inverted sider */
    inverted: boolean;
    /** Sider width */
    width: number;
    /** Collapsed sider width */
    collapsedWidth: number;
    /** Sider width when the layout is 'vertical-mix' or 'horizontal-mix' */
    mixWidth: number;
    /** Collapsed sider width when the layout is 'vertical-mix' or 'horizontal-mix' */
    mixCollapsedWidth: number;
    /** Child menu width when the layout is 'vertical-mix' or 'horizontal-mix' */
    mixChildMenuWidth: number;
  };
  /** Footer */
  footer: {
    /** Whether to show the footer */
    visible: boolean;
    /** Whether fixed the footer */
    fixed: boolean;
    /** Footer height */
    height: number;
    /** Whether float the footer to the right when the layout is 'horizontal-mix' */
    right: boolean;
  };
  /** Watermark */
  watermark: {
    /** Whether to show the watermark */
    visible: boolean;
    /** Watermark text */
    text: string;
  };
  /** define some theme settings tokens, will transform to css variables */
  tokens: {
    light: ThemeSettingToken;
    dark?: {
      [K in keyof ThemeSettingToken]?: Partial<ThemeSettingToken[K]>;
    };
  };
}

export const useThemeStore = defineStore('theme-store', {
  state: (): ThemeState => ({}),
});
