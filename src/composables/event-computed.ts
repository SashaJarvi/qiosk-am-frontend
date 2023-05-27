import { computed } from "vue";
import padToTwoDigits from "@/utils/pad-to-two-digits";

export function useEventComputed(dateString?: string, minPrice?: number, maxPrice?: number) {
  const eventDate = computed<Date>(() => new Date(dateString as string));
  const date = computed<string>(() => padToTwoDigits(eventDate.value.getDate()));
  const month = computed<string>(() => {
    const monthObject = {
      Jan: "января",
      Feb: "февраля",
      Mar: "марта",
      Apr: "апреля",
      May: "мая",
      Jun: "июня",
      Jul: "июля",
      Aug: "августа",
      Sep: "сентября",
      Oct: "октября",
      Nov: "ноября",
      Dec: "декабря",
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
    return maxPrice ? `${minPrice} – ${maxPrice} AMD` : `${minPrice} AMD`;
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
