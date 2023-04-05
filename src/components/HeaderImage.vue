<template>
  <picture>
    <source media="(min-width: 1921px)" :srcset="`/images/${image}-unsplash-2400.webp`" type="image/webp" />
    <source media="(min-width: 641px)" :srcset="`/images/${image}-unsplash-1920.webp`" type="image/webp" />
    <source media="(max-width: 640px)" :srcset="`/images/${image}-unsplash-640.webp`" type="image/webp" />

    <source media="(min-width: 1921px)" :srcset="`/images/${image}-unsplash-2400.jpeg`" type="image/jpeg" />
    <source media="(min-width: 641px)" :srcset="`/images/${image}-unsplash-1920.jpeg`" type="image/jpeg" />
    <source media="(max-width: 640px)" :srcset="`/images/${image}-unsplash-640.webp`" type="image/jpeg" />

    <img
      :alt="image"
      class="header-img"
      sizes="(min-width: 1921px) 2400px,
            (min-width: 641px) 1920px,
            (max-width: 640px) 640px"
      :src="`/images/${image}-unsplash-1920.jpeg`"
      :srcset="`/images/${image}-unsplash-2400.jpeg 2400w,
              /images/${image}-unsplash-1920.jpeg 1920w,
              /images/${image}-unsplash-640.jpeg   640w`"
    />
  </picture>
</template>

<script setup lang="ts">
defineProps<{
  image: string;
}>();
</script>

<style lang="scss" scoped>
.header-img {
  width: 100%;
  height: 150px;
  object-fit: cover;

  @media (min-width: 600px) {
    height: 300px;
  }

  @media (min-width: 1921px) {
    height: 400px;
  }

  @media (min-width: 2401px) {
    height: 500px;
  }
}
</style>
