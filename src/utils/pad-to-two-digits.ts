const padToTwoDigits = (num: number): string => {
  return String(num).padStart(2, "0");
};

export default padToTwoDigits;
