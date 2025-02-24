import type { ColorPaletteNumber } from './color/types';
import type { ThemeColorKey, ThemePaletteColor, ThemeTokenCSSVars } from './types';

/** Create color palette vars */
function createColorPaletteVars() {
  const colors: ThemeColorKey[] = ['primary', 'info', 'success', 'warning', 'error'];
  const colorPaletteNumbers: ColorPaletteNumber[] = [
    50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
  ];

  const colorPaletteVar = {} as ThemePaletteColor;

  colors.forEach((color) => {
    colorPaletteVar[color] = `rgb(var(--${color}-color))`;
    colorPaletteNumbers.forEach((number) => {
      colorPaletteVar[`${color}-${number}`] = `rgb(var(--${color}-${number}-color))`;
    });
  });

  return colorPaletteVar;
}

const colorPaletteVars = createColorPaletteVars();

/** Theme vars */
export const themeVars: ThemeTokenCSSVars = {
  colors: {
    ...colorPaletteVars,
    nprogress: 'rgb(var(--nprogress-color))',
    container: 'rgb(var(--container-bg-color))',
    layout: 'rgb(var(--layout-bg-color))',
    inverted: 'rgb(var(--inverted-bg-color))',
    'base-text': 'rgb(var(--base-text-color))',
  },
  boxShadow: {
    header: 'var(--header-box-shadow)',
    sider: 'var(--sider-box-shadow)',
    tab: 'var(--tab-box-shadow)',
  },
};
