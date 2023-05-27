const createDatetimeString = (dateString: string, timezone: string) => {
  const userCurrentDate = new Intl.DateTimeFormat("sv-SE", {
    // @ts-ignore
    dateStyle: "short",
    timeZone: timezone,
  }).format(new Date(dateString));

  const userDateStr = new Intl.DateTimeFormat("sv-SE", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(dateString));

  return `${userCurrentDate}T${userDateStr.split(" ")[1]}.000Z`;
};

export default createDatetimeString;
