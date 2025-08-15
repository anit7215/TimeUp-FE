// utils/recurrenceSummary.ts (snake_case)

type MonthlyOption = null | 'day_of_month' | 'nth_weekday';

const WEEK_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const NTH_LABELS = ['', '첫째', '둘째', '셋째', '넷째', '다섯째'] as const;

const joinWithMiddleDot = (arr: string[]) => arr.join('·');

const fmtYMDdot = (ymd: string) => {
  // 'YYYY-MM-DD' → 'YY.MM.DD'
  const y = ymd.slice(2, 4);
  const m = ymd.slice(5, 7);
  const d = ymd.slice(8, 10);
  return `${y}.${m}.${d}`;
};

interface RecurrenceRuleSnake {
  repeat_type: 'weekly' | 'monthly' | null;
  repeat_week_days?: number[];          // 0~6
  monthly_option?: MonthlyOption;       // 'day_of_month' | 'nth_weekday'
  day_of_month?: number | null;         // 1~31
  nth_week?: number | null;             // 1~5
  weekday: number[];                    // nth_weekday일 때 길이 1 권장
  repeat_mode?: 'count' | 'until' | string | null;
  repeat_count?: number | null;
  repeat_until_date?: string | null;    // 'YYYY-MM-DD' 권장
}

interface DraftLikeSnake {
  start_date: string;                   // ISO 또는 'YYYY-MM-DD'
  is_recurring: boolean;
  recurrence_rule?: RecurrenceRuleSnake;
}

export function buildRecurrenceSummary(draft: DraftLikeSnake) {
  const rule = draft.recurrence_rule;
  if (!draft.is_recurring || !rule || !rule.repeat_type) {
    return {
      freqText: '반복 없음',
      untilText: '',
      fullText: '반복 없음',
    };
  }

  // 1) 안전 기본값
  const repeat_type = rule.repeat_type;
  const repeat_mode: 'count' | 'until' =
    rule.repeat_mode === 'until' ? 'until' : 'count';

  // 2) start_date 기반 보조값
  const start = new Date(draft.start_date);
  const startWeekday = Number.isFinite(start.getTime()) ? start.getDay() : 0;
  const fallbackWeekdays =
    rule.repeat_week_days && rule.repeat_week_days.length
      ? rule.repeat_week_days
      : [startWeekday];

  // 3) 빈 텍스트 준비
  let freqText = '';

  if (repeat_type === 'weekly') {
    // 매주 월·수·금
    const labels = (rule.repeat_week_days ?? fallbackWeekdays)
      .map((n) => WEEK_LABELS[n])
      .filter(Boolean);
    const labelText = labels.length ? joinWithMiddleDot(labels) : WEEK_LABELS[startWeekday];
    freqText = `매주 ${labelText}요일마다`;
  }

  if (repeat_type === 'monthly') {
    const opt = (rule.monthly_option ?? null) as MonthlyOption;

    if (opt === 'day_of_month') {
      const dom = rule.day_of_month ?? start.getDate();
      freqText = `매달 ${dom}일마다`;
    } else if (opt === 'nth_weekday') {
      const nth = rule.nth_week ?? Math.floor((start.getDate() - 1) / 7) + 1;
      const w = (rule.weekday?.[0] ?? startWeekday) as number;
      const nthLabel = NTH_LABELS[nth] || `${nth}번째`;
      const wLabel = WEEK_LABELS[w];
      freqText = `매달 ${nthLabel} ${wLabel}요일마다`;
    } else {
      const dom = start.getDate();
      freqText = `매달 ${dom}일마다`;
    }
  }

  // 4) 종료/횟수 요약
  let untilText = '';
  if (repeat_mode === 'until') {
    if (rule.repeat_until_date) {
      untilText = `${fmtYMDdot(rule.repeat_until_date)}까지`;
    } else {
      untilText = '종료일 미지정';
    }
  } else {
    const cnt = Number(rule.repeat_count ?? 0);
    untilText = Number.isFinite(cnt) && cnt > 0 ? `${cnt}회 반복` : '';
  }

  // 줄바꿈 형식(요청대로)
  const fullText = untilText ? `${freqText} \n ${untilText}` : freqText;

  return { freqText, untilText, fullText };
}
