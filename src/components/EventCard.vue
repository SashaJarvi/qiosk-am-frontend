<template>
  <article class="flex flex-col border border-grey-4">
    <img class="w-full h-[200px] sm:h-[300px] object-cover" :src="coverUrl" :alt="event.attributes.title" />

    <div class="flex flex-col h-full p-[12px] sm:py-[16px] sm:px-[22px]">
      <div class="flex flex-col flex-1 gap-[12px]">
        <h2 class="font-medium">{{ event.attributes.title }}</h2>
        <p class="grid grid-cols-[16px_1fr] items-center gap-[6px] lowercase">
          <icon-calendar-check />{{ date }} {{ month }} в {{ time }}
        </p>
        <p class="grid grid-cols-[16px_1fr] items-center gap-[6px]"><icon-map-pin />{{ event.attributes.location }}</p>
        <p class="grid grid-cols-[16px_1fr] items-center gap-[6px]"><icon-money />{{ priceRange }}</p>
      </div>

      <div class="flex flex-wrap items-center gap-[8px] mt-[16px]">
        <button
          class="block w-fit p-[8px] text-black-base text-[14px] sm:text-[16px] bg-white border border-yellow-base rounded-[4px] shadow-lg shadow-yellow-base-dark/0 hover:shadow-yellow-base-dark/100 transition delay-150 duration-300 ease-in-out"
          @click="emit('show-event-details', event.id)"
        >
          Подробнее
        </button>

        <a
          :href="event.attributes.tickets_link"
          @click.stop.prevent="goForTickets"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="block w-fit p-[8px] text-black-base text-[14px] sm:text-[16px] bg-yellow-base border border-yellow-base rounded-[4px] shadow-lg shadow-yellow-base-dark/0 hover:shadow-yellow-base-dark/100 transition delay-150 duration-300 ease-in-out"
          >Купить билет</a
        >
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import IconCalendarCheck from "~icons/ph/calendar-check";
import IconMoney from "~icons/ph/money";
import IconMapPin from "~icons/ph/map-pin";
import type { IEvent } from "@/ts/interfaces/event";
import padToTwoDigits from "@/utils/pad-to-two-digits";

const props = defineProps<{
  event: IEvent;
}>();

const emit = defineEmits<{
  (e: "show-event-details", id: number): void;
}>();

const coverUrl = computed<string>(() => {
  return `${import.meta.env.VITE_BACKEND_URL}${props.event.attributes.cover.data.attributes.url}`;
});

const eventDate = computed<Date>(() => new Date(props.event.attributes.datetime));

const date = computed<any>(() => padToTwoDigits(eventDate.value.getDate()));

const month = computed<string>(() => {
  const monthObject = {
    Jan: "Янв.",
    Feb: "Фев.",
    Mar: "Мар.",
    Apr: "Апр.",
    May: "Мая",
    Jun: "Июн.",
    Jul: "Июл.",
    Aug: "Авг.",
    Sep: "Сен.",
    Oct: "Окт.",
    Nov: "Ноя.",
    Dec: "Дек.",
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
  return props.event.attributes.max_price
    ? `${props.event.attributes.min_price} – ${props.event.attributes.max_price}`
    : `${props.event.attributes.min_price}`;
});

const goForTickets = (e: UIEvent) => {
  window.open(
    (e.target as HTMLLinkElement).href,
    (e.target as HTMLLinkElement).target,
    (e.target as HTMLLinkElement).rel,
  );
};
</script>

<style scoped></style>
