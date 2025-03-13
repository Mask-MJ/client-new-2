import type { ButtonProps, FormInst, FormItemGiProps, FormProps, GridItemProps } from 'naive-ui';

import type { ExtractPropTypes, VNode } from 'vue';

import type { ComponentMap } from './component';
import type { basicProps } from './props';

// 按钮配置
export interface ButtonOptions extends ButtonProps {
  show: boolean;
  label: string;
}
export type ResetButtonOptions = {
  // 自定义提交函数
  resetFunc: () => Promise<void>;
} & Partial<ButtonOptions>;
export type SubmitButtonOptions = {
  // 回车自动提交
  autoSubmitOnEnter: boolean;
  // 自定义提交函数
  submitFunc: () => Promise<void>;
  // 提交表单后是否重置表单
  submitOnReset: boolean;
} & Partial<ButtonOptions>;
// 时间结构
export type PathMapToTime = [string, [string, string], ([string, string] | string)?][];
// 渲染回调参数
export interface RenderCallbackParams {
  schema: FormSchema;
  values: Record<string, any>;
  model: Record<string, any>;
  path: string;
}
export interface FormAction {
  /** 是否显示操作按钮组 */
  show: boolean;
  /** 操作按钮组栅格配置 */
  actionGi: Partial<GridItemProps>;
  /** 重置按钮属性 */
  resetButtonOptions: Partial<ResetButtonOptions>;
  /** 提交按钮属性 */
  submitButtonOptions: Partial<SubmitButtonOptions>;
  /** 当开启折叠时,是否显示收起展开按钮 */
  showAdvancedButton: boolean;
}
// 表单子项配置
export type FormSchema = {
  changeEvent?: string; // 表单更新事件名称
  defaultValue?: any; // 所渲渲染组件的初始值
  ifShow?: ((renderCallbackParams: RenderCallbackParams) => boolean) | boolean; // 动态判断当前组件是否显示，js 控制，会删除 dom
  path: string;
  render?: (renderCallbackParams: RenderCallbackParams) => string | VNode | VNode[]; // 自定义渲染组件
  renderComponentContent?:
    | ((renderCallbackParams: RenderCallbackParams) => any)
    | string // 自定义渲染组内部的 slot
    | VNode
    | VNode[];
  show?: ((renderCallbackParams: RenderCallbackParams) => boolean) | boolean;
  slot?: string; // 自定义 slot，渲染组件
  suffix?: ((values: RenderCallbackParams) => number | string) | number | string; // 组件后面插槽
} & ComponentMap &
  FormItemGiProps;
// 表单操作事件
export interface FormActionType extends FormInst {
  submit: (e?: Event | undefined) => Promise<void>; // 提交表单
  resetPaths: () => Promise<void>; // 重置表单值
  getPathsValue: () => any; // 获取表单值
  setPathsValue: (values: Record<string, any>) => Promise<void>; // 设置表单字段值
  updateSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>; // 更新表单的 schema, 只更新函数所传的参数
  resetSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>; // 重置表单 schema
  setProps: (formProps: Partial<FormProps>) => Promise<void>; // 设置表单 Props
  removeSchemaByPath: (path: string | string[]) => Promise<void>; // 根据 path 删除 Schema
  appendSchemaByPath: (
    schema: FormSchema,
    prefixPath: string | undefined,
    first?: boolean | undefined,
  ) => Promise<void>; //  插入到指定 Path 后面，如果没传指定 Path，则插入到最后,当 first = true 时插入到第一个位置
}
// 扩展form组件配置
export type BasicFormProps = ExtractPropTypes<typeof basicProps>;
export type RegisterFn = (formInstance: FormActionType) => void;
export type UseFormReturnType = [RegisterFn, FormActionType];
