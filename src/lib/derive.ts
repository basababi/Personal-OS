import { AppData } from '../types';
import { td, todayIdx, toMin } from './dates';

export function engToday(d: AppData): number {
  return d.engLog.date === td(0) ? Object.values(d.engLog.mins).reduce((a, b) => a + b, 0) : 0;
}
export function mlToday(d: AppData): number {
  return d.mlLog.date === td(0) ? d.mlLog.mins : 0;
}

export function taskStats(d: AppData) {
  const TD = td(0);
  const todays = d.tasks.filter(t => t.date === TD);
  return { todays, done: todays.filter(t => t.done).length, total: todays.length };
}

export function overdueTasks(d: AppData) {
  const TD = td(0);
  return d.tasks.filter(t => !t.done && t.date < TD);
}

export function habitStats(d: AppData) {
  const HB = d.habits;
  const H = HB.length || 1;
  const ti = todayIdx();
  const habitToday = HB.filter(hb => d.habit.grid[hb.id + '-' + ti]).length;
  const checkedAll = Object.keys(d.habit.grid).filter(k => d.habit.grid[k] && HB.some(hb => k.indexOf(hb.id + '-') === 0)).length;
  const weekScore = Math.round(checkedAll / ((ti + 1) * H) * 100) || 0;
  let streak = 0;
  for (let di = ti; di >= 0; di--) {
    const n = HB.filter(hb => d.habit.grid[hb.id + '-' + di]).length;
    if (n >= Math.min(3, H)) streak++;
    else if (di !== ti) break;
  }
  return { H, habitToday, weekScore, streak, todayIdx: ti };
}

export function dayScore(d: AppData): number {
  const { H, habitToday } = habitStats(d);
  const { done, total } = taskStats(d);
  return Math.round((habitToday / H) * 60 + (total ? done / total : 0) * 40);
}

export function blockNow(d: AppData, now: Date): string {
  const mins = now.getHours() * 60 + now.getMinutes();
  let cur = 'Чөлөөт цаг';
  d.blocks.forEach(b => { if (mins >= toMin(b.s) && mins < toMin(b.e)) cur = b.t; });
  return cur;
}

/** Сүүлийн n өдрийн бодит судалгааны минут (өнөөдрийг амьд утгаар) */
export function lastDays(d: AppData, n: number): { date: string; eng: number; ml: number }[] {
  const out: { date: string; eng: number; ml: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = td(-i);
    if (i === 0) out.push({ date, eng: engToday(d), ml: mlToday(d) });
    else {
      const h = d.history[date];
      out.push({ date, eng: h?.eng || 0, ml: h?.ml || 0 });
    }
  }
  return out;
}

export function weekMinutes(d: AppData) {
  const days = lastDays(d, 7);
  const eng = days.reduce((a, b) => a + b.eng, 0);
  const ml = days.reduce((a, b) => a + b.ml, 0);
  return { eng, ml, totalH: Math.round((eng + ml) / 60 * 10) / 10 };
}

export function roadStats(d: AppData) {
  const done = d.road.filter(r => r.st === 2).length;
  const prog = d.road.filter(r => r.st === 1).length;
  const pct = d.road.length ? Math.round(done / d.road.length * 100) : 0;
  return { done, prog, pct, total: d.road.length };
}

export function wordsToday(d: AppData): number {
  return d.words.filter(w => w.date === td(0)).length;
}

export function engLevel(d: AppData): { idx: number; name: string; pct: number } {
  const g = d.goals.find(g => g.area === 'English');
  const pct = g ? g.pct : 0;
  const idx = pct < 25 ? 0 : pct < 50 ? 1 : pct < 75 ? 2 : 3;
  return { idx, name: ['A1', 'A2', 'B1', 'B2'][idx], pct };
}
