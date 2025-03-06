<script lang="ts" setup>
import type { VbenFormSchema } from '@vben-core/form-ui';
import type { VbenFormSchema } from '@vben/common-ui';

import { SliderCaptcha } from '@/components/common/captcha';
import { $t } from '@/locales';
import { useVbenForm } from '@vben-core/form-ui';
import { z } from 'zod';

defineOptions({ name: 'Login' });

const loading = computed(() => userStore.loginLoading);

const userStore = useUserStore();

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      dependencies: {
        triggerFields: ['selectAccount'],
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: markRaw(SliderCaptcha),
      fieldName: 'captcha',
      rules: z.boolean().refine((value) => value, {
        message: $t('authentication.verifyRequiredTip'),
      }),
    },
  ];
});

const [Form, formApi] = useVbenForm(
  reactive({
    commonConfig: {
      hideLabel: true,
      hideRequiredMark: true,
    },
    schema: formSchema,
    showDefaultActions: false,
  }),
);
const router = useRouter();

const REMEMBER_ME_KEY = `REMEMBER_ME_USERNAME_${location.hostname}`;

const localUsername = localStorage.getItem(REMEMBER_ME_KEY) || '';

const rememberMe = ref(!!localUsername);

async function handleSubmit() {
  const { valid } = await formApi.validate();
  const values = await formApi.getValues();
  if (valid) {
    localStorage.setItem(REMEMBER_ME_KEY, rememberMe.value ? values?.username : '');
    userStore.authLogin(values);
  }
}

function handleGo(path: string) {
  router.push(path);
}

onMounted(() => {
  if (localUsername) {
    formApi.setFieldValue('username', localUsername);
  }
});

defineExpose({
  getFormApi: () => formApi,
});
</script>

<template>
  <div @keydown.enter.prevent="handleSubmit">
    <div class="mb-7 sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-foreground mb-3 text-3xl font-bold leading-9 tracking-tight lg:text-4xl">
        {{ `${$t('authentication.welcomeBack')} 👋🏻` }}
      </h2>

      <p class="text-muted-foreground lg:text-md text-sm">
        <span class="text-muted-foreground">
          {{ $t('authentication.loginSubtitle') }}
        </span>
      </p>
    </div>

    <Form />

    <div class="mb-6 flex justify-between">
      <div class="flex-center">
        <NCheckbox v-model:checked="rememberMe" name="rememberMe">
          {{ $t('authentication.rememberMe') }}
        </NCheckbox>
      </div>

      <span class="vben-link text-sm font-normal" @click="handleGo('/auth/forget-password')">
        {{ $t('authentication.forgetPassword') }}
      </span>
    </div>
    <NButton
      :class="{ 'cursor-wait': loading }"
      :loading="loading"
      aria-label="login"
      class="w-full"
      @click="handleSubmit"
    >
      {{ $t('common.login') }}
    </NButton>

    <div class="mt-3 text-center text-sm">
      {{ $t('authentication.accountTip') }}
      <span class="vben-link text-sm font-normal" @click="handleGo('/auth/register')">
        {{ $t('authentication.createAccount') }}
      </span>
    </div>
  </div>
</template>

<route lang="yaml">
name: login
meta:
  ignoreAccess: true
</route>
