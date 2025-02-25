import type { GlobalThemeOverrides } from 'naive-ui';

import { TinyColor } from '@ctrl/tinycolor';
import { getColors } from 'theme-colors';

import type { ThemeColor, NaiveColorKey, ThemeColorKey, NaiveColorAction } from './types';

function getPaletteColorByNumber(color: string, number: number): string {
  const theme = getColors(new TinyColor(color).toHexString());
  return theme[number] || color;
}

function getNaiveThemeColors(colors: ThemeColor) {
  const colorActions: NaiveColorAction[] = [
    { scene: '', handler: (color) => color },
    { scene: 'Suppl', handler: (color) => getPaletteColorByNumber(color, 400) },
    { scene: 'Hover', handler: (color) => getPaletteColorByNumber(color, 400) },
    { scene: 'Pressed', handler: (color) => getPaletteColorByNumber(color, 700) },
    { scene: 'Active', handler: (color) => color },
  ];

  const themeColors: Partial<Record<NaiveColorKey, string>> = {};
  const colorEntries = Object.entries(colors) as [ThemeColorKey, string][];

  colorEntries.forEach(([key, color]) => {
    colorActions.forEach(({ scene, handler }) => {
      themeColors[`${key}${scene}`] = handler(color);
    });
  });

  return themeColors;
}

/**
 * Get naive theme
 *
 * @param colors Theme colors
 * @param [recommended=false] Use recommended color. Default is `false`
 */
export function getNaiveTheme(colors: ThemeColor) {
  const { primaryColor: colorLoading } = colors;

  const theme: GlobalThemeOverrides = {
    common: {
      ...getNaiveThemeColors(colors),
      borderRadius: '6px',
    },
    LoadingBar: {
      colorLoading,
    },
    Tag: {
      borderRadius: '6px',
    },
  };

  return theme;
}
