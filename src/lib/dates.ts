export function td(off = 0): string {
  const d = new Date(Date.now() + off * 86400000);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/** Энэ долоо хоногийн Даваа гарагийн огноо */
export function monday(): string {
  const d = new Date();
  const dow = (d.getDay() + 6) % 7;
  return td(-dow);
}

/** Даваа=0 … Ням=6 */
export function todayIdx(): number {
  return (new Date().getDay() + 6) % 7;
}

export function toMin(s: string): number {
  return parseInt(s.slice(0, 2)) * 60 + parseInt(s.slice(3));
}

export const WDAYS = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'];
export const DAY_NAMES = ['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня'];
