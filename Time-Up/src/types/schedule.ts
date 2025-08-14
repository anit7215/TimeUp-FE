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
  recurrence_rule?: {
    repeat_type: "weekly" | "monthly" | null;
    monthly_option?: null | 'day_of_month' | 'nth_weekday';
    day_of_month?: null | number;
    nth_week?: null | number;
    weekday: number | null;
    repeat_mode?: 'count' | 'until' | null;
    repeat_count?: number | null;
    repeat_until_date?: null | string;
    repeat_weekdays?: RepeatWeekDays;
  };
}


export type CreateScheduleRequest = Omit<Schedule, 'scheduleId'>;

export type ScheduleDraft = Partial<Schedule>; 

export interface GetScheduleRequest {
  scheduleId: string;
}

export type GetScheduleResponse = Schedule;

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