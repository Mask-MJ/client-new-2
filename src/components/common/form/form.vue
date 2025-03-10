<script setup lang="ts">
import type { FormProps } from './types';

const {
  collapsed = false,
  collapsedRows = 1,
  commonConfig = () => ({}),
  handleReset = undefined,
  handleSubmit = undefined,
  resetButtonOptions = () => ({}),
  showCollapseButton = false,
  showDefaultActions = true,
  submitButtonOptions = () => ({}),
} = defineProps<FormProps>();
const currentCollapsed = ref(false);

const handleUpdateCollapsed = (value: boolean) => {
  currentCollapsed.value = !!value;
};

watchEffect(() => {
  currentCollapsed.value = collapsed;
});
</script>

<template>
  <div></div>
</template>

<style lang="" scoped></style>
