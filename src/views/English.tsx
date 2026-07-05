import React, { useState } from 'react';
import { useStore } from '../data/store';
import { Card, SecLabel, PageHead, Screen } from '../components/ui';
import { FONT, MONO, WORDST, WCOL, checkbox, inputSt, primaryBtn } from '../theme';
import { td } from '../lib/dates';
import { wordsToday, engToday, engLevel } from '../lib/derive';
import { IconX } from '../icons';
import { DelBtn } from '../components/bits';

const RES_KINDS = ['ПОДКАСТ', 'ВИДЕО', 'НОМ', 'САЙТ', 'КУРС'];

export function English() {
  const { d, commit, p } = useStore();
  const [en, setEn] = useState('');
  const [mn, setMn] = useState('');
  const [ex, setEx] = useState('');
  const [newGr, setNewGr] = useState<Record<string, string>>({});
  const [newRes, setNewRes] = useState('');
  const [resKind, setResKind] = useState(0);
  const wt = wordsToday(d);
  const lvl = engLevel(d);

  const addWord = () => {
    if (!en.trim()) return;
    const id = d.words.reduce((m, w) => Math.max(m, w.id), 0) + 1;
    d.words.unshift({ id, en: en.trim(), mn: mn.trim() || '—', ex: ex.trim(), st: 0, date: td(0) });
    setEn(''); setMn(''); setEx('');
    commit();
  };

  const addGrammar = (lv: string) => {
    const t = (newGr[lv] || '').trim();
    if (!t) return;
    const gr = d.grammar.find(g => g.lv === lv);
    if (!gr) return;
    gr.items.push({ t, on: false });
    setNewGr({ ...newGr, [lv]: '' });
    commit();
  };

  const addResource = () => {
    if (!newRes.trim()) return;
    const id = d.resources.reduce((m, r) => Math.max(m, r.id), 0) + 1;
    d.resources.push({ id, t: newRes.trim(), k: RES_KINDS[resKind] });
    setNewRes('');
    commit();
  };

  return (
    <Screen>
      <PageHead title="English OS" sub="A1 → B2 аялал · зорилго: 2027 оны 3-р сар" />

      {/* Түвшний stepper */}
      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 10 }}>
          {['A1', 'A2', 'B1', 'B2'].map((nm, i) => (
            <div key={nm} style={{ flex: i < 3 ? 1 : 'none', display: 'flex', alignItems: 'center' }}>
              <div style={{
                flex: 'none', width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                font: `700 12px ${MONO}`,
                background: i < lvl.idx ? p.a2 : i === lvl.idx ? p.a2 + '22' : p.cell,
                color: i < lvl.idx ? '#fff' : i === lvl.idx ? p.a2 : 'var(--tx2)',
                border: i === lvl.idx ? '2px solid ' + p.a2 : 'none'
              }}>{nm}</div>
              {i < 3 && <div style={{ flex: 1, height: 2, background: i < lvl.idx ? p.a2 : p.cell }} />}
            </div>
          ))}
        </div>
        <div style={{ height: 7, borderRadius: 4, background: 'var(--panel2)', overflow: 'hidden' }}>
          <div style={{ width: lvl.pct + '%', height: '100%', background: 'var(--acc2)', borderRadius: 4, transition: 'width .4s' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 6, marginTop: 8, font: `500 10.5px ${MONO}`, color: 'var(--tx2)' }}>
          <span>1-2 сар · A2 бататгах</span><span>3-5 сар · B1 дүрэм + ярих</span><span>6-9 сар · B2 унших/сонсох/бичих</span>
        </div>
      </Card>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-start' }}>
        <div style={{ flex: '1.4 1 340px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Word Bank */}
          <Card>
            <SecLabel color={p.a2} right={<span style={{ color: p.a2 }}>өнөөдөр {wt}/5</span>}>Word Bank · өдөрт 5 үг</SecLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              <input value={en} onChange={e => setEn(e.target.value)} placeholder="English үг" style={{ ...inputSt, flex: '1 1 140px' }} />
              <input value={mn} onChange={e => setMn(e.target.value)} placeholder="Монгол утга" style={{ ...inputSt, flex: '1 1 140px' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              <input value={ex} onChange={e => setEx(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addWord(); }}
                placeholder="Жишээ өгүүлбэр (заавал биш)" style={{ ...inputSt, flex: '1 1 200px' }} />
              <button className="hv-bright" onClick={addWord} style={primaryBtn('var(--acc2)')}>+ Нэмэх</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 340, overflowY: 'auto' }}>
              {d.words.length === 0 && (
                <div style={{ font: `500 12px ${FONT}`, color: 'var(--tx2)', padding: '10px 12px', borderRadius: 11, background: 'var(--panel2)' }}>
                  Эхний үгээ нэм — өдөрт 5 үг · B2 хүрэх зам эндээс эхэлнэ.
                </div>
              )}
              {d.words.map(w => (
                <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 11, background: 'var(--panel2)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                      <b style={{ font: `700 13px ${FONT}` }}>{w.en}</b>
                      <span style={{ font: `500 12px ${FONT}`, color: 'var(--tx2)' }}>{w.mn}</span>
                    </div>
                    <div style={{ font: `400 11px ${FONT}`, color: 'var(--tx2)', fontStyle: 'italic', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.ex || '—'}</div>
                  </div>
                  <span style={{ font: `500 9.5px ${MONO}`, color: 'var(--tx2)', flex: 'none' }}>{w.date.slice(5)}</span>
                  <button onClick={() => { w.st = ((w.st + 1) % 3) as 0 | 1 | 2; commit(); }}
                    style={{ flex: 'none', font: `700 10px ${MONO}`, padding: '5px 10px', borderRadius: 99, border: 'none', background: WCOL[w.st] + '22', color: WCOL[w.st] }}>
                    {WORDST[w.st]}
                  </button>
                  <button className="hv-red" title="Устгах" onClick={() => { d.words = d.words.filter(x => x.id !== w.id); commit(); }}
                    style={{ border: 'none', background: 'none', color: 'var(--tx2)', opacity: .35, padding: 2, display: 'inline-flex', borderRadius: 5 }}>
                    <IconX size={11} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Дүрмийн tracker — сэдэв нэмж/хасаж болно */}
          <Card>
            <SecLabel color={p.a2}>Дүрмийн tracker</SecLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
              {d.grammar.map(gr => {
                const on = gr.items.filter(i => i.on).length;
                return (
                  <div key={gr.lv} style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ font: `700 12px ${MONO}`, padding: '2px 9px', borderRadius: 7, background: p.a2 + '1c', color: p.a2 }}>{gr.lv}</span>
                      <span style={{ font: `600 10px ${MONO}`, color: 'var(--tx2)' }}>{gr.items.length ? Math.round(on / gr.items.length * 100) : 0}%</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {gr.items.map((gi, gii) => (
                        <div key={gii} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <button className="hv-line-acc2" onClick={() => { gi.on = !gi.on; commit(); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, minWidth: 0, padding: '7px 9px', borderRadius: 9, border: '1px solid var(--line)', background: 'var(--panel2)', textAlign: 'left', color: 'var(--tx)' }}>
                            <span style={checkbox(gi.on, p.a2, p.dark, 15, 5)}>{gi.on ? '✓' : ''}</span>
                            <span style={{ font: `500 11.5px ${FONT}`, textDecoration: gi.on ? 'line-through' : 'none', opacity: gi.on ? .55 : 1 }}>{gi.t}</span>
                          </button>
                          <DelBtn onClick={() => { gr.items.splice(gii, 1); commit(); }} size={10} />
                        </div>
                      ))}
                      <input value={newGr[gr.lv] || ''} onChange={e => setNewGr({ ...newGr, [gr.lv]: e.target.value })}
                        onKeyDown={e => { if (e.key === 'Enter') addGrammar(gr.lv); }}
                        placeholder="+ Сэдэв (Enter)" style={{ ...inputSt, padding: '7px 9px', font: `500 11.5px ${FONT}`, background: 'transparent', border: '1px dashed var(--line)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div style={{ flex: '1 1 250px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Өнөөдрийн лог */}
          <Card>
            <SecLabel color={p.a2} right={<span style={{ color: p.a2 }}>{engToday(d)} мин</span>}>Өнөөдрийн лог</SecLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {Object.keys(d.engLog.mins).map(k => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ flex: 1, minWidth: 0, font: `500 12px ${FONT}` }}>{k}</span>
                  <span style={{ font: `600 11px ${MONO}`, color: 'var(--tx2)' }}>{d.engLog.mins[k]}м</span>
                  <button className="hv-tint2" onClick={() => { d.engLog.mins[k] += 15; commit(); }}
                    style={{ padding: '5px 10px', borderRadius: 8, border: 'none', background: 'rgba(29,158,117,.12)', color: 'var(--acc2)', font: `700 11px ${MONO}` }}>+15</button>
                </div>
              ))}
            </div>
          </Card>
          {/* Нөөцүүд — нэмж/хасаж болно */}
          <Card>
            <SecLabel color={p.a2}>Сонсох · Унших</SecLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, font: `500 12px ${FONT}` }}>
              {d.resources.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderRadius: 10, background: 'var(--panel2)' }}>
                  <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.t}</span>
                  <span style={{ font: `500 9.5px ${MONO}`, color: 'var(--tx2)', flex: 'none' }}>{r.k}</span>
                  <DelBtn onClick={() => { d.resources = d.resources.filter(x => x.id !== r.id); commit(); }} size={10} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              <input value={newRes} onChange={e => setNewRes(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addResource(); }}
                placeholder="Шинэ нөөц…" style={{ ...inputSt, flex: '1 1 110px', padding: '8px 10px', font: `500 12px ${FONT}` }} />
              <button onClick={() => setResKind((resKind + 1) % RES_KINDS.length)}
                style={{ flex: 'none', padding: '8px 10px', borderRadius: 10, border: 'none', background: p.a2 + '1c', color: 'var(--acc2)', font: `600 9.5px ${MONO}` }}>
                {RES_KINDS[resKind]}
              </button>
              <button className="hv-bright" onClick={addResource}
                style={{ ...primaryBtn('var(--acc2)'), padding: '8px 12px', font: `700 12px ${FONT}` }}>+</button>
            </div>
          </Card>
        </div>
      </div>
    </Screen>
  );
}
