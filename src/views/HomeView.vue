<template>
  <main :class="{ loading: isLoading }">
    <transition v-if="!isLoading && categorizedEvents" name="events-fade" mode="out-in" appear>
      <div>
        <event-cards
          :events="categorizedEvents"
          :events-categories="nonEmptyEventsCategories"
          @load-more="getEventsHandler"
        />

        <the-loader v-if="isGettingMoreEvents" />
      </div>
    </transition>

    <the-loader v-else />
  </main>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useEventsStore } from "@/stores/events";
import { useEventsCategoriesStore } from "@/stores/event-categories";
import type { IEvent } from "@/ts/interfaces/event";
import TheLoader from "@/components/TheLoader.vue";

const EventCards = defineAsyncComponent(() => import("@/components/EventCards.vue"));

const { locale } = useI18n();

const { events, eventsToShow, categorizedEvents } = storeToRefs(useEventsStore());
const { nonEmptyEventsCategories } = storeToRefs(useEventsCategoriesStore());
const { getEvents, setEventsToShow, resetEventsToShow, clearEvents, clearSearch } = useEventsStore();
const { getEventsCategories, clearCategory } = useEventsCategoriesStore();

const isLoading: Ref<boolean> = ref(false);
const isGettingMoreEvents: Ref<boolean> = ref(false);

const getEventsHandler = () => {
  if ((events.value as IEvent[]).length <= eventsToShow.value) return;

  isGettingMoreEvents.value = true;

  setTimeout(() => {
    setEventsToShow();
    isGettingMoreEvents.value = false;
  }, 300);
};

const getDataHandler = async () => {
  isLoading.value = true;
  clearSearch();

  await clearEvents();
  await getEventsCategories();
  await getEvents();
  resetEventsToShow();

  isLoading.value = false;
};

watch(locale, () => {
  clearCategory();
  getDataHandler();
});

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
