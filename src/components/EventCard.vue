<template>
  <router-link :to="{ name: 'event', params: { id: event.id } }" class="flex flex-col border border-grey-4">
    <div class="relative w-full h-[200px]">
      <div class="absolute top-[8px] right-[8px] flex flex-col gap-[4px] p-2 bg-white shadow-lg z-10">
        <p class="font-medium uppercase">{{ date }} {{ month }}</p>
        <p class="font-medium">{{ time }}</p>
      </div>

      <img class="w-full h-full object-cover" :src="coverUrl" :alt="event.attributes.title" />
    </div>

    <div class="flex flex-col py-[16px] px-[22px]">
      <div class="flex flex-col flex-1 gap-[6px]">
        <h2 class="mb-[8px] font-medium">{{ event.attributes.title }}</h2>
        <p class="flex gap-[6px]"><img src="/images/icons/dram.svg" alt="Цена" /> {{ priceRange }}</p>
        <p class="flex gap-[6px]">
          <img src="/images/icons/location.svg" alt="Место проведения" />
          {{ event.attributes.location }}
        </p>
      </div>

      <a
        :href="event.attributes.tickets_link"
        @click.stop.prevent="goForTickets"
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="block w-fit mt-[16px] p-[8px] text-black-base text-[14px] sm:text-[16px] bg-yellow-base rounded-[4px] shadow-lg shadow-yellow-base-dark/0 hover:shadow-yellow-base-dark/100 transition delay-150 duration-300 ease-in-out"
        >Купить билет</a
      >
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { IEvent } from "@/ts/interfaces/event";
import padToTwoDigits from "@/utils/pad-to-two-digits";

const props = defineProps<{
  event: IEvent;
}>();

const coverUrl = computed<string>(() => {
  return `${import.meta.env.VITE_BACKEND_URL}${props.event.attributes.cover.data.attributes.url}`;
});

const eventDate = computed<Date>(() => new Date(props.event.attributes.datetime));

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
