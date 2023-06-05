<template>
  <div ref="observerEl"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import type { Ref } from "vue";

defineProps<{}>();

const emit = defineEmits<{
  (e: "intersect"): void;
}>();

const observerEl = ref(null);
const observer: Ref<IntersectionObserver | null> = ref(null);

onMounted(() => {
  const options = {
    root: null,
    rootMargin: "50px",
    threshold: 0.5,
  };

  observer.value = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
      emit("intersect");
    }
  }, options);

  observer.value.observe(observerEl.value as unknown as Element);
});

onUnmounted(() => {
  observer.value?.disconnect();
});
</script>

<style scoped></style>
