import type { Component } from 'vue';

import type { ComponentName } from './component';

import {
  NCascader,
  NCheckbox,
  NCheckboxGroup,
  NDatePicker,
  NDivider,
  NInput,
  NInputNumber,
  NRate,
  NSelect,
  NSlider,
  NSwitch,
  NTimePicker,
  NTree,
  NTreeSelect,
} from 'naive-ui';

// import ApiSelect from './components/ApiSelect.vue';
// import ApiTree from './components/ApiTree.vue';
// import ApiTreeSelect from './components/ApiTreeSelect.vue';
// import AutoComplete from './components/AutoComplete.vue';
// import RadioGroup from './components/RadioGroup.vue';
// import Upload from './components/Upload.vue';

export const componentMap = new Map<ComponentName, Component>();

componentMap.set('Input', NInput);
componentMap.set('InputNumber', NInputNumber);
componentMap.set('Select', NSelect);
componentMap.set('TreeSelect', NTreeSelect);
componentMap.set('Tree', NTree);
componentMap.set('Switch', NSwitch);
componentMap.set('Checkbox', NCheckbox);
componentMap.set('CheckboxGroup', NCheckboxGroup);
componentMap.set('Cascader', NCascader);
componentMap.set('Slider', NSlider);
componentMap.set('Rate', NRate);
componentMap.set('DatePicker', NDatePicker);
componentMap.set('TimePicker', NTimePicker);
componentMap.set('Divider', NDivider);
// componentMap.set('AutoComplete', AutoComplete);
// componentMap.set('ApiSelect', ApiSelect);
// componentMap.set('ApiTree', ApiTree);
// componentMap.set('ApiTreeSelect', ApiTreeSelect);
// componentMap.set('RadioGroup', RadioGroup);
// componentMap.set('Upload', Upload);
