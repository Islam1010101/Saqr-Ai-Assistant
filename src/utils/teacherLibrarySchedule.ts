/**
 * Read-only presentation helper for the EFIPS weekly library timetable.
 * Booking ownership comes from the saved teacher_id (library_schedule.user_id),
 * never just a teacher's display name, which is not unique.
 */
export type TeacherLibrarySlot = {
  id: string;
  user_id: string | null;
  teacher: string | null;
  subject: string | null;
  grade: string | null;
};

const dayOrder: Record<string,number> = {
  'الأحد':0, 'sunday':0,
  'الإثنين':1, 'الاثنين':1, 'monday':1,
  'الثلاثاء':2, 'tuesday':2,
  'الأربعاء':3, 'الاربعاء':3, 'wednesday':3,
  'الخميس':4, 'thursday':4,
  'الجمعة':5, 'friday':5,
  'السبت':6, 'saturday':6,
};

const clean = (value: unknown) => String(value ?? '').normalize('NFKC').trim().toLowerCase();

export function getTeacherLibrarySlots(
  rows: readonly TeacherLibrarySlot[],
  teacherId: string | null | undefined,
): TeacherLibrarySlot[] {
  const id = clean(teacherId);
  if (!id) return [];
  const unique = new Map<string,TeacherLibrarySlot>();
  for (const row of rows) {
    if (!row || clean(row.user_id) !== id || !row.id) continue;
    // The existing booking page stores records as `${day}_${period}`.
    const separator = row.id.lastIndexOf('_');
    const day = separator >= 0 ? row.id.slice(0,separator) : '';
    const period = separator >= 0 ? Number(row.id.slice(separator+1)) : NaN;
    if (!(clean(day) in dayOrder) || !Number.isInteger(period) || period < 1 || period > 8) continue;
    unique.set(row.id,row);
  }
  return [...unique.values()].sort((a,b) => {
    const parse = (row:TeacherLibrarySlot) => {
      const i=row.id.lastIndexOf('_');
      return dayOrder[clean(row.id.slice(0,i))]*100 + Number(row.id.slice(i+1));
    };
    return parse(a)-parse(b);
  });
}
