import { computed, reactive, ref } from "vue";
import type { Ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { useEventsCategoriesStore } from "@/stores/event-categories";
import type { IEvent } from "@/ts/interfaces/event";
import type { IEventCategory } from "@/ts/interfaces/event-category";
import api from "@/api";
import delay from "@/utils/delay";

interface IFormData {
  name: string;
  email: string;
  message: string;
}

interface IMeta {
  pagination: {
    page: number | null;
    pageCount: number | null;
    pageSize: number | null;
    total: number | null;
  };
}

export const useEventsStore = defineStore("events", () => {
  const events: Ref<IEvent[] | null> = ref(null);
  const event: Ref<IEvent | null> = ref(null);
  const eventsMeta = reactive<IMeta>({
    pagination: {
      page: null,
      pageCount: null,
      pageSize: null,
      total: null,
    },
  });

  const { eventsCategory } = storeToRefs(useEventsCategoriesStore());

  const categorizedEvents = computed<IEvent[] | null>(() => {
    if (!eventsCategory.value) return events.value;

    return (events.value as IEvent[]).filter(
      event => event.attributes.event_category.data.id === (eventsCategory.value as IEventCategory).id,
    );
  });

  const getEvents = async (hasInternalDelay: boolean = false) => {
    if (
      eventsMeta.pagination &&
      eventsMeta.pagination.page &&
      eventsMeta.pagination.pageCount &&
      eventsMeta.pagination.page >= eventsMeta.pagination.pageCount
    ) {
      return;
    }

    const url =
      eventsMeta.pagination && eventsMeta.pagination.page
        ? `events?populate[0]=cover&populate[1]=event_category&filters[datetime][$gt]=${new Date().toISOString()}&sort[0]=datetime&pagination[page]=${
            eventsMeta.pagination.page + 1
          }&pagination[pageSize]=${eventsMeta.pagination.pageCount}`
        : `events?populate[0]=cover&populate[1]=event_category&filters[datetime][$gt]=${new Date().toISOString()}&sort[0]=datetime&pagination[page]=1&pagination[pageSize]=10`;

    if (hasInternalDelay) await delay();

    return api
      .get(url)
      .then(res => res.json())
      .then(({ data, meta }) => {
        eventsMeta.pagination.page = meta.pagination.page;
        eventsMeta.pagination.pageCount = meta.pagination.pageCount;
        eventsMeta.pagination.pageSize = meta.pagination.pageSize;
        eventsMeta.pagination.total = meta.pagination.total;

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

  const clearEvent = () => {
    event.value = null;
  };

  return {
    events,
    event,
    eventsMeta,
    categorizedEvents,
    getEvents,
    getEvent,
    sendEmail,
    clearEvent,
  };
});
