import { AddressItem } from '@/src/types/address';

export const onboardingPayload = ({
  birthYear,
  job,
  transport,
  readyTime, commuteTime,
  selectedTimes, 
  homeAddress, workAddress,
}: {
  birthYear: string;
  job: string;
  transport: string[];
  readyTime: { hour: string; minute: string };
  commuteTime: { hour: string; minute: string } | null;
  selectedTimes: Record<string, { hour: string; minute: string; period: string }>;
  homeAddress: AddressItem | null;
  workAddress: AddressItem | null;
}) => {
  
  const jobMap: Record<string, string> = {
    office: "worker",
    gov: "public_officer",
    self: "self_employed",
    freelancer: "freelancer",
    student: "student",
    unemployed: "unemployed",
    etc: "other",
  };
  const dayMap: Record<string, string> = {
    월요일: 'mon',
    화요일: 'tue',
    수요일: 'wed',
    목요일: 'thu',
    금요일: 'fri',
    토요일: 'sat',
    일요일: 'sun',
  };

  const wakeup_time = Object.fromEntries(
    Object.entries(selectedTimes).map(([day, time]) => {
      const dayEng = dayMap[day] ?? day; 
      return [dayEng, `${time.hour.padStart(2, '0')}:${time.minute.padStart(2, '0')}:00`];
    })
  );

  const preferences = transport.map((type, index) => ({
    priority: index + 1,
    transportType: type,
    }));

  return {
    birth: Number(birthYear),
    job: jobMap[job] || "other",
    preferences,
    avg_ready_time: Number(readyTime.hour) * 60 + Number(readyTime.minute),
    duration_time: commuteTime ? Number(commuteTime.hour) * 60 + Number(commuteTime.minute): 0,
    home_address: homeAddress?.address || null,
    work_address: workAddress?.address || null,
    wakeup_time,
  };
};
