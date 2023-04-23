<template>
  <div class="card">
    <div class="card__img">
      <img :alt="event.attributes.title" :src="coverUrl" />
    </div>

    <div class="card__info">
      <div class="card__descr">
        <span class="card__type">{{ event.attributes.event_category.data.attributes.name }}</span>

        <h2 class="card-title">{{ event.attributes.title }}</h2>

        <p class="card__text">{{ event.attributes.short_description }}</p>

        <div class="card__btn">
          <router-link
            class="read-more"
            :to="{ name: 'event-page', params: { eventId: event.id }, ...(archived && { query: { archived: true } }) }"
            >Подробнее о мероприятии
          </router-link>

          <a v-if="!archived" class="btn-buy" :href="event.attributes.tickets_link" target="_blank">
            <span>Купить билет</span>
            <img alt="arrow-right" src="/images/arrows/arrow-right.svg" />
          </a>
        </div>

        <div class="card__organization">
          <div class="card__organization-item">
            <h4 class="card__organization-title">
              <img alt="calendar" src="/images/events-icons/calendar.svg" />
              <span>Дата</span>
            </h4>

            <div class="card__organization-descr">
              {{ date }} {{ month }}<br class="br" />
              {{ time }}
            </div>
          </div>

          <div class="card__organization-item">
            <h4 class="card__organization-title">
              <img alt="calendar" src="/images/events-icons/marker.svg" />
              <span>Место проведения</span>
            </h4>

            <div class="card__organization-descr">{{ event.attributes.location }}</div>
          </div>

          <div class="card__organization-item">
            <h4 class="card__organization-title">
              <img alt="calendar" src="/images/events-icons/cards.svg" />
              <span>Стоимость</span>
            </h4>

            <div class="card__organization-descr card__organization-descr--short">{{ priceRange }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue";
// import VueMarkdown from "vue-markdown-render";
import type { IEvent } from "@/ts/interfaces/event";
import { useEventComputed } from "@/composables/event-computed";

const props = defineProps<{
  event: IEvent;
}>();

const { date, month, year, time, priceRange } = useEventComputed(
  props.event.attributes.datetime,
  props.event.attributes.min_price,
  props.event.attributes.max_price,
);

const coverUrl = computed<string>(() => {
  return `${import.meta.env.VITE_BACKEND_URL}${props.event.attributes.cover.data.attributes.url}`;
});

const archived = inject("archived", false);
</script>

<style lang="scss" scoped>
@import "@/assets/scss/elements/btns";
@import "@/assets/scss/elements/card";
@import "@/assets/scss/elements/card-title";
@import "@/assets/scss/components/event-card";
</style>
