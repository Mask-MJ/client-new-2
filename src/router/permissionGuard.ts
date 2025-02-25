import type { Router } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@/config/constants';
import { DEFAULT_PREFERENCES } from '@/config/preferences';
import { useNProgress } from '@vueuse/integrations/useNProgress';
/**
 * 通用守卫配置
 * @param router
 */
function setupCommonGuard(router: Router) {
  // 记录已经加载的页面
  const loadedPaths = new Set<string>();
  const { isLoading } = useNProgress();
  router.beforeEach(async (to) => {
    to.meta.loaded = loadedPaths.has(to.path);

    // 页面加载进度条
    if (!to.meta.loaded && DEFAULT_PREFERENCES.transition.progress) {
      isLoading.value = true;
    }
    return true;
  });

  router.afterEach((to) => {
    // 记录页面是否加载,如果已经加载，后续的页面切换动画等效果不在重复执行

    loadedPaths.add(to.path);

    // 关闭页面加载进度条
    if (DEFAULT_PREFERENCES.transition.progress) {
      isLoading.value = false;
    }
  });
}

/**
 * 权限访问守卫配置
 * @param router
 */
function setupAccessGuard(router: Router) {
  router.beforeEach(async (to) => {
    const userStore = useUserStore();
    const accessToken = userStore.state.accessToken;
    const coreRouteNames = ['login', '404', '403'];
    // 基本路由，这些路由不需要进入权限拦截
    if (coreRouteNames.includes(to.name as string)) {
      if (to.path === LOGIN_PATH && accessToken) {
        return decodeURIComponent((to.query?.redirect as string) || DEFAULT_HOME_PATH);
      }
      return true;
    }

    // accessToken 检查
    if (!accessToken) {
      // 明确声明忽略权限访问权限，则可以访问
      if (to.meta.ignoreAccess) {
        return true;
      }

      // 没有访问权限，跳转登录页面
      if (to.fullPath !== LOGIN_PATH) {
        return {
          path: LOGIN_PATH,
          // 如不需要，直接删除 query
          query:
            to.fullPath === DEFAULT_HOME_PATH ? {} : { redirect: encodeURIComponent(to.fullPath) },
          // 携带当前跳转的页面，登录后重新跳转该页面
          replace: true,
        };
      }
      return to;
    }

    // // 是否已经生成过动态路由
    // if (userStore.isAccessChecked) {
    //   return true
    // }

    // // 保存菜单信息和路由信息
    // userStore.setAccessMenus([])
    // userStore.setIsAccessChecked(true)
    // const redirectPath = (from.query.redirect ?? (to.path === DEFAULT_HOME_PATH ? DEFAULT_HOME_PATH : to.fullPath)) as string

    // return {
    //   ...router.resolve(decodeURIComponent(redirectPath)),
    //   replace: true,
    // }
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
