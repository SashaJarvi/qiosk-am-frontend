import { computed, reactive, ref } from "vue";
import type { Ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { useEventsCategoriesStore } from "@/stores/event-categories";
import type { IEvent } from "@/ts/interfaces/event";
import type { IEventCategory } from "@/ts/interfaces/event-category";
import api from "@/api";
import delay from "@/utils/delay";
import useDebouncedRef from "@/composables/debounced-ref";

interface IMeta {
  pagination: {
    page: number | null;
    pageCount: number | null;
    pageSize: number | null;
    total: number | null;
  };
}

interface IGetEventsParams {
  archived?: boolean;
  hasInternalDelay?: boolean;
}

interface IFormData {
  name: string;
  email: string;
  message: string;
}

export const useEventsStore = defineStore("events", () => {
  const events: Ref<IEvent[] | null> = ref(null);
  const searchStr = useDebouncedRef("", 1500, false);
  const searchedEvents: Ref<IEvent[] | null> = ref(null);
  const event: Ref<IEvent | null> = ref(null);
  const eventsMeta = reactive<IMeta>({
    pagination: {
      page: null,
      pageCount: null,
      pageSize: null,
      total: null,
    },
  });
  const searchedEventsMeta = reactive<IMeta>({
    pagination: {
      page: null,
      pageCount: null,
      pageSize: null,
      total: null,
    },
  });

  const { eventsCategory } = storeToRefs(useEventsCategoriesStore());

  const categorizedEvents = computed<IEvent[] | null>(() => {
    if (!eventsCategory.value) {
      return searchedEvents.value && searchedEvents.value.length ? searchedEvents.value : events.value;
    }

    if (searchedEvents.value && searchedEvents.value.length) {
      return (searchedEvents.value as IEvent[]).filter(
        event => event.attributes.event_category.data.id === (eventsCategory.value as IEventCategory).id,
      );
    }

    return (events.value as IEvent[]).filter(
      event => event.attributes.event_category.data.id === (eventsCategory.value as IEventCategory).id,
    );
  });

  const getEvents = async (params?: IGetEventsParams) => {
    let archived;
    let hasInternalDelay;

    if (params) {
      archived = params.archived;
      hasInternalDelay = params.hasInternalDelay;
    }

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
        ? `events?populate[0]=cover&populate[1]=event_category&filters[datetime][${
            archived ? "$lt" : "$gt"
          }]=${new Date().toISOString()}&sort=datetime:${archived ? "desc" : "asc"}&pagination[page]=${
            eventsMeta.pagination.page + 1
          }&pagination[pageSize]=${eventsMeta.pagination.pageCount}`
        : `events?populate[0]=cover&populate[1]=event_category&filters[datetime][${
            archived ? "$lt" : "$gt"
          }]=${new Date().toISOString()}&sort=datetime:${
            archived ? "desc" : "asc"
          }&pagination[page]=1&pagination[pageSize]=10`;

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

  const searchEvents = async (searchStr: string, hasInternalDelay?: boolean) => {
    const url =
      searchedEventsMeta.pagination && searchedEventsMeta.pagination.page
        ? `events?populate[0]=cover&populate[1]=event_category&filters[$or][0][title][$containsi]=${searchStr}&filters[$or][1][description][$containsi]=${searchStr}&filters[$or][2][short_description][$containsi]=${searchStr}&filters[datetime][$gt]=${new Date().toISOString()}&sort[0]=datetime&pagination[page]=${
            searchedEventsMeta.pagination.page + 1
          }&pagination[pageSize]=${searchedEventsMeta.pagination.pageCount}`
        : `events?populate[0]=cover&populate[1]=event_category&filters[$or][0][title][$containsi]=${searchStr}&filters[$or][1][description][$containsi]=${searchStr}&filters[$or][2][short_description][$containsi]=${searchStr}&filters[datetime][$gt]=${new Date().toISOString()}&sort[0]=datetime&pagination[page]=1&pagination[pageSize]=10`;

    if (hasInternalDelay) await delay();

    return api
      .get(url)
      .then(res => res.json())
      .then(({ data, meta }) => {
        searchedEventsMeta.pagination.page = meta.pagination.page;
        searchedEventsMeta.pagination.pageCount = meta.pagination.pageCount;
        searchedEventsMeta.pagination.pageSize = meta.pagination.pageSize;
        searchedEventsMeta.pagination.total = meta.pagination.total;

        searchedEvents.value = searchedEvents.value?.length ? [...searchedEvents.value, ...data] : data;
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

  const clearEvents = () => {
    const metaPagination = eventsMeta.pagination;

    events.value = null;
    Object.keys(metaPagination).forEach(key => {
      metaPagination[key as keyof typeof metaPagination] = null;
    });
  };

  const clearSearchedEvents = () => {
    const metaSearchedPagination = searchedEventsMeta.pagination;

    searchedEvents.value = null;
    Object.keys(metaSearchedPagination).forEach(key => {
      metaSearchedPagination[key as keyof typeof metaSearchedPagination] = null;
    });
  };

  const clearEvent = () => {
    event.value = null;
  };

  return {
    events,
    searchStr,
    searchedEvents,
    event,
    eventsMeta,
    searchedEventsMeta,
    categorizedEvents,
    getEvents,
    searchEvents,
    getEvent,
    sendEmail,
    clearEvents,
    clearSearchedEvents,
    clearEvent,
  };
});
