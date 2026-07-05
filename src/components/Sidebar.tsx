import React from 'react';
import { useStore } from '../data/store';
import { FONT, MONO } from '../theme';
import { taskStats, habitStats, dayScore, roadStats, wordsToday } from '../lib/derive';
import { IconBolt, IconHome, IconCal, IconCpu, IconGlobe, IconTarget, IconSliders, IconSun, IconMoon, IconFlame } from '../icons';
import { View } from '../types';

export function Sidebar() {
  const { d, commit, view, nav, p } = useStore();
  const ts = taskStats(d);
  const hs = habitStats(d);
  const rs = roadStats(d);
  const score = dayScore(d);
  const wt = wordsToday(d);

  const items: { id: View; icon: React.ReactNode; label: string; badge: string }[] = [
    { id: 'home', icon: <IconHome size={20} />, label: 'Хяналтын самбар', badge: '' },
    { id: 'planner', icon: <IconCal size={20} />, label: 'Өдрийн төлөвлөгч', badge: String(ts.total - ts.done || '') },
    { id: 'mlops', icon: <IconCpu size={20} />, label: 'MLOps төв', badge: String(rs.prog || '') },
    { id: 'english', icon: <IconGlobe size={20} />, label: 'English OS', badge: wt + '/5' },
    { id: 'goals', icon: <IconTarget size={20} />, label: 'Зорилго ба Хэвшил', badge: hs.weekScore + '%' },
    { id: 'settings', icon: <IconSliders size={20} />, label: 'Тохиргоо', badge: '' }
  ];

  return (
    <aside style={{ width: 232, flex: 'none', borderRight: '1px solid var(--line)', padding: '22px 14px', display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px' }}>
        <div style={{ width: 30, height: 30, flex: 'none', borderRadius: 9, background: 'var(--acc1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconBolt />
        </div>
        <div>
          <div style={{ font: `800 14px ${FONT}`, letterSpacing: '-.01em' }}>Personal OS</div>
          <div style={{ font: `500 9px ${MONO}`, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--tx2)' }}>Mission Control</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: 12, borderRadius: 14, background: 'var(--panel)', border: '1px solid var(--line)' }}>
        <div style={{ width: 36, height: 36, flex: 'none', borderRadius: 12, background: 'var(--acc1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 14px ${FONT}` }}>
          {(d.userName || 'Б').slice(0, 1)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ font: `700 13px ${FONT}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.userName}</div>
          <div style={{ font: `500 9px ${MONO}`, letterSpacing: '.08em', color: 'var(--tx2)', textTransform: 'uppercase' }}>MLOps · in progress</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {items.map(it => {
          const active = view === it.id;
          return (
            <button key={it.id} onClick={() => nav(it.id)} className={active ? undefined : 'hv-bg2'}
              style={{
                display: 'flex', alignItems: 'center', gap: 9, width: '100%', textAlign: 'left', padding: '10px 11px', borderRadius: 12,
                border: '1px solid ' + (active ? 'var(--line)' : 'transparent'),
                background: active ? 'var(--panel)' : 'transparent',
                color: 'inherit', font: `600 12.5px ${FONT}`,
                boxShadow: active ? '0 1px 2px rgba(20,15,40,.05)' : 'none'
              }}>
              <span style={{ display: 'inline-flex', width: 20, justifyContent: 'center', color: active ? 'var(--acc1)' : 'var(--tx2)' }}>{it.icon}</span>
              <span>{it.label}</span>
              <span style={{ marginLeft: 'auto', font: `600 10px ${MONO}`, color: 'var(--tx2)' }}>{it.badge}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ padding: 12, borderRadius: 14, background: 'var(--panel)', border: '1px solid var(--line)' }}>
          <div style={{ font: `600 9px ${MONO}`, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--tx2)', marginBottom: 6 }}>Өнөөдрийн оноо</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ font: `700 22px ${MONO}`, color: 'var(--acc1)' }}>{score}</span>
            <span style={{ font: `500 11px ${MONO}`, color: 'var(--tx2)' }}>/ 100</span>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 3, font: `700 11px ${MONO}`, color: 'var(--acc3)' }}>
              <IconFlame />{hs.streak}
            </span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'var(--panel2)', marginTop: 8, overflow: 'hidden' }}>
            <div style={{ width: score + '%', height: '100%', background: 'var(--acc1)', borderRadius: 2, transition: 'width .4s' }} />
          </div>
        </div>
        <button className="hv-bg2" onClick={() => { d.theme = p.dark ? 'light' : 'dark'; commit(); }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 10, borderRadius: 12, border: '1px solid var(--line)', background: 'var(--panel)', color: 'var(--tx)', font: `600 12px ${FONT}` }}>
          <span style={{ display: 'inline-flex', color: 'var(--tx2)' }}>{p.dark ? <IconSun /> : <IconMoon />}</span>
          {p.dark ? 'Гэрэлтэй горим' : 'Харанхуй горим'}
        </button>
        <div style={{ font: `500 9px ${MONO}`, letterSpacing: '.1em', color: 'var(--tx2)', textAlign: 'center', textTransform: 'uppercase' }}>Systems · not goals</div>
      </div>
    </aside>
  );
}
