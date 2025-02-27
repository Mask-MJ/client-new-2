import type { Router } from 'vue-router';

import { getMenuList } from '@/api/system/menu';
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
  console.log(isLoading);
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
  router.beforeEach(async (to, from) => {
    const userStore = useUserStore();
    const accessToken = userStore.accessToken;
    // 明确声明忽略权限访问权限，则可以访问
    if (to.meta.ignoreAccess) {
      if (to.path === LOGIN_PATH && accessToken) {
        return decodeURIComponent((to.query?.redirect as string) || DEFAULT_HOME_PATH);
      }
      return true;
    }
    // accessToken 检查
    if (!accessToken) {
      // 没有访问权限，跳转登录页面
      return {
        path: LOGIN_PATH,
        query:
          to.fullPath === DEFAULT_HOME_PATH ? {} : { redirect: encodeURIComponent(to.fullPath) },
        replace: true,
      };
    }

    // 判断是否有用户信息
    if (!userStore.userInfo) {
      await userStore.fetchUserInfo();
    }

    if (userStore.accessMenus.length === 0) {
      const { data } = await getMenuList();
      console.log(data);
    }

    // 生成路由表
    // 当前登录用户拥有的角色标识列表
    // const userInfo = userStore.userInfo || (await userStore.fetchUserInfo());
    // const userRoles = userInfo?.roles ?? [];

    return true;

    // 保存菜单信息和路由信息
    // userStore.setAccessMenus([]);
    // userStore.setIsAccessChecked(true);
    // const redirectPath = (from.query.redirect ??
    //   (to.path === DEFAULT_HOME_PATH ? DEFAULT_HOME_PATH : to.fullPath)) as string;

    // return { ...router.resolve(decodeURIComponent(redirectPath)), replace: true };
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
