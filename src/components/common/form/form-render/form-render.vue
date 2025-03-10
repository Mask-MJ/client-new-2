<script setup lang="ts">
import type { GenericObject } from 'vee-validate';
import type { ZodTypeAny } from 'zod';

import type { FormCommonConfig, FormRenderProps, FormShape } from '../types';

import { isString } from 'lodash-es';

import { getBaseRules, getDefaultValueInZodStack } from './helper';

const props = withDefaults(
  defineProps<FormRenderProps & { globalCommonConfig?: FormCommonConfig }>(),
  {
    collapsedRows: 1,
    commonConfig: () => ({}),
    globalCommonConfig: () => ({}),
    showCollapseButton: false,
  },
);
const emits = defineEmits<{ submit: [event: any] }>();
const shapes = computed(() => {
  const resultShapes: FormShape[] = [];
  props.schema?.forEach((schema) => {
    const { fieldName } = schema;
    const rule = schema.rule as ZodTypeAny;

    let typeName = '';
    if (rule && !isString(rule)) {
      typeName = rule._def.typeName;
    }
    const baseRule = getBaseRules(rule) as ZodTypeAny;
    resultShapes.push({
      default: getDefaultValueInZodStack(rule),
      fieldName,
      required: !['ZodNullable', 'ZodOptional'].includes(typeName),
      rule: baseRule,
    });
  });
  return resultShapes;
});
const formComponent = computed(() => (props.form ? 'form' : Form));
const formComponentProps = computed(() => {
  return props.form
    ? {
        onSubmit: props.form.handleSubmit((val) => emits('submit', val)),
      }
    : {
        onSubmit: (val: GenericObject) => emits('submit', val),
      };
});
const formCollapsed = computed(() => {
  return props.collapsed;
});

// const computedSchema = computed(
//   (): (Omit<FormSchema, 'formFieldProps'> & {
//     commonComponentProps: Record<string, any>;
//     formFieldProps: Record<string, any>;
//   })[] => {
//     const {
//       colon = false,
//       componentProps = {},
//       controlClass = '',
//       disabled,
//       disabledOnChangeListener = true,
//       disabledOnInputListener = true,
//       emptyStateValue = undefined,
//       formFieldProps = {},
//       formItemClass = '',
//       hideLabel = false,
//       hideRequiredMark = false,
//       labelClass = '',
//       labelWidth = 100,
//       modelPropName = '',
//       wrapperClass = '',
//     } = mergeWithArrayOverrides(props.commonConfig, props.globalCommonConfig);

//     return {};
//   },
// );
</script>

<template>
  <div></div>
</template>

<style lang="" scoped></style>
