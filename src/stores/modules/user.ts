import type { SignInParams, UserInfo } from '@/api/system/user';
import type { MenuRecordRaw } from '@/config/types/menu';

import { getAccessCodesApi, getUserInfoApi, login } from '@/api/system/user';
import { DEFAULT_HOME_PATH } from '@/config/constants';
import { $t } from '@/locales';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useRouter } from 'vue-router';

interface UserState {
  /**
   * 权限码
   */
  accessCodes: string[];
  /**
   * 可访问的菜单列表
   */
  accessMenus: MenuRecordRaw[];
  /**
   * 登录 accessToken
   */
  accessToken: null | string;
  /**
   * 是否已经检查过权限
   */
  isAccessChecked: boolean;
  /**
   * 登录中
   */
  loginLoading: boolean;
  /**
   * 登录 refreshToken
   */
  refreshToken: null | string;
  /**
   * 用户信息
   */
  userInfo: null | UserInfo;
  /**
   * 用户角色
   */
  userRoles: string[];
}

export const useUserStore = defineStore(
  'user-store',
  () => {
    const state = reactive<UserState>({
      accessCodes: [],
      accessMenus: [],
      accessToken: null,
      isAccessChecked: false,
      loginLoading: false,
      refreshToken: null,
      userInfo: null,
      userRoles: [],
    });

    const setAccessCodes = (codes: string[]) => {
      state.accessCodes = codes;
    };

    const setAccessMenus = (menus: MenuRecordRaw[]) => {
      state.accessMenus = menus;
    };

    const setAccessToken = (token: string) => {
      state.accessToken = token;
    };

    const setIsAccessChecked = (isChecked: boolean) => {
      state.isAccessChecked = isChecked;
    };

    const setRefreshToken = (token: string) => {
      state.refreshToken = token;
    };

    const setUserInfo = (info: UserInfo) => {
      state.userInfo = info;
      const roles = info?.roles.map((role) => role.name) ?? [];
      setUserRoles(roles);
    };

    const setUserRoles = (roles: string[]) => {
      state.userRoles = roles;
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
        state.loginLoading = true;
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
        state.loginLoading = false;
      }

      return {
        userInfo: userInfoData,
      };
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
      return findMenu(state.accessMenus, path);
    };

    return {
      state,
      setAccessCodes,
      setAccessMenus,
      setAccessToken,
      setIsAccessChecked,
      setRefreshToken,
      setUserInfo,
      setUserRoles,
      fetchUserInfo,
      authLogin,
      getMenuByPath,
    };
  },
  {
    persist: {
      pick: ['state.accessToken', 'state.refreshToken', 'state.accessCodes'],
    },
  },
);

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
