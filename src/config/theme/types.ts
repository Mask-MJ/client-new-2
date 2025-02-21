type ThemeScheme = 'light' | 'dark' | 'auto';
type ThemeTabMode = 'button' | 'chrome';
/** Page animate mode */
type ThemePageAnimateMode =
  | 'fade'
  | 'fade-slide'
  | 'fade-bottom'
  | 'fade-scale'
  | 'zoom-fade'
  | 'zoom-out'
  | 'none';

interface ThemeSettingTokenColor {
  /** the progress bar color, if not set, will use the primary color */
  nprogress?: string;
  container: string;
  layout: string;
  inverted: string;
  'base-text': string;
}

interface ThemeSettingTokenBoxShadow {
  header: string;
  sider: string;
  tab: string;
}

interface ThemeSettingToken {
  colors: ThemeSettingTokenColor;
  boxShadow: ThemeSettingTokenBoxShadow;
}

/**
 * The layout mode
 *
 * - vertical: the vertical menu in left
 * - horizontal: the horizontal menu in top
 * - vertical-mix: two vertical mixed menus in left
 * - horizontal-mix: the vertical first level menus in left and horizontal child level menus in top
 */
type ThemeLayoutMode = 'vertical' | 'horizontal' | 'vertical-mix' | 'horizontal-mix';

/**
 * The scroll mode when content overflow
 *
 * - Wrapper: the layout component's wrapper element has a scrollbar
 * - Content: the layout component's content element has a scrollbar
 *
 * @default 'wrapper'
 */
type ThemeScrollMode = 'wrapper' | 'content';

/**
 * Reset cache strategy
 *
 * - close: re-cache when close page
 * - refresh: re-cache when refresh page
 */
type ResetCacheStrategy = 'close' | 'refresh';

interface ThemeOtherColor {
  info: string;
  success: string;
  warning: string;
  error: string;
}

interface ThemeColor extends ThemeOtherColor {
  primary: string;
}

export type {
  ThemeTabMode,
  ThemeScheme,
  ThemeSettingToken,
  ThemeLayoutMode,
  ThemeScrollMode,
  ThemePageAnimateMode,
  ResetCacheStrategy,
  ThemeOtherColor,
  ThemeColor,
};
