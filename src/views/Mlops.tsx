import React, { useState } from 'react';
import { useStore } from '../data/store';
import { Card, SecLabel, PageHead, Screen } from '../components/ui';
import { FONT, MONO, PHASES, PROJST, ST_DOT, inputSt, primaryBtn } from '../theme';
import { roadStats, mlToday } from '../lib/derive';
import { IconX } from '../icons';

export function Mlops() {
  const { d, commit, p } = useStore();
  const rs = roadStats(d);
  const [newTopic, setNewTopic] = useState('');
  const [newCat, setNewCat] = useState('');
  const [newPh, setNewPh] = useState(0);
  const [newProj, setNewProj] = useState('');

  const addTopic = () => {
    if (!newTopic.trim()) return;
    const id = d.road.reduce((m, r) => Math.max(m, r.id), 0) + 1;
    d.road.push({ id, t: newTopic.trim(), ph: newPh as 0 | 1 | 2 | 3, cat: newCat.trim() || 'Сэдэв', st: 0 });
    setNewTopic(''); setNewCat('');
    commit();
  };

  const addProj = () => {
    if (!newProj.trim()) return;
    const id = d.projects.reduce((m, r) => Math.max(m, r.id), 0) + 1;
    d.projects.push({ id, t: newProj.trim(), stack: [], st: 0 });
    setNewProj('');
    commit();
  };

  const stats = [
    { k: 'Нийт сэдэв', v: String(rs.total) },
    { k: 'Дууссан', v: String(rs.done) },
    { k: 'Явагдаж буй', v: String(rs.prog) },
    { k: 'Roadmap явц', v: rs.pct + '%' }
  ];

  return (
    <Screen>
      <PageHead title="MLOps төв" sub="Roadmap 2026 · картан дээр дарж статус солино (эхлээгүй → явагдаж буй → дууссан)" />

      {/* Статистик + өнөөдрийн минут */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 18 }}>
        {stats.map(ms => (
          <div key={ms.k} style={{ minWidth: 0, background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ font: `600 9.5px ${MONO}`, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--tx2)' }}>{ms.k}</div>
            <div style={{ font: `700 24px ${MONO}`, marginTop: 4, color: 'var(--acc1)' }}>{ms.v}</div>
          </div>
        ))}
        <div style={{ minWidth: 0, background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ font: `600 9.5px ${MONO}`, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--tx2)' }}>Өнөөдрийн минут</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ font: `700 24px ${MONO}`, color: 'var(--acc1)' }}>{mlToday(d)}</span>
            <button className="hv-tint1" onClick={() => { d.mlLog.mins += 15; commit(); }}
              style={{ padding: '5px 10px', borderRadius: 8, border: 'none', background: 'rgba(127,119,221,.12)', color: 'var(--acc1)', font: `700 11px ${MONO}` }}>+15</button>
            <button className="hv-tint1" onClick={() => { d.mlLog.mins += 30; commit(); }}
              style={{ padding: '5px 10px', borderRadius: 8, border: 'none', background: 'rgba(127,119,221,.12)', color: 'var(--acc1)', font: `700 11px ${MONO}` }}>+30</button>
          </div>
        </div>
      </div>

      {/* Сэдэв нэмэх */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        <input value={newTopic} onChange={e => setNewTopic(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addTopic(); }}
          placeholder="Шинэ сэдэв нэмэх… (ж: Airflow)" style={{ ...inputSt, flex: '1 1 180px' }} />
        <input value={newCat} onChange={e => setNewCat(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addTopic(); }}
          placeholder="Категори" style={{ ...inputSt, flex: '0 1 120px' }} />
        <button onClick={() => setNewPh((newPh + 1) % 4)}
          style={{ flex: 'none', padding: '10px 12px', borderRadius: 11, border: 'none', background: p.a1 + '22', color: 'var(--acc1)', font: `700 11px ${MONO}` }}>
          {PHASES[newPh]}
        </button>
        <button className="hv-bright" onClick={addTopic} style={primaryBtn('var(--acc1)')}>+ Нэмэх</button>
      </div>

      {/* Roadmap багана */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(205px,1fr))', gap: 18, alignItems: 'start', marginBottom: 18 }}>
        {PHASES.map((pn, pi) => {
          const tops = d.road.filter(r => r.ph === pi);
          const done = tops.filter(r => r.st === 2).length;
          return (
            <div key={pn} style={{ minWidth: 0, background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 16, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ font: `700 12.5px ${FONT}` }}>{pn}</span>
                <span style={{ font: `600 10px ${MONO}`, color: 'var(--tx2)' }}>{done}/{tops.length}</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--panel2)', marginBottom: 10, overflow: 'hidden' }}>
                <div style={{ width: (tops.length ? done / tops.length * 100 : 0) + '%', height: '100%', background: 'var(--acc1)', borderRadius: 2, transition: 'width .4s' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tops.map(r => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button className="hv-line-acc1" onClick={() => { r.st = ((r.st + 1) % 3) as 0 | 1 | 2; commit(); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0, textAlign: 'left', padding: '9px 10px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--panel2)', color: 'var(--tx)' }}>
                      <span style={{ width: 9, height: 9, flex: 'none', borderRadius: '50%', background: ST_DOT[r.st] }} />
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', font: `600 12px ${FONT}`, textDecoration: r.st === 2 ? 'line-through' : 'none', opacity: r.st === 2 ? .55 : 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.t}</span>
                        <span style={{ display: 'block', font: `500 9px ${MONO}`, letterSpacing: '.08em', color: 'var(--tx2)', textTransform: 'uppercase', marginTop: 2 }}>{r.cat}</span>
                      </span>
                    </button>
                    <button className="hv-red" title="Устгах" onClick={() => { d.road = d.road.filter(x => x.id !== r.id); commit(); }}
                      style={{ border: 'none', background: 'none', color: 'var(--tx2)', opacity: .35, padding: 2, display: 'inline-flex', borderRadius: 5, flex: 'none' }}>
                      <IconX size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Төслүүд */}
      <Card>
        <SecLabel color={p.a1}>Идэвхтэй төслүүд</SecLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <input value={newProj} onChange={e => setNewProj(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addProj(); }}
            placeholder="Шинэ төсөл нэмэх…" style={{ ...inputSt, flex: '1 1 200px' }} />
          <button className="hv-bright" onClick={addProj} style={primaryBtn('var(--acc1)')}>+ Төсөл</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {d.projects.map(pj => (
            <div key={pj.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, background: 'var(--panel2)' }}>
              <span style={{ font: `600 13px ${FONT}`, flex: '1 1 160px', minWidth: 0 }}>{pj.t}</span>
              {pj.stack.map(sk => (
                <span key={sk} style={{ font: `600 10px ${MONO}`, padding: '3px 8px', borderRadius: 6, background: 'var(--panel)', border: '1px solid var(--line)', color: 'var(--tx2)' }}>{sk}</span>
              ))}
              <button onClick={() => { pj.st = ((pj.st + 1) % 3) as 0 | 1 | 2; commit(); }}
                style={{ flex: 'none', font: `700 10.5px ${MONO}`, padding: '6px 12px', borderRadius: 99, border: 'none', background: [p.tx2 + '22', p.a3 + '22', p.a2 + '22'][pj.st], color: [p.tx2, p.a3, p.a2][pj.st] }}>
                {PROJST[pj.st]}
              </button>
              <button className="hv-red" title="Устгах" onClick={() => { d.projects = d.projects.filter(x => x.id !== pj.id); commit(); }}
                style={{ border: 'none', background: 'none', color: 'var(--tx2)', opacity: .35, padding: 2, display: 'inline-flex', borderRadius: 5 }}>
                <IconX />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </Screen>
  );
}
