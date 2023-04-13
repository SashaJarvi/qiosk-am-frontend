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
        <div class="flex items-center justify-center min-h-screen py-8 text-center">
          <transition
            enter-active-class="transition ease-out duration-300 transform "
            enter-from-class="opacity-0 translate-y-10 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-10 translate-y-0 scale-95"
          >
            <div
              class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl px-4 py-8 sm:p-8 w-[calc(100%-16px)] sm:w-2/3"
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
                  <h1 class="mb-[32px] text-[24px] font-bold leading-[32px]">{{ event.attributes.title }}</h1>

                  <div class="flex flex-col md:flex-row items-start gap-[24px]">
                    <img class="w-[320px] h-[240px] object-cover" :src="coverUrl" alt="" />

                    <div class="flex flex-col gap-[8px]">
                      <p class="grid grid-cols-[16px_1fr] items-stretch gap-[8px]">
                        <icon-map /> {{ event.attributes.location }}
                      </p>
                      <p class="grid grid-cols-[16px_1fr] items-stretch gap-[8px]">
                        <icon-calendar />
                        <span class="lowercase"
                          >{{ eventInfo.date }} {{ eventInfo.month }} {{ eventInfo.year }}, {{ eventInfo.time }}</span
                        >
                      </p>
                      <p class="grid grid-cols-[16px_1fr] items-stretch gap-[8px]">
                        <icon-card /> {{ eventInfo.priceRange }}
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
                    class="p-[10px_16px] text-black-base text-[14px] sm:text-[16px] bg-yellow-base border border-yellow-base rounded-[4px] shadow-lg shadow-yellow-base-dark/0 hover:shadow-yellow-base-dark/60 transition delay-150 duration-300 ease-in-out"
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
import { computed, ref, reactive, watch } from "vue";
import type { Ref } from "vue";
import VueMarkdown from "vue-markdown-render";
import type { IEvent } from "@/ts/interfaces/event";
import api from "@/api";
import delay from "@/utils/delay";
import { useEventComputed } from "@/composables/event-computed";
import EventLoader from "@/components/EventLoader.vue";

interface IEventInfo {
  date: string | undefined;
  month: string | undefined;
  year: string | undefined;
  time: string | undefined;
  priceRange: string | undefined;
}

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
const eventInfo = reactive<IEventInfo>({
  date: "",
  month: "",
  year: "",
  time: "",
  priceRange: "",
});

const coverUrl = computed<string>(() => {
  return `${import.meta.env.VITE_BACKEND_URL}${event.value?.attributes.cover.data.attributes.url}`;
});

const getEvent = async () => {
  isLoading.value = true;

  await delay();
  await api
    .get(`events/${eventId.value}?populate[0]=cover`)
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
