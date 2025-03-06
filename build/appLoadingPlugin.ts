import type { PluginOption } from 'vite';

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

async function viteInjectAppLoadingPlugin(
  appTitle: string,
  loadingTemplate = 'loading.html',
): Promise<PluginOption | undefined> {
  let loadingHtml = await getLoadingRawByHtmlTemplate(loadingTemplate);
  // 获取缓存的主题
  // 保证黑暗主题下，刷新页面时，loading也是黑暗主题
  const injectScript = `
    <script data-app-loading="inject-js">
      var theme = localStorage.getItem("preferences-store");
      document.documentElement.classList.toggle('dark', /dark/.test(theme));
    </script>
  `;
  // VITE_GLOB_APP_TITLE
  // loadingHtml = loadingHtml.replace('VITE_GLOB_APP_TITLE', 'VITE_GLOB_APP_TITLE222');
  // 获取环境变量， 用于替换loading模板中的变量
  if (appTitle) {
    // 已 <%= VITE_GLOB_APP_TITLE %> 为例
    const re = new RegExp(`${String.raw`<%=\s*`}VITE_GLOB_APP_TITLE${String.raw`\s*%>`}`, 'g');
    loadingHtml = loadingHtml.replaceAll(re, appTitle);
  }
  if (!loadingHtml) {
    return;
  }

  return {
    enforce: 'pre',
    name: 'vite:inject-app-loading',
    transformIndexHtml: {
      handler(html) {
        const re = /<body\s*>/;
        html = html.replace(re, `<body>${injectScript}${loadingHtml}`);
        return html;
      },
      order: 'pre',
    },
  };
}

/**
 * 用于获取loading的html模板
 */
async function getLoadingRawByHtmlTemplate(loadingTemplate: string) {
  // 支持在app内自定义loading模板，模版参考default-loading.html即可
  let appLoadingPath = join(process.cwd(), loadingTemplate);

  if (!fs.existsSync(appLoadingPath)) {
    const __dirname = fileURLToPath(new URL('.', import.meta.url));
    appLoadingPath = join(__dirname, './default-loading.html');
  }

  return await fsp.readFile(appLoadingPath, 'utf8');
}

export { viteInjectAppLoadingPlugin };
