<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__row">
        <router-link :to="Tr.i18nRoute({ name: 'refund-policy' })">Политика возврата билетов</router-link>
        <p>&copy; {{ currentYear }} qiosk.am</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Tr from "@/i18n/translation";

const currentYear: number = new Date().getFullYear();
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/the-footer";
</style>
