import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { AppData, View } from '../types';
import { defaults, migrate } from './defaults';
import { td } from '../lib/dates';
import { rollover } from '../lib/rollover';
import { palette, Palette } from '../theme';

interface Store {
  d: AppData;
  /** d-г шууд mutate хийсний дараа дуудна — UI шинэчилж, диск рүү хадгална */
  commit: () => void;
  view: View;
  nav: (v: View) => void;
  now: Date;
  p: Palette;
  ready: boolean;
  replaceData: (next: AppData) => void;
}

const Ctx = createContext<Store | null>(null);

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('StoreProvider missing');
  return s;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => defaults());
  const [view, setView] = useState<View>('home');
  const [now, setNow] = useState(() => new Date());
  const [ready, setReady] = useState(false);
  const dRef = useRef(data);
  dRef.current = data;
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback((immediate = false) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    const doSave = () => window.pos?.saveData(JSON.parse(JSON.stringify(dRef.current)));
    if (immediate) doSave();
    else saveTimer.current = setTimeout(doSave, 400);
  }, []);

  const commit = useCallback(() => {
    setData({ ...dRef.current });
    persist();
  }, [persist]);

  const replaceData = useCallback((next: AppData) => {
    const m = migrate(next);
    rollover(m);
    dRef.current = m;
    setData(m);
    persist(true);
  }, [persist]);

  // Анхны ачаалт
  useEffect(() => {
    let alive = true;
    (async () => {
      const saved = window.pos ? await window.pos.loadData() : null;
      if (!alive) return;
      const m = migrate(saved);
      rollover(m);
      dRef.current = m;
      setData(m);
      setReady(true);
      window.pos?.saveData(JSON.parse(JSON.stringify(m)));
    })();
    return () => { alive = false; };
  }, []);

  // Цаг — секунд тутам; өдөр солигдохыг мөн шалгана
  useEffect(() => {
    const dayRef = { current: td(0) };
    const t = setInterval(() => {
      setNow(new Date());
      if (td(0) !== dayRef.current) {
        dayRef.current = td(0);
        if (rollover(dRef.current)) {
          setData({ ...dRef.current });
          persist(true);
        }
      }
    }, 1000);
    return () => clearInterval(t);
  }, [persist]);

  // Main процессоос ирэх мессежүүд
  useEffect(() => {
    const un1 = window.pos?.onNavigate(v => setView(v));
    const un2 = window.pos?.onRemindersEnabled(val => {
      dRef.current.reminders.enabled = val;
      setData({ ...dRef.current });
    });
    const un3 = window.pos?.onShotTheme(t => {
      dRef.current.theme = t;
      setData({ ...dRef.current });
    });
    const flush = () => window.pos?.saveData(JSON.parse(JSON.stringify(dRef.current)));
    window.addEventListener('beforeunload', flush);
    return () => { un1?.(); un2?.(); un3?.(); window.removeEventListener('beforeunload', flush); };
  }, []);

  const p = palette(data.theme === 'dark');

  return (
    <Ctx.Provider value={{ d: data, commit, view, nav: setView, now, p, ready, replaceData }}>
      {children}
    </Ctx.Provider>
  );
}
