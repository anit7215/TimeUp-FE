import { create } from 'zustand';

export type JobType =
  | '직장인'
  | '공무원/군인'
  | '자영업자'
  | '프리랜서'
  | '학생'
  | '무직'
  | '기타';

export type TransportType = 'bus' | 'subway' | 'car' | 'walk';

interface ProfileState {
  birthYear: string | null;
  job: JobType | null;
  transport: TransportType[];
  readyTime: { hour: string; minute: string } | null;
  commuteTime: { hour: string; minute: string } | null;
  selectedTimes: Record<string, { period: string; hour: string; minute: string }>;
  homeAddress: string | null;
  workAddress: string | null;
  setField: <K extends keyof ProfileState>(field: K, value: ProfileState[K]) => void;
  toggleTransport: (value: TransportType) => void;
  profileImage:string|null;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  birthYear: null,
  job: null,
  transport: [],
  readyTime: null,
  commuteTime: null,
  selectedTimes: {},
  homeAddress: null,
  workAddress: null,
  setField: (field, value) => set({ [field]: value }),
  toggleTransport: (value) => {
    const transport = get().transport;
    set({
      transport: transport.includes(value)
        ? transport.filter((v) => v !== value)
        : [...transport, value],
    });
  },
  profileImage:null,
}));
