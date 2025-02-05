import {
  parseISO,
  startOfISOWeek,
  endOfISOWeek,
  startOfMonth,
  startOfYear,
  endOfYear,
  endOfMonth,
  format,
  addDays,
} from "date-fns";

export function generateDateRange(input: string): string[] {
  let start, end;

  if (/^\d{4}$/.test(input)) {
    start = startOfYear(parseISO(input));
    end = endOfYear(parseISO(input));
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return [input];
  } else if (/^\d{4}-W\d{2}$/.test(input)) {
    const date = parseISO(input);
    start = startOfISOWeek(date);
    end = endOfISOWeek(date);
  } else if (/^\d{4}-\d{2}$/.test(input)) {
    const date = parseISO(input + "-01");
    start = startOfMonth(date);
    end = endOfMonth(date);
  } else {
    throw new Error("Invalid format.");
  }

  const dates = [];
  let current = start;

  while (current <= end) {
    dates.push(format(current, "yyyy-MM-dd")); // Format as YYYY-MM-DD
    current = addDays(current, 1);
  }

  return dates;
}
