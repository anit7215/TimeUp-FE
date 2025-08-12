// src/contexts/AlarmContext.tsx
import { deleteMyAlarm, toggleMyAlarmActivation } from '@/src/apis/alarmApi';
import moment from 'moment';
import React, { createContext, useContext, useState } from 'react';
import { AlarmItem } from '../types/alarm';

export type Day = '월' | '화' | '수' | '목' | '금' | '토' | '일';

const weekdays: Day[] = ['월', '화', '수', '목', '금', '토', '일'];

interface AlarmContextProps {
  selectedDay: Day | null;
  setSelectedDay: (day: Day) => void;

  weekdaySwitchStates: Record<Day, boolean>;
  setWeekdaySwitchStates: React.Dispatch<React.SetStateAction<Record<Day, boolean>>>;

  autoAlarmOn: boolean;
  setAutoAlarmOn: React.Dispatch<React.SetStateAction<boolean>>;

  myAlarms: AlarmItem[];
  setMyAlarms: React.Dispatch<React.SetStateAction<AlarmItem[]>>;

  wakeupAlarms: AlarmItem[];
  setWakeupAlarms: React.Dispatch<React.SetStateAction<AlarmItem[]>>;

  selectedAlarmId: number | null;
  setSelectedAlarmId: (id: number | null) => void;

  selectedAlarmDate: string;
  setSelectedAlarmDate: (date: string) => void;

  updateAlarmField: <K extends keyof AlarmItem>(
    alarmId: number,
    field: K,
    value: AlarmItem[K]
  ) => void;

  toggleAlarmActivation: (alarmId: number) => Promise<void>;
  deleteAlarmById: (alarmId: number) => Promise<void>;
}

const AlarmContext = createContext<AlarmContextProps | undefined>(undefined);

export const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);

  const initialSwitchStates = weekdays.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {} as Record<Day, boolean>);

  const [weekdaySwitchStates, setWeekdaySwitchStates] = useState<Record<Day, boolean>>(initialSwitchStates);
  const [autoAlarmOn, setAutoAlarmOn] = useState<boolean>(false);
  const [selectedAlarmDate, setSelectedAlarmDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [selectedAlarmId, setSelectedAlarmId] = useState<number | null>(null);

  const [myAlarms, setMyAlarms] = useState<AlarmItem[]>([]);
  const [wakeupAlarms, setWakeupAlarms] = useState<AlarmItem[]>([]);

  const updateAlarmField = <K extends keyof AlarmItem>(
    alarmId: number,
    field: K,
    value: AlarmItem[K]
  ) => {
    setMyAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === alarmId ? { ...alarm, [field]: value } : alarm
      )
    );
  };

const toggleAlarmActivation = async (alarmId: number) => {
  try {
    await toggleMyAlarmActivation(alarmId);

    setMyAlarms((prevAlarms) =>
      prevAlarms.map((alarm) =>
        alarm.id === alarmId
          ? { ...alarm, isActive: !alarm.isActive }
          : alarm
      )
    );

    console.log(`알람 ${alarmId}의 상태를 토글했습니다.`);
  } catch (error) {
    console.error(`알람 ${alarmId} 토글 실패:`, error);
  }
};

const deleteAlarmById = async (alarmId: number) => {
  try {
    await deleteMyAlarm(alarmId);
    setMyAlarms(prev => prev.filter(alarm => alarm.id !== alarmId));
    console.log(`알람 ${alarmId} 삭제 완료`);
  } catch (error) {
    console.error(`알람 ${alarmId} 삭제 실패:`, error);
  }
};

// useEffect(() => {
//   const fetchAlarms = async () => {
//     try {
//       const token = await getAccessToken();
//       const res = await axiosInstance.get<GetAllAlarmsResponse>(
//         '/alarm/alarmlist',
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // ✅ 전체 응답 출력
//     console.log('전체 알람 응답:', res.data);

//     console.log('기상 알람 목록:', res.data.success?.wakeup_alarms ?? []);
//     console.log('자동 알람 목록:', res.data.success?.auto_alarms ?? []);
//     console.log('내 알람 목록:', res.data.success?.my_alarms ?? []);


//       const wakeupList = res.data.success?.wakeup_alarms ?? [];
//       console.log('서버 응답 wakeup_alarms:', res.data.success?.wakeup_alarms);

//       const transformed = wakeupList.map(transformWakeupSummaryToAlarmItem);

//       const ordered = ['월', '화', '수', '목', '금', '토', '일'].map(day =>
//         transformed.find(a => a.date.dayOfWeek === day)
//       ).filter(Boolean) as AlarmItem[];

//       setWakeupAlarms(ordered);
//     } catch (err) {
//       console.error('전체 알람 조회 실패:', err);
//     }
//   };

//   fetchAlarms();
// }, []);


  return (
    <AlarmContext.Provider
      value={{
        selectedDay,
        setSelectedDay,
        weekdaySwitchStates,
        setWeekdaySwitchStates,
        autoAlarmOn,
        setAutoAlarmOn,
        myAlarms,
        setMyAlarms,
        wakeupAlarms,
        setWakeupAlarms,
        selectedAlarmId,
        setSelectedAlarmId,
        selectedAlarmDate,
        setSelectedAlarmDate,
        updateAlarmField,
        toggleAlarmActivation,
        deleteAlarmById
      }}
    >
      {children}
    </AlarmContext.Provider>
  );
};

export const useAlarmContext = () => {
  const context = useContext(AlarmContext);
  if (!context) throw new Error('useAlarmContext must be used within AlarmProvider');
  return context;
};