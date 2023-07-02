<template>
  <main class="policy">
    <div class="container">
      <article class="policy__content">
        <router-link :to="Tr.i18nRoute({ name: 'home' })" class="read-more">
          <span>{{ $t("event.back") }}</span> <img src="/images/arrows/arrow-left.svg" alt="arrow-left" />
        </router-link>

        <h1 class="">{{ $t("refund-policy.service-fee") }}</h1>
        <br />

        <div class="">
          {{ $t("refund-policy.service-fee-amount") }}
          <ul class="">
            <li>– {{ $t("refund-policy.7-days-more") }}</li>
            <li>– {{ $t("refund-policy.7-days-less") }}</li>
            <li>- {{ $t("refund-policy.72-hours") }}</li>
          </ul>
        </div>
        <br />

        <div>{{ $t("refund-policy.cancel") }}</div>
        <br />

        <div>{{ $t("refund-policy.term") }}</div>
      </article>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import Tr from "@/i18n/translation";
</script>

<style lang="scss" scoped>
@import "@/assets/scss/elements/btns";

.policy {
  &__content {
    padding: 48px 0;
    font-size: 18px;

    .read-more {
      height: 50px;
      margin-bottom: 30px;
    }
  }
}

.policy-list {
  li::before {
    content: "• ";
    color: rgb(241, 220, 100);
  }
}
</style>
