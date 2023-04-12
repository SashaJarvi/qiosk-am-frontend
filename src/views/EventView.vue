<template>
  <section class="read-more-section">
    <div class="container">
      <template v-if="event"
        ><div class="read-more__card">
          <div class="read-more__img">
            <img :src="coverUrl" :alt="event.attributes.title" />
          </div>

          <div class="read-more__card-descr">
            <span class="read-more__type card__type">Спектакль</span>
            <h2 class="card-title">{{ event.attributes.title }}</h2>

            <a :href="event.attributes.tickets_link" target="_blunk" class="read-more-card__btn btn-buy">
              <span>Купить билет</span>
              <img src="/images/arrows/arrow-right.svg" alt="arrow-right" />
            </a>

            <ul class="read-more__list">
              <li class="read-more__item">
                <div class="read-more__item-img">
                  <img src="/images/events-icons/calendar.svg" alt="calendar" />
                </div>
                <span>{{ eventInfo.date }} {{ eventInfo.month }} в {{ eventInfo.time }}</span>
              </li>

              <li class="read-more__item">
                <div class="read-more__item-img">
                  <img src="/images/events-icons/marker.svg" alt="marker" />
                </div>
                <span>{{ event.attributes.location }}</span>
              </li>

              <li class="read-more__item">
                <div class="read-more__item-img">
                  <img src="/images/events-icons/cards.svg" alt="cards" />
                </div>
                <span>{{ eventInfo.priceRange }}</span>
              </li>
            </ul>
          </div>
        </div>

        <vue-markdown
          :options="{
            preset: 'default',
            linkify: true,
            breaks: true,
            injected: true,
          }"
          :source="event.attributes.description"
          class="read-more__descr"
      /></template>

      <router-link to="/" class="read-more__btn">
        <span>Вернуться назад</span>
        <img src="/images/arrows/arrow-left.svg" alt="arrow-left" />
      </router-link>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import type { Ref } from "vue";
import { useRoute } from "vue-router";
import type { IEvent } from "@/ts/interfaces/event";
import delay from "@/utils/delay";
import api from "@/api";
import { useEventComputed } from "@/composables/event-computed";
import VueMarkdown from "vue-markdown-render";

interface IEventInfo {
  date: string | undefined;
  month: string | undefined;
  year: string | undefined;
  time: string | undefined;
  priceRange: string | undefined;
}

const route = useRoute();

const isLoading: Ref<boolean> = ref(false);
const event: Ref<IEvent | null> = ref(null);
const eventInfo = reactive<IEventInfo>({
  date: "",
  month: "",
  year: "",
  time: "",
  priceRange: "",
});

const coverUrl = computed<string>(() => {
  return `${import.meta.env.VITE_BACKEND_URL}${(event.value as IEvent).attributes.cover.data.attributes.url}`;
});

const getEvent = async () => {
  isLoading.value = true;

  await delay();
  await api
    .get(`events/${route.params.eventId}?populate[0]=cover`)
    .then(res => res.json())
    .then(({ data }) => (event.value = data));

  const { date, month, year, time, priceRange } = useEventComputed(
    (event.value as IEvent).attributes.datetime,
    (event.value as IEvent).attributes.min_price,
    (event.value as IEvent).attributes.max_price,
  );

  eventInfo.date = date.value;
  eventInfo.month = month.value;
  eventInfo.year = year.value;
  eventInfo.time = time.value;
  eventInfo.priceRange = priceRange.value;

  isLoading.value = false;
};

getEvent();
</script>

<style lang="scss" scoped>
@import "@/assets/scss/elements/btns";
@import "@/assets/scss/elements/card-title";
@import "@/assets/scss/pages/event";
</style>
