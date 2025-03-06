import type { SignInParams, UserInfo } from '@/api/system/user';
import type { MenuRecordRaw } from '@/config/types/menu';

import { useRouter } from 'vue-router';

import { getMenuList } from '@/api/system/menu';
import { getAccessCodesApi, getUserInfoApi, login } from '@/api/system/user';
import { DEFAULT_HOME_PATH } from '@/config/constants';
import { $t } from '@/locales';
import { acceptHMRUpdate, defineStore } from 'pinia';

export const useUserStore = defineStore(
  'user-store',
  () => {
    // 权限码
    const accessCodes = ref<string[]>([]);
    // 可访问的菜单列表
    const accessMenus = ref<MenuRecordRaw[]>([]);
    // 登录 accessToken
    const accessToken = ref<null | string>(null);
    // 登录中
    const loginLoading = ref<boolean>(false);
    // 登录 refreshToken
    const refreshToken = ref<null | string>(null);
    // 是否已经检查过权限
    const isAccessChecked = ref<boolean>(false);
    // 用户信息
    const userInfo = ref<null | UserInfo>(null);
    // 用户角色
    const userRoles = ref<string[]>([]);

    const setAccessCodes = (codes: string[]) => {
      accessCodes.value = codes;
    };

    const setAccessMenus = (menus: MenuRecordRaw[] = []) => {
      accessMenus.value = menus;
    };

    const setAccessToken = (token: string) => {
      accessToken.value = token;
    };

    const setRefreshToken = (token: string) => {
      refreshToken.value = token;
    };

    const setIsAccessChecked = (checked: boolean) => {
      isAccessChecked.value = checked;
    };

    const setUserInfo = (info: UserInfo) => {
      userInfo.value = info;
      const roles = info?.roles.map((role) => role.name) ?? [];
      setUserRoles(roles);
    };

    const setUserRoles = (roles: string[]) => {
      userRoles.value = roles;
    };

    const fetchUserInfo = async () => {
      const { data } = await getUserInfoApi();
      if (data) {
        setUserInfo(data);
      }
      return data || null;
    };

    const authLogin = async (params: SignInParams, onSuccess?: () => Promise<void> | void) => {
      const router = useRouter();
      let userInfoData: null | UserInfo = null;
      try {
        loginLoading.value = true;
        const { data } = await login(params);
        if (data && data.accessToken) {
          setAccessToken(data.accessToken);

          const { data: accessCodesData = [] } = await getAccessCodesApi();

          userInfoData = await fetchUserInfo();

          setAccessCodes(accessCodesData);

          await (onSuccess ? onSuccess() : router.push(DEFAULT_HOME_PATH));

          if (userInfoData?.nickname) {
            window.$notification.success({
              content: $t('authentication.loginSuccess'),
              description: `${$t('authentication.loginSuccessDesc')}:${userInfoData?.nickname}`,
              duration: 3000,
            });
          }
        }
      } finally {
        loginLoading.value = false;
      }

      return {
        userInfo: userInfoData,
      };
    };

    const fetchMenuList = async () => {
      const { data } = await getMenuList();
      setAccessMenus(data);
      return data || [];
    };

    const getMenuByPath = (path: string) => {
      const findMenu = (menus: MenuRecordRaw[], path: string): MenuRecordRaw | undefined => {
        for (const menu of menus) {
          if (menu.path === path) {
            return menu;
          }
          if (menu.children) {
            const matched = findMenu(menu.children, path);
            if (matched) {
              return matched;
            }
          }
        }
      };
      return findMenu(accessMenus.value, path);
    };

    const resetState = () => {
      accessCodes.value = [];
      accessMenus.value = [];
      accessToken.value = null;
      refreshToken.value = null;
      isAccessChecked.value = false;
      userInfo.value = null;
      userRoles.value = [];
    };

    return {
      accessCodes,
      accessMenus,
      accessToken,
      loginLoading,
      refreshToken,
      isAccessChecked,
      userInfo,
      userRoles,

      $reset: resetState,

      authLogin,
      fetchMenuList,
      getMenuByPath,
      setAccessCodes,
      setAccessMenus,
      setAccessToken,
      setRefreshToken,
      setIsAccessChecked,
      setUserInfo,
      fetchUserInfo,
      setUserRoles,
    };
  },
  {
    persist: {
      pick: ['accessToken', 'refreshToken', 'accessCodes'],
    },
  },
);

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
