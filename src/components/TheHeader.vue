<template>
  <header>
    <swiper
      :autoplay="{
        delay: 3000,
        disableOnInteraction: true,
      }"
      :creative-effect="{
        prev: {
          shadow: false,
          translate: ['-20%', 0, -1],
        },
        next: {
          translate: ['100%', 0, 0],
        },
      }"
      :effect="'creative'"
      :loop="true"
      :modules="[Autoplay, EffectCreative]"
      :slides-per-view="1"
    >
      <swiper-slide v-for="image in images" :key="image">
        <header-image :image="image" />
      </swiper-slide>
    </swiper>
  </header>
</template>

<script setup lang="ts">
import { Autoplay, EffectCreative } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import HeaderImage from "@/components/HeaderImage.vue";

const images: string[] = ["krists-luhaers-AtPWnYNDJnM", "denise-jans-dPeMksg59lA", "actionvance-nLGX7U1dnZM"];
</script>

<style scoped></style>
