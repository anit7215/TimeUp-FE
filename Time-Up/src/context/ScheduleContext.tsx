import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Schedule, CreateScheduleRequest, UpdateScheduleRequest, ImportantSchedule } from '../types/schedule';

// 상태 타입 정의
interface ScheduleState {
  schedules: Schedule[];
  draft: CreateScheduleRequest;
  loading: boolean;
  error: string | null;
}

// 액션 타입 정의
type ScheduleAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SCHEDULES'; payload: Schedule[] }
  | { type: 'ADD_SCHEDULE'; payload: Schedule }
  | { type: 'UPDATE_SCHEDULE'; payload: UpdateScheduleRequest }
  | { type: 'DELETE_SCHEDULE'; payload: string }
  | { type: 'TOGGLE_IMPORTANT'; payload: string }
  | { type: 'UPDATE_DRAFT'; payload: Partial<CreateScheduleRequest> }
  | { type: 'RESET_DRAFT' };
  
// 초기 상태
const initialState: ScheduleState = {
  schedules: [],
  draft: {
    name: '',
    start_date: '',
    end_date: '',
    place_name: '',
    address: '',
    color: '',
    is_important: false,
    is_reminding: false,
    memo: '',
    remind_at: null,
    is_recurring: false,
    
  },
  loading: false,
  error: null
};

// 리듀서 함수
function scheduleReducer(state: ScheduleState, action: ScheduleAction): ScheduleState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_SCHEDULES':
      return { ...state, schedules: action.payload, loading: false, error: null };
    
    case 'ADD_SCHEDULE':
      return {
        ...state,
        schedules: [...state.schedules, action.payload],
        error: null,
      };
    
    case 'UPDATE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.map(schedule =>
          schedule.scheduleId === action.payload.scheduleId
            ? { ...schedule, ...action.payload }
            : schedule
        ),
        error: null,
      };
    
    case 'DELETE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.filter(
          schedule => schedule.scheduleId !== action.payload
        ),
        error: null,
      };
    
    case 'TOGGLE_IMPORTANT':
      return {
        ...state,
        schedules: state.schedules.map(schedule =>
          schedule.scheduleId === action.payload
            ? { ...schedule, is_important: !schedule.is_important }
            : schedule
        ),
        error: null,
      };

      case 'UPDATE_DRAFT':
        return {
            ...state,
            draft: {
                ...state.draft,
                ...action.payload,
            },
        }

        case 'RESET_DRAFT':
            return {
                ...state,
                draft: initialState.draft,
            }
    
    default:
      return state;
  }
}

// 컨텍스트 타입 정의
interface ScheduleContextType {
  state: ScheduleState;
  dispatch: React.Dispatch<ScheduleAction>;
  // 편의 메서드들
  addSchedule: (schedule: CreateScheduleRequest) => void;
  updateSchedule: (scheduleData: UpdateScheduleRequest) => void;
  deleteSchedule: (scheduleId: string) => void;
  toggleImportant: (scheduleId: string) => void;
  getImportantSchedules: () => ImportantSchedule[];
  getScheduleById: (scheduleId: string) => Schedule | undefined;
}

// 컨텍스트 생성
const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

// Provider 컴포넌트
interface ScheduleProviderProps {
  children: ReactNode;
}

export function ScheduleProvider({ children }: ScheduleProviderProps) {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);

  // 스케줄 추가
  const addSchedule = (scheduleData: CreateScheduleRequest) => {
    const newSchedule: Schedule = {
      ...scheduleData,
      scheduleId: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    dispatch({ type: 'ADD_SCHEDULE', payload: newSchedule });
  };

  // 스케줄 업데이트
  const updateSchedule = (scheduleData: UpdateScheduleRequest) => {
    dispatch({ type: 'UPDATE_SCHEDULE', payload: scheduleData });
  };

  // 스케줄 삭제
  const deleteSchedule = (scheduleId: string) => {
    dispatch({ type: 'DELETE_SCHEDULE', payload: scheduleId });
  };

  // 중요 일정 토글
  const toggleImportant = (scheduleId: string) => {
    dispatch({ type: 'TOGGLE_IMPORTANT', payload: scheduleId });
  };

  // 중요 일정만 가져오기
  const getImportantSchedules = (): ImportantSchedule[] => {
    return state.schedules
      .filter(schedule => schedule.is_important)
      .map(schedule => ({
        scheduleId: schedule.scheduleId,
        name: schedule.name,
        start_date: schedule.start_date,
        end_date: schedule.end_date,
        place_name: schedule.place_name,
        address: schedule.address,
        color: schedule.color,
        is_important: schedule.is_important,
        is_recurring: schedule.is_recurring,

      }));
  };

  // ID로 스케줄 찾기
  const getScheduleById = (scheduleId: string): Schedule | undefined => {
    return state.schedules.find(schedule => schedule.scheduleId === scheduleId);
  };

  const contextValue: ScheduleContextType = {
    state,
    dispatch,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    toggleImportant,
    getImportantSchedules,
    getScheduleById,
  };

  return (
    <ScheduleContext.Provider value={contextValue}>
      {children}
    </ScheduleContext.Provider>
  );
}

// 커스텀 훅
export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}

// hooks/useScheduleActions.ts - 추가 편의 훅들
export function useScheduleActions() {
  const { addSchedule, updateSchedule, deleteSchedule, toggleImportant } = useSchedule();
  
  return {
    addSchedule,
    updateSchedule,
    deleteSchedule,
    toggleImportant,
  };
}

export function useScheduleSelectors() {
  const { state, getImportantSchedules, getScheduleById } = useSchedule();
  
  return {
    schedules: state.schedules,
    loading: state.loading,
    error: state.error,
    importantSchedules: getImportantSchedules(),
    getScheduleById,
    // 추가 셀렉터들
    getTodaySchedules: () => {
      const today = new Date().toISOString().split('T')[0];
      return state.schedules.filter(schedule => 
        schedule.start_date <= today && schedule.end_date >= today
      );
    },
    getUpcomingSchedules: (days: number = 7) => {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);
      
      return state.schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.start_date);
        return scheduleDate >= today && scheduleDate <= futureDate;
      });
    },
  };
}

export default ScheduleContext;