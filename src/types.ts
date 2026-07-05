export type Area = 'MLOps' | 'English' | 'Сургууль' | 'Ажил' | 'Хувийн';
export type View = 'home' | 'planner' | 'mlops' | 'english' | 'goals' | 'settings';

export interface Task {
  id: number;
  t: string;
  area: Area;
  pri: 0 | 1 | 2;
  done: boolean;
  date: string; // YYYY-MM-DD
}

export interface Habit { id: number; name: string }

export interface Goal {
  id: number;
  t: string;
  area: Area;
  target: string; // '2026-09' гэх мэт
  pct: number;
  ms: string; // milestones текст
}

export interface RoadTopic {
  id: number;
  t: string;
  ph: 0 | 1 | 2 | 3;
  cat: string;
  st: 0 | 1 | 2; // эхлээгүй / явагдаж буй / дууссан
}

export interface Project { id: number; t: string; stack: string[]; st: 0 | 1 | 2 }

export interface Word {
  id: number;
  en: string;
  mn: string;
  ex: string;
  st: 0 | 1 | 2; // Шинэ / Сурч буй / Эзэмшсэн
  date: string;
}

export interface GrammarLevel { lv: string; items: { t: string; on: boolean }[] }

export interface TimeBlock { id: number; s: string; e: string; t: string }

export type SmartKind = 'routine' | 'english' | 'mlops';

export interface Reminder {
  id: number;
  time: string;   // 'HH:MM'
  title: string;
  body: string;
  days: number[]; // Даваа=0 … Ням=6; хоосон = өдөр бүр
  enabled: boolean;
  view?: View;
  smart?: SmartKind; // аль хэдийн хийсэн бол алгасна
}

export interface DayLog { eng: number; ml: number; score?: number }

export interface AppData {
  v: 2;
  theme: 'light' | 'dark';
  userName: string;
  tasks: Task[];
  routineSteps: string[];
  routine: { date: string; items: boolean[] };
  habits: Habit[];
  habit: { week: string; grid: Record<string, boolean>; history: number[] };
  goals: Goal[];
  road: RoadTopic[];
  projects: Project[];
  words: Word[];
  grammar: GrammarLevel[];
  engLog: { date: string; mins: Record<string, number> };
  mlLog: { date: string; mins: number };
  history: Record<string, DayLog>; // бодит өдөр тутмын судалгааны түүх
  blocks: TimeBlock[];
  reminders: { enabled: boolean; items: Reminder[] };
  settings: { closeToTray: boolean };
}

// preload API
declare global {
  interface Window {
    pos?: {
      loadData: () => Promise<AppData | null>;
      saveData: (d: AppData) => void;
      exportData: () => Promise<string | null>;
      importData: () => Promise<(AppData & { __error?: string }) | null>;
      getAutoLaunch: () => Promise<boolean>;
      setAutoLaunch: (b: boolean) => Promise<boolean>;
      testNotify: () => void;
      appInfo: () => Promise<{ version: string; dataFile: string; isDev: boolean }>;
      onNavigate: (cb: (v: View) => void) => () => void;
      onRemindersEnabled: (cb: (v: boolean) => void) => () => void;
      onShotTheme: (cb: (t: 'light' | 'dark') => void) => () => void;
    };
  }
}
