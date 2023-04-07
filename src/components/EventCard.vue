<template>
  <article @click.stop="emit('show-event-details', event.id)" class="flex flex-col border border-grey-4 cursor-pointer">
    <div class="w-full h-[200px] md:h-[300px]">
      <img class="w-full h-full object-cover" :src="coverUrl" :alt="event.attributes.title" />
    </div>

    <div class="flex flex-col h-full p-[12px] sm:py-[16px] sm:px-[22px]">
      <div class="flex flex-col flex-1 gap-[12px] h-full">
        <h2 class="flex-1 font-bold">{{ event.attributes.title }}</h2>
        <p class="grid grid-cols-[16px_1fr] items-stretch gap-[8px] lowercase">
          <icon-calendar />{{ date }} {{ month }} в {{ time }}
        </p>
        <p class="grid grid-cols-[16px_1fr] items-stretch gap-[8px]"><icon-map />{{ event.attributes.location }}</p>
        <p class="grid grid-cols-[16px_1fr] items-stretch gap-[8px]"><icon-card />{{ priceRange }}</p>
      </div>

      <div class="flex flex-wrap items-center gap-[8px] mt-[16px]">
        <a
          :href="event.attributes.tickets_link"
          @click.stop.prevent="goForTickets"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="block w-fit p-[8px] text-black-base text-[14px] sm:text-[16px] bg-yellow-base border border-yellow-base rounded-[4px] shadow-lg shadow-yellow-base-dark/0 hover:shadow-yellow-base-dark/70 transition delay-150 duration-300 ease-in-out"
          >Купить билет</a
        >

        <button
          class="block w-fit p-[8px] text-black-base text-[14px] sm:text-[16px] bg-white border border-black-base rounded-[4px] shadow-lg shadow-black-base/0 hover:shadow-black-base/40 transition delay-150 duration-300 ease-in-out"
          @click.stop="emit('show-event-details', event.id)"
        >
          Подробнее
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import IconCalendar from "~icons/emojione/tear-off-calendar";
import IconCard from "~icons/emojione/credit-card";
import IconMap from "~icons/emojione/world-map";
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
