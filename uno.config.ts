import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

import { themeVars } from './src/config/preferences/vars';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        // mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
        lucide: () => import('@iconify-json/lucide/icons.json').then((i) => i.default),
      },
    }),
    presetTypography(),
  ],
  theme: {
    ...themeVars,
  },
  shortcuts: [
    [
      'btn',
      'px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer !outline-none hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    ],
    [
      'icon-btn',
      'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600',
    ],
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
});
