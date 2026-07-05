import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { defaults, migrate } from '../src/data/defaults';
import { AppData } from '../src/types';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 6, 8, 10, 0, 0));
});
afterEach(() => vi.useRealTimers());

describe('migrate', () => {
  it('null → бүрэн дефолт', () => {
    const d = migrate(null);
    expect(d.v).toBe(2);
    expect(d.habits.length).toBe(7);
    expect(d.reminders.items.length).toBe(6);
    expect(d.blocks.length).toBe(9);
  });

  it('хуучин схем: id-гүй goal/word-д id олгоно', () => {
    const saved = {
      goals: [{ t: 'B2', area: 'English', target: '2027-03', pct: 35, ms: '' }],
      words: [{ en: 'deploy', mn: 'байршуулах', ex: '', st: 1, date: '2026-07-01' }]
    } as unknown as Partial<AppData>;
    const d = migrate(saved);
    expect(d.goals[0].id).toBe(1);
    expect(d.words[0].id).toBe(1);
    expect(d.goals[0].pct).toBe(35); // хэрэглэгчийн утга хадгалагдана
  });

  it('routine items тоо алхмуудтай зөрвөл тэгшитгэнэ', () => {
    const base = defaults();
    const saved: Partial<AppData> = {
      ...base,
      routineSteps: ['a', 'b', 'c'],
      routine: { date: '2026-07-08', items: [true] }
    };
    const d = migrate(saved);
    expect(d.routine.items).toEqual([true, false, false]);
  });

  it('дутуу шинэ талбаруудыг (mlLog, history, reminders, resources) нөхнө', () => {
    const saved = { theme: 'dark', userName: 'Басбиш' } as Partial<AppData>;
    const d = migrate(saved);
    expect(d.theme).toBe('dark');
    expect(d.mlLog.mins).toBe(0);
    expect(d.history).toEqual({});
    expect(d.reminders.enabled).toBe(true);
    expect(d.resources.length).toBe(4);
  });

  it('хэрэглэгч бүх нөөцөө устгасан бол хоосон хэвээр үлдээнэ', () => {
    const d = migrate({ resources: [] } as Partial<AppData>);
    expect(d.resources).toEqual([]);
  });

  it('хэрэглэгчийн сануулгууд дефолтоор дарагдахгүй', () => {
    const saved: Partial<AppData> = {
      reminders: { enabled: false, items: [{ id: 1, time: '06:00', title: 'X', body: '', days: [], enabled: true }] }
    };
    const d = migrate(saved);
    expect(d.reminders.enabled).toBe(false);
    expect(d.reminders.items.length).toBe(1);
    expect(d.reminders.items[0].time).toBe('06:00');
  });
});
