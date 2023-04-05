<template>
  <main>
    <div class="container mx-auto px-[16px]">
      <event-cards v-if="!isLoading" :events="events" />
      <cards-loader v-else />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import type { IEvent } from "@/ts/interfaces/event";
import api from "@/api";
import delay from "@/utils/delay";
import CardsLoader from "@/components/CardsLoader.vue";
import EventCards from "@/components/EventCards.vue";

const isLoading: Ref<boolean> = ref(false);
const events: Ref<IEvent[]> = ref([]);

const getEvents = async () => {
  isLoading.value = true;

  await delay();
  await api
    .get(`events?populate[0]=cover&filters[datetime][$gt]=${new Date().toISOString()}?sort[0]=datetime`)
    .then(res => res.json())
    .then(
      ({ data }) =>
        (events.value = data.sort(
          (a: IEvent, b: IEvent) =>
            new Date(a.attributes.datetime).getTime() - new Date(b.attributes.datetime).getTime(),
        )),
    );

  isLoading.value = false;
};

getEvents();
</script>

<style scoped></style>
