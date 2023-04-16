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
              {{ category.attributes.name.toUpperCase() }}
            </button>
          </li>
        </ul>
      </nav>

      <div v-if="events.length" class="events__cards">
        <event-card v-for="event in filteredEvents" :key="event.id" :event="event" />
      </div>

      <p v-else class="events__no-cards">Каталог пока пуст. Попробуйте выбрать другую категорию</p>

      <div class="btn-block">
        <button
          v-if="events.length > eventsLimit"
          @click="showAllEvents = !showAllEvents"
          :class="!showAllEvents ? 'add-more' : 'hide-cards'"
        >
          <span>{{ !showAllEvents ? "Больше мероприятий" : "Скрыть" }}</span>
          <img width="30" height="30" src="/images/arrows/arrow-down.svg" alt="arrow-down" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { useEventsCategoriesStore } from "@/stores/event-categories";
import type { IEvent } from "@/ts/interfaces/event";
import type { IEventCategory } from "@/ts/interfaces/event-category";
import EventCard from "@/components/EventCard.vue";

const { eventsCategory } = storeToRefs(useEventsCategoriesStore());
const { selectEventCategory, clearCategory } = useEventsCategoriesStore();

const props = defineProps<{
  events: IEvent[];
  eventsCategories: IEventCategory[];
}>();

const eventsLimit: Ref<number> = ref(3);
const showAllEvents: Ref<boolean> = ref(false);

const filteredEvents = computed<IEvent[]>(() =>
  !showAllEvents.value ? props.events.slice(0, eventsLimit.value) : props.events,
);
</script>

<style lang="scss" scoped>
@import "@/assets/scss/elements/btns";
@import "@/assets/scss/components/event-cards";
</style>
