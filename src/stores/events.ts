import { ref, computed } from "vue";
import type { Ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useEventsCategoriesStore } from "@/stores/event-categories";
import type { IEvent } from "@/ts/interfaces/event";
import type { IEventCategory } from "@/ts/interfaces/event-category";
import api from "@/api";

interface IFormData {
  name: string;
  email: string;
  message: string;
}

export const useEventsStore = defineStore("events", () => {
  const { locale } = useI18n();

  const events: Ref<IEvent[]> = ref([]);
  const searchStr: Ref<string> = ref("");
  const eventsToShow: Ref<number> = ref(3);
  const event: Ref<IEvent | null> = ref(null);

  const { eventsCategory } = storeToRefs(useEventsCategoriesStore());

  const searchedEvents = computed<IEvent[]>(() => {
    if (!events.value.length || !searchStr.value || searchStr.value.length < 3) return [];

    return events.value.filter(event => {
      const lowerSearchStr = searchStr.value.toLowerCase();
      const lowerTitle = event.attributes.title.toLowerCase();
      const lowerShortDescription = event.attributes.short_description.toLowerCase();
      const lowerDescription = event.attributes.description.toLowerCase();

      return (
        lowerDescription.includes(lowerSearchStr) ||
        lowerShortDescription.includes(lowerSearchStr) ||
        lowerTitle.includes(lowerSearchStr)
      );
    });
  });

  const categorizedEvents = computed<IEvent[]>(() => {
    if (!events.value.length) return [];

    if (!eventsCategory.value) {
      return searchedEvents.value && searchedEvents.value.length ? searchedEvents.value : events.value;
    }

    if (searchedEvents.value.length) {
      return (searchedEvents.value as IEvent[]).filter(
        event => event.attributes.event_category.data.id === (eventsCategory.value as IEventCategory).id,
      );
    }

    return (events.value as IEvent[]).filter(
      event => event.attributes.event_category.data.id === (eventsCategory.value as IEventCategory).id,
    );
  });

  const visibleEvents = computed<IEvent[]>(() => {
    if (!categorizedEvents.value.length) return [];

    if (searchedEvents.value.length) return searchedEvents.value;

    return eventsToShow.value === categorizedEvents.value.length
      ? categorizedEvents.value
      : categorizedEvents.value.slice(0, eventsToShow.value);
  });

  const getEvents = async (archived?: boolean) => {
    const url = `events?locale=${locale.value}&populate[0]=cover&populate[1]=event_category&filters[datetime][${
      archived ? "$lt" : "$gt"
    }]=${new Date().toISOString()}&sort=datetime:${archived ? "desc" : "asc"}`;

    return api
      .get(url)
      .then(res => res.json())
      .then(({ data }) => {
        events.value = events.value?.length ? [...events.value, ...data] : data;
      });
  };

  const getEvent = async (eventId: string) => {
    return api
      .get(
        `events/${eventId}?locale=${locale.value}&populate[0]=cover&populate[1]=event_category&populate[2]=localizations`,
      )
      .then(res => res.json())
      .then(({ data }) => (event.value = data));
  };

  const sendEmail = async (formData: IFormData) => {
    return api
      .post(`send-email`, formData)
      .then(res => res.json())
      .then(data => {
        if (data.message === "ok") {
          return { status: "success" };
        } else {
          return { status: "error" };
        }
      });
  };

  const setEventsToShow = () => {
    const basicValue: number = 3;

    eventsToShow.value += basicValue;
  };

  const resetEventsToShow = () => {
    const initialEventsToShow: number = 3;
    eventsToShow.value = initialEventsToShow;
  };

  const clearEvents = () => {
    events.value = [];
  };

  const clearEvent = () => {
    event.value = null;
  };

  const clearSearch = () => {
    searchStr.value = "";
  };

  return {
    events,
    searchStr,
    eventsToShow,
    visibleEvents,
    searchedEvents,
    event,
    categorizedEvents,
    getEvents,
    getEvent,
    sendEmail,
    setEventsToShow,
    resetEventsToShow,
    clearEvents,
    clearEvent,
    clearSearch,
  };
});
