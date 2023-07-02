<template>
  <section class="events">
    <div class="container">
      <nav class="events__catalog">
        <h1 class="events__title">{{ $t("events.events-catalog") }}</h1>

        <div class="events__header">
          <ul v-if="eventsCategories.length" class="events__category">
            <li>
              <button class="btn btn--all" @click="clearCategory">{{ $t("events.all") }}</button>
            </li>
            <li v-for="category in eventsCategories" :key="category.id">
              <button
                class="btn"
                :class="{ active: eventsCategory && category.id === eventsCategory.id }"
                @click="selectEventCategory(category.id)"
              >
                {{ category.attributes.name }}
              </button>
            </li>
            <li v-if="!isArchivePage">
              <router-link :to="Tr.i18nRoute({ name: 'events-archive' })" class="btn">{{
                $t("events.archive")
              }}</router-link>
            </li>
          </ul>

          <div v-if="!isArchivePage" class="events__search-wrapper">
            <svg
              class="events__search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input v-model="searchStr" class="events__search" type="text" />
          </div>
        </div>
      </nav>

      <p
        v-if="(searchStr && !searchedEvents.length) || (searchedEvents.length && !visibleEvents.length)"
        class="events__no-cards"
      >
        {{ $t("events.not-found") }}
        <button @click="resetSearch">{{ $t("events.click-to-show") }}</button>
      </p>

      <div v-else-if="visibleEvents.length" class="events__cards">
        <event-card v-for="event in visibleEvents" :key="event.id" :event="event" />
        <the-observer @intersect="intersectCatch" />
      </div>

      <p v-else class="events__no-cards">{{ $t("events.empty") }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useEventsStore } from "@/stores/events";
import { useEventsCategoriesStore } from "@/stores/event-categories";
import type { IEvent } from "@/ts/interfaces/event";
import type { IEventCategory } from "@/ts/interfaces/event-category";
import Tr from "@/i18n/translation";
import EventCard from "@/components/EventCard.vue";
import TheObserver from "@/components/TheObserver.vue";

const route = useRoute();

const { searchStr, searchedEvents, visibleEvents } = storeToRefs(useEventsStore());
const { eventsCategory, nonEmptyEventsCategories } = storeToRefs(useEventsCategoriesStore());
const { selectEventCategory, clearCategory } = useEventsCategoriesStore();

defineProps<{
  events: IEvent[];
  eventsCategories: IEventCategory[];
}>();

const emit = defineEmits<{
  (e: "load-more"): void;
}>();

const isArchivePage = computed<boolean>(() => route.name === "events-archive");

const resetSearch = () => {
  searchStr.value = "";
};

const intersectCatch = () => {
  if (searchedEvents.value?.length) return;

  emit("load-more");
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/elements/btns";
@import "@/assets/scss/components/event-cards";
</style>
