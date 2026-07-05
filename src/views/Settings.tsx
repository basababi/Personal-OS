import React, { useEffect, useState } from 'react';
import { useStore } from '../data/store';
import { Card, SecLabel, PageHead, Screen } from '../components/ui';
import { FONT, MONO, inputSt, primaryBtn } from '../theme';
import { DAY_NAMES } from '../lib/dates';
import { IconX, IconBell, IconDownload, IconUpload } from '../icons';
import { Reminder } from '../types';
import { TimeField } from '../components/bits';

function Toggle({ on, onChange, color = 'var(--acc2)' }: { on: boolean; onChange: (v: boolean) => void; color?: string }) {
  return (
    <button onClick={() => onChange(!on)} aria-pressed={on}
      style={{ width: 38, height: 22, flex: 'none', borderRadius: 99, border: 'none', padding: 2, background: on ? color : 'var(--cell)', transition: 'background .25s', display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start' }}>
      <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.25)', transition: 'transform .25s' }} />
    </button>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 11, background: 'var(--panel2)' }}>{children}</div>;
}


export function Settings() {
  const { d, commit, p, replaceData } = useStore();
  const [autoLaunch, setAL] = useState(false);
  const [info, setInfo] = useState<{ version: string; dataFile: string } | null>(null);
  const [msg, setMsg] = useState('');
  const [newRemTime, setNewRemTime] = useState('20:00');
  const [newRemTitle, setNewRemTitle] = useState('');
  const [newBlock, setNewBlock] = useState('');
  const [newStep, setNewStep] = useState('');

  useEffect(() => {
    window.pos?.getAutoLaunch().then(setAL);
    window.pos?.appInfo().then(setInfo);
  }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 4000); };

  const addReminder = () => {
    if (!newRemTitle.trim()) return;
    const id = d.reminders.items.reduce((m, r) => Math.max(m, r.id), 0) + 1;
    d.reminders.items.push({ id, time: newRemTime, title: newRemTitle.trim(), body: '', days: [], enabled: true, view: 'home' });
    setNewRemTitle('');
    commit();
  };

  const toggleDay = (rem: Reminder, di: number) => {
    const cur = rem.days.length ? [...rem.days] : [0, 1, 2, 3, 4, 5, 6];
    const next = cur.includes(di) ? cur.filter(x => x !== di) : [...cur, di];
    rem.days = next.length >= 7 ? [] : next.sort();
    commit();
  };

  const addBlock = () => {
    if (!newBlock.trim()) return;
    const id = d.blocks.reduce((m, b) => Math.max(m, b.id), 0) + 1;
    d.blocks.push({ id, s: '18:00', e: '19:00', t: newBlock.trim() });
    setNewBlock('');
    commit();
  };

  const addStep = () => {
    if (!newStep.trim()) return;
    d.routineSteps.push(newStep.trim());
    d.routine.items.push(false);
    setNewStep('');
    commit();
  };

  const sortedBlocks = [...d.blocks].sort((a, b) => a.s.localeCompare(b.s));

  return (
    <Screen>
      <PageHead title="Тохиргоо" sub="Системээ өөрийнхөөрөө тааруул — сануулга · цагийн блок · routine · өгөгдөл" />
      {msg && (
        <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 11, background: p.a2 + '1c', color: p.a2, font: `600 12px ${FONT}` }}>{msg}</div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-start' }}>
        <div style={{ flex: '1.3 1 360px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Сануулгууд */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
              <SecLabel color={p.a3} mb={0}>Сануулгууд · Windows мэдэгдэл</SecLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button className="hv-tint1" onClick={() => { window.pos?.testNotify(); flash('Туршилтын мэдэгдэл илгээлээ — дэлгэцийн баруун доод буланг хар.'); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 9, border: 'none', background: 'rgba(127,119,221,.12)', color: 'var(--acc1)', font: `700 11px ${MONO}` }}>
                  <IconBell size={13} />Туршиж үзэх
                </button>
                <Toggle on={d.reminders.enabled} onChange={v => { d.reminders.enabled = v; commit(); }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, opacity: d.reminders.enabled ? 1 : .45 }}>
              {d.reminders.items.map(rem => (
                <div key={rem.id} style={{ padding: '10px 12px', borderRadius: 11, background: 'var(--panel2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <TimeField value={rem.time} onChange={v => { rem.time = v; commit(); }} />
                    <input value={rem.title} onChange={e => { rem.title = e.target.value; commit(); }}
                      style={{ ...inputSt, flex: '1 1 140px', padding: '6px 10px', background: 'var(--panel)' }} />
                    <Toggle on={rem.enabled} onChange={v => { rem.enabled = v; commit(); }} color="var(--acc3)" />
                    <button className="hv-red" title="Устгах" onClick={() => { d.reminders.items = d.reminders.items.filter(x => x.id !== rem.id); commit(); }}
                      style={{ border: 'none', background: 'none', color: 'var(--tx2)', opacity: .45, padding: 2, display: 'inline-flex', borderRadius: 5 }}>
                      <IconX />
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                    {DAY_NAMES.map((dn, di) => {
                      const active = rem.days.length === 0 || rem.days.includes(di);
                      return (
                        <button key={di} onClick={() => toggleDay(rem, di)}
                          style={{ padding: '3px 8px', borderRadius: 7, border: 'none', font: `600 10px ${MONO}`, background: active ? p.a3 + '2b' : 'var(--panel)', color: active ? p.a3 : 'var(--tx2)' }}>
                          {dn}
                        </button>
                      );
                    })}
                    {rem.smart && <span style={{ marginLeft: 'auto', font: `500 9px ${MONO}`, letterSpacing: '.08em', color: 'var(--tx2)', textTransform: 'uppercase' }}>ухаалаг · хийсэн бол алгасна</span>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <TimeField value={newRemTime} onChange={setNewRemTime} />
              <input value={newRemTitle} onChange={e => setNewRemTitle(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addReminder(); }}
                placeholder="Шинэ сануулгын нэр…" style={{ ...inputSt, flex: '1 1 160px' }} />
              <button className="hv-bright" onClick={addReminder} style={primaryBtn('var(--acc3)')}>+ Сануулга</button>
            </div>
          </Card>

          {/* Цагийн блокууд */}
          <Card>
            <SecLabel color={p.a1}>Цагийн блокууд · өдрийн хуваарь</SecLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sortedBlocks.map(b => (
                <Row key={b.id}>
                  <TimeField value={b.s} onChange={v => { b.s = v; commit(); }} />
                  <span style={{ color: 'var(--tx2)', font: `600 11px ${MONO}` }}>–</span>
                  <TimeField value={b.e} onChange={v => { b.e = v; commit(); }} />
                  <input value={b.t} onChange={e => { b.t = e.target.value; commit(); }}
                    style={{ ...inputSt, flex: 1, padding: '6px 10px', background: 'var(--panel)' }} />
                  <button className="hv-red" title="Устгах" onClick={() => { d.blocks = d.blocks.filter(x => x.id !== b.id); commit(); }}
                    style={{ border: 'none', background: 'none', color: 'var(--tx2)', opacity: .45, padding: 2, display: 'inline-flex', borderRadius: 5 }}>
                    <IconX />
                  </button>
                </Row>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <input value={newBlock} onChange={e => setNewBlock(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addBlock(); }}
                placeholder="Шинэ блокийн нэр…" style={{ ...inputSt, flex: '1 1 180px' }} />
              <button className="hv-bright" onClick={addBlock} style={primaryBtn('var(--acc1)')}>+ Блок</button>
            </div>
          </Card>

          {/* Routine алхмууд */}
          <Card>
            <SecLabel color={p.a3}>Өглөөний routine алхмууд</SecLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {d.routineSteps.map((step, i) => (
                <Row key={i}>
                  <span style={{ font: `600 10px ${MONO}`, color: 'var(--tx2)', width: 16, flex: 'none' }}>{i + 1}</span>
                  <input value={step} onChange={e => { d.routineSteps[i] = e.target.value; commit(); }}
                    style={{ ...inputSt, flex: 1, padding: '6px 10px', background: 'var(--panel)' }} />
                  <button className="hv-red" title="Устгах"
                    onClick={() => { d.routineSteps.splice(i, 1); d.routine.items.splice(i, 1); commit(); }}
                    style={{ border: 'none', background: 'none', color: 'var(--tx2)', opacity: .45, padding: 2, display: 'inline-flex', borderRadius: 5 }}>
                    <IconX />
                  </button>
                </Row>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <input value={newStep} onChange={e => setNewStep(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addStep(); }}
                placeholder="Шинэ алхам…" style={{ ...inputSt, flex: '1 1 180px' }} />
              <button className="hv-bright" onClick={addStep} style={primaryBtn('var(--acc3)')}>+ Алхам</button>
            </div>
          </Card>
        </div>

        <div style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Хувийн */}
          <Card>
            <SecLabel color={p.a1}>Хувийн</SecLabel>
            <div style={{ font: `600 10px ${MONO}`, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--tx2)', marginBottom: 6 }}>Нэр</div>
            <input value={d.userName} onChange={e => { d.userName = e.target.value; commit(); }} style={{ ...inputSt, width: '100%' }} />
          </Card>

          {/* Систем */}
          <Card>
            <SecLabel color={p.a1}>Систем</SecLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ font: `600 12.5px ${FONT}` }}>Windows-тэй хамт асаах</div>
                  <div style={{ font: `400 11px ${FONT}`, color: 'var(--tx2)', marginTop: 2 }}>Компьютер асахад tray-д чимээгүй суух</div>
                </div>
                <Toggle on={autoLaunch} onChange={async v => { const r = await window.pos?.setAutoLaunch(v); setAL(r ?? v); }} color="var(--acc1)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ font: `600 12.5px ${FONT}` }}>Хаахад tray-д үлдэх</div>
                  <div style={{ font: `400 11px ${FONT}`, color: 'var(--tx2)', marginTop: 2 }}>Сануулга ажилласаар байхын тулд</div>
                </div>
                <Toggle on={d.settings.closeToTray} onChange={v => { d.settings.closeToTray = v; commit(); }} color="var(--acc1)" />
              </div>
            </div>
          </Card>

          {/* Өгөгдөл */}
          <Card>
            <SecLabel color={p.a2}>Өгөгдөл</SecLabel>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="hv-tint2" onClick={async () => { const fp = await window.pos?.exportData(); if (fp) flash('Хадгаллаа: ' + fp); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, flex: 1, justifyContent: 'center', padding: '10px 12px', borderRadius: 11, border: 'none', background: 'rgba(29,158,117,.12)', color: 'var(--acc2)', font: `600 12px ${FONT}` }}>
                <IconDownload size={14} />Backup хадгалах
              </button>
              <button className="hv-tint1" onClick={async () => {
                const r = await window.pos?.importData();
                if (!r) return;
                if ((r as { __error?: string }).__error) { flash((r as { __error: string }).__error); return; }
                replaceData(r);
                flash('Өгөгдөл амжилттай сэргээгдлээ.');
              }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, flex: 1, justifyContent: 'center', padding: '10px 12px', borderRadius: 11, border: 'none', background: 'rgba(127,119,221,.12)', color: 'var(--acc1)', font: `600 12px ${FONT}` }}>
                <IconUpload size={14} />Сэргээх
              </button>
            </div>
            {info && (
              <div style={{ marginTop: 12, font: `500 10px ${MONO}`, color: 'var(--tx2)', lineHeight: 1.7, wordBreak: 'break-all' }}>
                v{info.version} · дата: {info.dataFile}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Screen>
  );
}
