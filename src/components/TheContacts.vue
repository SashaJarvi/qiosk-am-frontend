<template>
  <section class="contacts">
    <div class="container">
      <div class="contacts__row">
        <div class="contacts__social-wrapper">
          <router-link to="/" class="contacts__logo">
            <img width="135" height="118" src="/images/logo/logo-contacts.svg" alt="logo contacts" />
          </router-link>

          <div class="contacts__socials">
            <a
              v-for="{ href, icon } in socialLinks"
              :key="href"
              :href="href"
              target="_blank"
              rel="noopener"
              class="contacts__socials-item"
            >
              <img width="30" height="30" :src="`/images/contacts/${icon}.svg`" :alt="icon" />
            </a>
          </div>
        </div>

        <div class="contacts__links-wrapper">
          <div class="contacts__links">
            <a href="tel:37477233503">+374 77 233 503</a>
            <a href="mailto:Info@qiosk.am">Info@qiosk.am</a>
          </div>

          <ul class="contacts__payments">
            <li v-for="system in paymentSystems" :key="system" class="contacts__payments-item">
              <img width="79" height="39" :src="`/images/contacts/${system}.jpg`" :alt="`${system} card`" />
            </li>
          </ul>
        </div>
      </div>

      <div class="contacts__payments-out">
        <div
          v-for="(paymentSystemArr, index) in paymentSystemsMobile"
          :key="`payment-chunk_${index + 1}`"
          class="contacts__payments-items-out"
        >
          <div v-for="system in paymentSystemArr" :key="system" class="contacts__payments-item">
            <img width="79" height="39" :src="`/images/contacts/${system}.jpg`" :alt="`${system} card`" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type { Ref } from "vue";
import chunkArray from "@/utils/chunk-array";
interface ISocialLink {
  href: string;
  icon: string;
}

const socialLinks: ISocialLink[] = [
  { href: "https://www.facebook.com/yerevankino", icon: "facebook" },
  { href: "https://www.instagram.com/yerevankino", icon: "instagram" },
  { href: "https://t.me/YerevanKino", icon: "telegram" },
];

const paymentSystems: Ref<string[]> = ref(["visa", "mastercard", "arca", "mir"]);

const paymentSystemsMobile = computed(() => chunkArray(paymentSystems.value, 2));
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/the-contacts";
</style>
