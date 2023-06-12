import { computed, ref } from "vue";
import type { Ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { useEventsCategoriesStore } from "@/stores/event-categories";
import type { IEvent } from "@/ts/interfaces/event";
import type { IEventCategory } from "@/ts/interfaces/event-category";
import api from "@/api";
import createDatetimeString from "@/utils/create-datetime-string";

interface IFormData {
  name: string;
  email: string;
  message: string;
}

export const useEventsStore = defineStore("events", () => {
  const events: Ref<IEvent[] | null> = ref(null);
  const searchStr: Ref<string> = ref("");
  const eventsToShow: Ref<number> = ref(3);
  const event: Ref<IEvent | null> = ref(null);

  const { eventsCategory } = storeToRefs(useEventsCategoriesStore());

  const visibleEvents = computed<IEvent[] | null>(() => {
    if (!events.value?.length) return null;

    return eventsToShow.value === events.value?.length ? events.value : events.value.slice(0, eventsToShow.value);
  });

  const searchedEvents = computed<IEvent[] | null>(() => {
    if (!events.value?.length || !searchStr.value) return null;

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

  const categorizedEvents = computed<IEvent[] | null>(() => {
    if (!eventsCategory.value) {
      return searchedEvents.value && searchedEvents.value.length ? searchedEvents.value : visibleEvents.value;
    }

    if (searchedEvents.value && searchedEvents.value.length) {
      return (searchedEvents.value as IEvent[]).filter(
        event => event.attributes.event_category.data.id === (eventsCategory.value as IEventCategory).id,
      );
    }

    return (visibleEvents.value as IEvent[]).filter(
      event => event.attributes.event_category.data.id === (eventsCategory.value as IEventCategory).id,
    );
  });

  const getEvents = async (archived?: boolean) => {
    const url = `events?populate[0]=cover&populate[1]=event_category&filters[datetime][${
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
      .get(`events/${eventId}?populate[0]=cover&populate[1]=event_category`)
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

    if (eventsToShow.value >= (events.value as IEvent[]).length) {
      eventsToShow.value = (events.value as IEvent[]).length;
      return;
    }

    eventsToShow.value += basicValue;
  };

  const resetEventsToShow = () => {
    const initialEventsToShow: number = 3;
    eventsToShow.value = initialEventsToShow;
  };

  const clearEvents = () => {
    events.value = null;
  };

  const clearEvent = () => {
    event.value = null;
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
  };
});
