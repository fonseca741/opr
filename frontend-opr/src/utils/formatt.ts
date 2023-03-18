export const formattStringToDots = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value;
  }

  return value.substring(0, maxLength).concat("...");
};
