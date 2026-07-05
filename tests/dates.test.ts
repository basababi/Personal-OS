import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { td, monday, todayIdx, toMin } from '../src/lib/dates';

// Бүх тест 2026-07-08 (Лхагва) 10:00 цаг дээр тогтмол ажиллана
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 6, 8, 10, 0, 0));
});
afterEach(() => vi.useRealTimers());

describe('td', () => {
  it('өнөөдрийг YYYY-MM-DD форматаар буцаана', () => {
    expect(td(0)).toBe('2026-07-08');
  });
  it('offset хоногийг зөв нэмж/хасна', () => {
    expect(td(-1)).toBe('2026-07-07');
    expect(td(1)).toBe('2026-07-09');
    expect(td(-8)).toBe('2026-06-30'); // сар дамнана
  });
});

describe('monday', () => {
  it('энэ долоо хоногийн Даваа гарагийг буцаана', () => {
    expect(monday()).toBe('2026-07-06');
  });
  it('Ням гарагт мөн өмнөх Даваа байна', () => {
    vi.setSystemTime(new Date(2026, 6, 12, 23, 0, 0)); // Ням
    expect(monday()).toBe('2026-07-06');
  });
  it('Даваа гарагт өөрийгөө буцаана', () => {
    vi.setSystemTime(new Date(2026, 6, 6, 0, 5, 0));
    expect(monday()).toBe('2026-07-06');
  });
});

describe('todayIdx', () => {
  it('Даваа=0 … Ням=6 индекс', () => {
    expect(todayIdx()).toBe(2); // Лхагва
    vi.setSystemTime(new Date(2026, 6, 12, 10, 0, 0)); // Ням
    expect(todayIdx()).toBe(6);
    vi.setSystemTime(new Date(2026, 6, 6, 10, 0, 0)); // Даваа
    expect(todayIdx()).toBe(0);
  });
});

describe('toMin', () => {
  it('HH:MM-ийг минут руу хөрвүүлнэ', () => {
    expect(toMin('07:00')).toBe(420);
    expect(toMin('23:59')).toBe(1439);
    expect(toMin('00:00')).toBe(0);
  });
});
