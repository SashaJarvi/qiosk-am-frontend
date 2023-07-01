<template>
  <header class="header">
    <div class="container">
      <div class="header__info">
        <router-link :to="Tr.i18nRoute({ name: 'home' })" class="header__logo">
          <picture>
            <source media="(max-width: 599px)" srcset="/images/logo/logo-header-m.svg" />
            <source media="(max-width: 899px)" srcset="/images/logo/logo-header.svg" />
            <img src="/images/logo/logo-header-big.svg" alt="Logo header" />
          </picture>
        </router-link>

        <locale-switcher />

        <div class="header__links">
          <div class="header__contacts">
            <a href="tel:37477233503" class="header__contacts-number">+374 77 233 503</a>
          </div>
          <button class="write-btn" @click="toggleFeedbackForm">Написать нам!</button>
        </div>
      </div>

      <div class="header__mobile-content">
        <div class="header__contacts hide-element">
          <a href="tel:37477233503" class="header__contacts-number">+374 77 233 503</a>
        </div>
        <locale-switcher class="hide-element" />
      </div>
    </div>
  </header>

  <teleport to="#app">
    <transition name="modal-wrapper-fade" mode="out-in" appear>
      <feedback-form v-if="isFeedbackForm" @close="toggleFeedbackForm" />
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import type { Ref } from "vue";
import bodyScrollLock from "@/utils/body-scroll-lock";
import LocaleSwitcher from "@/components/LocaleSwitcher.vue";
import Tr from "@/i18n/translation";

const FeedbackForm = defineAsyncComponent(() => import("@/components/FeedbackForm.vue"));

const isFeedbackForm: Ref<boolean> = ref(false);

const toggleFeedbackForm = () => {
  isFeedbackForm.value = !isFeedbackForm.value;
  isFeedbackForm.value ? bodyScrollLock.enable() : bodyScrollLock.disable();
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/elements/btns";
@import "@/assets/scss/components/the-header";

.modal-wrapper-fade-enter-active,
.modal-wrapper-fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.modal-wrapper-fade-enter-from,
.modal-wrapper-fade-leave-to {
  opacity: 0;
}
</style>
