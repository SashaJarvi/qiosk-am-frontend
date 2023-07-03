<template>
  <div class="switcher">
    <button
      v-for="sLocale in supportedLocales"
      :key="`locale-${sLocale}`"
      :value="sLocale"
      class="switcher__btn"
      :class="{ selected: locale === sLocale }"
      @click="switchLanguage(sLocale)"
    >
      {{ sLocale.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Tr from "@/i18n/translation";

const { locale } = useI18n();
const supportedLocales = Tr.supportedLocales;

const router = useRouter();

const isSwitcherOpen: Ref<boolean> = ref(false);
const switchLanguage = async (newLocale: string) => {
  closeSwitcher();

  await Tr.switchLanguage(newLocale);

  try {
    await router.replace({ params: { locale: newLocale } });
  } catch (e) {
    console.error(e);
    await router.push("/");
  }
};

const closeSwitcher = (): void => {
  isSwitcherOpen.value = false;
};
</script>

<style lang="scss">
@import "@/assets/scss/components/locale-switcher";
</style>
