import type { RouteLocationNormalized, Router, RouteRecordNormalized } from 'vue-router';

import { openRouteInNewWindow } from '@/utils';
import { useNProgress } from '@vueuse/integrations/useNProgress';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, computed } from 'vue';

type TabDefinition = RouteLocationNormalized;

interface TabbarState {
  /**
   * @zh_CN 当前打开的标签页列表缓存
   */
  cachedTabs: Set<string>;
  /**
   * @zh_CN 拖拽结束的索引
   */
  dragEndIndex: number;
  /**
   * @zh_CN 需要排除缓存的标签页
   */
  excludeCachedTabs: Set<string>;
  /**
   * @zh_CN 是否加载中
   */
  isLoading: boolean;
  /**
   * @zh_CN 是否刷新
   */
  renderRouteView?: boolean;
  /**
   * @zh_CN 当前打开的标签页列表
   */
  tabs: TabDefinition[];
  /**
   * @zh_CN 更新时间，用于一些更新场景，使用watch深度监听的话，会损耗性能
   */
  updateTime?: number;
}

const { isLoading } = useNProgress();

export const useTabbarStore = defineStore(
  'tabbar-store',
  () => {
    const state = ref<TabbarState>({
      cachedTabs: new Set(),
      dragEndIndex: 0,
      excludeCachedTabs: new Set(),
      isLoading: isLoading.value,
      renderRouteView: true,
      tabs: [],
      updateTime: Date.now(),
    });

    const affixTabs = computed(() => {
      return state.value.tabs
        .filter((tab) => isAffixTab(tab))
        .sort((a, b) => {
          const orderA = (a.meta?.affixTabOrder ?? 0) as number;
          const orderB = (b.meta?.affixTabOrder ?? 0) as number;
          return orderA - orderB;
        });
    });

    const getCachedTabs = computed(() => [...state.value.cachedTabs]);
    const getExcludeCachedTabs = computed(() => [...state.value.excludeCachedTabs]);
    const getTabs = computed(() => {
      const normalTabs = state.value.tabs.filter((tab) => !isAffixTab(tab));
      return [...affixTabs.value, ...normalTabs].filter(Boolean);
    });

    function cloneTab(route: TabDefinition): TabDefinition {
      if (!route) {
        return route;
      }
      const { matched, meta, ...opt } = route;
      return {
        ...opt,
        matched: (matched
          ? matched.map((item) => ({
              meta: item.meta,
              name: item.name,
              path: item.path,
            }))
          : undefined) as RouteRecordNormalized[],
        meta: {
          ...meta,
          newTabTitle: meta.newTabTitle,
        },
      };
    }

    function isAffixTab(tab: TabDefinition) {
      return tab?.meta?.affixTab ?? false;
    }

    function isTabShown(tab: TabDefinition) {
      const matched = tab?.matched ?? [];
      return !tab.meta.hideInTab && matched.every((item) => !item.meta.hideInTab);
    }

    function getTabPath(tab: RouteRecordNormalized | TabDefinition) {
      return decodeURIComponent((tab as TabDefinition).fullPath || tab.path);
    }

    function routeToTab(route: RouteRecordNormalized) {
      return {
        meta: route.meta,
        name: route.name,
        path: route.path,
      } as TabDefinition;
    }

    async function _bulkCloseByPaths(paths: string[]) {
      state.value.tabs = state.value.tabs.filter((item) => !paths.includes(getTabPath(item)));
      await updateCacheTabs();
    }

    function _close(tab: TabDefinition) {
      const { fullPath } = tab;
      if (isAffixTab(tab)) {
        return;
      }
      const index = state.value.tabs.findIndex((item) => item.fullPath === fullPath);
      if (index !== -1) state.value.tabs.splice(index, 1);
    }

    async function _goToDefaultTab(router: Router) {
      if (getTabs.value.length <= 0) {
        return;
      }
      const firstTab = getTabs.value[0];
      if (firstTab) {
        await _goToTab(firstTab, router);
      }
    }

    async function _goToTab(tab: TabDefinition, router: Router) {
      const { params, path, query } = tab;
      const toParams = {
        params: params || {},
        path,
        query: query || {},
      };
      await router.replace(toParams);
    }

    function addTab(routeTab: TabDefinition) {
      const tab = cloneTab(routeTab);
      if (!isTabShown(tab)) {
        return;
      }

      const tabIndex = state.value.tabs.findIndex(
        (tab) => getTabPath(tab) === getTabPath(routeTab),
      );

      if (tabIndex === -1) {
        const maxNumOfOpenTab = (routeTab?.meta?.maxNumOfOpenTab ?? -1) as number;
        if (
          maxNumOfOpenTab > 0 &&
          state.value.tabs.filter((tab) => tab.name === routeTab.name).length >= maxNumOfOpenTab
        ) {
          const index = state.value.tabs.findIndex((item) => item.name === routeTab.name);
          if (index !== -1) state.value.tabs.splice(index, 1);
        }

        state.value.tabs.push(tab);
      } else {
        const currentTab = toRaw(state.value.tabs)[tabIndex];
        const mergedTab = {
          ...currentTab,
          ...tab,
          meta: { ...currentTab?.meta, ...tab.meta },
        };
        if (currentTab) {
          const curMeta = currentTab.meta;
          if (Reflect.has(curMeta, 'affixTab')) {
            mergedTab.meta.affixTab = curMeta.affixTab;
          }
          if (Reflect.has(curMeta, 'newTabTitle')) {
            mergedTab.meta.newTabTitle = curMeta.newTabTitle;
          }
        }

        state.value.tabs.splice(tabIndex, 1, mergedTab);
      }
      updateCacheTabs();
    }

    async function closeAllTabs(router: Router) {
      const newTabs = state.value.tabs.filter((tab) => isAffixTab(tab));
      state.value.tabs = newTabs.length > 0 ? newTabs : [...state.value.tabs].splice(0, 1);
      await _goToDefaultTab(router);
      updateCacheTabs();
    }

    async function closeLeftTabs(tab: TabDefinition) {
      const index = state.value.tabs.findIndex((item) => getTabPath(item) === getTabPath(tab));

      if (index < 1) {
        return;
      }

      const leftTabs = state.value.tabs.slice(0, index);
      const paths: string[] = [];

      for (const item of leftTabs) {
        if (!isAffixTab(item)) {
          paths.push(getTabPath(item));
        }
      }
      await _bulkCloseByPaths(paths);
    }

    async function closeOtherTabs(tab: TabDefinition) {
      const closePaths = state.value.tabs.map((item) => getTabPath(item));

      const paths: string[] = [];

      for (const path of closePaths) {
        if (path !== tab.fullPath) {
          const closeTab = state.value.tabs.find((item) => getTabPath(item) === path);
          if (!closeTab) {
            continue;
          }
          if (!isAffixTab(closeTab)) {
            paths.push(getTabPath(closeTab));
          }
        }
      }
      await _bulkCloseByPaths(paths);
    }

    async function closeRightTabs(tab: TabDefinition) {
      const index = state.value.tabs.findIndex((item) => getTabPath(item) === getTabPath(tab));

      if (index !== -1 && index < state.value.tabs.length - 1) {
        const rightTabs = state.value.tabs.slice(index + 1);

        const paths: string[] = [];
        for (const item of rightTabs) {
          if (!isAffixTab(item)) {
            paths.push(getTabPath(item));
          }
        }
        await _bulkCloseByPaths(paths);
      }
    }

    async function closeTab(tab: TabDefinition, router: Router) {
      const { currentRoute } = router;

      if (getTabPath(currentRoute.value) !== getTabPath(tab)) {
        _close(tab);
        updateCacheTabs();
        return;
      }
      const index = getTabs.value.findIndex(
        (item) => getTabPath(item) === getTabPath(currentRoute.value),
      );

      const before = getTabs.value[index - 1];
      const after = getTabs.value[index + 1];

      if (after) {
        _close(tab);
        await _goToTab(after, router);
      } else if (before) {
        _close(tab);
        await _goToTab(before, router);
      } else {
        console.error('Failed to close the tab; only one tab remains open.');
      }
    }

    async function closeTabByKey(key: string, router: Router) {
      const originKey = decodeURIComponent(key);
      const index = state.value.tabs.findIndex((item) => getTabPath(item) === originKey);
      if (index === -1) {
        return;
      }

      const tab = state.value.tabs[index];
      if (tab) {
        await closeTab(tab, router);
      }
    }

    function getTabByPath(path: string) {
      return getTabs.value.find((item) => getTabPath(item) === path) as TabDefinition;
    }

    async function openTabInNewWindow(tab: TabDefinition) {
      openRouteInNewWindow(tab.fullPath || tab.path);
    }

    async function pinTab(tab: TabDefinition) {
      const index = state.value.tabs.findIndex((item) => getTabPath(item) === getTabPath(tab));
      if (index !== -1) {
        const oldTab = state.value.tabs[index];
        tab.meta.affixTab = true;
        tab.meta.title = oldTab?.meta?.title as string;
        state.value.tabs.splice(index, 1, tab);
      }
      const affixTabs = state.value.tabs.filter((tab) => isAffixTab(tab));
      const newIndex = affixTabs.findIndex((item) => getTabPath(item) === getTabPath(tab));
      await sortTabs(index, newIndex);
    }

    async function refresh(router: Router) {
      const { currentRoute } = router;
      const { name } = currentRoute.value;

      state.value.excludeCachedTabs.add(name as string);
      state.value.renderRouteView = false;
      state.value.isLoading = true;

      await new Promise((resolve) => setTimeout(resolve, 200));

      state.value.excludeCachedTabs.delete(name as string);
      state.value.renderRouteView = true;
      state.value.isLoading = false;
    }

    async function resetTabTitle(tab: TabDefinition) {
      if (tab?.meta?.newTabTitle) {
        return;
      }
      const findTab = state.value.tabs.find((item) => getTabPath(item) === getTabPath(tab));
      if (findTab) {
        findTab.meta.newTabTitle = undefined;
        await updateCacheTabs();
      }
    }

    function setAffixTabs(tabs: RouteRecordNormalized[]) {
      for (const tab of tabs) {
        tab.meta.affixTab = true;
        addTab(routeToTab(tab));
      }
    }

    async function setTabTitle(tab: TabDefinition, title: string) {
      const findTab = state.value.tabs.find((item) => getTabPath(item) === getTabPath(tab));

      if (findTab) {
        findTab.meta.newTabTitle = title;
        await updateCacheTabs();
      }
    }

    function setUpdateTime() {
      state.value.updateTime = Date.now();
    }

    async function sortTabs(oldIndex: number, newIndex: number) {
      const currentTab = state.value.tabs[oldIndex];
      if (!currentTab) {
        return;
      }
      state.value.tabs.splice(oldIndex, 1);
      state.value.tabs.splice(newIndex, 0, currentTab);
      state.value.dragEndIndex = state.value.dragEndIndex + 1;
    }

    async function toggleTabPin(tab: TabDefinition) {
      const affixTab = tab?.meta?.affixTab ?? false;
      await (affixTab ? unpinTab(tab) : pinTab(tab));
    }

    async function unpinTab(tab: TabDefinition) {
      const index = state.value.tabs.findIndex((item) => getTabPath(item) === getTabPath(tab));

      if (index !== -1) {
        const oldTab = state.value.tabs[index];
        tab.meta.affixTab = false;
        tab.meta.title = oldTab?.meta?.title as string;
        state.value.tabs.splice(index, 1, tab);
      }
      const affixTabs = state.value.tabs.filter((tab) => isAffixTab(tab));
      const newIndex = affixTabs.length;
      await sortTabs(index, newIndex);
    }

    async function updateCacheTabs() {
      const cacheMap = new Set<string>();

      for (const tab of state.value.tabs) {
        const keepAlive = tab.meta?.keepAlive;
        if (!keepAlive) {
          continue;
        }
        (tab.matched || []).forEach((t, i) => {
          if (i > 0) {
            cacheMap.add(t.name as string);
          }
        });

        const name = tab.name as string;
        cacheMap.add(name);
      }
      state.value.cachedTabs = cacheMap;
    }

    return {
      state,
      affixTabs,
      getCachedTabs,
      getExcludeCachedTabs,
      getTabs,
      _bulkCloseByPaths,
      _close,
      _goToDefaultTab,
      _goToTab,
      addTab,
      closeAllTabs,
      closeLeftTabs,
      closeOtherTabs,
      closeRightTabs,
      closeTab,
      closeTabByKey,
      getTabByPath,
      openTabInNewWindow,
      pinTab,
      refresh,
      resetTabTitle,
      setAffixTabs,
      setTabTitle,
      setUpdateTime,
      sortTabs,
      toggleTabPin,
      unpinTab,
      updateCacheTabs,
    };
  },
  {
    persist: [
      {
        pick: ['state.value.tabs'],
        storage: sessionStorage,
      },
    ],
  },
);

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useTabbarStore, hot));
}
