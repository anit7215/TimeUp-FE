// time.ts (또는 이 파일 상단에)
import moment from 'moment';

export const HOTFIX_BACKEND_EDIT_KST_BUG = true; // 백엔드 수정되면 false로 바꾸거나 함수 삭제

export const minus9HIfHotfix = (s?: string | null) => {
  if (!s) return null;
  if (!HOTFIX_BACKEND_EDIT_KST_BUG) {
    // 정상 경로: 그냥 UTC로
    return moment.parseZone(s).utc().toISOString();
  }
  // 워크어라운드: 백엔드가 +9h로 저장하는 버그를 상쇄하기 위해 선제 -9h
  // KST( +09:00 ) 로 보관된 문자열 기준으로 9시간 빼고 UTC ISO로 보냄
  return moment.parseZone(s).subtract(9, 'hours').utc().toISOString();
};
