import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLockStore = defineStore(
  'lock-store',
  () => {
    const isLockScreen = ref(false);
    const lockScreenPassword = ref<string | undefined>(undefined);

    function lockScreen(password: string) {
      isLockScreen.value = true;
      lockScreenPassword.value = password;
    }

    function unlockScreen() {
      isLockScreen.value = false;
      lockScreenPassword.value = undefined;
    }

    return {
      isLockScreen,
      lockScreenPassword,
      lockScreen,
      unlockScreen,
    };
  },
  { persist: true },
);
