import { ref } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import api from "@/api";
import type { IEventCategory } from "@/ts/interfaces/event-category";

export const useEventsCategoriesStore = defineStore("events-categories", () => {
  const eventsCategories: Ref<IEventCategory[] | null> = ref(null);
  const eventsCategory: Ref<IEventCategory | null> = ref(null);

  const getEventsCategories = async () => {
    return api
      .get("event-categories")
      .then(res => res.json())
      .then(({ data }) => (eventsCategories.value = data));
  };

  const selectEventCategory = (id: number): void => {
    eventsCategory.value = (eventsCategories.value as IEventCategory[]).find(c => c.id === id) as IEventCategory;
  };

  const clearCategory = (): void => {
    eventsCategory.value = null;
  };

  return {
    eventsCategories,
    eventsCategory,
    getEventsCategories,
    selectEventCategory,
    clearCategory,
  };
});
