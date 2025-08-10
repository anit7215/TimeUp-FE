// utils/recurrenceSummary.ts
type MonthlyOption = null | 'day_of_month' | 'nth_weekday';

const WEEK_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const NTH_LABELS = ['', '첫째', '둘째', '셋째', '넷째', '다섯째'] as const;

const joinWithMiddleDot = (arr: string[]) => arr.join('·');

const fmtYMDdot = (ymd: string) => {
  // 'YYYY-MM-DD' → 'YY.MM.DD'
  // ISO 전체가 와도 slice로 안전 처리
  const y = ymd.slice(2, 4);
  const m = ymd.slice(5, 7);
  const d = ymd.slice(8, 10);
  return `${y}.${m}.${d}`;
};

interface RecurrenceRule {
  repeatType: 'weekly' | 'monthly' | null;
  repeatWeekDays?: number[];               // 0(일)~6(토)
  monthlyOption?: MonthlyOption;           // 'day_of_month' | 'nth_weekday'
  dayOfMonth?: number | null;             // 1~31
  nthWeek?: number | null;                // 1~5
  weekday: number[];                      // nth_weekday일 때 길이 1 권장
  repeatMode?: 'count' | 'until' | string;
  repeatCount?: string;                   // 서버 스펙이 string이면 string 유지
  repeatUntilDate?: string | null;        // 'YYYY-MM-DD' 권장
}

interface DraftLike {
  start_date: string;                     // 사용자가 고른 시작일 (ISO 또는 YYYY-MM-DD)
  is_recurring: boolean;
  recurrenceRule?: RecurrenceRule;
}

export function buildRecurrenceSummary(draft: DraftLike) {
  const rule = draft.recurrenceRule;
  if (!draft.is_recurring || !rule || !rule.repeatType) {
    return {
      freqText: '반복 없음',
      untilText: '',
      fullText: '반복 없음',
    };
  }

  // 1) 빈 값 대비 안전 기본값
  const repeatType = rule.repeatType;
  const repeatMode = (rule.repeatMode === 'until' ? 'until' : 'count') as 'until' | 'count';

  // 2) 빈 선택 시 start_date를 기본으로 보조
  const start = new Date(draft.start_date);
  const startWeekday = Number.isFinite(start.getTime()) ? start.getDay() : 0;
  const fallbackWeekdays = (rule.repeatWeekDays && rule.repeatWeekDays.length)
    ? rule.repeatWeekDays
    : [startWeekday];

  // 3) 빈 텍스트 준비
  let freqText = '';

  if (repeatType === 'weekly') {
    // 매주 월·수·금
    const labels = (rule.repeatWeekDays ?? fallbackWeekdays)
      .map((n) => WEEK_LABELS[n])
      .filter(Boolean);
    const labelText = labels.length ? joinWithMiddleDot(labels) : WEEK_LABELS[startWeekday];
    freqText = `매주 ${labelText}요일마다`;
  }

  if (repeatType === 'monthly') {
    const opt = (rule.monthlyOption ?? null) as MonthlyOption;

    if (opt === 'day_of_month') {
      // 매달 21일
      const dom = rule.dayOfMonth ?? start.getDate();
      freqText = `매달 ${dom}일마다`;
    } else if (opt === 'nth_weekday') {
      // 매달 셋째 토요일
      const nth = rule.nthWeek ?? Math.floor((start.getDate() - 1) / 7) + 1;
      const w = (rule.weekday?.[0] ?? startWeekday) as number;
      const nthLabel = NTH_LABELS[nth] || `${nth}번째`;
      const wLabel = WEEK_LABELS[w];
      freqText = `매달 ${nthLabel} ${wLabel}요일마다`;
    } else {
      // 옵션 미선택 시 일단 시작일 기준
      const dom = start.getDate();
      freqText = `매달 ${dom}일마다`;
    }
  }

  // 4) 종료/횟수 요약
  let untilText = '';
  if (repeatMode === 'until') {
    if (rule.repeatUntilDate) {
      untilText = `${fmtYMDdot(rule.repeatUntilDate)}까지`;
    } else {
      untilText = '종료일 미지정';
    }
  } else {
    const cnt = Number(rule.repeatCount);
    untilText = Number.isFinite(cnt) && cnt > 0 ? `${cnt}회 반복` : '';
  }

  const fullText = untilText ? `${freqText} \n ${untilText}` : freqText;

  return { freqText, untilText, fullText };
}
