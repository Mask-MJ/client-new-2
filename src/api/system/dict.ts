import type { components, operations } from '#/openapi';

import { client } from '@/utils';

export type DictDataInfo = components['schemas']['DictDataEntity'];
export type DictTypeInfo = components['schemas']['DictTypeEntity'];
export type SearchParams = operations['DictTypeController_findAll']['parameters']['query'];

// 获取字典列表
export function getDictTypeList(query?: SearchParams) {
  return client.GET('/api/system/dict-type', { params: { query } });
}
// 创建字典
export function createDictType(body: components['schemas']['CreateDictTypeDto']) {
  return client.POST('/api/system/dict-type', { body });
}
// 获取单个字典信息
export function getDictTypeDetail(id: number) {
  return client.GET('/api/system/dict-type/{id}', { params: { path: { id } } });
}
// 更新字典
export function updateDictType(body: components['schemas']['UpdateDictTypeDto']) {
  return client.PATCH('/api/system/dict-type/{id}', { body, params: { path: { id: body.id } } });
}
// 删除字典
export function deleteDictType(id: number) {
  return client.DELETE('/api/system/dict-type/{id}', { params: { path: { id } } });
}

// 获取字典数据列表
export function getDictDataList(query: SearchParams) {
  return client.GET('/api/system/dict-data', { params: { query } });
}
// 创建字典数据
export function createDictData(body: components['schemas']['CreateDictDataDto']) {
  return client.POST('/api/system/dict-data', { body });
}
// 获取单个字典数据信息
export function getDictDataDetail(id: number) {
  return client.GET('/api/system/dict-data/{id}', { params: { path: { id } } });
}
// 更新字典数据
export function updateDictData(body: components['schemas']['UpdateDictDataDto']) {
  return client.PATCH('/api/system/dict-data/{id}', { body, params: { path: { id: body.id } } });
}
// 删除字典数据
export function deleteDictData(id: number) {
  return client.DELETE('/api/system/dict-data/{id}', { params: { path: { id } } });
}
