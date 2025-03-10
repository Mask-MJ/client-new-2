import type { ButtonProps, FormItemProps, FormProps as NaiveFormProps } from 'naive-ui';
import type { FieldOptions, FormContext, GenericObject } from 'vee-validate';
import type { ZodTypeAny } from 'zod';

import type { HtmlHTMLAttributes } from 'vue';

type MaybeReadonlyRef<T> = (() => T) | ComputedRef<T>;
type MaybeComputedRef<T> = MaybeReadonlyRef<T> | MaybeRef<T>;

export type BaseFormComponentType =
  | 'Checkbox'
  | 'DefaultButton'
  | 'Input'
  | 'InputPassword'
  | 'PinInput'
  | 'PrimaryButton'
  | 'Select'
  | (Record<never, never> & string);

export type FormFieldOptions = Partial<
  FieldOptions & {
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    validateOnInput?: boolean;
    validateOnModelUpdate?: boolean;
  }
>;

export interface FormShape {
  /** 默认值 */
  default?: any;
  /** 字段名 */
  fieldName: string;
  /** 是否必填 */
  required?: boolean;
  rule?: ZodTypeAny;
}

export type MaybeComponentPropKey =
  | 'options'
  | 'placeholder'
  | 'title'
  | keyof HtmlHTMLAttributes
  | (Record<never, never> & string);

export type MaybeComponentProps = { [K in MaybeComponentPropKey]?: any };

export type FormActions = FormContext<GenericObject>;

export type CustomRenderType = (() => Component | string) | string;

export type FormSchemaRuleType =
  | 'required'
  | 'selectRequired'
  | null
  | (Record<never, never> & string)
  | ZodTypeAny;

type FormItemDependenciesCondition<T = boolean | PromiseLike<boolean>> = (
  value: Partial<Record<string, any>>,
  actions: FormActions,
) => T;

type FormItemDependenciesConditionWithRules = (
  value: Partial<Record<string, any>>,
  actions: FormActions,
) => FormSchemaRuleType | PromiseLike<FormSchemaRuleType>;

type FormItemDependenciesConditionWithProps = (
  value: Partial<Record<string, any>>,
  actions: FormActions,
) => MaybeComponentProps | PromiseLike<MaybeComponentProps>;

export interface FormItemDependencies extends Omit<FormItemProps, 'required' | 'rule'> {
  /**
   * 组件参数
   * @returns 组件参数
   */
  componentProps?: FormItemDependenciesConditionWithProps;
  /**
   * 是否禁用
   * @returns 是否禁用
   */
  disabled?: boolean | FormItemDependenciesCondition;
  /**
   * 是否渲染（删除dom）
   * @returns 是否渲染
   */
  if?: boolean | FormItemDependenciesCondition;
  /**
   * 是否必填
   * @returns 是否必填
   */
  required?: boolean | FormItemDependenciesCondition;
  /**
   * 字段规则
   */
  rule?: FormItemDependenciesConditionWithRules;
  /**
   * 是否隐藏(Css)
   * @returns 是否隐藏
   */
  show?: boolean | FormItemDependenciesCondition;
  /**
   * 任意触发都会执行
   */
  trigger?: FormItemDependenciesCondition<void>;
  /**
   * 触发字段
   */
  triggerFields: string[];
}

type ComponentProps =
  | ((value: Partial<Record<string, any>>, actions: FormActions) => MaybeComponentProps)
  | MaybeComponentProps;

export interface FormCommonConfig {
  /**
   * 在Label后显示一个冒号
   */
  colon?: boolean;
  /**
   * 所有表单项的props
   */
  componentProps?: ComponentProps;
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
   * 所有表单项的控件样式
   * @default {}
   */
  formFieldProps?: FormFieldOptions;
  /**
   * 所有表单项的model属性名
   * @default "modelValue"
   */
  modelPropName?: string;
}

type RenderComponentContentType = (
  value: Partial<Record<string, any>>,
  api: FormActions,
) => Record<string, any>;

export type HandleSubmitFn = (values: Record<string, any>) => Promise<void> | void;

export type HandleResetFn = (values: Record<string, any>) => Promise<void> | void;

export type FieldMappingTime = [
  string,
  [string, string],
  (((value: any, fieldName: string) => any) | [string, string] | null | string)?,
][];

export interface FormSchema<T extends BaseFormComponentType = BaseFormComponentType>
  extends FormCommonConfig {
  /** 组件 */
  component: Component | T;
  /** 组件参数 */
  componentProps?: ComponentProps;
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
  // 自定义组件内部渲染
  renderComponentContent?: RenderComponentContentType;
  /** 字段规则 */
  rule?: FormSchemaRuleType;
  /** 后缀 */
  suffix?: CustomRenderType;
}

export interface FormFieldProps extends FormSchema {
  required?: boolean;
}

export interface FormRenderProps<T extends BaseFormComponentType = BaseFormComponentType>
  extends NaiveFormProps {
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
  componentBindEventMap?: Partial<Record<BaseFormComponentType, string>>;
  /**
   * 组件集合
   */
  componentMap: Record<BaseFormComponentType, Component>;
  /**
   * 表单实例
   */
  form?: FormContext<GenericObject>;
  /**
   * 表单定义
   */
  schema?: FormSchema<T>[];
  /**
   * 是否显示展开/折叠
   */
  showCollapseButton?: boolean;
}

export interface ActionButtonOptions extends ButtonProps {
  [key: string]: any;
  content?: MaybeComputedRef<string>;
  show?: boolean;
}

export interface FormProps<T extends BaseFormComponentType = BaseFormComponentType>
  extends Omit<FormRenderProps<T>, 'componentBindEventMap' | 'componentMap' | 'form'> {
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
