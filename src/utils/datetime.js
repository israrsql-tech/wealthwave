// src/utils/datetime.js

export function formatIstDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);  // "20/12/2025, 11:20 am"
}

export function formatIstDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);  // "20/12/2025"
}
