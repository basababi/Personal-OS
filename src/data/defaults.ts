import { AppData } from '../types';
import { td, monday } from '../lib/dates';

// Басбишийн бодит эхлэлийн дата — прототипын демо тоонуудыг хассан,
// зорилго/roadmap/дүрэм зэрэг нь хэрэглэгчийн жинхэнэ төлөвлөгөө.
export function defaults(): AppData {
  const TD = td(0);
  return {
    v: 2,
    theme: 'light',
    userName: 'Басбиш',
    tasks: [
      { id: 1, t: 'English — 5 шинэ үг нэмэх', area: 'English', pri: 2, done: false, date: TD },
      { id: 2, t: 'MLOps — өнөөдрийн сэдвээ үзэх', area: 'MLOps', pri: 2, done: false, date: TD },
      { id: 3, t: 'Гүйлт / дасгал 20 мин', area: 'Хувийн', pri: 1, done: false, date: TD }
    ],
    routineSteps: [
      'Орноосоо босох — утасгүй 30 мин',
      'Ус уух (1 шил)',
      'Нүүр угаах / бэлтгэх',
      'Дасгал / гүйх (20 мин)',
      'Өглөөний цай',
      'Өдрийн 3 зорилго бичих'
    ],
    routine: { date: TD, items: [false, false, false, false, false, false] },
    habits: [
      { id: 1, name: 'Утасгүй өглөө' },
      { id: 2, name: 'English 30 мин' },
      { id: 3, name: 'MLOps судалгаа' },
      { id: 4, name: 'Дасгал / гүйлт' },
      { id: 5, name: 'Ном 10 хуудас' },
      { id: 6, name: 'Оройн scroll-гүй' },
      { id: 7, name: 'Ус 2Л' }
    ],
    habit: { week: monday(), grid: {}, history: [] },
    goals: [
      { id: 1, t: 'English B2 түвшин', area: 'English', target: '2027-03', pct: 20, ms: 'A2 → B1 → B2' },
      { id: 2, t: 'MLOps 1-р үе шат', area: 'MLOps', target: '2026-09', pct: 15, ms: 'Docker · CI/CD · Cloud' },
      { id: 3, t: 'Анхны freelance орлого', area: 'Ажил', target: '2026-09', pct: 5, ms: 'Portfolio · Upwork · 1 клиент' },
      { id: 4, t: 'Өглөөний routine систем', area: 'Хувийн', target: '2026-07', pct: 30, ms: 'Босох · Scroll-гүй · Дасгал' }
    ],
    road: [
      { id: 1, t: 'Linux CLI', ph: 0, cat: 'Linux', st: 0 },
      { id: 2, t: 'Python гүнзгийрүүлэх', ph: 0, cat: 'Python', st: 0 },
      { id: 3, t: 'Git ба GitHub', ph: 0, cat: 'Git', st: 0 },
      { id: 4, t: 'Docker', ph: 0, cat: 'Docker', st: 0 },
      { id: 5, t: 'SQL суурь', ph: 0, cat: 'SQL', st: 0 },
      { id: 6, t: 'AWS үндэс (EC2 · S3)', ph: 1, cat: 'Cloud', st: 0 },
      { id: 7, t: 'Networking суурь', ph: 1, cat: 'Cloud', st: 0 },
      { id: 8, t: 'Terraform', ph: 1, cat: 'IaC', st: 0 },
      { id: 9, t: 'FastAPI сервис', ph: 2, cat: 'API', st: 0 },
      { id: 10, t: 'ML pipeline бүтээх', ph: 2, cat: 'ML', st: 0 },
      { id: 11, t: 'Model serving', ph: 2, cat: 'ML', st: 0 },
      { id: 12, t: 'CI/CD — GitHub Actions', ph: 3, cat: 'CI/CD', st: 0 },
      { id: 13, t: 'Kubernetes', ph: 3, cat: 'K8s', st: 0 },
      { id: 14, t: 'Monitoring — Grafana', ph: 3, cat: 'Хяналт', st: 0 },
      { id: 15, t: 'MLflow', ph: 3, cat: 'Tracking', st: 0 }
    ],
    projects: [
      { id: 1, t: 'AURA CHILL брэнд сайт', stack: ['React', 'Дизайн'], st: 0 },
      { id: 2, t: 'ML deploy демо', stack: ['FastAPI', 'Docker'], st: 0 },
      { id: 3, t: 'Portfolio v1', stack: ['React', 'GitHub Pages'], st: 0 }
    ],
    words: [],
    grammar: [
      {
        lv: 'A2',
        items: [
          { t: 'Present / Past tenses', on: false },
          { t: 'Articles (a / the)', on: false },
          { t: 'Prepositions', on: false },
          { t: 'Basic questions', on: false }
        ]
      },
      {
        lv: 'B1',
        items: [
          { t: 'Perfect tenses', on: false },
          { t: 'Conditionals 1 · 2', on: false },
          { t: 'Passive voice', on: false }
        ]
      },
      {
        lv: 'B2',
        items: [
          { t: 'Бүх conditionals', on: false },
          { t: 'Relative clauses', on: false },
          { t: 'Reported speech', on: false },
          { t: 'Complex sentences', on: false }
        ]
      }
    ],
    resources: [
      { id: 1, t: 'BBC Learning English', k: 'ПОДКАСТ' },
      { id: 2, t: '6 Minute English', k: 'ПОДКАСТ' },
      { id: 3, t: 'EnglishPod101', k: 'ВИДЕО' },
      { id: 4, t: 'English Grammar in Use · B1', k: 'НОМ' }
    ],
    engLog: { date: TD, mins: { 'Сонсох': 0, 'Унших': 0, 'Дүрэм': 0, 'Үгийн сан': 0, 'Ярих': 0 } },
    mlLog: { date: TD, mins: 0 },
    history: {},
    blocks: [
      { id: 1, s: '07:00', e: '08:00', t: 'Өглөөний routine' },
      { id: 2, s: '08:00', e: '09:00', t: 'Бэлтгэл / зам' },
      { id: 3, s: '09:00', e: '18:00', t: 'Их сургууль / ажил' },
      { id: 4, s: '18:00', e: '19:00', t: 'Хоол / амралт' },
      { id: 5, s: '19:00', e: '19:45', t: 'English study' },
      { id: 6, s: '19:45', e: '20:00', t: 'Завсарлага' },
      { id: 7, s: '20:00', e: '21:30', t: 'MLOps / Төсөл' },
      { id: 8, s: '21:30', e: '22:00', t: 'Review + маргаашийн план' },
      { id: 9, s: '22:30', e: '23:59', t: 'Унтах' }
    ],
    reminders: {
      enabled: true,
      items: [
        { id: 1, time: '07:00', title: 'Өглөөний routine 🌅', body: 'Утасгүй 30 минут · ус уу · өдрийн 3 зорилгоо бич.', days: [], enabled: true, view: 'planner', smart: 'routine' },
        { id: 2, time: '19:00', title: 'English цаг', body: '5 шинэ үг + 30 минут. B2 зорилго руугаа нэг алхам.', days: [], enabled: true, view: 'english', smart: 'english' },
        { id: 3, time: '20:00', title: 'MLOps блок', body: 'Гүн ажлын 90 минут эхэллээ — roadmap-аа урагшлуул.', days: [], enabled: true, view: 'mlops', smart: 'mlops' },
        { id: 4, time: '21:30', title: 'Оройн review', body: 'Хэвшлээ тэмдэглэ · маргаашийн 3 зорилгоо бич.', days: [], enabled: true, view: 'goals' },
        { id: 5, time: '22:15', title: 'Унтах бэлтгэл 🌙', body: 'Scroll-гүй орой. 22:30 — гэрэл унтраана.', days: [], enabled: true, view: 'home' },
        { id: 6, time: '20:00', title: 'Долоо хоногийн review', body: '7 хоногоо дүгнэ: юу бүтсэн, юу бүтсэнгүй, дараагийн 3 гол зүйл.', days: [6], enabled: true, view: 'goals' }
      ]
    },
    settings: { closeToTray: true }
  };
}

/** Хадгалагдсан датаг дефолттой нийлүүлж, дутуу талбаруудыг нөхнө */
export function migrate(saved: Partial<AppData> | null): AppData {
  const base = defaults();
  if (!saved || typeof saved !== 'object') return base;
  const merged: AppData = { ...base, ...saved } as AppData;
  merged.v = 2;
  // Гүн обьектуудыг тусад нь баталгаажуулна
  merged.settings = { ...base.settings, ...(saved.settings || {}) };
  merged.reminders = {
    enabled: saved.reminders?.enabled !== false,
    items: Array.isArray(saved.reminders?.items) ? saved.reminders!.items : base.reminders.items
  };
  merged.history = saved.history && typeof saved.history === 'object' ? saved.history : {};
  merged.mlLog = saved.mlLog && typeof saved.mlLog === 'object' ? saved.mlLog : base.mlLog;
  merged.routineSteps = Array.isArray(saved.routineSteps) && saved.routineSteps.length ? saved.routineSteps : base.routineSteps;
  merged.blocks = Array.isArray(saved.blocks) && saved.blocks.length ? saved.blocks : base.blocks;
  merged.resources = Array.isArray(saved.resources) ? saved.resources : base.resources;
  if (!Array.isArray(merged.routine?.items)) merged.routine = base.routine;
  // routine items тоо алхмуудтай тэнцүү байх ёстой
  if (merged.routine.items.length !== merged.routineSteps.length) {
    merged.routine.items = merged.routineSteps.map((_, i) => merged.routine.items[i] || false);
  }
  // Хуучин схемд goal/road/project/word-д id байгаагүй — нөхнө
  merged.goals = (merged.goals || []).map((g, i) => ({ ...g, id: g.id ?? i + 1 }));
  merged.road = (merged.road || []).map((r, i) => ({ ...r, id: r.id ?? i + 1 }));
  merged.projects = (merged.projects || []).map((p, i) => ({ ...p, id: p.id ?? i + 1 }));
  merged.words = (merged.words || []).map((w, i) => ({ ...w, id: w.id ?? i + 1 }));
  return merged;
}
