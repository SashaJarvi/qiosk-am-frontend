<template>
  <div class="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[16px] py-[48px]">
    <event-card v-for="event in events" :key="event.id" :event="event" @show-event-details="showModal" />
  </div>

  <event-modal :show="isModalShown" :event="selectedEventId" @close-modal="closeModal" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import type { IEvent } from "@/ts/interfaces/event";
import bodyScrollLock from "@/utils/body-scroll-lock";
import EventCard from "@/components/EventCard.vue";
import EventModal from "@/components/EventModal.vue";

defineProps<{
  events: IEvent[];
}>();

const isModalShown: Ref<boolean> = ref(false);
const selectedEventId: Ref<number | null> = ref(null);

const showModal = (id: number): void => {
  isModalShown.value = true;
  bodyScrollLock.enable();
  selectedEventId.value = id;
};

const closeModal = (): void => {
  isModalShown.value = false;
  bodyScrollLock.disable();
  selectedEventId.value = null;
};
</script>

<style scoped></style>
