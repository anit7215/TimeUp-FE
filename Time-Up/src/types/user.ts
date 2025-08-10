export type JobType = 
  | '직장인'
  | '공무원/군인'
  | '자영업자'
  | '프리랜서'
  | '학생'
  | '무직'
  | '기타';

export type TransportType = 'bus' | 'subway' | 'car' | 'walk';

export type TransportPreference = {
  priority: number;
  transportType: TransportType;
};

export type UserInfo = {
  email: string;
  name: string;
  birth: number;
  job: JobType;
  avg_ready_time: number;
  duration_time: number;
  alarm_check_time: string;
  user_preference_transport?: {
    transport: TransportType;
    priority: number;
  }[];
  home_address: string | null;
  work_address: string | null;
};

export type AutoAlarmCheckTime = {
  alarm_check_time: string; 
};

export type AutoAlarmFeedback = {
  time_rating: number;     
  wakeup_rating: number;   
  comment?: string;
  alarm_id?: number;        
};