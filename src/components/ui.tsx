import React, { CSSProperties } from 'react';
import { card, MONO, FONT } from '../theme';

export function Card({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return <div style={{ ...card, ...style }}>{children}</div>;
}

/** Картын гарчиг: өнгөт цэг + UPPERCASE mono label, баруун талд утга */
export function SecLabel({ color, children, right, mb = 12 }: {
  color: string; children: React.ReactNode; right?: React.ReactNode; mb?: number;
}) {
  const lbl = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, font: `600 10px ${MONO}`, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--tx2)' }}>
      <span style={{ width: 6, height: 6, borderRadius: 2, background: color }} />
      {children}
    </span>
  );
  if (right === undefined) return <div style={{ marginBottom: mb }}>{lbl}</div>;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: mb, gap: 10 }}>
      {lbl}
      <span style={{ font: `600 11px ${MONO}`, color: 'var(--tx2)', flex: 'none' }}>{right}</span>
    </div>
  );
}

export function Bar({ pct, color, h = 5, bg }: { pct: number; color: string; h?: number; bg?: string }) {
  return (
    <div style={{ height: h, borderRadius: h / 2 + 1, background: bg || 'var(--panel2)', overflow: 'hidden' }}>
      <div style={{ width: Math.max(0, Math.min(100, pct)) + '%', height: '100%', borderRadius: h / 2 + 1, background: color, transition: 'width .4s' }} />
    </div>
  );
}

/** Хуудасны H2 гарчиг + дэд текст */
export function PageHead({ title, sub }: { title: string; sub: string }) {
  return (
    <>
      <h2 style={{ margin: '0 0 4px', font: `800 24px ${FONT}`, letterSpacing: '-.02em' }}>{title}</h2>
      <p style={{ margin: '0 0 18px', font: `400 13px ${FONT}`, color: 'var(--tx2)' }}>{sub}</p>
    </>
  );
}

/** Зөв fade-up анимацтай дэлгэцийн боодол */
export function Screen({ children, gap }: { children: React.ReactNode; gap?: number }) {
  return (
    <section style={{ animation: 'osFade .4s ease', ...(gap !== undefined ? { display: 'flex', flexDirection: 'column' as const, gap } : {}) }}>
      {children}
    </section>
  );
}
