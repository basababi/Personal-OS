import React, { useState } from 'react';
import { useStore } from '../data/store';
import { Card, SecLabel, PageHead, Screen, Bar } from '../components/ui';
import { habitCell } from '../components/bits';
import { FONT, MONO, AREAS, ACOL, inputSt, primaryBtn, chip } from '../theme';
import { DAY_NAMES } from '../lib/dates';
import { habitStats, lastDays, weekMinutes } from '../lib/derive';
import { IconX, IconFlame } from '../icons';
import { Area } from '../types';

const GRID_COLS = 'minmax(110px,1fr) repeat(7,minmax(28px,40px)) 46px';

export function Goals() {
  const { d, commit, p } = useStore();
  const hs = habitStats(d);
  const wm = weekMinutes(d);
  const [newHabit, setNewHabit] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [goalArea, setGoalArea] = useState(0);

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const maxId = d.habits.reduce((m, x) => Math.max(m, x.id), 0);
    d.habits.push({ id: maxId + 1, name: newHabit.trim() });
    setNewHabit('');
    commit();
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;
    const id = d.goals.reduce((m, g) => Math.max(m, g.id), 0) + 1;
    d.goals.push({ id, t: newGoal.trim(), area: AREAS[goalArea], target: '', pct: 0, ms: '' });
    setNewGoal('');
    commit();
  };

  // Аналитик — habit trend (өмнөх долоо хоногууд + одоо)
  const trendArr = (d.habit.history || []).slice(-4).concat([hs.weekScore]);
  const tMax = Math.max(...trendArr, 1);
  const tx = (i: number) => trendArr.length > 1 ? 12 + i * (276 / (trendArr.length - 1)) : 150;
  const trendPts = trendArr.map((v, i) => tx(i).toFixed(1) + ',' + (90 - v / tMax * 78).toFixed(1)).join(' ');

  // 14 хоногийн bar chart — бодит датанаас
  const days14 = lastDays(d, 14);
  const allMax = Math.max(...days14.map(x => x.eng), ...days14.map(x => x.ml), 1);
  const bars = days14.map((x, i) => {
    const gx = i * 22 + 2;
    const h1 = Math.max(2, x.eng / allMax * 78), h2 = Math.max(2, x.ml / allMax * 78);
    return { x1: gx, h1, y1: 92 - h1, x2: gx + 9, h2, y2: 92 - h2 };
  });

  // Donut
  const C = 251.2;
  const dTot = wm.eng + wm.ml || 1;
  const segs = [{ name: 'English', v: wm.eng, color: p.a2 }, { name: 'MLOps', v: wm.ml, color: p.a1 }];
  let accOff = 0;
  const donut = segs.map(s => {
    const len = s.v / dTot * C;
    const seg = { color: s.color, dash: len.toFixed(1) + ' ' + (C - len).toFixed(1), off: (-accOff).toFixed(1) };
    accOff += len;
    return seg;
  });

  const dayHeadSt = (di: number): React.CSSProperties => ({
    font: `600 10px ${MONO}`, textAlign: 'center', color: di === hs.todayIdx ? p.a2 : 'var(--tx2)', textTransform: 'uppercase'
  });

  return (
    <Screen>
      <PageHead title="Зорилго & Хэвшил" sub="9 сарын систем · долоо хоногийн tracker · аналитик" />

      {/* Зорилгын картууд */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(215px,1fr))', gap: 18, marginBottom: 18 }}>
        {d.goals.map(g => (
          <Card key={g.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <span style={{ ...chip(ACOL[g.area]), display: 'inline-block', padding: '3px 9px' }}>{g.area}</span>
              <button className="hv-red" title="Устгах" onClick={() => { d.goals = d.goals.filter(x => x.id !== g.id); commit(); }}
                style={{ border: 'none', background: 'none', color: 'var(--tx2)', opacity: .35, padding: 2, display: 'inline-flex', borderRadius: 5 }}>
                <IconX size={11} />
              </button>
            </div>
            <div style={{ font: `700 14px/1.3 ${FONT}`, margin: '8px 0 2px' }}>{g.t}</div>
            <div style={{ font: `500 10px ${MONO}`, color: 'var(--tx2)', minHeight: 13 }}>{g.ms}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <button className="hv-line-acc1" onClick={() => { g.pct = Math.max(0, g.pct - 5); commit(); }}
                style={{ width: 24, height: 24, flex: 'none', borderRadius: 8, border: '1px solid var(--line)', background: 'none', color: 'var(--tx2)', font: `700 13px ${MONO}` }}>−</button>
              <div style={{ flex: 1 }}><Bar pct={g.pct} color={ACOL[g.area]} h={6} /></div>
              <button className="hv-line-acc1" onClick={() => { g.pct = Math.min(100, g.pct + 5); commit(); }}
                style={{ width: 24, height: 24, flex: 'none', borderRadius: 8, border: '1px solid var(--line)', background: 'none', color: 'var(--tx2)', font: `700 13px ${MONO}` }}>+</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ font: `700 15px ${MONO}` }}>{g.pct}%</span>
              <span style={{ font: `500 10px ${MONO}`, color: 'var(--tx2)' }}>{g.target}</span>
            </div>
          </Card>
        ))}
        {/* Зорилго нэмэх карт */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', border: '1px dashed var(--line)', background: 'transparent', boxShadow: 'none' }}>
          <input value={newGoal} onChange={e => setNewGoal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addGoal(); }}
            placeholder="Шинэ зорилго…" style={{ ...inputSt }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setGoalArea((goalArea + 1) % AREAS.length)}
              style={{ flex: 1, padding: '9px 12px', borderRadius: 11, border: 'none', background: ACOL[AREAS[goalArea]] + '22', color: ACOL[AREAS[goalArea]], font: `700 11px ${MONO}` }}>
              {AREAS[goalArea]}
            </button>
            <button className="hv-bright" onClick={addGoal} style={{ ...primaryBtn('var(--acc1)'), flex: 1, padding: '9px 12px' }}>+ Нэмэх</button>
          </div>
        </Card>
      </div>

      {/* Хэвшлийн grid */}
      <Card style={{ marginBottom: 18, overflowX: 'auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
          <SecLabel color={p.a2} mb={0}>Долоо хоногийн хэвшил</SecLabel>
          <span style={{ font: `600 11px ${MONO}`, color: p.a2 }}>7 хоногийн оноо {hs.weekScore}%</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          <input value={newHabit} onChange={e => setNewHabit(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addHabit(); }}
            placeholder="Шинэ дадал нэмэх… (ж: Бясалгал 10 мин)" style={{ ...inputSt, flex: '1 1 200px', padding: '9px 12px', font: `500 12px ${FONT}` }} />
          <button className="hv-bright" onClick={addHabit} style={{ ...primaryBtn('var(--acc2)'), padding: '9px 15px', font: `700 12px ${FONT}` }}>+ Дадал нэмэх</button>
        </div>
        <div style={{ minWidth: 520 }}>
          <div style={{ display: 'grid', gridTemplateColumns: GRID_COLS, gap: 4, alignItems: 'center', marginBottom: 6 }}>
            <span />
            {DAY_NAMES.map((l, di) => <span key={l} style={dayHeadSt(di)}>{l}</span>)}
            <span style={{ font: `600 9px ${MONO}`, letterSpacing: '.08em', color: 'var(--tx2)', textAlign: 'right', textTransform: 'uppercase' }}>7 хон</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {d.habits.map(hb => {
              const cnt = DAY_NAMES.filter((_, di) => d.habit.grid[hb.id + '-' + di]).length;
              return (
                <div key={hb.id} style={{ display: 'grid', gridTemplateColumns: GRID_COLS, gap: 4, alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                    <button className="hv-red" title="Устгах"
                      onClick={() => {
                        d.habits = d.habits.filter(x => x.id !== hb.id);
                        Object.keys(d.habit.grid).forEach(k => { if (k.indexOf(hb.id + '-') === 0) delete d.habit.grid[k]; });
                        commit();
                      }}
                      style={{ border: 'none', background: 'none', color: 'var(--tx2)', opacity: .45, padding: 1, display: 'inline-flex', borderRadius: 5, flex: 'none' }}>
                      <IconX />
                    </button>
                    <span style={{ font: `500 12.5px ${FONT}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hb.name}</span>
                  </span>
                  {DAY_NAMES.map((_, di) => {
                    const on = !!d.habit.grid[hb.id + '-' + di];
                    const future = di > hs.todayIdx;
                    return (
                      <button key={di}
                        onClick={() => { if (future) return; const k = hb.id + '-' + di; d.habit.grid[k] = !d.habit.grid[k]; commit(); }}
                        style={habitCell(on, di === hs.todayIdx, future, p.a2, p.cell, true)}>
                        {on ? '✓' : ''}
                      </button>
                    );
                  })}
                  <span style={{ font: `600 11px ${MONO}`, color: 'var(--tx2)', textAlign: 'right' }}>{Math.round(cnt / 7 * 100)}%</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: GRID_COLS, gap: 4, alignItems: 'center', marginTop: 8, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
            <span style={{ font: `600 10px ${MONO}`, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--tx2)' }}>Өдрийн оноо</span>
            {DAY_NAMES.map((_, di) => {
              const n = d.habits.filter(hb => d.habit.grid[hb.id + '-' + di]).length;
              const v = di > hs.todayIdx ? '·' : String(Math.round(n / hs.H * 100));
              return <span key={di} style={{ font: `600 10.5px ${MONO}`, textAlign: 'center', color: n >= Math.ceil(hs.H / 2) ? p.a2 : 'var(--tx2)' }}>{v}</span>;
            })}
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, font: `700 12px ${MONO}`, color: 'var(--acc3)' }}>
              <IconFlame />{hs.streak}
            </span>
          </div>
        </div>
      </Card>

      {/* Аналитик */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(245px,1fr))', gap: 18 }}>
        <Card>
          <SecLabel color={p.a2} mb={10}>Habit score · 5 долоо хоног</SecLabel>
          <svg viewBox="0 0 300 96" style={{ width: '100%', height: 'auto' }}>
            <line x1="4" y1="90" x2="296" y2="90" stroke="var(--line)" strokeWidth="1" />
            <polyline points={trendPts} fill="none" stroke="var(--acc2)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
            {trendArr.map((v, i) => (
              <circle key={i} cx={tx(i).toFixed(1)} cy={(90 - v / tMax * 78).toFixed(1)} r="3.5" fill="var(--acc2)" />
            ))}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', font: `500 10px ${MONO}`, color: 'var(--tx2)', marginTop: 6 }}>
            <span>W-4</span><span>W-3</span><span>W-2</span><span>W-1</span><span>одоо</span>
          </div>
        </Card>
        <Card>
          <SecLabel color={p.a1} mb={10}>Судалгааны минут · 14 хоног</SecLabel>
          <svg viewBox="0 0 308 96" style={{ width: '100%', height: 'auto' }}>
            <line x1="2" y1="92" x2="306" y2="92" stroke="var(--line)" strokeWidth="1" />
            {bars.map((br, i) => (
              <g key={i}>
                <rect x={br.x1} y={br.y1.toFixed(1)} width="7" height={br.h1.toFixed(1)} rx="2" fill="var(--acc2)" />
                <rect x={br.x2} y={br.y2.toFixed(1)} width="7" height={br.h2.toFixed(1)} rx="2" fill="var(--acc1)" />
              </g>
            ))}
          </svg>
          <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: `500 10.5px ${MONO}`, color: 'var(--tx2)' }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--acc2)' }} />English</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: `500 10.5px ${MONO}`, color: 'var(--tx2)' }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--acc1)' }} />MLOps</span>
          </div>
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ alignSelf: 'flex-start', marginBottom: 6 }}>
            <SecLabel color={p.a3} mb={0}>Цагийн хуваарилалт</SecLabel>
          </div>
          <div style={{ position: 'relative', width: 120, height: 120 }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--panel2)" strokeWidth="13" />
              {donut.map((dn, i) => (
                <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={dn.color} strokeWidth="13"
                  strokeDasharray={dn.dash} strokeDashoffset={dn.off} transform="rotate(-90 50 50)" strokeLinecap="butt" />
              ))}
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ font: `700 19px ${MONO}` }}>{wm.totalH}ц</span>
              <span style={{ font: `500 9px ${MONO}`, color: 'var(--tx2)' }}>7 ХОНОГТ</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 12, alignSelf: 'stretch' }}>
            {segs.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 7, font: `500 11px ${MONO}`, color: 'var(--tx2)' }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color, flex: 'none' }} />
                <span style={{ flex: 1 }}>{s.name}</span>
                <b style={{ color: 'var(--tx)' }}>{Math.round(s.v / dTot * 100)}%</b>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Screen>
  );
}
