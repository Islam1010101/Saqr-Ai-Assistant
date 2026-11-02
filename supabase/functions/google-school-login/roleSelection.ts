/**
 * Resolve EFIPS access only from the Google-verified email and school-controlled
 * staff/access records. The typed email or editable Google metadata NEVER decides
 * the user's authorization. Staff wins when a real approved account is present.
 */
export type SchoolLoginRole = 'student' | 'teacher' | 'admin';

export const normalizeSchoolEmail = (value: string) => String(value || '').trim().toLowerCase();

export function resolveSchoolLoginRole(
  email: string,
  staffRole: string | null | undefined,
  accessRole: string | null | undefined,
): SchoolLoginRole | null {
  const verifiedEmail = normalizeSchoolEmail(email);
  if (!/^[^@\s]+@falcon-school\.com$/.test(verifiedEmail)) return null;
  const studentCandidate = /^[0-9]{6,7}@falcon-school\.com$/.test(verifiedEmail);
  // A school administrator can designate a verified account as student-only.
  if (accessRole === 'student') return studentCandidate ? 'student' : null;
  if (staffRole === 'admin' || staffRole === 'teacher') return staffRole;
  // Teacher- or admin-only access requires a matching approved staff roster row.
  if (accessRole === 'teacher' || accessRole === 'admin') return null;
  return studentCandidate ? 'student' : null;
}
