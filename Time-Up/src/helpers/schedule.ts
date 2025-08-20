// helpers/schedule.ts
import { Schedule } from '../types/schedule';

export type ScheduleDraft = Partial<Schedule>;

export const toDraft = (s: Schedule): ScheduleDraft => ({
  scheduleId: s.scheduleId ?? '',
  name: s.name ?? '',
  start_date: s.start_date ?? new Date().toISOString(),
  end_date: s.end_date ?? new Date().toISOString(),
  color: s.color ?? 'gray',
  is_important: s.is_important ?? false,
  is_reminding: s.is_reminding ?? false,
  is_recurring: s.is_recurring ?? false,
  remind_at: s.remind_at ?? 0,
  memo: s.memo ?? '',
  place_name: s.place_name ?? '',
  address: s.address ?? '',
  recurrence_rule: s.recurrence_rule
    ? {
        repeat_type: s.recurrence_rule.repeat_type ?? null,
        monthly_option: s.recurrence_rule.monthly_option ?? null,
        day_of_month: s.recurrence_rule.day_of_month ?? null,
        nth_week: s.recurrence_rule.nth_week ?? null,
        weekday: s.recurrence_rule.weekday ?? null,
        repeat_mode: s.recurrence_rule.repeat_mode ?? null,
        repeat_count: s.recurrence_rule.repeat_count ?? null,
        repeat_until_date: s.recurrence_rule.repeat_until_date ?? null,
        repeat_weekdays: s.recurrence_rule.repeat_weekdays ?? [],
      }
    : undefined,
});
