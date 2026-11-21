// Use at render boundaries so legacy records are shown consistently even
// before the one-time database normalization has been run.
export const upper = (value, fallback = "—") => {
  const text = String(value ?? "").trim();
  return text ? text.toUpperCase() : fallback;
};
