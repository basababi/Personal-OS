import type { CSSProperties } from 'react';
import { Area } from './types';

export const FONT = "'Golos Text', system-ui, sans-serif";
export const MONO = "'JetBrains Mono', Consolas, monospace";

export const AREAS: Area[] = ['MLOps', 'English', 'Сургууль', 'Ажил', 'Хувийн'];
export const ACOL: Record<Area, string> = {
  MLOps: '#7F77DD',
  English: '#1D9E75',
  'Сургууль': '#5B7FD6',
  'Ажил': '#B8791F',
  'Хувийн': '#8B8798'
};
export const PRIS = ['Бага', 'Дунд', 'Өндөр'];
export const PCOL = ['#8B8798', '#B8791F', '#C4554D'];
export const RED = '#C4554D';

export const WORDST = ['Шинэ', 'Сурч буй', 'Эзэмшсэн'];
export const WCOL = ['#7F77DD', '#B8791F', '#1D9E75'];
export const PROJST = ['Төлөвлөлт', 'Бүтээж буй', 'Deployed'];
export const PHASES = ['Суурь', 'Cloud', 'ML инженерчлэл', 'MLOps интеграц'];
export const ST_DOT = ['#C4554D', '#B8791F', '#1D9E75'];

export interface Palette {
  dark: boolean;
  bg: string; panel: string; panel2: string; line: string;
  tx: string; tx2: string;
  a1: string; a2: string; a3: string;
  cell: string; // хоосон чекбокс/grid нүд
}

export function palette(dark: boolean): Palette {
  return dark
    ? { dark, bg: '#0F0F1A', panel: '#171726', panel2: '#1E1E32', line: 'rgba(190,180,255,.11)', tx: '#E9E6F7', tx2: '#7A7A9A', a1: '#968DEC', a2: '#2CBA8D', a3: '#D99A3D', cell: '#252540' }
    : { dark, bg: '#F2EFE8', panel: '#FFFEFA', panel2: '#F6F3EB', line: 'rgba(35,30,60,.09)', tx: '#232130', tx2: '#8B8798', a1: '#7F77DD', a2: '#1D9E75', a3: '#B8791F', cell: '#ECE8DD' };
}

export function cssVars(p: Palette): CSSProperties {
  return {
    '--bg': p.bg, '--panel': p.panel, '--panel2': p.panel2, '--line': p.line,
    '--tx': p.tx, '--tx2': p.tx2, '--acc1': p.a1, '--acc2': p.a2, '--acc3': p.a3,
    '--cell': p.cell, colorScheme: p.dark ? 'dark' : 'light'
  } as CSSProperties;
}

// ── Түгээмэл style-ууд ──
export const card: CSSProperties = {
  minWidth: 0,
  background: 'var(--panel)',
  border: '1px solid var(--line)',
  borderRadius: 16,
  padding: 20,
  boxShadow: '0 1px 2px rgba(20,15,40,.04)'
};

export const label = (color: string): CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 7,
  font: `600 10px ${MONO}`, letterSpacing: '.14em', textTransform: 'uppercase',
  color: 'var(--tx2)'
});

export const labelDot = (color: string): CSSProperties => ({
  width: 6, height: 6, borderRadius: 2, background: color
});

export const monoSm: CSSProperties = { font: `600 11px ${MONO}`, color: 'var(--tx2)' };

export const inputSt: CSSProperties = {
  padding: '10px 12px', borderRadius: 11, border: '1px solid var(--line)',
  background: 'var(--panel2)', color: 'var(--tx)', font: `500 12.5px ${FONT}`
};

export const checkbox = (on: boolean, color: string, dark: boolean, size = 19, radius = 6): CSSProperties => ({
  width: size, height: size, flex: 'none', borderRadius: radius,
  border: on ? 'none' : '1.5px solid ' + (dark ? 'rgba(190,180,255,.3)' : 'rgba(35,30,60,.25)'),
  background: on ? color : 'transparent',
  color: '#fff', font: `700 ${Math.round(size * 0.63)}px sans-serif`,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, cursor: 'pointer'
});

export const chip = (color: string): CSSProperties => ({
  flex: 'none', font: `600 9.5px ${MONO}`, padding: '3px 8px',
  borderRadius: 99, background: color + '1f', color
});

export const pillBtn = (color: string): CSSProperties => ({
  flex: 'none', font: `700 10.5px ${MONO}`, padding: '6px 12px',
  borderRadius: 99, border: 'none', background: color + '22', color, cursor: 'pointer'
});

export const primaryBtn = (color: string): CSSProperties => ({
  flex: 'none', padding: '10px 16px', borderRadius: 11, border: 'none',
  background: color, color: '#fff', font: `700 12.5px ${FONT}`, cursor: 'pointer'
});
