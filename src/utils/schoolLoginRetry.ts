/**
 * Retry temporary EFIPS directory failures, never a Google identity or role
 * rejection. The actual email/role is checked again on every server request.
 */
export type SchoolLoginFailure = 'SCHOOL' | 'BLOCKED' | 'UNREGISTERED' | 'AUTH' | 'RETRYABLE' | 'FAILED';
const retryDelaysMs = [0, 400, 1000, 1800] as const;

export async function classifySchoolLoginFailure(error: unknown, data: unknown): Promise<SchoolLoginFailure> {
  const payload = data && typeof data === 'object' ? data as {code?: unknown} : null;
  let code = typeof payload?.code === 'string' ? payload.code : '';
  const context = error && typeof error === 'object' && 'context' in error
    ? (error as {context?: unknown}).context : null;
  const response = context && typeof context === 'object'
    ? context as {status?: number; json?: () => Promise<unknown>} : null;
  if (!code && typeof response?.json === 'function') {
    try {
      const parsed = await response.json();
      if (parsed && typeof parsed === 'object' && 'code' in parsed &&
        typeof (parsed as {code?: unknown}).code === 'string') {
        code = (parsed as {code: string}).code;
      }
    } catch { /* A failed network request may have no JSON body. */ }
  }
  if (code === 'SCHOOL_GOOGLE_REQUIRED') return 'SCHOOL';
  if (code === 'ACCOUNT_DISABLED') return 'BLOCKED';
  if (code === 'ACCOUNT_NOT_REGISTERED' || code === 'ACCOUNT_LINK_CONFLICT') return 'UNREGISTERED';
  if (code === 'AUTH_INVALID' || code === 'AUTH_REQUIRED') return 'AUTH';
  const status = response?.status;
  if (code === 'DIRECTORY_UNAVAILABLE' || code === 'SERVER_UNAVAILABLE' ||
    status === 408 || status === 429 || (typeof status === 'number' && status >= 500) ||
    (error && typeof status !== 'number')) return 'RETRYABLE';
  return 'FAILED';
}

export async function verifySchoolLoginWithRetry<T>(
  invoke: () => Promise<{data: T | null; error: unknown}>,
  wait: (ms: number) => Promise<void> =
    ms => new Promise(resolve => setTimeout(resolve, ms)),
): Promise<T> {
  for (let index = 0; index < retryDelaysMs.length; index++) {
    if (index > 0) await wait(retryDelaysMs[index]);
    let result: {data: T | null; error: unknown};
    try {
      result = await invoke();
    } catch (error) {
      result = {data: null, error};
    }
    if (!result.error && result.data) return result.data;
    const failure = await classifySchoolLoginFailure(result.error, result.data);
    // Permission denials must never be retried or interpreted as successful.
    if (failure !== 'RETRYABLE') throw new Error(failure);
  }
  throw new Error('RETRYABLE');
}
