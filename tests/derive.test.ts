import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { defaults } from '../src/data/defaults';
import { habitStats, dayScore, taskStats, overdueTasks, lastDays, weekMinutes, engLevel, blockNow, wordsToday, roadStats } from '../src/lib/derive';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 6, 8, 10, 0, 0)); // Лхагва (todayIdx = 2)
});
afterEach(() => vi.useRealTimers());

describe('habitStats', () => {
  it('weekScore, habitToday, streak-ийг зөв тооцно', () => {
    const d = defaults();
    // Да: 3 дадал, Мя: 4, Лх(өнөөдөр): 3 → streak босго = min(3, 7) = 3
    ['1-0', '2-0', '3-0', '1-1', '2-1', '3-1', '4-1', '1-2', '2-2', '3-2'].forEach(k => { d.habit.grid[k] = true; });
    const s = habitStats(d);
    expect(s.H).toBe(7);
    expect(s.todayIdx).toBe(2);
    expect(s.habitToday).toBe(3);
    expect(s.weekScore).toBe(Math.round((10 / 21) * 100)); // 10 чек / (3 өдөр × 7 дадал)
    expect(s.streak).toBe(3);
  });

  it('завсарласан өдөр streak-ийг таслана', () => {
    const d = defaults();
    // Да: 3, Мя: 0, Лх: 3 → зөвхөн өнөөдөр = 1
    ['1-0', '2-0', '3-0', '1-2', '2-2', '3-2'].forEach(k => { d.habit.grid[k] = true; });
    expect(habitStats(d).streak).toBe(1);
  });

  it('өнөөдөр хийгээгүй ч өмнөх өдрүүдийн streak хадгалагдана', () => {
    const d = defaults();
    // Да: 3, Мя: 3, Лх(өнөөдөр): 0 → streak 2 (өнөөдөр таслахгүй)
    ['1-0', '2-0', '3-0', '1-1', '2-1', '3-1'].forEach(k => { d.habit.grid[k] = true; });
    expect(habitStats(d).streak).toBe(2);
  });
});

describe('dayScore', () => {
  it('хэвшил 60% + даалгавар 40% жинтэй', () => {
    const d = defaults(); // 3 даалгавар өнөөдөр, 7 дадал
    ['1-2', '2-2', '3-2'].forEach(k => { d.habit.grid[k] = true; });
    d.tasks[0].done = true;
    // round(3/7*60 + 1/3*40) = round(25.71 + 13.33) = 39
    expect(dayScore(d)).toBe(39);
  });
  it('даалгаваргүй өдөр task хэсэг 0', () => {
    const d = defaults();
    d.tasks = [];
    ['1-2', '2-2', '3-2', '4-2', '5-2', '6-2', '7-2'].forEach(k => { d.habit.grid[k] = true; });
    expect(dayScore(d)).toBe(60);
  });
});

describe('taskStats / overdueTasks', () => {
  it('зөвхөн өнөөдрийн даалгаврыг тоолно', () => {
    const d = defaults();
    d.tasks.push({ id: 99, t: 'хуучин', area: 'MLOps', pri: 1, done: false, date: '2026-07-01' });
    const s = taskStats(d);
    expect(s.total).toBe(3);
    expect(overdueTasks(d).map(t => t.id)).toEqual([99]);
  });
  it('дууссан хуучин даалгавар хоцорсонд орохгүй', () => {
    const d = defaults();
    d.tasks.push({ id: 99, t: 'хуучин', area: 'MLOps', pri: 1, done: true, date: '2026-07-01' });
    expect(overdueTasks(d)).toEqual([]);
  });
});

describe('lastDays / weekMinutes', () => {
  it('түүх + өнөөдрийн амьд утгыг нэгтгэнэ', () => {
    const d = defaults();
    d.history['2026-07-07'] = { eng: 30, ml: 60 };
    d.engLog.mins['Унших'] = 15;
    d.mlLog.mins = 45;
    const days = lastDays(d, 3);
    expect(days).toEqual([
      { date: '2026-07-06', eng: 0, ml: 0 },
      { date: '2026-07-07', eng: 30, ml: 60 },
      { date: '2026-07-08', eng: 15, ml: 45 }
    ]);
    const wm = weekMinutes(d);
    expect(wm.eng).toBe(45);
    expect(wm.ml).toBe(105);
    expect(wm.totalH).toBe(2.5);
  });

  it('өнгөрсөн өдрийн engLog-ийг (rollover хийгдээгүй бол) амьд утгад тооцохгүй', () => {
    const d = defaults();
    d.engLog = { date: '2026-07-05', mins: { 'Сонсох': 90, 'Унших': 0, 'Дүрэм': 0, 'Үгийн сан': 0, 'Ярих': 0 } };
    expect(lastDays(d, 1)[0].eng).toBe(0);
  });
});

describe('engLevel', () => {
  it('English зорилгын % -аас түвшин гарна', () => {
    const d = defaults();
    const eng = d.goals.find(g => g.area === 'English')!;
    eng.pct = 10; expect(engLevel(d).name).toBe('A1');
    eng.pct = 25; expect(engLevel(d).name).toBe('A2');
    eng.pct = 50; expect(engLevel(d).name).toBe('B1');
    eng.pct = 75; expect(engLevel(d).name).toBe('B2');
  });
});

describe('blockNow', () => {
  it('идэвхтэй цагийн блокийг олно', () => {
    const d = defaults();
    expect(blockNow(d, new Date(2026, 6, 8, 10, 0))).toBe('Их сургууль / ажил');
    expect(blockNow(d, new Date(2026, 6, 8, 19, 30))).toBe('English study');
    expect(blockNow(d, new Date(2026, 6, 8, 6, 30))).toBe('Чөлөөт цаг');
  });
});

describe('wordsToday / roadStats', () => {
  it('өнөөдөр нэмсэн үгийг тоолно', () => {
    const d = defaults();
    d.words.push({ id: 1, en: 'pipeline', mn: 'дамжлага', ex: '', st: 0, date: '2026-07-08' });
    d.words.push({ id: 2, en: 'deploy', mn: 'байршуулах', ex: '', st: 0, date: '2026-07-07' });
    expect(wordsToday(d)).toBe(1);
  });
  it('roadmap статистик', () => {
    const d = defaults();
    d.road[0].st = 2;
    d.road[1].st = 2;
    d.road[2].st = 1;
    const s = roadStats(d);
    expect(s.done).toBe(2);
    expect(s.prog).toBe(1);
    expect(s.pct).toBe(Math.round((2 / 15) * 100));
  });
});
