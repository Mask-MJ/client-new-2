import type {
  AutoCompleteProps,
  CascaderProps,
  CheckboxGroupProps,
  CheckboxProps,
  DatePickerProps,
  DividerProps,
  InputNumberProps,
  InputProps,
  RadioGroupProps,
  RateProps,
  SelectProps,
  SliderProps,
  SwitchProps,
  TimePickerProps,
  TreeProps,
  TreeSelectProps,
  UploadProps,
} from 'naive-ui';

export interface FormComponentProps {
  schema: FormSchema;
  formModel: any;
  formActionType: FormActionType;
}

type OptionsItem = {
  [name: string]: any;
  children?: OptionsItem[];
  disabled?: boolean;
  label?: string;
  value?: string;
};

interface ApiProps {
  /** 获取options数据的函数 */
  api?: (arg?: any) => Promise<OptionsItem[] | Record<string, any>>;
  /** 传递给api的参数 */
  params?: Record<string, any>;
  /** 从api返回的结果中提取options数组的字段名 */
  resultField?: string;
  /** 是否立即调用api */
  immediate?: boolean;
  /** 每次`visibleEvent`事件发生时都重新请求数据 */
  alwaysLoad?: boolean;
  /** 在api请求之前的回调函数 */
  beforeFetch?: (...arg: any) => PromiseLike<any>;
  /** 在api请求之后的回调函数 */
  afterFetch?: (...arg: any) => PromiseLike<any>;
  /** 直接传入选项数据，也作为api返回空数据时的后备数据 */
  options?: OptionsItem[];
}

type ComponentProps<T> = ((arg: any) => T) | T;

type Component =
  | { component: 'AutoComplete'; componentProps: ComponentProps<AutoCompleteProps> }
  | { component: 'Cascader'; componentProps: ComponentProps<CascaderProps> }
  | { component: 'Checkbox'; componentProps: ComponentProps<CheckboxProps> }
  | { component: 'CheckboxGroup'; componentProps: ComponentProps<CheckboxGroupProps> }
  | { component: 'DatePicker'; componentProps: ComponentProps<DatePickerProps> }
  | { component: 'Divider'; componentProps: ComponentProps<DividerProps> }
  | { component: 'Input'; componentProps: ComponentProps<InputProps> }
  | { component: 'InputNumber'; componentProps: ComponentProps<InputNumberProps> }
  | { component: 'RadioGroup'; componentProps: ComponentProps<RadioGroupProps> }
  | { component: 'Rate'; componentProps: ComponentProps<RateProps> }
  | { component: 'Select'; componentProps: ComponentProps<SelectProps> }
  | { component: 'Slider'; componentProps: ComponentProps<SliderProps> }
  | { component: 'Switch'; componentProps: ComponentProps<SwitchProps> }
  | { component: 'TimePicker'; componentProps: ComponentProps<TimePickerProps> }
  | { component: 'Tree'; componentProps: ComponentProps<TreeProps> }
  | { component: 'TreeSelect'; componentProps: ComponentProps<TreeSelectProps> }
  | { component: 'Upload'; componentProps: ComponentProps<UploadProps> };

export type ComponentName = Component['component'];
export type ComponentPropsType = Component['componentProps'];
