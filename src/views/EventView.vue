<template>
  <section class="read-more-section">
    <div class="container">
      <transition v-if="event" name="event-fade" mode="out-in" appear>
        <div>
          <div class="read-more__card">
            <div class="read-more__img">
              <img :src="coverUrl" :alt="event.attributes.title" />
            </div>

            <div class="read-more__card-descr">
              <span class="read-more__type card__type">{{ event.attributes.event_category.data.attributes.name }}</span>
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
          />
        </div>
      </transition>

      <the-loader v-else-if="isLoading" />

      <a href="/" class="read-more__btn" @click.prevent="wrapGoBack">
        <span>Вернуться назад</span>
        <img src="/images/arrows/arrow-left.svg" alt="arrow-left" />
      </a>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import type { Ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import VueMarkdown from "vue-markdown-render";
import type { IEvent } from "@/ts/interfaces/event";
import { useEventsStore } from "@/stores/events";
import { useEventComputed } from "@/composables/event-computed";
import delay from "@/utils/delay";
import TheLoader from "@/components/TheLoader.vue";

interface IEventInfo {
  date: string | undefined;
  month: string | undefined;
  year: string | undefined;
  time: string | undefined;
  priceRange: string | undefined;
}

const router = useRouter();
const route = useRoute();

const { event } = storeToRefs(useEventsStore());
const { getEvent, clearEvent } = useEventsStore();

const isLoading: Ref<boolean> = ref(false);
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

const getEventHandler = async () => {
  isLoading.value = true;

  await delay();
  await getEvent(route.params.eventId as string);

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

const wrapGoBack = () => {
  clearEvent();
  router.push("/");
};

getEventHandler();
</script>

<style lang="scss" scoped>
@import "@/assets/scss/elements/btns";
@import "@/assets/scss/elements/card";
@import "@/assets/scss/elements/card-title";
@import "@/assets/scss/pages/event";

.event-fade-enter-active,
.event-fade-leave-active {
  transition: all 0.5s ease;
}

.event-fade-enter-from,
.event-fade-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}
</style>