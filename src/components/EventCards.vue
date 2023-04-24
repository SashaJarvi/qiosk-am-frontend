<template>
  <section class="events">
    <div class="container">
      <nav class="events__catalog">
        <h1 class="events__title">Каталог мероприятий</h1>
        <ul class="events__category">
          <li>
            <button class="btn" @click="clearCategory">Все</button>
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
      </nav>

      <nav v-if="!isArchivePage" class="events__catalog">
        <h1 class="events__title">Найти мероприятие</h1>

        <input v-model="searchStr" class="events__search" type="text" />
      </nav>

      <div v-if="events.length" class="events__cards">
        <event-card v-for="event in events" :key="event.id" :event="event" />
        <the-observer @intersect="intersectCatch" />
      </div>

      <p v-else class="events__no-cards">Каталог пока пуст.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useEventsStore } from "@/stores/events";
import { useEventsCategoriesStore } from "@/stores/event-categories";
import type { IEvent } from "@/ts/interfaces/event";
import type { IEventCategory } from "@/ts/interfaces/event-category";
import EventCard from "@/components/EventCard.vue";
import TheObserver from "@/components/TheObserver.vue";

const route = useRoute();

const { searchStr } = storeToRefs(useEventsStore());
const { eventsCategory } = storeToRefs(useEventsCategoriesStore());
const { selectEventCategory, clearCategory } = useEventsCategoriesStore();

defineProps<{
  events: IEvent[];
  eventsCategories: IEventCategory[];
}>();

const emit = defineEmits<{
  (e: "load-more"): void;
  (e: "update-search-str", str: string): void;
}>();

const isArchivePage = computed<boolean>(() => route.name === "events-archive");

const intersectCatch = () => {
  emit("load-more");
};

watch(searchStr, value => {
  emit("update-search-str", value);
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/elements/btns";
@import "@/assets/scss/components/event-cards";
</style>
