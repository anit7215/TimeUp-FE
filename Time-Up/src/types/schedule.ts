// types/schedule.ts
export type RepeatWeekDays = number[];

export interface Schedule {
  scheduleId: string;
  name: string;
  start_date: string;
  end_date: string;
  place_name?: string;
  address?: string;
  color: string;
  memo?: string;
  is_reminding: boolean;
  remind_at?: number | null;
  is_recurring: boolean;
  is_important: boolean;
  recurrenceRule?: {
    repeatType: "weekly" | "monthly" | null;
      repeatWeekDays?: RepeatWeekDays;
      monthlyOption?: null | 'day_of_month' | 'nth_weekday';
      dayOfMonth?: null | number;
      nthWeek?: null | number;
      weekday: number[];
    repeatMode?: 'count' | 'until' | null;
    repeatCount?: number | null;
    repeatUntilDate?: null | string;
  };
  repeatWeekDays?: number[];
};

export type CreateScheduleRequest = Omit<Schedule, 'scheduleId'>;

export type UpdateScheduleRequest = Partial<CreateScheduleRequest> & {
  scheduleId: string;
};

export interface ImportantSchedule {
  scheduleId: string;
  name: string;
  start_date: string;
  end_date: string;
  place_name?: string;
  color: string;
  is_important: boolean;
}