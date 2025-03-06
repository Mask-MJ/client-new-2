/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'vue-router'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    'FallbackNotFound': RouteRecordInfo<'FallbackNotFound', '/:all(.*)', { all: ParamValue<true> }, { all: ParamValue<false> }>,
    'login': RouteRecordInfo<'login', '/auth/login', Record<never, never>, Record<never, never>>,
    '/dashboard/analytics': RouteRecordInfo<'/dashboard/analytics', '/dashboard/analytics', Record<never, never>, Record<never, never>>,
    '/system/menu/': RouteRecordInfo<'/system/menu/', '/system/menu', Record<never, never>, Record<never, never>>,
    'SystemUser': RouteRecordInfo<'SystemUser', '/system/user', Record<never, never>, Record<never, never>>,
  }
}
