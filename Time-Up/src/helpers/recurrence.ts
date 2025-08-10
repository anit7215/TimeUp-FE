import { RepeatWeekDays, Schedule } from "../types/schedule";


export const toggleWeekday = (current: RepeatWeekDays = [], day: number): RepeatWeekDays => {
    return current.includes(day)
    ? current.filter(d => d !== day)
    : [...current, day].sort((a, b) => a - b);
}

export const ensureRecurrenceRule = (rule?: Schedule['recurrenceRule']): NonNullable<Schedule['recurrenceRule']> => ({
  repeatType: rule?.repeatType ?? null,
  repeatWeekDays: rule?.repeatWeekDays ?? [],
  monthlyOption: rule?.monthlyOption ?? null,  // 'dayOfMonth' | 'nthWeekday' 등 네이밍 합의
  dayOfMonth: rule?.dayOfMonth ?? null,
  nthWeek: rule?.nthWeek ?? null,
  weekday: rule?.weekday ?? [],
  repeatMode: rule?.repeatMode ?? 'count',     // 'count' | 'until'
  repeatCount: rule?.repeatCount ?? '',        // number가 더 자연스러움(아래 참고)
  repeatUntilDate: rule?.repeatUntilDate ?? null,
});