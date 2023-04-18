<template>
  <main :class="{ loading: isLoading }">
    <transition v-if="!isLoading && categorizedEvents" name="events-fade" mode="out-in" appear>
      <div>
        <event-cards
          :events="(categorizedEvents as IEvent[])"
          :events-categories="eventsCategories as IEventCategory[]"
          @load-more="getEventsHandler"
        />

        <the-loader v-if="isGettingMoreEvents" />
      </div>
    </transition>

    <the-loader v-else />
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { useEventsStore } from "@/stores/events";
import { useEventsCategoriesStore } from "@/stores/event-categories";
import type { IEvent } from "@/ts/interfaces/event";
import type { IEventCategory } from "@/ts/interfaces/event-category";
import delay from "@/utils/delay";
import TheLoader from "@/components/TheLoader.vue";
import EventCards from "@/components/EventCards.vue";

const { categorizedEvents } = storeToRefs(useEventsStore());
const { eventsCategories } = storeToRefs(useEventsCategoriesStore());
const { getEvents } = useEventsStore();
const { getEventsCategories } = useEventsCategoriesStore();

const isLoading: Ref<boolean> = ref(false);
const isGettingMoreEvents: Ref<boolean> = ref(false);

const getEventsHandler = async () => {
  isGettingMoreEvents.value = true;

  await getEvents(true);

  isGettingMoreEvents.value = false;
};

const getDataHandler = async () => {
  isLoading.value = true;

  await delay();
  await getEventsCategories();
  await getEvents();

  isLoading.value = false;
};

getDataHandler();
</script>

<style lang="scss" scoped>
.events-fade-enter-active,
.events-fade-leave-active {
  transition: all 0.5s ease;
}

.events-fade-enter-from,
.events-fade-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
