/**
 * National Identity visibility: students and administrators keep their original
 * access; HR040 is the only teacher with this additional invitation.
 * The current school profile comes from the verified Google sign-in flow.
 */
type SchoolAccount = {
  student_id?: unknown;
  teacher_id?: unknown;
} | null | undefined;

export const isNationalIdentityTeacher = (role: unknown, teacherId: unknown): boolean =>
  role === 'teacher' &&
  typeof teacherId === 'string' &&
  teacherId.trim().toUpperCase() === 'HR040';

export const canAccessNationalIdentity = (role: unknown, account: SchoolAccount): boolean =>
  (role === 'student' && Boolean(account?.student_id)) ||
  (role === 'admin' && Boolean(account?.teacher_id)) ||
  isNationalIdentityTeacher(role, account?.teacher_id);
