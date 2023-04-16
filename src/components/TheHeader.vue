<template>
  <header class="header">
    <div class="container">
      <div class="header__info">
        <router-link to="/" class="header__logo">
          <picture>
            <source media="(max-width: 599px)" srcset="/images/logo/logo-header-m.svg" />
            <source media="(max-width: 899px)" srcset="/images/logo/logo-header.svg" />
            <img src="/images/logo/logo-header-big.svg" alt="Logo header" />
          </picture>
        </router-link>

        <div class="header__links">
          <div class="header__contacts">
            <a href="tel:37477233503" class="header__contacts-number">+374 77 233 503</a>
            <a href="mailto:Info@qiosk.am" class="header__contacts-email">Info@qiosk.am</a>
          </div>
          <button class="write-btn" @click="toggleFeedbackForm">Написать нам!</button>
        </div>
      </div>

      <div class="header__contacts hide-element">
        <a href="tel:37477233503" class="header__contacts-number">+374 77 233 503</a>
        <a href="mailto:Info@qiosk.am" class="header__contacts-email">Info@qiosk.am</a>
      </div>
    </div>
  </header>

  <feedback-form v-if="isFeedbackForm" @close="toggleFeedbackForm" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import type { Ref } from "vue";
import bodyScrollLock from "@/utils/body-scroll-lock";

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
</style>
