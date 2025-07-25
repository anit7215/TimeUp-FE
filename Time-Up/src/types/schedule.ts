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
    remind_at?: number;
    is_recurring: boolean;
    is_important: boolean;
}

export type CreateScheduleRequest = Omit<Schedule, 'id'>;

export type UpdateScheduleRequest = Partial<CreateScheduleRequest> & {
    scheduleId: string;
};

