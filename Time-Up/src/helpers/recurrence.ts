import { RepeatWeekDays, Schedule } from "../types/schedule";


export const toggleWeekday = (current: RepeatWeekDays = [], day: number): RepeatWeekDays => {
    return current.includes(day)
    ? current.filter(d => d !== day)
    : [...current, day].sort((a, b) => a - b);
}

export const ensureRecurrenceRule = (rule?: Schedule['recurrence_rule']): NonNullable<Schedule['recurrence_rule']> => ({
  repeat_type: rule?.repeat_type ?? null,
  repeat_weekdays: rule?.repeat_weekdays ?? [],
  monthly_option: rule?.monthly_option ?? null,  // 'dayOfMonth' | 'nthWeekday' 등 네이밍 합의
  day_of_month: rule?.day_of_month ?? null,
  nth_week: rule?.nth_week ?? null,
  weekday: rule?.weekday ?? [],
  repeat_mode: rule?.repeat_mode ?? 'count',     // 'count' | 'until'
  repeat_count: rule?.repeat_count ?? null,        // number가 더 자연스러움(아래 참고)
  repeat_until_date: rule?.repeat_until_date ?? null,
});