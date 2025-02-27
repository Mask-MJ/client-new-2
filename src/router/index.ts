import type { App } from 'vue';

import { createRouter, createWebHistory } from 'vue-router';
import { routes } from 'vue-router/auto-routes';

import { setupLayouts } from 'virtual:generated-layouts';

import { createRouterGuard } from './permissionGuard';

export const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes),
  scrollBehavior: () => ({ left: 0, top: 0 }),
  strict: true,
});

export function initRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
}
