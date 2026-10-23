import { supabase } from './supabase';
import type { ReadingPassport } from './readingPassport';

// Codes are roster identifiers, never credentials. The server accepts only
// bounded, unverified submissions and does not reveal any stored personal data.
const currentMonth = () => {
  const now = new Date();
  return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
};
const schoolProfile = () => {
  try {
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    const storedType = localStorage.getItem('user_type');
    const user_type = storedType === 'student' ? 'student' : storedType === 'teacher' || storedType === 'admin' ? 'teacher' : null;
    const school_user_id = String(user_type === 'student' ? user.student_id : user.teacher_id || '').trim();
    return user_type && /^[A-Za-z0-9-]{4,30}$/.test(school_user_id) ? { user_type, school_user_id } : null;
  } catch { return null; }
};
let latestPayload = '';
let syncTimer: ReturnType<typeof setTimeout> | null = null;
export const queueSchoolReadingSubmission = (passport: ReadingPassport): void => {
  const profile = schoolProfile();
  if (!profile) return;
  const month = currentMonth();
  const done = passport.completed
    .filter(key => (passport.completedOn[key] || '').startsWith(month))
    .slice(0, 100)
    .map(key => ({ book_key: key, completed_on: passport.completedOn[key] }));
  const payload = JSON.stringify({
    ...profile,
    goal_month: month + '-01',
    target_books: Math.max(1, Math.min(20, Math.round(passport.goal))),
    completed_books: done
  });
  if (payload === latestPayload) return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncTimer = null;
    // No unverified submission is treated as an official school achievement.
    void supabase.functions.invoke('submit-school-reading-progress', { body: JSON.parse(payload) })
      .then(({ error }) => {
        if (error) {
          console.warn('School reading submission was not accepted; local reading passport is unchanged.');
          return;
        }
        latestPayload = payload;
      })
      .catch(() => console.warn('School reading submission unavailable; device data preserved.'));
  }, 1500);
};
