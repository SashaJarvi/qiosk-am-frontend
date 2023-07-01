import { ref } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import type { IEventCategory } from "@/ts/interfaces/event-category";
import api from "@/api";
import { useI18n } from "vue-i18n";

export const useEventsCategoriesStore = defineStore("events-categories", () => {
  const { locale } = useI18n();

  const eventsCategories: Ref<IEventCategory[] | null> = ref(null);
  const eventsCategory: Ref<IEventCategory | null> = ref(null);

  const getEventsCategories = async () => {
    return api
      .get(`event-categories?locale=${locale.value}`)
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
