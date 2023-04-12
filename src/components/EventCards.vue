<template>
  <section class="events">
    <div class="container">
      <nav class="events__catalog">
        <h1 class="events__title">Каталог мероприятий</h1>
        <ul class="events__category">
          <li><button class="btn">КИНО</button></li>
          <li><button class="btn">ТЕАТР</button></li>
          <li><button class="btn">КОНЦЕРТ</button></li>
          <li><button class="btn">ЛЕКЦИЯ</button></li>
          <li><button class="btn">СТЕНДАП</button></li>
          <li><button class="btn">ПРОЧЕЕ</button></li>
        </ul>
      </nav>

      <div class="events__cards">
        <event-card v-for="event in events" :key="event.id" :event="event" />
      </div>

      <button class="add-more">
        <span>Больше мероприятий</span>
        <img src="/images/arrows/arrow-down.svg" alt="arrow-down" />
      </button>

      <button class="hide-cards none">
        <span>Скрыть</span>
        <img src="/images/arrows/arrow-down.svg" alt="arrow-down" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import type { IEvent } from "@/ts/interfaces/event";
import bodyScrollLock from "@/utils/body-scroll-lock";
import EventCard from "@/components/EventCard.vue";
import EventModal from "@/components/EventModal.vue";

defineProps<{
  events: IEvent[];
}>();

// const isModalShown: Ref<boolean> = ref(false);
const selectedEventId: Ref<number | null> = ref(null);

// const showModal = (id: number): void => {
//   isModalShown.value = true;
//   bodyScrollLock.enable();
//   selectedEventId.value = id;
// };
//
// const closeModal = (): void => {
//   isModalShown.value = false;
//   bodyScrollLock.disable();
//   selectedEventId.value = null;
// };
</script>

<style lang="scss" scoped>
@import "@/assets/scss/elements/btns";
@import "@/assets/scss/components/event-cards";
</style>
