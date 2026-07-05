import React, { CSSProperties, useEffect, useState } from 'react';
import { useStore } from '../data/store';
import { Task } from '../types';
import { FONT, MONO, ACOL, PCOL, checkbox, chip, inputSt } from '../theme';
import { IconX } from '../icons';

/** Даалгаврын мөр — Dashboard болон Planner-т хамтдаа хэрэглэнэ */
export function TaskRow({ task, showDel, showPri }: { task: Task; showDel?: boolean; showPri?: boolean }) {
  const { d, commit, p } = useStore();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: showDel ? '11px 12px' : '10px 12px', borderRadius: 11, background: 'var(--panel2)' }}>
      <button onClick={() => { task.done = !task.done; commit(); }} style={checkbox(task.done, p.a2, p.dark)}>
        {task.done ? '✓' : ''}
      </button>
      {showPri && <span style={{ width: 7, height: 7, flex: 'none', borderRadius: '50%', background: PCOL[task.pri] }} />}
      <span style={{ flex: 1, minWidth: 0, font: `500 12.5px ${FONT}`, textDecoration: task.done ? 'line-through' : 'none', opacity: task.done ? .5 : 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {task.t}
      </span>
      <span style={chip(ACOL[task.area])}>{task.area}</span>
      {showDel && (
        <button className="hv-red" onClick={() => { d.tasks = d.tasks.filter(x => x.id !== task.id); commit(); }}
          style={{ border: 'none', background: 'none', color: 'var(--tx2)', padding: '2px 4px', borderRadius: 6, display: 'inline-flex' }}>
          <IconX />
        </button>
      )}
    </div>
  );
}

/** Хэвшлийн нэг өдрийн нүд (жижиг 13px / том 38×29) */
export function habitCell(on: boolean, isToday: boolean, future: boolean, a2: string, cell: string, big: boolean): CSSProperties {
  const base: CSSProperties = {
    border: 'none', padding: 0, cursor: future ? 'default' : 'pointer',
    background: on ? a2 : cell, opacity: future ? .35 : 1,
    outline: isToday ? '2px solid ' + a2 + (on ? '00' : '88') : 'none', outlineOffset: 1
  };
  return big
    ? { ...base, width: '100%', maxWidth: 38, height: 29, borderRadius: 9, color: '#fff', font: '700 13px sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }
    : { ...base, width: 13, height: 13, borderRadius: 4, flex: 'none' };
}

/** Дэлгэц рүү үсрэх зураасан товч */
export function GoBtn({ onClick, hvClass, children }: { onClick: () => void; hvClass: string; children: React.ReactNode }) {
  return (
    <button className={hvClass} onClick={onClick}
      style={{ marginTop: 12, width: '100%', padding: 8, borderRadius: 10, border: '1px dashed var(--line)', background: 'none', color: 'var(--tx2)', font: `600 11px ${FONT}` }}>
      {children}
    </button>
  );
}

export const kvRow: CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: 8 };
export const kvKey: CSSProperties = { color: 'var(--tx2)' };
export const kvVal: CSSProperties = { fontFamily: MONO, fontWeight: 700 };

export const timeInputSt: CSSProperties = { ...inputSt, padding: '6px 8px', font: `600 12px ${MONO}`, width: 62, flex: 'none', textAlign: 'center' };

/** 24 цагийн HH:MM текст input — Windows-ийн 12ц локалиас хамаарахгүй */
export function TimeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [txt, setTxt] = useState(value);
  useEffect(() => setTxt(value), [value]);
  const done = () => {
    const m = /^(\d{1,2})[:.]?(\d{2})$/.exec(txt.trim());
    if (m) {
      const v = String(Math.min(23, parseInt(m[1]))).padStart(2, '0') + ':' + String(Math.min(59, parseInt(m[2]))).padStart(2, '0');
      setTxt(v);
      if (v !== value) onChange(v);
    } else setTxt(value);
  };
  return (
    <input value={txt} onChange={e => setTxt(e.target.value)} onBlur={done}
      onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
      placeholder="HH:MM" style={timeInputSt} />
  );
}

/** Жижиг устгах товч (hover-т улаан) */
export function DelBtn({ onClick, size = 11, opacity = .35 }: { onClick: () => void; size?: number; opacity?: number }) {
  return (
    <button className="hv-red" title="Устгах" onClick={onClick}
      style={{ border: 'none', background: 'none', color: 'var(--tx2)', opacity, padding: 2, display: 'inline-flex', borderRadius: 5, flex: 'none' }}>
      <IconX size={size} />
    </button>
  );
}
