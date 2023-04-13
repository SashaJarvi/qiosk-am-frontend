<template>
  <section class="contacts">
    <div class="container">
      <div class="contacts__row">
        <router-link to="/" class="contacts__logo">
          <img src="/images/logo/logo-contacts.svg" alt="logo contacts" />
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
            <img :src="`/images/contacts/${icon}.svg`" :alt="icon" />
          </a>
        </div>

        <div class="contacts__links">
          <a href="tel:37477233503">+374 77 233 503</a>
          <a href="mailto:Info@qiosk.am">Info@qiosk.am</a>
        </div>

        <ul class="contacts__payments">
          <li v-for="system in paymentSystems" :key="system" class="contacts__payments-item">
            <img :src="`/images/contacts/${system}.jpg`" :alt="`${system} card`" />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
interface ISocialLink {
  href: string;
  icon: string;
}

const paymentSystems: string[] = ["visa", "mastercard", "arca", "mir"];
const socialLinks: ISocialLink[] = [
  { href: "https://www.facebook.com/yerevankino", icon: "facebook" },
  { href: "https://www.instagram.com/yerevankino", icon: "instagram" },
  { href: "https://t.me/YerevanKino", icon: "telegram" },
];
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/the-contacts";
</style>
