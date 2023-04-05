<template>
  <main>
    <div class="container mx-auto px-[16px]">
      <article v-if="event" class="py-[48px]">
        <div class="mb-[32px]">
          <h1 class="mb-[32px] text-[24px] leading-[32px]">{{ event.attributes.title }}</h1>

          <div class="flex flex-col md:flex-row items-start gap-[24px]">
            <img class="w-[320px] h-[240px] object-cover" :src="coverUrl" alt="" />

            <div class="flex flex-col gap-[8px]">
              <p class="flex items-center gap-[8px] font-medium">
                <img src="/images/icons/location.svg" alt="Место проведения" /> {{ event.attributes.location }}
              </p>
              <p class="flex items-center gap-[8px]">
                <img src="/images/icons/calendar.svg" alt="Календарь" />
                <span class="font-medium uppercase">{{ date }} {{ month }}, {{ time }}</span>
              </p>
              <p class="flex items-center gap-[8px] font-medium">
                <img src="/images/icons/dram.svg" alt="Цена" /> {{ priceRange }}
              </p>
            </div>
          </div>
        </div>

        <vue-markdown
          class="mb-[32px]"
          :source="event.attributes.description"
          :options="{
            preset: 'default',
            linkify: true,
            breaks: true,
            injected: true,
          }"
        />

        <div class="flex flex-wrap gap-[8px]">
          <router-link to="/" class="p-[10px_16px] text-black-base bg-white border border-yellow-base rounded-[4px]">
            К списку мероприятий
          </router-link>
          <a
            :href="event.attributes.tickets_link"
            target="_blank"
            rel="noopener"
            class="p-[10px_16px] text-black-base text-[14px] sm:text-[16px] bg-yellow-base border border-yellow-base rounded-[4px] shadow-lg shadow-yellow-base-dark/0 hover:shadow-yellow-base-dark/100 transition delay-150 duration-300 ease-in-out"
          >
            Купить билет
          </a>
        </div>
      </article>

      <event-loader v-if="isLoading" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Ref } from "vue";
import { useRoute } from "vue-router";
import { RouterLink } from "vue-router";
// @ts-ignore
import VueMarkdown from "vue-markdown-render";
import type { IEvent } from "@/ts/interfaces/event";
import delay from "@/utils/delay";
import padToTwoDigits from "@/utils/pad-to-two-digits";
import api from "@/api";
import EventLoader from "@/components/EventLoader.vue";

const route = useRoute();

const isLoading: Ref<boolean> = ref(false);
const event: Ref<IEvent | null> = ref(null);

const coverUrl = computed<string>(() => {
  return `${import.meta.env.VITE_BACKEND_URL}${event.value?.attributes.cover.data.attributes.url}`;
});

const eventDate = computed<Date>(() => new Date((event.value as IEvent)?.attributes.datetime));

const date = computed<any>(() => padToTwoDigits(eventDate.value.getDate()));

const month = computed<string>(() => {
  const monthObject = {
    Jan: "Янв",
    Feb: "Фев",
    Mar: "Мар",
    Apr: "Апр",
    May: "Мая",
    Jun: "Июн",
    Jul: "Июл",
    Aug: "Авг",
    Sep: "Сен",
    Oct: "Окт",
    Nov: "Ноя",
    Dec: "Дек",
  };
  const dateStr = eventDate.value.toDateString();
  const dateStrArr = dateStr.split(" ");
  const monthStr: string = dateStrArr[1];

  return monthObject[monthStr as keyof typeof monthObject];
});

const time = computed<string>(() => {
  return `${padToTwoDigits(eventDate.value.getHours())}:${padToTwoDigits(eventDate.value.getMinutes())}`;
});

const priceRange = computed<string>(() => {
  return event.value?.attributes.max_price
    ? `${event.value?.attributes.min_price} – ${event.value?.attributes.max_price}`
    : `${event.value?.attributes.min_price}`;
});

const getEvent = async () => {
  isLoading.value = true;

  await delay();
  await api
    .get(`events/${route.params.id}?populate[0]=cover`)
    .then(res => res.json())
    .then(({ data }) => (event.value = data));

  isLoading.value = false;
};

getEvent();
</script>

<style scoped></style>
