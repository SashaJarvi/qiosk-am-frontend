<template>
  <main :class="{ loading: isLoading }">
    <transition v-if="!isLoading && categorizedEvents" name="events-fade" mode="out-in" appear>
      <div>
        <event-cards
          :events="(categorizedEvents as IEvent[])"
          :archived="true"
          :events-categories="eventsCategories as IEventCategory[]"
          @load-more="getEventsHandler"
        />

        <the-loader v-if="isGettingMoreEvents" />

        <div class="container">
          <router-link :to="Tr.i18nRoute({ name: 'home' })" class="back-btn">
            <span>{{ $t("event.back") }}</span>
            <img src="/images/arrows/arrow-left.svg" alt="arrow-left" />
          </router-link>
        </div>
      </div>
    </transition>

    <the-loader v-else />
  </main>
</template>

<script setup lang="ts">
import { ref, provide, defineAsyncComponent, watch } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useEventsStore } from "@/stores/events";
import { useEventsCategoriesStore } from "@/stores/event-categories";
import type { IEvent } from "@/ts/interfaces/event";
import type { IEventCategory } from "@/ts/interfaces/event-category";
import Tr from "@/i18n/translation";
import TheLoader from "@/components/TheLoader.vue";

const EventCards = defineAsyncComponent(() => import("@/components/EventCards.vue"));

const { locale } = useI18n();

const { events, eventsToShow, categorizedEvents } = storeToRefs(useEventsStore());
const { eventsCategories } = storeToRefs(useEventsCategoriesStore());
const { getEvents, setEventsToShow, resetEventsToShow, clearEvents } = useEventsStore();
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
  clearCategory();

  await clearEvents();
  await getEventsCategories();
  await getEvents(true);
  resetEventsToShow();

  isLoading.value = false;
};

watch(locale, () => {
  getDataHandler();
});

provide("archived", true);

getDataHandler();
</script>

<style lang="scss" scoped>
.back-btn {
  display: inline-flex;
  align-items: center;
  column-gap: 38px;
  height: 50px;
  margin-bottom: 46px;
  padding: 0 28px 0 38px;
  background-color: #ffffff;
  border: 2px solid #000000;
  border-radius: 5px;
  font-weight: 700;
  font-size: 15px;
  transition: 0.2s linear;
}

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
