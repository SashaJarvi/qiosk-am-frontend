import { computed } from "vue";
import { useI18n } from "vue-i18n";
import createDatetimeString from "@/utils/create-datetime-string";
import separateDateTime from "@/utils/separate-date-time";

export function useEventComputed(dateString?: string, minPrice?: number, maxPrice?: number) {
  const { t } = useI18n();

  const yerevanDatetime = createDatetimeString(dateString as string, "Asia/Yerevan");
  const datetimeObject = separateDateTime(yerevanDatetime);
  const date = computed<string>(() => datetimeObject.dateStr.split("-")[2]);
  const month = computed<string>(() => {
    const monthObject = {
      "01": t("months.jan"),
      "02": t("months.feb"),
      "03": t("months.mar"),
      "04": t("months.apr"),
      "05": t("months.may"),
      "06": t("months.jun"),
      "07": t("months.jul"),
      "08": t("months.aug"),
      "09": t("months.sep"),
      "10": t("months.oct"),
      "11": t("months.nov"),
      "12": t("months.dec"),
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
