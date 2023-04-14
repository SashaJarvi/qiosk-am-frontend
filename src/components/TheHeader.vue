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
          <button class="write-btn" @click="showFeedbackForm = true">Написать нам!</button>
        </div>
      </div>

      <div class="header__contacts hide-element">
        <a href="tel:37477233503" class="header__contacts-number">+374 77 233 503</a>
        <a href="mailto:Info@qiosk.am" class="header__contacts-email">Info@qiosk.am</a>
      </div>
    </div>
  </header>

  <feedback-form v-if="showFeedbackForm" @close="showFeedbackForm = false" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import type { Ref } from "vue";

const FeedbackForm = defineAsyncComponent(() => import("@/components/FeedbackForm.vue"));

const showFeedbackForm: Ref<boolean> = ref(false);
</script>

<style lang="scss" scoped>
@import "@/assets/scss/elements/btns";
@import "@/assets/scss/components/the-header";
</style>
