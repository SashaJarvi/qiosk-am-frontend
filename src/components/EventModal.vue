<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="showModal"
        ref="modal-backdrop"
        class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50"
        @click.stop="emit('close-modal')"
      >
        <div class="flex items-start justify-center min-h-screen pt-8 text-center">
          <transition
            enter-active-class="transition ease-out duration-300 transform "
            enter-from-class="opacity-0 translate-y-10 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-10 translate-y-0 scale-95"
          >
            <div
              class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl p-8 w-2/3"
              role="dialog"
              ref="modal"
              aria-modal="true"
              v-show="showModal"
              aria-labelledby="modal-headline"
            >
              <button class="absolute top-4 right-4">
                <icon-x @click="emit('close-modal')" />
              </button>

              <article v-if="event">
                <div class="mb-[32px]">
                  <h1 class="mb-[32px] text-[24px] leading-[32px]">{{ event.attributes.title }}</h1>

                  <div class="flex flex-col md:flex-row items-start gap-[24px]">
                    <img class="w-[320px] h-[240px] object-cover" :src="coverUrl" alt="" />

                    <div class="flex flex-col gap-[8px]">
                      <p class="grid grid-cols-[16px_1fr] items-stretch gap-[8px] font-medium">
                        <icon-map-pin /> {{ event.attributes.location }}
                      </p>
                      <p class="grid grid-cols-[16px_1fr] items-stretch gap-[8px]">
                        <icon-calendar-check />
                        <span class="font-medium uppercase">{{ date }} {{ month }}, {{ time }}</span>
                      </p>
                      <p class="grid grid-cols-[16px_1fr] items-stretch gap-[8px] font-medium">
                        <icon-money /> {{ priceRange }}
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
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Ref } from "vue";
import VueMarkdown from "vue-markdown-render";
import IconX from "~icons/ph/x";
import IconCalendarCheck from "~icons/ph/calendar-check";
import IconMoney from "~icons/ph/money";
import IconMapPin from "~icons/ph/map-pin";
import type { IEvent } from "@/ts/interfaces/event";
import api from "@/api";
import padToTwoDigits from "@/utils/pad-to-two-digits";
import delay from "@/utils/delay";
import EventLoader from "@/components/EventLoader.vue";

const props = defineProps<{
  show: boolean;
  event: number | null;
}>();

const emit = defineEmits<{
  (e: "close-modal"): void;
}>();

const showModal: Ref<boolean> = ref(false);
const eventId: Ref<number | null> = ref(null);
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
    .get(`events/${eventId.value}?populate[0]=cover`)
    .then(res => res.json())
    .then(({ data }) => (event.value = data));

  isLoading.value = false;
};

watch(
  () => props.show,
  value => {
    showModal.value = value;
  },
);

watch(
  () => props.event,
  value => {
    if (!value) {
      event.value = null;
      return;
    }

    eventId.value = value;
    getEvent();
  },
);
</script>

<style scoped></style>
