// utils/colors.ts
export const COLOR_NAME_TO_HEX = {
    red:    '#F7A1A1',
    orange: '#FACA9E',
    yellow: '#FAE39E',
    green:  '#B9DFBB',
    blue:   '#A5C6F3',
    purple: '#B6A3F5',
    pink:   '#F8A0DA',
    gray:   '#CCCCCC',
  } as const;
  
  export type ServerColor = keyof typeof COLOR_NAME_TO_HEX;
  const DEFAULT_HEX = COLOR_NAME_TO_HEX.gray;
  
  const HEX_RE = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i;
  
  // 서버에서 온 color(이름/hex 섞여 와도 ok) → 우리 팔레트 hex
  export function toHex(input?: string): string {
    if (!input) return DEFAULT_HEX;
    const raw = input.trim();
    if (HEX_RE.test(raw)) return raw.toUpperCase(); // 이미 hex면 그대로 사용
    const key = raw.toLowerCase();
    // gray/grey 등 대응
    const alias: Record<string, ServerColor> = { grey: 'gray', violet: 'purple', magenta: 'pink' };
    const norm = (alias[key] ?? key) as ServerColor;
    return COLOR_NAME_TO_HEX[norm] ?? DEFAULT_HEX;
  }
  
  // (선택) 우리 hex → 서버 이름으로 보내야 할 때
  export function toServerName(hex?: string): ServerColor {
    if (!hex) return 'gray';
    const normalized = hex.toUpperCase();
    const entry = Object.entries(COLOR_NAME_TO_HEX).find(([, v]) => v.toUpperCase() === normalized);
    return (entry?.[0] as ServerColor) ?? 'gray';
  }
  
  // (선택) 팔레트 목록이 필요하면 여기서 파생
  export const colorOptions = Object.values(COLOR_NAME_TO_HEX);
  