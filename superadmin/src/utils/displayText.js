export const upper = (value, fallback = "—") => {
  const text = String(value ?? "").trim();
  return text ? text.toUpperCase() : fallback;
};
