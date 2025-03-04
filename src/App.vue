<script setup lang="ts">
import type { WatermarkProps } from 'naive-ui';

import { RouterView } from 'vue-router';

import { darkTheme, dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui';
import { storeToRefs } from 'pinia';

import { getNaiveTheme } from './config/preferences';

const userStore = useUserStore();
const preferencesStore = usePreferencesStore();
const { userInfo } = storeToRefs(userStore);
const { app, theme } = storeToRefs(preferencesStore);
const naiveTheme = computed(() => {
  const { error, info, primary, success, warning } = theme.value;
  return getNaiveTheme({ error, info, primary, success, warning });
});

const naiveDarkTheme = computed(() => (theme.value.mode === 'dark' ? darkTheme : undefined));
const naiveLocale = computed(() => (app.value.locale === 'zh-CN' ? zhCN : enUS));
const naiveDateLocale = computed(() => (app.value.locale === 'zh-CN' ? dateZhCN : dateEnUS));
const watermarkProps = computed<WatermarkProps>(() => {
  return {
    content: userInfo.value?.username || app.value.name,
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
      <NWatermark v-if="app.watermark" v-bind="watermarkProps" />
    </NaiveProvider>
  </NConfigProvider>
</template>

<style scoped></style>
