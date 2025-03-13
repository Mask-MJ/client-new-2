import type { ComputedRef, Ref } from 'vue';

import type { BasicFormProps, FormActionType, FormSchema, UseFormReturnType } from '../types';

import { isProdMode } from '@/utils';

export type DynamicProps<T> = {
  [P in keyof T]: ComputedRef<T[P]> | Ref<T[P]> | T[P];
};

export function getDynamicProps<T extends object, U>(props: T): Partial<U> {
  const ret: Record<string, any> = {};

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Record<string, any>)[key]);
    return ret[key];
  });

  return ret as Partial<U>;
}

type Props = Partial<DynamicProps<BasicFormProps>>;

export function useForm(props?: Props): UseFormReturnType {
  const formRef = ref<FormActionType | null>(null);
  const loadedRef = ref<boolean | null>(false);
  const getForm = async () => {
    const form = unref(formRef);
    if (!form) {
      console.error(
        'The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!',
      );
    }
    await nextTick();
    return form as FormActionType;
  };

  const register = (instance: FormActionType) => {
    isProdMode() &&
      onUnmounted(() => {
        formRef.value = null;
        loadedRef.value = null;
      });
    if (unref(loadedRef) && isProdMode() && instance === unref(formRef)) return;
    formRef.value = instance;
    loadedRef.value = true;

    watch(
      () => props,
      () => {
        props && instance.setProps(getDynamicProps(props));
      },
      { immediate: true, deep: true },
    );
  };

  const methods: FormActionType = {
    setProps: async (formProps: Partial<BasicFormProps>) => {
      const form = await getForm();
      form.setProps(formProps);
    },

    updateSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm();
      form.updateSchema(data);
    },

    resetSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm();
      form.resetSchema(data);
    },

    restoreValidation: async () => {
      const form = await getForm();
      form.restoreValidation();
    },

    resetPaths: async () => {
      const form = await getForm();
      form.resetPaths();
    },

    removeSchemaByPath: async (paths: string | string[]) => {
      unref(formRef)?.removeSchemaByPath(paths);
    },

    // TODO promisify
    getPathsValue: <T>() => {
      return unref(formRef)?.getPathsValue() as T;
    },

    setPathsValue: async (values) => {
      const form = await getForm();
      form.setPathsValue(values);
    },

    appendSchemaByPath: async (schema: FormSchema, prefixPath?: string, first?: boolean) => {
      const form = await getForm();
      form.appendSchemaByPath(schema, prefixPath, first);
    },

    submit: async (): Promise<any> => {
      const form = await getForm();
      return form.submit();
    },

    validate: async () => {
      const form = await getForm();
      return form.validate();
    },
  };

  return [register, methods];
}
