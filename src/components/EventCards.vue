<template>
  <section class="events">
    <div class="container">
      <nav class="events__catalog">
        <h1 class="events__title">Каталог мероприятий</h1>

        <div class="events__header">
          <ul class="events__category">
            <li>
              <button class="btn btn--all" @click="clearCategory">Все</button>
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
              <router-link to="/archive" class="btn">Архив</router-link>
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

      <div v-if="events.length && (searchedEvents === null || searchedEvents.length)" class="events__cards">
        <event-card v-for="event in events" :key="event.id" :event="event" />
        <the-observer @intersect="intersectCatch" />
      </div>

      <p v-else-if="searchedEvents && !searchedEvents.length" class="events__no-cards">
        Мероприятия по запросу не найдены.
        <button @click="resetSearch">Нажмите, чтобы показать все мероприятия</button>
      </p>

      <p v-else class="events__no-cards">Каталог пока пуст.</p>
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
import EventCard from "@/components/EventCard.vue";
import TheObserver from "@/components/TheObserver.vue";

const route = useRoute();

const { searchStr, searchedEvents } = storeToRefs(useEventsStore());
const { eventsCategory } = storeToRefs(useEventsCategoriesStore());
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
