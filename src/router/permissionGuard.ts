import type { Router } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@/config/constants';
import { DEFAULT_PREFERENCES } from '@/config/preferences';
import { flatMapDeep } from 'lodash-es';
import { storeToRefs } from 'pinia';
/**
 * 通用守卫配置
 * @param router
 */
function setupCommonGuard(router: Router) {
  // 记录已经加载的页面
  const loadedPaths = new Set<string>();
  router.beforeEach(async (to) => {
    to.meta.loaded = loadedPaths.has(to.path);

    // 页面加载进度条
    if (!to.meta.loaded && DEFAULT_PREFERENCES.transition.progress) {
      window.$loadingBar.start();
    }
    return true;
  });

  router.afterEach((to) => {
    // 记录页面是否加载,如果已经加载，后续的页面切换动画等效果不在重复执行

    loadedPaths.add(to.path);

    // 关闭页面加载进度条
    if (DEFAULT_PREFERENCES.transition.progress) {
      window.$loadingBar.finish();
    }
  });
}

/**
 * 权限访问守卫配置
 * @param router
 */
function setupAccessGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const userStore = useUserStore();
    const { fetchUserInfo, fetchMenuList, setIsAccessChecked } = userStore;
    const { accessToken, accessMenus, isAccessChecked } = storeToRefs(userStore);
    // 明确声明忽略权限访问权限，则可以访问
    if (to.meta.ignoreAccess) {
      if (to.path === LOGIN_PATH && accessToken.value) {
        return decodeURIComponent((to.query?.redirect as string) || DEFAULT_HOME_PATH);
      }
      return true;
    }
    // accessToken 检查
    if (!accessToken.value) {
      // 没有访问权限，跳转登录页面
      return {
        path: LOGIN_PATH,
        query:
          to.fullPath === DEFAULT_HOME_PATH ? {} : { redirect: encodeURIComponent(to.fullPath) },
        replace: true,
      };
    }

    // 是否已经初始化权限
    if (isAccessChecked.value) {
      // 权限检查
      // 扁平化菜单
      const menus = flatMapDeep(accessMenus.value, (item) => item.children);
      const hasAccess = menus.filter((item) => item?.path === to.path);
      if (hasAccess.length > 0) {
        return true;
      }
    }

    await fetchUserInfo();
    await fetchMenuList();
    setIsAccessChecked(true);

    const redirectPath = (from.query.redirect ??
      (to.path === DEFAULT_HOME_PATH ? DEFAULT_HOME_PATH : to.fullPath)) as string;

    return { ...router.resolve(decodeURIComponent(redirectPath)), replace: true };
  });
}

/**
 * 项目守卫配置
 * @param router
 */
function createRouterGuard(router: Router) {
  /** 通用 */
  setupCommonGuard(router);
  /** 权限访问 */
  setupAccessGuard(router);
}

export { createRouterGuard };
