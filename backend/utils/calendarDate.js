export const parseCalendarDate = (value) => {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  const text = String(value).trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
};

export const calendarDateInputValue = (value) => {
  const date = parseCalendarDate(value);
  if (!date) return "";
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${date.getUTCFullYear()}-${month}-${day}`;
};

export const ageFromCalendarDate = (date) => {
  if (!date) return null;
  const today = new Date();
  let age = today.getUTCFullYear() - date.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - date.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < date.getUTCDate())) age -= 1;
  return age;
};
