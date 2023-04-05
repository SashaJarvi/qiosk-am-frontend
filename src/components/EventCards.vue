<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[16px] py-[48px]">
    <event-card v-for="event in events" :key="event.id" :event="event" />
  </div>
</template>

<script setup lang="ts">
import type { IEvent } from "@/ts/interfaces/event";
import EventCard from "@/components/EventCard.vue";

defineProps<{
  events: IEvent[];
}>();
</script>

<style scoped></style>
