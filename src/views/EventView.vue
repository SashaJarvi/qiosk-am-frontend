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
              <p v-if="event.attributes.subtitle" class="card-subtitle">{{ event.attributes.subtitle }}</p>

              <a
                v-if="!route.query.archived"
                :href="event.attributes.tickets_link"
                target="_blunk"
                class="read-more-card__btn btn-buy"
              >
                <span>{{ $t("event.ticket") }}</span>
                <img src="/images/arrows/arrow-right.svg" alt="arrow-right" />
              </a>

              <ul class="read-more__list">
                <li class="read-more__item">
                  <div class="read-more__item-img">
                    <img src="/images/events-icons/calendar.svg" alt="calendar" />
                  </div>
                  <span>{{ eventInfo.date }} {{ eventInfo.month }} {{ eventInfo.time }}</span>
                </li>

                <li class="read-more__item">
                  <div class="read-more__item-img">
                    <img src="/images/events-icons/marker.svg" alt="marker" />
                  </div>
                  <p>
                    <span>{{ event.attributes.location_name }}</span
                    ><br />
                    <span>{{ event.attributes.location_address }}</span>
                  </p>
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
              html: true,
            }"
            v-if="event.attributes.description"
            :source="event.attributes.description"
            class="read-more__descr"
            ref="eventDescription"
          />

          <div v-if="event.attributes.youtube_video" class="read-more__yt-wrapper">
            <iframe
              class="read-more__yt"
              :src="getYtEmbedLink(event.attributes.youtube_video)"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </transition>

      <the-loader v-else-if="isLoading" />

      <router-link
        :to="route.query.archived ? Tr.i18nRoute({ name: 'events-archive' }) : Tr.i18nRoute({ name: 'home' })"
        class="read-more__btn"
      >
        <span>{{ $t("event.back") }}</span>
        <img src="/images/arrows/arrow-left.svg" alt="arrow-left" />
      </router-link>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from "vue";
import type { Ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import VueMarkdown from "vue-markdown-render";
import { useEventsStore } from "@/stores/events";
import type { IEvent } from "@/ts/interfaces/event";
import getYtEmbedLink from "@/utils/get-yt-embed-link";
import Tr from "@/i18n/translation";
import TheLoader from "@/components/TheLoader.vue";
import createDatetimeString from "@/utils/create-datetime-string";
import separateDateTime from "@/utils/separate-date-time";

interface IEventInfo {
  date: string | undefined;
  month: string | undefined;
  time: string | undefined;
  priceRange: string | undefined;
}

interface IAvailableLocale {
  id: number;
  locale: string;
}

const route = useRoute();
const { t, locale } = useI18n();

const { event } = storeToRefs(useEventsStore());
const { getEvent, clearEvent } = useEventsStore();

const isLoading: Ref<boolean> = ref(false);
const currentLocalizedEventId: Ref<number | null> = ref(null);
const eventDescription = ref<HTMLDivElement | null>(null);

const eventInfo = computed<IEventInfo | null>(() => {
  if (!event.value) return null;

  const yerevanDatetime = createDatetimeString(event.value?.attributes.datetime, "Asia/Yerevan");
  const datetimeObject = separateDateTime(yerevanDatetime);
  const monthObject = {
    "01": t("months.jan"),
    "02": t("months.feb"),
    "03": t("months.mar"),
    "04": t("months.apr"),
    "05": t("months.may"),
    "06": t("months.jun"),
    "07": t("months.jul"),
    "08": t("months.aug"),
    "09": t("months.sep"),
    "10": t("months.oct"),
    "11": t("months.nov"),
    "12": t("months.dec"),
  };
  const monthStr = datetimeObject.dateStr.split("-")[1];

  return {
    date: datetimeObject.dateStr.split("-")[2],
    month: monthObject[monthStr as keyof typeof monthObject],
    time: datetimeObject.timeStr,
    priceRange: event.value.attributes.max_price
      ? `${event.value.attributes.min_price} – ${event.value.attributes.max_price} AMD`
      : `${event.value.attributes.min_price} AMD`,
  };
});
const coverUrl = computed<string>(() => {
  return `${(event.value as IEvent).attributes.cover.data.attributes.url}`;
});
const availableLocales = computed<IAvailableLocale[]>(() => {
  if (!event.value) return [];

  const localizationsArr = event.value?.attributes.localizations.data;

  if (!localizationsArr?.length) return [];

  return [
    { id: event.value.id, locale: event.value.attributes.locale },
    ...localizationsArr.map(l => {
      return {
        id: l.id,
        locale: l.attributes.locale,
      };
    }),
  ];
});

// if (event.value) {
//   const { date, month, time, priceRange } = useEventComputed(
//     event.value?.attributes?.datetime,
//     event.value?.attributes?.min_price,
//     event.value?.attributes?.max_price,
//   );
//
//   eventInfo.date = date.value;
//   eventInfo.month = month.value;
//   eventInfo.time = time.value;
//   eventInfo.priceRange = priceRange.value;
// }

const getEventHandler = async () => {
  isLoading.value = true;

  await getEvent(route.params.eventId as string);
  currentLocalizedEventId.value = +route.params.eventId;

  // const { date, month, year, time, priceRange } = useEventComputed(
  //   (event.value as IEvent).attributes.datetime,
  //   (event.value as IEvent).attributes.min_price,
  //   (event.value as IEvent).attributes.max_price,
  // );

  // eventInfo.date = date.value;
  // eventInfo.month = month.value;
  // eventInfo.year = year.value;
  // eventInfo.time = time.value;
  // eventInfo.priceRange = priceRange.value;

  isLoading.value = false;
};

getEventHandler();

watch(eventDescription, value => {
  if (!value) return;

  // @ts-ignore
  const descriptionLinks = value?.$el.querySelectorAll("a");

  [...descriptionLinks].forEach(function (link) {
    link.style.color = "#0000ff";
    link.style.textDecoration = "underline";
    link.setAttribute("target", "_blank");
  });
});

watch(locale, value => {
  if (!availableLocales.value.length) return;

  currentLocalizedEventId.value = (availableLocales.value.find(l => l.locale === value) as IAvailableLocale).id;
});

watch(currentLocalizedEventId, (value, oldValue) => {
  if (!oldValue || !value) return;

  getEvent(String(value));
  route.params.eventId = String(value);
});

onUnmounted(() => {
  clearEvent();
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/elements/btns";
@import "@/assets/scss/elements/card";
@import "@/assets/scss/elements/card-title";
@import "@/assets/scss/elements/card-subtitle";
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
