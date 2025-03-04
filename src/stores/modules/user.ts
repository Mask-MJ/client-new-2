import type { SignInParams, UserInfo } from '@/api/system/user';
import type { MenuRecordRaw } from '@/config/types/menu';

import { useRouter } from 'vue-router';

import { getMenuList } from '@/api/system/menu';
import { getAccessCodesApi, getUserInfoApi, login } from '@/api/system/user';
import { DEFAULT_HOME_PATH } from '@/config/constants';
import { $t } from '@/locales';
import { acceptHMRUpdate, defineStore } from 'pinia';

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
   * 是否已经检查过权限
   */
  isAccessChecked: boolean;
  /**
   * 登录 accessToken
   */
  accessToken: null | string;
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
    const state = ref<UserState>({
      accessCodes: [],
      accessMenus: [],
      accessToken: '',
      loginLoading: false,
      refreshToken: '',
      isAccessChecked: false,
      userInfo: {},
      userRoles: [],
    });

    const setAccessCodes = (codes: string[]) => {
      state.value.accessCodes = codes;
    };

    const setAccessMenus = (menus: MenuRecordRaw[] = []) => {
      state.value.accessMenus = menus;
    };

    const setAccessToken = (token: string) => {
      state.value.accessToken = token;
    };

    const setRefreshToken = (token: string) => {
      state.value.refreshToken = token;
    };

    const setIsAccessChecked = (isAccessChecked: boolean) => {
      state.value.isAccessChecked = isAccessChecked;
    };

    const setUserInfo = (info: UserInfo) => {
      state.value.userInfo = info;
      const roles = info?.roles.map((role) => role.name) ?? [];
      setUserRoles(roles);
    };

    const setUserRoles = (roles: string[]) => {
      state.value.userRoles = roles;
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
        state.value.loginLoading = true;
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
        state.value.loginLoading = false;
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
      return findMenu(state.value.accessMenus, path);
    };

    const resetState = () => {
      state.value = {
        accessCodes: [],
        accessMenus: [],
        accessToken: '',
        loginLoading: false,
        refreshToken: '',
        isAccessChecked: false,
        userInfo: {},
        userRoles: [],
      };
    };

    return {
      ...state.value,
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
