type WeeklySlot = { day: number };

function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function getIsoWeekday(value: string): number {
  const weekday = parseDateOnly(value).getUTCDay();
  return weekday === 0 ? 7 : weekday;
}

export function countScheduleOccurrences(
  startDate: string,
  endDate: string,
  slots: WeeklySlot[],
): number {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  if (start > end || slots.length === 0) return 0;

  let count = 0;
  for (
    const cursor = new Date(start);
    cursor <= end;
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  ) {
    const weekday = cursor.getUTCDay() === 0 ? 7 : cursor.getUTCDay();
    count += slots.filter((slot) => slot.day === weekday).length;
  }
  return count;
}
