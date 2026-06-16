export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatItalianDate(date: Date): string {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function getWeekId(date: Date): string {
  const weekStart = getMonday(date);
  return toDateKey(weekStart);
}

function getMonday(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}
