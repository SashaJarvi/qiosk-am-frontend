import { computed } from "vue";
import createDatetimeString from "@/utils/create-datetime-string";
import separateDateTime from "@/utils/separate-date-time";

export function useEventComputed(dateString?: string, minPrice?: number, maxPrice?: number) {
  const yerevanDatetime = createDatetimeString(dateString as string, "Asia/Yerevan");
  const datetimeObject = separateDateTime(yerevanDatetime);
  const date = computed<string>(() => datetimeObject.dateStr.split("-")[2]);
  const month = computed<string>(() => {
    const monthObject = {
      "01": "января",
      "02": "февраля",
      "03": "марта",
      "04": "апреля",
      "05": "мая",
      "06": "июня",
      "07": "июля",
      "08": "августа",
      "09": "сентября",
      "10": "октября",
      "11": "ноября",
      "12": "декабря",
    };
    const monthStr = datetimeObject.dateStr.split("-")[1];

    return monthObject[monthStr as keyof typeof monthObject];
  });

  const year = computed<string>(() => datetimeObject.dateStr.split("-")[0]);

  const time = computed<string>(() => {
    return datetimeObject.timeStr;
  });

  const priceRange = computed<string>(() => {
    return maxPrice ? `${minPrice} – ${maxPrice} AMD` : `${minPrice} AMD`;
  });

  return {
    yerevanDatetime,
    datetimeObject,
    date,
    month,
    year,
    time,
    priceRange,
  };
}
