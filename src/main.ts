import { DEFAULT_PREFERENCES } from '@/config/preferences';
import { $t, setupI18n } from '@/locales';
import { initRouter, router } from '@/router';
import { initStores } from '@/stores';
import { createApp } from 'vue';

import App from './App.vue';

import '@unocss/reset/normalize.css';

async function bootstrap() {
  const app = createApp(App);

  // 国际化 i18n 配置
  await setupI18n(app);
  // 初始化全局状态管理
  initStores(app);
  // 初始化路由
  initRouter(app);
  // 动态更新标题
  watchEffect(() => {
    if (DEFAULT_PREFERENCES.app.dynamicTitle) {
      const routeTitle = router.currentRoute.value.meta?.title;
      const pageTitle = (routeTitle ? `${$t(routeTitle)} - ` : '') + DEFAULT_PREFERENCES.app.name;
      useTitle(pageTitle);
    }
  });

  app.mount('#app');
}

bootstrap();
