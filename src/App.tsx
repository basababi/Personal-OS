import React, { useEffect } from 'react';
import { useStore } from './data/store';
import { cssVars, FONT } from './theme';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { Planner } from './views/Planner';
import { Mlops } from './views/Mlops';
import { English } from './views/English';
import { Goals } from './views/Goals';
import { Settings } from './views/Settings';

export default function App() {
  const { view, p } = useStore();

  useEffect(() => {
    document.body.style.background = p.bg;
  }, [p.bg]);

  return (
    <div style={cssVars(p)}>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', fontFamily: FONT, transition: 'background .35s,color .35s' }}>
        <Sidebar />
        <main key={view} style={{ flex: 1, minWidth: 0, padding: '26px 28px 60px', maxWidth: 1160, margin: '0 auto' }}>
          {view === 'home' && <Dashboard />}
          {view === 'planner' && <Planner />}
          {view === 'mlops' && <Mlops />}
          {view === 'english' && <English />}
          {view === 'goals' && <Goals />}
          {view === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}
