<script setup lang="ts">
import type { WatermarkProps } from 'naive-ui';

import { RouterView } from 'vue-router';

import { darkTheme, dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui';

import { getNaiveTheme } from './config/preferences';

const { appConfig, themeConfig } = usePreferencesStore();
const { userInfo } = useUserStore();
const naiveTheme = computed(() => {
  const { error, info, primary, success, warning } = themeConfig;
  return getNaiveTheme({ error, info, primary, success, warning });
});
console.log('naiveTheme', naiveTheme);

const naiveDarkTheme = computed(() => (themeConfig.mode === 'dark' ? darkTheme : undefined));
const naiveLocale = computed(() => (appConfig.locale === 'zh-CN' ? zhCN : enUS));
const naiveDateLocale = computed(() => (appConfig.locale === 'zh-CN' ? dateZhCN : dateEnUS));

const watermarkProps = computed<WatermarkProps>(() => {
  return {
    content: userInfo?.username || appConfig.name,
    cross: true,
    fullscreen: true,
    fontSize: 16,
    lineHeight: 16,
    width: 384,
    height: 384,
    xOffset: 12,
    yOffset: 60,
    rotate: -15,
    zIndex: 9999,
  };
});
</script>

<template>
  <NConfigProvider
    :theme="naiveDarkTheme"
    :theme-overrides="naiveTheme"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
    class="h-full"
  >
    <NaiveProvider>
      <RouterView class="bg-layout" />
      <NWatermark v-if="appConfig.watermark" v-bind="watermarkProps" />
    </NaiveProvider>
  </NConfigProvider>
</template>

<style scoped></style>
