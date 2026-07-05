import React, { useState } from 'react';
import { useStore } from '../data/store';
import { Card, SecLabel, PageHead, Screen } from '../components/ui';
import { TaskRow, kvRow, kvKey, kvVal, TimeField, DelBtn } from '../components/bits';
import { FONT, MONO, AREAS, ACOL, PRIS, PCOL, checkbox, inputSt, primaryBtn, chip } from '../theme';
import { td, toMin } from '../lib/dates';
import { taskStats, overdueTasks, habitStats, blockNow, engToday } from '../lib/derive';

export function Planner() {
  const { d, commit, now, p } = useStore();
  const [newTask, setNewTask] = useState('');
  const [areaIdx, setAreaIdx] = useState(0);
  const [priIdx, setPriIdx] = useState(1);
  const [editBlocks, setEditBlocks] = useState(false);
  const [newBlockT, setNewBlockT] = useState('');

  const ts = taskStats(d);
  const hs = habitStats(d);
  const overdue = overdueTasks(d);
  const mins = now.getHours() * 60 + now.getMinutes();

  const addTask = () => {
    if (!newTask.trim()) return;
    d.tasks.push({ id: Date.now(), t: newTask.trim(), area: AREAS[areaIdx], pri: priIdx as 0 | 1 | 2, done: false, date: td(0) });
    setNewTask('');
    commit();
  };

  const sorted = ts.todays.slice().sort((a, b) => Number(a.done) - Number(b.done) || b.pri - a.pri);
  const routinePct = Math.round(d.routine.items.filter(Boolean).length / (d.routineSteps.length || 1) * 100);

  return (
    <Screen>
      <PageHead title="Өдрийн төлөвлөгч" sub="«Өглөө утас харахгүй байх нь хамгийн том ялалт.»" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-start' }}>

        {/* Цагийн блокууд — шууд эндээс нэмж/засаж/устгана */}
        <Card style={{ flex: '1 1 230px' }}>
          <SecLabel color={p.a1} right={
            <button onClick={() => setEditBlocks(!editBlocks)}
              style={{ border: 'none', borderRadius: 8, padding: '3px 10px', background: editBlocks ? 'var(--acc1)' : p.a1 + '1c', color: editBlocks ? '#fff' : 'var(--acc1)', font: `700 10px ${MONO}` }}>
              {editBlocks ? 'Болсон' : 'Засах'}
            </button>
          }>Цагийн блокууд</SecLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[...d.blocks].sort((a, b) => a.s.localeCompare(b.s)).map(b => {
              const active = mins >= toMin(b.s) && mins < toMin(b.e);
              const past = mins >= toMin(b.e);
              if (editBlocks) {
                return (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 6px', borderRadius: 11, background: 'var(--panel2)' }}>
                    <TimeField value={b.s} onChange={v => { b.s = v; commit(); }} />
                    <TimeField value={b.e} onChange={v => { b.e = v; commit(); }} />
                    <input value={b.t} onChange={e => { b.t = e.target.value; commit(); }}
                      style={{ ...inputSt, flex: 1, padding: '6px 8px', font: `500 12px ${FONT}`, background: 'var(--panel)' }} />
                    <DelBtn onClick={() => { d.blocks = d.blocks.filter(x => x.id !== b.id); commit(); }} />
                  </div>
                );
              }
              return (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderRadius: 11, background: active ? p.a1 + '16' : 'var(--panel2)', border: '1px solid ' + (active ? p.a1 + '66' : 'transparent'), opacity: past ? .5 : 1 }}>
                  <span style={{ font: `600 10.5px ${MONO}`, width: 76, flex: 'none', color: 'var(--tx2)' }}>{b.s}–{b.e}</span>
                  <span style={{ font: `500 12px ${FONT}`, flex: 1, minWidth: 0 }}>{b.t}</span>
                  {active && <span style={{ font: `700 8.5px ${MONO}`, letterSpacing: '.1em', padding: '3px 7px', borderRadius: 99, background: 'var(--acc1)', color: '#fff', animation: 'osPulse 2s infinite', flex: 'none' }}>ОДОО</span>}
                </div>
              );
            })}
            {editBlocks && (
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                <input value={newBlockT} onChange={e => setNewBlockT(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newBlockT.trim()) {
                      const id = d.blocks.reduce((m, x) => Math.max(m, x.id), 0) + 1;
                      const lastE = [...d.blocks].sort((a, b) => a.e.localeCompare(b.e)).pop()?.e || '18:00';
                      d.blocks.push({ id, s: lastE === '23:59' ? '18:00' : lastE, e: '23:59', t: newBlockT.trim() });
                      setNewBlockT('');
                      commit();
                    }
                  }}
                  placeholder="+ Шинэ блок (Enter)" style={{ ...inputSt, flex: 1, padding: '8px 10px', font: `500 12px ${FONT}`, background: 'transparent', border: '1px dashed var(--line)' }} />
              </div>
            )}
          </div>
        </Card>

        {/* Даалгавар */}
        <Card style={{ flex: '2 1 320px' }}>
          <SecLabel color={p.a2} right={`${ts.done}/${ts.total}`}>Өнөөдрийн даалгавар</SecLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addTask(); }}
              placeholder="Шинэ даалгавар бичих…" style={{ ...inputSt, flex: '1 1 170px' }} />
            <button onClick={() => setAreaIdx((areaIdx + 1) % AREAS.length)}
              style={{ flex: 'none', padding: '10px 12px', borderRadius: 11, border: 'none', background: ACOL[AREAS[areaIdx]] + '22', color: ACOL[AREAS[areaIdx]], font: `700 11px ${MONO}` }}>
              {AREAS[areaIdx]}
            </button>
            <button onClick={() => setPriIdx((priIdx + 1) % 3)}
              style={{ flex: 'none', padding: '10px 12px', borderRadius: 11, border: 'none', background: PCOL[priIdx] + '22', color: PCOL[priIdx], font: `700 11px ${MONO}` }}>
              {PRIS[priIdx]}
            </button>
            <button className="hv-bright" onClick={addTask} style={primaryBtn('var(--acc1)')}>+ Нэмэх</button>
          </div>

          {overdue.length > 0 && (
            <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 11, border: '1px solid #C4554D44', background: '#C4554D0d' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                <span style={{ font: `600 10px ${MONO}`, letterSpacing: '.1em', textTransform: 'uppercase', color: '#C4554D' }}>Хоцорсон · {overdue.length}</span>
                <button className="hv-bright" onClick={() => { overdue.forEach(t => { t.date = td(0); }); commit(); }}
                  style={{ border: 'none', borderRadius: 8, padding: '4px 10px', background: '#C4554D22', color: '#C4554D', font: `700 10.5px ${MONO}` }}>
                  Өнөөдөрт шилжүүлэх
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {overdue.slice(0, 4).map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, font: `500 12px ${FONT}` }}>
                    <span style={{ font: `500 9.5px ${MONO}`, color: 'var(--tx2)', flex: 'none' }}>{t.date.slice(5)}</span>
                    <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.t}</span>
                    <span style={chip(ACOL[t.area])}>{t.area}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {sorted.length === 0 && (
              <div style={{ font: `500 12px ${FONT}`, color: 'var(--tx2)', padding: '11px 12px', borderRadius: 11, background: 'var(--panel2)' }}>
                Өнөөдрийн даалгавар алга. Дээрээс эхнийхээ нэм — өдрийн 3 зорилго хангалттай.
              </div>
            )}
            {sorted.map(t => <TaskRow key={t.id} task={t} showDel showPri />)}
          </div>
        </Card>

        {/* Routine + дүн */}
        <div style={{ flex: '1 1 240px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card>
            <SecLabel color={p.a3} right={<span style={{ color: p.a3 }}>{routinePct}%</span>}>Өглөөний routine</SecLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {d.routineSteps.map((step, i) => {
                const on = d.routine.items[i];
                return (
                  <button key={i} className="hv-line-acc3" onClick={() => { d.routine.items[i] = !on; commit(); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 10, border: '1px solid ' + (on ? p.a3 + '55' : 'transparent'), background: on ? p.a3 + '14' : 'var(--panel2)', color: 'inherit' }}>
                    <span style={checkbox(on, p.a3, p.dark, 17, 99)}>{on ? '✓' : ''}</span>
                    <span style={{ font: `500 12px ${FONT}`, textDecoration: on ? 'line-through' : 'none', opacity: on ? .55 : 1 }}>{step}</span>
                  </button>
                );
              })}
            </div>
          </Card>
          <Card>
            <SecLabel color={p.a1} mb={10}>Өнөөдрийн дүн</SecLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, font: `500 12px ${FONT}` }}>
              <div style={kvRow}><span style={kvKey}>Даалгавар</span><b style={kvVal}>{ts.done}/{ts.total}</b></div>
              <div style={kvRow}><span style={kvKey}>Хэвшил</span><b style={kvVal}>{hs.habitToday}/{hs.H}</b></div>
              <div style={kvRow}><span style={kvKey}>English минут</span><b style={kvVal}>{engToday(d)} мин</b></div>
              <div style={kvRow}><span style={kvKey}>Идэвхтэй блок</span><b style={{ ...kvVal, textAlign: 'right' }}>{blockNow(d, now)}</b></div>
            </div>
          </Card>
        </div>
      </div>
    </Screen>
  );
}
