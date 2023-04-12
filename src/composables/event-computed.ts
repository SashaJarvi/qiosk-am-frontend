import padToTwoDigits from "@/utils/pad-to-two-digits";
import { computed } from "vue";

export function useEventComputed(dateString?: string, minPrice?: number, maxPrice?: number) {
  const eventDate = computed<Date>(() => new Date(dateString as string));
  const date = computed<string>(() => padToTwoDigits(eventDate.value.getDate()));
  const month = computed<string>(() => {
    const monthObject = {
      Jan: "Янв.",
      Feb: "Фев.",
      Mar: "Мар.",
      Apr: "Апр.",
      May: "Мая",
      Jun: "Июн.",
      Jul: "Июл.",
      Aug: "Авг.",
      Sep: "Сен.",
      Oct: "Окт.",
      Nov: "Ноя.",
      Dec: "Дек.",
    };
    const dateStr = eventDate.value.toDateString();
    const dateStrArr = dateStr.split(" ");
    const monthStr: string = dateStrArr[1];

    return monthObject[monthStr as keyof typeof monthObject];
  });

  const year = computed<string>(() => `${eventDate.value.getFullYear()}`);

  const time = computed<string>(() => {
    return `${padToTwoDigits(eventDate.value.getHours())}:${padToTwoDigits(eventDate.value.getMinutes())}`;
  });

  const priceRange = computed<string>(() => {
    return maxPrice ? `${minPrice} AMD – ${maxPrice} AMD` : `${minPrice} AMD`;
  });

  return {
    eventDate,
    date,
    month,
    year,
    time,
    priceRange,
  };
}
