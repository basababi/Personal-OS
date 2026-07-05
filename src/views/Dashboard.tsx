import React from 'react';
import { useStore } from '../data/store';
import { Card, SecLabel, Bar, Screen } from '../components/ui';
import { TaskRow, habitCell, GoBtn } from '../components/bits';
import { FONT, MONO, ACOL } from '../theme';
import { WDAYS, DAY_NAMES, td } from '../lib/dates';
import { taskStats, habitStats, blockNow, lastDays, weekMinutes, roadStats, wordsToday, engToday, engLevel } from '../lib/derive';

export function Dashboard() {
  const { d, commit, nav, now, p } = useStore();
  const ts = taskStats(d);
  const hs = habitStats(d);
  const road = roadStats(d);
  const wm = weekMinutes(d);
  const wt = wordsToday(d);
  const lvl = engLevel(d);

  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const dateLine = WDAYS[now.getDay()] + ' · ' + now.getFullYear() + ' оны ' + (now.getMonth() + 1) + '-р сарын ' + now.getDate();
  const h = now.getHours();
  const greeting = h < 5 ? 'Сайхан шөнө' : h < 12 ? 'Өглөөний мэнд' : h < 18 ? 'Өдрийн мэнд' : 'Оройн мэнд';

  // 14 хоногийн бодит график
  const days14 = lastDays(d, 14);
  const allMax = Math.max(...days14.map(x => x.eng), ...days14.map(x => x.ml), 1);
  const pts = (get: (x: { eng: number; ml: number }) => number) =>
    days14.map((x, i) => (4 + i * (292 / 13)).toFixed(1) + ',' + (84 - get(x) / allMax * 74).toFixed(1)).join(' ');

  const topSorted = ts.todays.slice().sort((a, b) => Number(a.done) - Number(b.done) || b.pri - a.pri);
  const topTasks = topSorted.filter(t => !t.done).slice(0, 3).concat(topSorted.filter(t => t.done)).slice(0, 3);

  const activeTopics = d.road.filter(r => r.st === 1).slice(0, 3).map(r => r.t);
  const pillSt: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, font: `600 10.5px ${MONO}`, padding: '6px 11px', borderRadius: 99, border: '1px solid var(--line)', color: 'var(--tx2)' };
  const dot = (c: string): React.CSSProperties => ({ width: 6, height: 6, borderRadius: 2, background: c });

  return (
    <Screen gap={18}>
      {/* Hero */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'stretch', background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 18, padding: '26px 28px', boxShadow: '0 1px 2px rgba(20,15,40,.04)' }}>
        <div style={{ flex: '1 1 340px', minWidth: 0 }}>
          <div style={{ font: `600 10px ${MONO}`, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--tx2)' }}>{dateLine}</div>
          <h1 style={{ margin: '10px 0 8px', font: `800 32px/1.15 ${FONT}`, letterSpacing: '-.02em' }}>{greeting}, {d.userName}.</h1>
          <p style={{ margin: 0, font: `400 14px/1.5 ${FONT}`, color: 'var(--tx2)' }}>
            Өнөөдрийн {ts.total - ts.done} даалгавар хүлээгдэж байна. Систем чинь ажиллаж байна — үргэлжлүүл.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <span style={pillSt}><span style={dot(p.a1)} />9 САРЫН СИСТЕМ</span>
            <span style={pillSt}><span style={dot(p.a2)} />B2 ЗОРИЛГО</span>
            <span style={pillSt}><span style={dot(p.a3)} />MLOPS ЗАМ</span>
          </div>
        </div>
        <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', paddingLeft: 26, borderLeft: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ font: `700 46px ${MONO}`, letterSpacing: '-.03em' }}>{hh}:{mm}</span>
            <span style={{ font: `600 16px ${MONO}`, color: 'var(--acc1)', animation: 'osPulse 2s infinite' }}>{ss}</span>
          </div>
          <div style={{ font: `600 10px ${MONO}`, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--tx2)', marginTop: 2 }}>{blockNow(d, now)}</div>
        </div>
      </div>

      {/* Мөр 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 18 }}>
        <Card>
          <SecLabel color={p.a1} right={`${ts.done}/${ts.total}`} mb={14}>Өнөөдрийн фокус</SecLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topTasks.length === 0 && (
              <div style={{ font: `500 12px ${FONT}`, color: 'var(--tx2)', padding: '10px 12px', borderRadius: 11, background: 'var(--panel2)' }}>
                Даалгавар алга — төлөвлөгчөөс нэм.
              </div>
            )}
            {topTasks.map(t => <TaskRow key={t.id} task={t} />)}
          </div>
          <GoBtn hvClass="hv-go-acc1" onClick={() => nav('planner')}>Бүх даалгавар →</GoBtn>
        </Card>

        <Card>
          <SecLabel color={p.a2} right={<span style={{ color: p.a2 }}>{hs.weekScore}%</span>} mb={14}>Хэвшил · 7 хоног</SecLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {d.habits.map(hb => (
              <div key={hb.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ flex: 1, minWidth: 0, font: `500 11.5px ${FONT}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--tx)' }}>{hb.name}</span>
                {DAY_NAMES.map((dn, di) => {
                  const on = !!d.habit.grid[hb.id + '-' + di];
                  const future = di > hs.todayIdx;
                  return (
                    <button key={di} title={dn}
                      onClick={() => { if (future) return; const k = hb.id + '-' + di; d.habit.grid[k] = !d.habit.grid[k]; commit(); }}
                      style={habitCell(on, di === hs.todayIdx, future, p.a2, p.cell, false)} />
                  );
                })}
              </div>
            ))}
          </div>
          <GoBtn hvClass="hv-go-acc2" onClick={() => nav('goals')}>Бүтэн tracker →</GoBtn>
        </Card>

        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <SecLabel color={p.a3} right={`${wm.totalH}ц / 7 хон`} mb={10}>Судалгаа · 14 хоног</SecLabel>
          <svg viewBox="0 0 300 88" style={{ width: '100%', height: 'auto', flex: 1 }}>
            <line x1="4" y1="84" x2="296" y2="84" stroke="var(--line)" strokeWidth="1" />
            <polyline points={pts(x => x.ml)} fill="none" stroke="var(--acc1)" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
            <polyline points={pts(x => x.eng)} fill="none" stroke="var(--acc2)" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: `500 10.5px ${MONO}`, color: 'var(--tx2)' }}><span style={dot(p.a1)} />MLOps {wm.ml}м</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: `500 10.5px ${MONO}`, color: 'var(--tx2)' }}><span style={dot(p.a2)} />English {wm.eng}м</span>
          </div>
        </Card>
      </div>

      {/* Мөр 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 18 }}>
        <Card>
          <SecLabel color={p.a1} mb={14}>9 сарын milestones</SecLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {d.goals.map(g => (
              <div key={g.id}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ font: `600 12.5px ${FONT}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.t}</span>
                  <span style={{ font: `500 10px ${MONO}`, color: 'var(--tx2)', flex: 'none' }}>{g.target}</span>
                  <span style={{ marginLeft: 'auto', font: `700 11px ${MONO}`, color: ACOL[g.area] }}>{g.pct}%</span>
                </div>
                <div style={{ marginTop: 6 }}><Bar pct={g.pct} color={ACOL[g.area]} /></div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SecLabel color={p.a2}>English өнөөдөр</SecLabel>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ font: `700 30px ${MONO}`, color: 'var(--acc2)' }}>{wt}</span>
            <span style={{ font: `500 12px ${FONT}`, color: 'var(--tx2)' }}>/ 5 шинэ үг</span>
          </div>
          <div style={{ display: 'flex', gap: 4, margin: '10px 0 14px' }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i < wt ? p.a2 : p.cell }} />
            ))}
          </div>
          <div style={{ font: `500 11.5px/1.5 ${FONT}`, color: 'var(--tx2)' }}>
            Түвшин: <b style={{ color: 'var(--acc2)' }}>{lvl.name}</b> · {engToday(d)} мин суралцсан
          </div>
          <button className="hv-tint2" onClick={() => nav('english')}
            style={{ marginTop: 12, width: '100%', padding: 8, borderRadius: 10, border: 'none', background: 'rgba(29,158,117,.12)', color: 'var(--acc2)', font: `600 11.5px ${FONT}` }}>
            Үг нэмэх →
          </button>
        </Card>

        <Card>
          <SecLabel color={p.a1}>MLOps өнөөдөр</SecLabel>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ font: `700 30px ${MONO}`, color: 'var(--acc1)' }}>{road.pct}%</span>
            <span style={{ font: `500 12px ${FONT}`, color: 'var(--tx2)' }}>roadmap явц</span>
          </div>
          <div style={{ marginTop: 10, font: `600 10px ${MONO}`, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--tx2)' }}>Явагдаж буй</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 7 }}>
            {activeTopics.length === 0 && (
              <div style={{ font: `500 12px ${FONT}`, color: 'var(--tx2)', padding: '7px 10px', borderRadius: 9, background: 'var(--panel2)' }}>
                Roadmap-аас сэдэв эхлүүл →
              </div>
            )}
            {activeTopics.map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 9, background: 'var(--panel2)', font: `500 12px ${FONT}` }}>
                <span style={{ width: 7, height: 7, flex: 'none', borderRadius: '50%', background: 'var(--acc3)' }} />{t}
              </div>
            ))}
          </div>
          <button className="hv-tint1" onClick={() => nav('mlops')}
            style={{ marginTop: 12, width: '100%', padding: 8, borderRadius: 10, border: 'none', background: 'rgba(127,119,221,.12)', color: 'var(--acc1)', font: `600 11.5px ${FONT}` }}>
            Roadmap →
          </button>
        </Card>
      </div>

      {/* Quote */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px', borderRadius: 16, background: 'var(--panel)', border: '1px solid var(--line)' }}>
        <span style={{ width: 8, height: 8, flex: 'none', borderRadius: 2, background: 'var(--acc1)', transform: 'rotate(45deg)' }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ font: `600 14px ${FONT}` }}>«Систем &gt; зорилго. Identity-гээ бүтээ — үр дүн нь дагана.»</div>
          <div style={{ font: `500 11px ${MONO}`, color: 'var(--tx2)', marginTop: 3 }}>Дүрэм 1 · Өглөө утасгүй эхний 30 минут — энэ л хамгийн том ялалт.</div>
        </div>
      </div>
    </Screen>
  );
}
