import { AppData } from '../types';
import { td, monday } from './dates';

/** Өдөр/долоо хоног солигдоход хийх шилжилт. true = өөрчлөлт орсон */
export function rollover(d: AppData): boolean {
  const TD = td(0);
  let ch = false;

  // Өчигдрийн судалгааны минутыг бодит түүхэнд хадгална
  if (d.engLog.date !== TD) {
    const sum = Object.values(d.engLog.mins).reduce((a, b) => a + b, 0);
    if (sum > 0) d.history[d.engLog.date] = { ...(d.history[d.engLog.date] || { eng: 0, ml: 0 }), eng: sum };
    d.engLog = { date: TD, mins: { 'Сонсох': 0, 'Унших': 0, 'Дүрэм': 0, 'Үгийн сан': 0, 'Ярих': 0 } };
    ch = true;
  }
  if (d.mlLog.date !== TD) {
    if (d.mlLog.mins > 0) d.history[d.mlLog.date] = { ...(d.history[d.mlLog.date] || { eng: 0, ml: 0 }), ml: d.mlLog.mins };
    d.mlLog = { date: TD, mins: 0 };
    ch = true;
  }
  if (d.routine.date !== TD) {
    d.routine = { date: TD, items: d.routineSteps.map(() => false) };
    ch = true;
  }
  const wk = monday();
  if (d.habit.week !== wk) {
    let n = 0;
    Object.values(d.habit.grid).forEach(v => { if (v) n++; });
    const H = d.habits.length || 7;
    d.habit.history = (d.habit.history || []).concat([Math.round((n / (H * 7)) * 100)]).slice(-8);
    d.habit = { week: wk, grid: {}, history: d.habit.history };
    ch = true;
  }
  // Түүхийг 90 хоногоор хязгаарлана
  const keys = Object.keys(d.history).sort();
  if (keys.length > 90) {
    keys.slice(0, keys.length - 90).forEach(k => delete d.history[k]);
    ch = true;
  }
  return ch;
}
