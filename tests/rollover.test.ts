import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rollover } from '../src/lib/rollover';
import { defaults } from '../src/data/defaults';
import { td } from '../src/lib/dates';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 6, 7, 21, 0, 0)); // Мягмар
});
afterEach(() => vi.useRealTimers());

describe('өдрийн rollover', () => {
  it('өчигдрийн судалгааны минутыг түүхэнд хадгалж, өнөөдрийг цэвэрлэнэ', () => {
    const d = defaults(); // 2026-07-07-нд үүссэн
    d.engLog.mins['Сонсох'] = 30;
    d.engLog.mins['Үгийн сан'] = 15;
    d.mlLog.mins = 60;
    d.routine.items = d.routineSteps.map(() => true);

    vi.setSystemTime(new Date(2026, 6, 8, 7, 0, 0)); // маргааш өглөө
    expect(rollover(d)).toBe(true);

    expect(d.history['2026-07-07']).toEqual({ eng: 45, ml: 60 });
    expect(d.engLog.date).toBe('2026-07-08');
    expect(Object.values(d.engLog.mins).every(v => v === 0)).toBe(true);
    expect(d.mlLog).toEqual({ date: '2026-07-08', mins: 0 });
    expect(d.routine.date).toBe('2026-07-08');
    expect(d.routine.items.every(v => v === false)).toBe(true);
    expect(d.routine.items.length).toBe(d.routineSteps.length);
  });

  it('0 минуттай өдрийг түүхэнд бичихгүй', () => {
    const d = defaults();
    vi.setSystemTime(new Date(2026, 6, 8, 7, 0, 0));
    rollover(d);
    expect(d.history['2026-07-07']).toBeUndefined();
  });

  it('өдөр солигдоогүй бол false буцааж юу ч өөрчлөхгүй', () => {
    const d = defaults();
    const before = JSON.stringify(d);
    expect(rollover(d)).toBe(false);
    expect(JSON.stringify(d)).toBe(before);
  });
});

describe('долоо хоногийн rollover', () => {
  it('шинэ Даваа гарагт grid-ийг хоослож оноог түүхэнд нэмнэ', () => {
    const d = defaults(); // week = 2026-07-06
    // 7 дадал × 7 хоног = 49 нүднээс 10-ыг чеклэв → round(10/49*100) = 20
    ['1-0', '2-0', '3-0', '1-1', '2-1', '4-1', '7-1', '1-2', '3-2', '5-2'].forEach(k => { d.habit.grid[k] = true; });

    vi.setSystemTime(new Date(2026, 6, 13, 8, 0, 0)); // дараагийн Даваа
    expect(rollover(d)).toBe(true);

    expect(d.habit.week).toBe('2026-07-13');
    expect(d.habit.grid).toEqual({});
    expect(d.habit.history).toEqual([20]);
  });

  it('түүх сүүлийн 8 долоо хоногоор хязгаарлагдана', () => {
    const d = defaults();
    d.habit.history = [10, 20, 30, 40, 50, 60, 70, 80];
    vi.setSystemTime(new Date(2026, 6, 13, 8, 0, 0));
    rollover(d);
    expect(d.habit.history.length).toBe(8);
    expect(d.habit.history[0]).toBe(20); // хамгийн хуучин нь хасагдсан
  });
});

describe('түүхийн цэвэрлэгээ', () => {
  it('90 хоногоос хуучин бичлэгүүдийг устгана', () => {
    const d = defaults();
    for (let i = 1; i <= 95; i++) d.history[td(-i)] = { eng: 10, ml: 10 };
    rollover(d);
    expect(Object.keys(d.history).length).toBe(90);
    expect(d.history[td(-95)]).toBeUndefined();
    expect(d.history[td(-1)]).toBeDefined();
  });
});
