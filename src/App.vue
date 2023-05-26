<template>
  <the-header />
  <router-view />
  <the-contacts />
  <the-footer />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useHead, useSeoMeta } from "@vueuse/head";
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import TheContacts from "@/components/TheContacts.vue";

useSeoMeta({
  title: "qiosk.am",
  description: "Выбор каталога мероприятий qiosk.am",
  ogType: "website",
  ogTitle: "Каталог мероприятий qiosk.am",
  ogDescription: "Выбор каталога мероприятий",
  ogImage: "/image/opengraph.jpg",
});

useHead({
  meta: [
    {
      name: "yandex-verification",
      content: "7e3db70c4d3d99c0",
    },
  ],
});
</script>
