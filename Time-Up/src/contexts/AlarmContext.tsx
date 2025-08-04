// src/contexts/AlarmContext.tsx
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

  selectedAlarmId: number | null;
  setSelectedAlarmId: (id: number | null) => void;

  selectedAlarmDate: string;
  setSelectedAlarmDate: (date: string) => void;

  updateAlarmField: <K extends keyof AlarmItem>(
    alarmId: number,
    field: K,
    value: AlarmItem[K]
  ) => void;
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
        selectedAlarmId,
        setSelectedAlarmId,
        selectedAlarmDate,
        setSelectedAlarmDate,
        updateAlarmField,
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