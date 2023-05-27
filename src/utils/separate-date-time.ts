const separateDateTime = (dateTime: string) => {
  const dateStr = dateTime.split("T")[0];
  const time = dateTime.split("T")[1].split(".")[0].split(":");
  const timeStr = `${time[0]}:${time[1]}`;
  return { dateStr, timeStr };
};

export default separateDateTime;
