import { create } from 'zustand';

export type JobType =
  | 'worker'
  | 'public_worker'
  | 'self_employed'
  | 'freelancer'
  | 'student'
  | 'unemployed'
  | 'other';

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
  reset: () => void;
}

const initialState: Omit<ProfileState, 'setField' | 'toggleTransport' | 'reset'> = {
  birthYear: null,
  job: null,
  transport: [],
  readyTime: null,
  commuteTime: null,
  selectedTimes: {
    월요일: { period: '오전', hour: '08', minute: '00' },
    화요일: { period: '오전', hour: '08', minute: '00' },
    수요일: { period: '오전', hour: '08', minute: '00' },
    목요일: { period: '오전', hour: '08', minute: '00' },
    금요일: { period: '오전', hour: '08', minute: '00' },
    토요일: { period: '오전', hour: '08', minute: '00' },
    일요일: { period: '오전', hour: '08', minute: '00' },
  },
  homeAddress: null,
  workAddress: null,
  profileImage: null,
};

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
  reset: () => set(initialState),
}));
