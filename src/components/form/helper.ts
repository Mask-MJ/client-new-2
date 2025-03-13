import type { FormItemGiProps, FormItemRule } from 'naive-ui';

import type { ComponentName } from './component';
import type { FormSchema } from './types';

import { i18n } from '@/locales';

const t = i18n.global.t;
// 生成placeholder
export function createPlaceholderMessage(component: ComponentName, type?: string) {
  if (['Complete', 'NInput'].includes(component)) {
    return t('components.form.inputText');
  }
  if (['NCascader', 'NCheckbox', 'NRadioGroup', 'NSelect', 'NSwitch'].includes(component)) {
    return t('components.form.chooseText');
  }
  if (['NDatePicker'].includes(component)) {
    if (type === 'start') {
      return t('components.form.startTime');
    } else if (type === 'end') {
      return t('components.form.endTime');
    } else {
      return t('components.form.chooseText');
    }
  }
  return '';
}

export function createFormItemRule(schemas: FormSchema) {
  if (schemas.required && !schemas.rule) {
    const rule: FormItemRule = { required: true, message: `${schemas.label}为必填项` };
    if (['NAutoComplete', 'NInput'].includes(schemas.component)) {
      rule.trigger = ['blur', 'input'];
    } else if (['ApiSelect', 'ApiTree', 'NTreeSelect'].includes(schemas.component)) {
      rule.type = 'number';
      rule.trigger = ['blur', 'change'];
    } else if (['NCheckbox', 'NCheckboxGroup'].includes(schemas.component)) {
      rule.type = 'array';
      rule.trigger = ['blur', 'change'];
    } else if (['NInputNumber'].includes(schemas.component)) {
      rule.type = 'number';
      rule.trigger = ['blur', 'change'];
    } else if (['NRadioGroup'].includes(schemas.component)) {
      rule.trigger = 'change';
    }
    schemas.rule = rule;
  }
  return schemas as FormItemGiProps;
}
