import { computed, ref } from "vue";
import type { Ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { useEventsCategoriesStore } from "@/stores/event-categories";
import type { IEvent } from "@/ts/interfaces/event";
import api from "@/api";
import type { IEventCategory } from "@/ts/interfaces/event-category";

export const useEventsStore = defineStore("events", () => {
  const events: Ref<IEvent[] | null> = ref(null);
  const event: Ref<IEvent | null> = ref(null);

  const { eventsCategory } = storeToRefs(useEventsCategoriesStore());

  const categorizedEvents = computed<IEvent[] | null>(() => {
    if (!eventsCategory.value) return events.value;

    return (events.value as IEvent[]).filter(
      event => event.attributes.event_category.data.id === (eventsCategory.value as IEventCategory).id,
    );
  });

  const getEvents = async () => {
    return api
      .get(
        `events?populate[0]=cover&populate[1]=event_category&filters[datetime][$gt]=${new Date().toISOString()}?sort[0]=datetime`,
      )
      .then(res => res.json())
      .then(
        ({ data }) =>
          (events.value = data.sort(
            (a: IEvent, b: IEvent) =>
              new Date(a.attributes.datetime).getTime() - new Date(b.attributes.datetime).getTime(),
          )),
      );
  };

  const getEvent = async (eventId: string) => {
    return api
      .get(`events/${eventId}?populate[0]=cover&populate[1]=event_category`)
      .then(res => res.json())
      .then(({ data }) => (event.value = data));
  };

  const clearEvent = () => {
    event.value = null;
  };

  return {
    events,
    event,
    categorizedEvents,
    getEvents,
    getEvent,
    clearEvent,
  };
});
