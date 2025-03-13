import type { ComputedRef, Ref } from 'vue';

import type { BasicFormProps, FormSchema } from '../types';

import { unref } from 'vue';

import {
  cloneDeep,
  isArray,
  isFunction,
  isNull,
  isObject,
  isString,
  isUndefined,
  set,
} from 'lodash-es';

import { dateUtil } from './dateUtil';

interface UseFormValuesContext {
  defaultValueRef: Ref<any>;
  getSchema: ComputedRef<FormSchema[]>;
  getProps: ComputedRef<BasicFormProps>;
  formModel: Record<string, any>;
}

/**
 * @desription deconstruct array-link key. This method will mutate the target.
 */
function tryDeconstructArray(key: string, value: any, target: Record<string, any>) {
  const pattern = /^\[(.+)\]$/;
  if (pattern.test(key)) {
    const match = key.match(pattern);
    if (match && match[1]) {
      const keys = match[1].split(',');
      value = Array.isArray(value) ? value : [value];
      keys.forEach((k, index) => {
        set(target, k.trim(), value[index]);
      });
      return true;
    }
  }
}

/**
 * @desription deconstruct object-link key. This method will mutate the target.
 */
function tryDeconstructObject(key: string, value: any, target: Record<string, any>) {
  const pattern = /^\{(.+)\}$/;
  if (pattern.test(key)) {
    const match = key.match(pattern);
    if (match && match[1]) {
      const keys = match[1].split(',');
      value = isObject(value) ? value : {};
      keys.forEach((k) => {
        set(target, k.trim(), value[k.trim()]);
      });
      return true;
    }
  }
}

export function useFormValues({
  defaultValueRef,
  getSchema,
  formModel,
  getProps,
}: UseFormValuesContext) {
  // Processing form values
  function handleFormValues(values: Record<string, any>) {
    if (!isObject(values)) {
      return {};
    }
    const res: Record<string, any> = {};
    for (const item of Object.entries(values)) {
      let [, value] = item;
      const [key] = item;
      if (!key || (isArray(value) && value.length === 0) || isFunction(value)) {
        continue;
      }
      const transformDateFunc = unref(getProps).transformDateFunc;
      if (isObject(value)) {
        value = transformDateFunc?.(value);
      }

      if (isArray(value) && value[0]?.format && value[1]?.format) {
        value = value.map((item) => transformDateFunc?.(item));
      }
      // Remove spaces
      if (isString(value)) {
        value = value.trim();
      }
      if (!tryDeconstructArray(key, value, res) && !tryDeconstructObject(key, value, res)) {
        // 没有解构成功的，按原样赋值
        set(res, key, value);
      }
    }
    return handleRangeTimeValue(res);
  }

  /**
   * @description: Processing time interval parameters
   */
  function handleRangeTimeValue(values: Record<string, any>) {
    const pathMapToTime = unref(getProps).pathMapToTime;

    if (!pathMapToTime || !Array.isArray(pathMapToTime)) {
      return values;
    }

    for (const [path, [startTimeKey, endTimeKey], format = 'yyyy-MM-dd'] of pathMapToTime) {
      if (!path || !startTimeKey || !endTimeKey) {
        continue;
      }
      // If the value to be converted is empty, remove the path
      if (!values[path]) {
        Reflect.deleteProperty(values, path);
        continue;
      }

      const [startTime, endTime]: string[] = values[path];

      const [startTimeFormat, endTimeFormat] = Array.isArray(format) ? format : [format, format];

      values[startTimeKey] = dateUtil(startTime).format(startTimeFormat);
      values[endTimeKey] = dateUtil(endTime).format(endTimeFormat);
      Reflect.deleteProperty(values, path);
    }

    return values;
  }

  function initDefault() {
    const schemas = unref(getSchema);
    const obj: Record<string, any> = {};
    schemas.forEach((item) => {
      const { defaultValue } = item;
      if (!(isUndefined(defaultValue) || isNull(defaultValue))) {
        obj[item.path] = defaultValue;
        if (formModel[item.path] === undefined) {
          formModel[item.path] = defaultValue;
        }
      }
    });
    defaultValueRef.value = cloneDeep(obj);
  }

  return { handleFormValues, initDefault };
}
