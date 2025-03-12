import type { ButtonProps, FormItemGiProps, FormProps as NaiveFormProps } from 'naive-ui';

import type { ComponentName, ComponentPropsType } from './component';

export type CustomRenderType = (() => Component | string) | string;
// 渲染回调参数
export interface RenderCallbackParams {
  schema: FormSchema;
  values: Record<string, any>;
  model: Record<string, any>;
  path: string;
}

export interface FormItemDependencies extends FormItemGiProps {
  /**
   * 组件参数
   * @returns 组件参数
   */
  componentProps?: ComponentPropsType;

  /**
   * 是否渲染（删除dom）
   * @returns 是否渲染
   */
  if?: ((renderCallbackParams: RenderCallbackParams) => boolean) | boolean;

  /**
   * 是否隐藏(Css)
   * @returns 是否隐藏
   */
  show?: ((renderCallbackParams: RenderCallbackParams) => boolean) | boolean;
  /**
   * 任意触发都会执行
   */
  // trigger?: FormItemDependenciesCondition<void>;
  /**
   * 触发字段
   */
  triggerFields: string[];
}

export interface FormCommonConfig {
  /**
   * 在Label后显示一个冒号
   */
  colon?: boolean;
  /**
   * 所有表单项的props
   */
  componentProps?: ComponentPropsType;
  /**
   * 所有表单项的禁用状态
   * @default false
   */
  disabled?: boolean;
  /**
   * 是否禁用所有表单项的change事件监听
   * @default true
   */
  disabledOnChangeListener?: boolean;
  /**
   * 是否禁用所有表单项的input事件监听
   * @default true
   */
  disabledOnInputListener?: boolean;
  /**
   * 所有表单项的空状态值,naive-ui的空状态值是null
   */
  emptyStateValue?: null;
  /**
   * 所有表单项的model属性名
   * @default "modelValue"
   */
  modelPropName?: string;
}

export type HandleSubmitFn = (values: Record<string, any>) => Promise<void> | void;

export type HandleResetFn = (values: Record<string, any>) => Promise<void> | void;

export type FieldMappingTime = [
  string,
  [string, string],
  (((value: any, fieldName: string) => any) | [string, string] | null | string)?,
][];

// 表单子项配置
export interface FormSchema extends FormCommonConfig {
  /** 组件 */
  component: ComponentName;
  /** 组件参数 */
  componentProps?: ComponentPropsType;
  /** 默认值 */
  defaultValue?: any;
  /** 依赖 */
  dependencies?: FormItemDependencies;
  /** 描述 */
  description?: CustomRenderType;
  /** 字段名 */
  fieldName: string;
  /** 帮助信息 */
  help?: CustomRenderType;
  /** 表单项 */
  label?: CustomRenderType;
  /** 后缀 */
  suffix?: CustomRenderType;
}

export interface FormRenderProps extends NaiveFormProps {
  /**
   * 是否展开，在showCollapseButton=true下生效
   */
  collapsed?: boolean;
  /**
   * 折叠时保持行数
   * @default 1
   */
  collapsedRows?: number;
  /**
   * 是否触发resize事件
   * @default false
   */
  collapseTriggerResize?: boolean;
  /**
   * 表单项通用后备配置，当子项目没配置时使用这里的配置，子项目配置优先级高于此配置
   */
  commonConfig?: FormCommonConfig;
  /**
   * 紧凑模式（移除表单每一项底部为校验信息预留的空间）
   */
  compact?: boolean;
  /**
   * 组件v-model事件绑定
   */
  componentBindEventMap?: Partial<Record<ComponentName, string>>;
  /**
   * 组件集合
   */
  componentMap: Record<ComponentName, Component>;
  /**
   * 表单定义
   */
  schema?: FormSchema[];
  /**
   * 是否显示展开/折叠
   */
  showCollapseButton?: boolean;
}

export interface ActionButtonOptions extends ButtonProps {
  [key: string]: any;
  content?: string;
  show?: boolean;
}

export interface FormProps
  extends Omit<FormRenderProps, 'componentBindEventMap' | 'componentMap' | 'form'> {
  /**
   * 表单字段映射
   */
  fieldMappingTime?: FieldMappingTime;
  /**
   * 表单重置回调
   */
  handleReset?: HandleResetFn;
  /**
   * 表单提交回调
   */
  handleSubmit?: HandleSubmitFn;
  /**
   * 表单值变化回调
   */
  handleValuesChange?: (values: Record<string, any>) => void;
  /**
   * 重置按钮参数
   */
  resetButtonOptions?: ActionButtonOptions;
  /**
   * 是否显示默认操作按钮
   * @default true
   */
  showDefaultActions?: boolean;

  /**
   * 提交按钮参数
   */
  submitButtonOptions?: ActionButtonOptions;

  /**
   * 是否在字段值改变时提交表单
   * @default false
   */
  submitOnChange?: boolean;

  /**
   * 是否在回车时提交表单
   * @default false
   */
  submitOnEnter?: boolean;
}
