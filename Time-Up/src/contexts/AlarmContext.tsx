// src/contexts/AlarmContext.tsx
import { deleteMyAlarm, toggleAutoAlarmActivation, toggleMyAlarmActivation } from '@/src/apis/alarmApi';
import { transformAlarmResponseToItem, transformWakeupSummaryToAlarmItem } from '@/src/utils/alarmTransform';
import moment from 'moment';
import React, { createContext, useContext, useState } from 'react';
import { axiosInstance } from '../apis/axiosInstance';
import { AlarmItem, AutoAlarmSummary, GetAllAlarmsResponse } from '../types/alarm';
import { getAccessToken } from '../utils/storage';

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

  autoAlarms: AutoAlarmSummary[];
  setAutoAlarms: React.Dispatch<React.SetStateAction<AutoAlarmSummary[]>>;
  toggleAutoAlarmActiveById: (autoAlarmId: number) => Promise<void>;

  selectedAlarmId: number | null;
  setSelectedAlarmId: (id: number | null) => void;

  selectedAlarmDate: string;
  setSelectedAlarmDate: (date: string) => void;

  updateAlarmField: <K extends keyof AlarmItem>(alarmId: number, field: K, value: AlarmItem[K]) => void;
  updateWakeupAlarmField: <K extends keyof AlarmItem>(
    alarmId: number,
    field: K,
    value: AlarmItem[K]
  ) => void;

  toggleAlarmActivation: (alarmId: number) => Promise<void>;
  deleteAlarmById: (alarmId: number) => Promise<void>;

  isLoadingAlarms: boolean;
  refreshAlarms: () => Promise<void>;
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
  const [isLoadingAlarms, setIsLoadingAlarms] = useState(false);
  const [autoAlarms, setAutoAlarms] = useState<AutoAlarmSummary[]>([]);

  // 서버에서 목록 불러와 컨텍스트 상태 갱신
  const refreshAlarms = async () => {
    setIsLoadingAlarms(true);
    try {
      // 한 번만 /alarm/alarmlist 호출해서 모두 세팅
      const token = await getAccessToken();
      const res = await axiosInstance.get<GetAllAlarmsResponse>(
        '/alarm/alarmlist',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const myList = res.data.success?.my_alarms ?? [];
      const wakeList = res.data.success?.wakeup_alarms ?? [];
      const autoList = res.data.success?.auto_alarms ?? [];

      const mappedMy = myList.map((a, idx) => {
        const serverId = (a as any).alarm_id ?? (a as any).my_alarm_id;
        const tsId = new Date(a.my_alarm_time).getTime() + idx; // 최후의 수단임.. 이거 쓰면 안됨.. 에러 방지용..^^;;
        // 화면 id는 서버ID가 있으면 서버ID로 고정
        const uiId = serverId ?? tsId;
        const item = transformAlarmResponseToItem(a);
        return { ...item, id: uiId, serverId };
      });
      const mappedWake = wakeList.map((w, idx) => {
        const serverId = (w as any).wakeup_alarm_id;
        const dayFromApi = typeof (w as any).day === 'number' ? (w as any).day : new Date(w.wakeup_time).getDay();
        const dayId = ((dayFromApi % 7) + 7) % 7; // 안전한 0~6

        const item = transformWakeupSummaryToAlarmItem(w);
        return {
          ...item,
          id: dayId,                            // 화면용 id = 요일(0~6)
          serverId: (w as any).wakeup_alarm_id, // 서버ID 따로 보관(삭제/수정용)
        };
      });

      setMyAlarms(mappedMy);
      setWakeupAlarms(mappedWake);
      setAutoAlarms(autoList);
      setAutoAlarmOn(autoList.length > 0 ? !!autoList[0].is_active : false);
      console.log('알람 동기화 완료:', mappedMy.length, mappedWake.length);
    } catch (e) {
      console.error('알람 동기화 실패:', e);
    }
  };

  // 앱 시작 시 한 번 자동 동기화
  // useEffect(() => {
  //   refreshAlarms();
  // }, []);


  // 아래 서버 id로 바꾸기?
  const updateAlarmField = <K extends keyof AlarmItem>(alarmId: number, field: K, value: AlarmItem[K]) => {
    setMyAlarms((prev) => prev.map((a) => (a.id === alarmId ? { ...a, [field]: value } : a)));
  };

  const updateWakeupAlarmField = <K extends keyof AlarmItem>(
    alarmId: number,
    field: K,
    value: AlarmItem[K]
  ) => {
    setWakeupAlarms(prev =>
      prev.map(a => (a.serverId === alarmId ? { ...a, [field]: value } : a))
    );
  };

  const toggleAlarmActivation = async (alarmId: number) => {
    try {
      await toggleMyAlarmActivation(alarmId);
      setMyAlarms((prev) => prev.map((a) => (a.id === alarmId ? { ...a, isActive: !a.isActive } : a)));
      // 서버 상태와 불일치 우려가 있으면 다음 줄을 사용:
      // await refreshAlarms();
      console.log(`알람 ${alarmId}의 상태를 토글했습니다.`);
    } catch (error) {
      console.error(`알람 ${alarmId} 토글 실패:`, error);
    }
  };

  // 자동알람 토글
  const toggleAutoAlarmActiveById = async (autoAlarmId: number) => {
    setAutoAlarms(prev =>
      prev.map(a =>
        a.auto_alarm_id === autoAlarmId ? { ...a, is_active: !a.is_active } : a
      )
    );

    try {
      const updated = await toggleAutoAlarmActivation(autoAlarmId); // API 호출
      // 서버가 내려준 최신 is_active로 동기화(신뢰도 ↑)
      setAutoAlarms(prev =>
        prev.map(a =>
          a.auto_alarm_id === autoAlarmId ? { ...a, is_active: updated.is_active, wakeup_time: updated.wakeup_time } : a
        )
      );
      // 상단 메인 토글(스위치) 기본값도 맞춰줌 (가장 가까운 알람 기준이면 MyAlarmPage에서 메모로 처리)
      setAutoAlarmOn(updated.is_active);
    } catch (e) {
      console.error('자동알람 토글 실패:', e);
      // 실패 시 롤백
      setAutoAlarms(prev =>
        prev.map(a =>
          a.auto_alarm_id === autoAlarmId ? { ...a, is_active: !a.is_active } : a
        )
      );
      throw e;
    }
  };

  const deleteAlarmById = async (alarmId: number) => {
    try {
      const target = myAlarms.find(a => a.id === alarmId);
      const remoteId = target?.serverId ?? target?.id; // 우선 서버 ID 사용
      if (!remoteId) throw new Error('서버 ID 없음');

      await deleteMyAlarm(remoteId);                   // 서버와 동기화
      setMyAlarms(prev => prev.filter(a => a.id !== alarmId));
      console.log(`알람 ${alarmId} 삭제 완료 (서버ID: ${remoteId})`);
    } catch (error) {
      console.error(`알람 ${alarmId} 삭제 실패:`, error);
    }
  };

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
        updateWakeupAlarmField,
        toggleAlarmActivation,
        deleteAlarmById,
        isLoadingAlarms,
        refreshAlarms,
        autoAlarms,
        setAutoAlarms,
        toggleAutoAlarmActiveById,
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
