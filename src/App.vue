<template>
  <the-header v-if="$route.name !== 'event'" />
  <router-view />
  <the-footer />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import TheFooter from "@/components/TheFooter.vue";
import TheHeader from "@/components/TheHeader.vue";
</script>

<style scoped></style>
