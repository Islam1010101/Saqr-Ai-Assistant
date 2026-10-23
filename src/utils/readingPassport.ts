import { useCallback, useEffect, useState } from 'react';
import { bookData } from '../../api/bookData';
import { queueSchoolReadingSubmission } from './schoolReadingSubmissions';
import { useCloudReader, loadCloudSaved, persistCloudSaved, loadReadingProgress, saveReadingGoal, saveReadingCompletion, currentReadingMonth } from './efipsCloud';

export type ReadingBook = {
  key: string;
  title: string;
  author: string;
  subject: string;
  format: 'physical' | 'ar' | 'en';
  href: string;
  shelf?: number;
  row?: number;
};
export type ReadingPassport = {
  saved: string[];
  completed: string[];
  completedOn: Record<string, string>;
  goal: number;
};
const EMPTY: ReadingPassport = { saved: [], completed: [], completedOn: {}, goal: 3 };
const EVENT = 'efips-reading-passport-change';
const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase();
const legacyKey = (title: string, author: string, shelf: number, row: number) =>
  [title, author, shelf, row].map(normalize).join('|');
export const physicalBookKey = (book: { id: string }) => 'physical:' + book.id;
export const digitalBookKey = (language: 'ar' | 'en', book: { id: string | number }) =>
  'digital:' + language + ':' + String(book.id);

export const physicalReadingCatalog: ReadingBook[] = bookData.map(book => ({
  key: physicalBookKey(book), title: book.title, author: book.author,
  subject: book.subject, format: 'physical' as const, href: '/search',
  shelf: book.shelf, row: book.row
}));
export const isValidReadingKey = (key: string): boolean =>
  physicalReadingCatalog.some(book => book.key === key) || /^digital:(ar|en):[a-zA-Z0-9_-]+$/.test(key);
const legacyPhysicalKeyMap = new Map(bookData.map(book =>
  [legacyKey(book.title, book.author, book.shelf, book.row), physicalBookKey(book)]
));

const safeList = (value: unknown): string[] =>
  Array.isArray(value) ? Array.from(new Set(value.filter((v): v is string => typeof v === 'string').map(key =>
    legacyPhysicalKeyMap.get(key) || key
  ).filter(key => isValidReadingKey(key)))).slice(0, 500) : [];

const getStorageKey = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    const role = localStorage.getItem('user_type') || '';
    const id = String(user.student_id || user.teacher_id || user.user_id || user.id || '').trim();
    return 'efips-reading-passport-v1:' + role + ':' + id;
  } catch { return 'efips-reading-passport-v1:guest'; }
};
const readFromDevice = (key: string): ReadingPassport => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || 'null');
    if (!data || typeof data !== 'object') return EMPTY;
    const saved = safeList(data.saved);
    const completed = safeList(data.completed);
    const completedOn: Record<string, string> = {};
    if (data.completedOn && typeof data.completedOn === 'object') {
      for (const [raw, date] of Object.entries(data.completedOn)) {
        const mappedKey = legacyPhysicalKeyMap.get(raw) || raw;
        if (completed.includes(mappedKey) && typeof date === 'string' && /^\d{4}-\d\d-\d\d$/.test(date)) completedOn[mappedKey] = date;
      }
    }
    return { saved, completed, completedOn, goal: Math.max(1, Math.min(20, Number(data.goal) || 3)) };
  } catch { return EMPTY; }
};
const saveToDevice = (key: string, next: ReadingPassport) => {
  try {
    localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }));
  } catch { /* Device storage may be blocked; never write sensitive data to Supabase. */ }
};
export const useReadingPassport = () => {
  const { user: cloudUser } = useCloudReader();
  // Keep each verified email account separate from locally entered school IDs.
  const storageKey = cloudUser ? 'efips-reading-passport-v1:cloud:' + cloudUser.id : getStorageKey();
  const [data, setData] = useState<ReadingPassport>(() => readFromDevice(storageKey));
  const [cloudReady, setCloudReady] = useState(false);
  useEffect(() => {
    // School codes identify unverified reports only; no private DB access is granted.
    if (!cloudUser) queueSchoolReadingSubmission(data);
  }, [cloudUser?.id, data]);

  useEffect(() => {
    if (!cloudUser) { setCloudReady(false); return; }
    let active = true;
    setCloudReady(false);
    const sync = async () => {
      try {
        const [remote, progress] = await Promise.all([loadCloudSaved(cloudUser.id), loadReadingProgress(cloudUser.id, currentReadingMonth())]);
        if (!active) return;
        const local = readFromDevice(storageKey);
        // Server-owned saved books are authoritative for verified accounts.
        // Do not auto-upload data associated with a self-asserted school ID.
        const verifiedCompleted = progress.completed.filter(item => isValidReadingKey(item.key));
        const completedOn = Object.fromEntries(verifiedCompleted.map(item => [item.key,item.date]));
        saveToDevice(storageKey, { ...local, saved: remote.filter(isValidReadingKey), completed: verifiedCompleted.map(item=>item.key), completedOn, goal: progress.goal ?? local.goal });
        if (active) setCloudReady(true);
      } catch (error) {
        console.warn('Cloud reading list unavailable; device list remains accessible.', error);
      }
    };
    void sync();
    return () => { active = false; };
  }, [cloudUser?.id, storageKey]);

  useEffect(() => {
    const update = () => setData(readFromDevice(storageKey));
    const onChange = (evt: Event) => {
      const detail = (evt as CustomEvent).detail;
      if (!detail?.key || detail.key === storageKey) update();
    };
    window.addEventListener(EVENT, onChange);
    window.addEventListener('storage', update);
    update();
    return () => { window.removeEventListener(EVENT, onChange); window.removeEventListener('storage', update); };
  }, [storageKey]);
  const change = useCallback((fn: (prev: ReadingPassport) => ReadingPassport) => {
    const previous = readFromDevice(storageKey);
    const next = fn(previous);
    setData(next);
    saveToDevice(storageKey, next);
  }, [storageKey]);
  const toggleSaved = useCallback((key: string) => {
    if (!isValidReadingKey(key)) return;
    const isCurrentlySaved = readFromDevice(storageKey).saved.includes(key);
    change(prev => ({ ...prev, saved: prev.saved.includes(key) ?
      prev.saved.filter(item => item !== key) : [...prev.saved, key] }));
    if (cloudUser && cloudReady) {
      void persistCloudSaved(cloudUser.id, key, !isCurrentlySaved).catch(error => {
        console.warn('Could not synchronize reading list; device copy preserved.', error);
      });
    }
  }, [change, storageKey, cloudUser?.id, cloudReady]);
  const toggleCompleted = useCallback((key: string) => {
    if (!isValidReadingKey(key)) return;
    const before = readFromDevice(storageKey).completed.includes(key);
    const today = [new Date().getFullYear(), String(new Date().getMonth()+1).padStart(2,'0'), String(new Date().getDate()).padStart(2,'0')].join('-');
    change(prev => {
      const done = prev.completed.includes(key);
      const completedOn = { ...prev.completedOn };
      if (done) delete completedOn[key];
      else completedOn[key] = today;
      return { ...prev, completed: done ? prev.completed.filter(item => item !== key) :
        [...prev.completed, key], completedOn };
    });
    if(cloudUser && cloudReady) void saveReadingCompletion(cloudUser.id,key,before?null:today).catch(error=>console.warn('Could not synchronize reading completion',error));
  }, [change,storageKey,cloudUser?.id,cloudReady]);
  const setGoal = useCallback((goal: number) => {
    const target = Math.max(1, Math.min(20, Math.round(goal)));
    change(prev => ({...prev,goal:target}));
    if(cloudUser && cloudReady) void saveReadingGoal(cloudUser.id,currentReadingMonth(),target).catch(error=>console.warn('Could not synchronize goal',error));
  }, [change,cloudUser?.id,cloudReady]);
  return { data, toggleSaved, toggleCompleted, setGoal, cloudUser, cloudReady };
};
