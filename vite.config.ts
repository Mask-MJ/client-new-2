import type { ConfigEnv } from 'vite';

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { unheadVueComposablesImports } from '@unhead/vue';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import Mkcert from 'vite-plugin-mkcert';
import VueDevTools from 'vite-plugin-vue-devtools';
import Layouts from 'vite-plugin-vue-layouts';

import { viteInjectAppLoadingPlugin } from './build/appLoadingPlugin';

// https://vite.dev/config/
export default defineConfig((config: ConfigEnv) => {
  const { command, mode } = config;
  const { VITE_BASE, VITE_PORT, VITE_PROXY, VITE_GLOB_APP_TITLE } = loadEnv(mode, process.cwd());

  return {
    base: VITE_BASE,
    build: {
      chunkSizeWarningLimit: 2000,
      reportCompressedSize: false,
      sourcemap: false,
    },
    esbuild: {
      drop: command === 'build' ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },
    plugins: [
      VueRouter({
        dts: './types/typed-router.d.ts',
        routesFolder: [{ path: '', src: 'src/views' }],
        // extensions: ['.page.vue'],
      }),
      Vue(),
      VueJsx(),
      VueDevTools(),
      Mkcert(),
      Unocss(),
      VueI18nPlugin({
        include: [path.resolve(process.cwd(), 'src/locales/lang/**')],
        runtimeOnly: true,
      }),
      Layouts(),
      AutoImport({
        dirs: ['src/stores', 'src/components/common'],
        dts: 'types/auto-imports.d.ts',
        imports: [
          'vue',
          'vue-i18n',
          VueRouterAutoImports,
          unheadVueComposablesImports,
          '@vueuse/core',
          { 'vue-router/auto': ['useLink'] },
          { 'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'] },
        ],
        vueTemplate: true,
      }),
      Components({ dts: 'types/components.d.ts', resolvers: [NaiveUiResolver()] }),
      createHtmlPlugin({ minify: true }),
      viteInjectAppLoadingPlugin(VITE_GLOB_APP_TITLE),
    ],
    resolve: {
      alias: {
        '#': fileURLToPath(new URL('types', import.meta.url)),
        '@': fileURLToPath(new URL('src', import.meta.url)),
      },
    },
    server: {
      host: true,
      port: Number(VITE_PORT) || 3100,
      proxy: {
        '/api': {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          target: VITE_PROXY,
        },
      },
    },
  };
});
