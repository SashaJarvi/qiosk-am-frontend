<template>
  <header class="header relative">
    <header-image :image="image" />
    <div class="absolute top-0 right-0 bottom-0 left-0 grid place-items-center text-white bg-black/60">
      <h1 class="font-[Raleway] text-[32px] sm:text-[48px] font-bold text-center drop-shadow-md shadow-black-base">
        Билеты на мероприятия
      </h1>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Ref } from "vue";
import HeaderImage from "@/components/HeaderImage.vue";

const images: Ref<string[]> = ref(["krists-luhaers-AtPWnYNDJnM", "denise-jans-dPeMksg59lA", "actionvance-nLGX7U1dnZM"]);
const image = computed<string>(() => {
  const imagesCopy = images.value;
  return imagesCopy.sort(() => 0.5 - Math.random())[0];
});
</script>

<style lang="scss" scoped></style>
