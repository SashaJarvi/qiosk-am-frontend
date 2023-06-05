<template>
  <main :class="{ loading: isLoading }">
    <transition v-if="!isLoading && categorizedEvents" name="events-fade" mode="out-in" appear>
      <div>
        <event-cards
          :events="(categorizedEvents as IEvent[])"
          :archived="true"
          :events-categories="eventsCategories as IEventCategory[]"
          @load-more="getEventsHandler"
        />

        <the-loader v-if="isGettingMoreEvents" />

        <div class="container">
          <router-link :to="route.params.archived ? '/archive' : '/'" class="back-btn">
            <span>Вернуться назад</span>
            <img src="/images/arrows/arrow-left.svg" alt="arrow-left" />
          </router-link>
        </div>
      </div>
    </transition>

    <the-loader v-else />
  </main>
</template>

<script setup lang="ts">
import { ref, provide, defineAsyncComponent } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useEventsStore } from "@/stores/events";
import { useEventsCategoriesStore } from "@/stores/event-categories";
import type { IEvent } from "@/ts/interfaces/event";
import type { IEventCategory } from "@/ts/interfaces/event-category";
import delay from "@/utils/delay";
import TheLoader from "@/components/TheLoader.vue";

const EventCards = defineAsyncComponent(() => import("@/components/EventCards.vue"));

const route = useRoute();

const { categorizedEvents } = storeToRefs(useEventsStore());
const { eventsCategories } = storeToRefs(useEventsCategoriesStore());
const { getEvents, clearEvents } = useEventsStore();
const { getEventsCategories } = useEventsCategoriesStore();

const isLoading: Ref<boolean> = ref(false);
const isGettingMoreEvents: Ref<boolean> = ref(false);

const getEventsHandler = async () => {
  isGettingMoreEvents.value = true;

  await getEvents({ archived: true, hasInternalDelay: true });

  isGettingMoreEvents.value = false;
};

const getDataHandler = async () => {
  isLoading.value = true;

  await delay(500);
  await clearEvents();
  await getEventsCategories();
  await getEvents({ archived: true });

  isLoading.value = false;
};

getDataHandler();

provide("archived", true);
</script>

<style lang="scss" scoped>
.back-btn {
  display: inline-flex;
  align-items: center;
  column-gap: 38px;
  height: 50px;
  margin-bottom: 46px;
  padding: 0 28px 0 38px;
  background-color: #ffffff;
  border: 2px solid #000000;
  border-radius: 5px;
  font-weight: 700;
  font-size: 15px;
  transition: 0.2s linear;
}

.events-fade-enter-active,
.events-fade-leave-active {
  transition: all 0.5s ease;
}

.events-fade-enter-from,
.events-fade-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
