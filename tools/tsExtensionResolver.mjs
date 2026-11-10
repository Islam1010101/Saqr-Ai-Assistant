/** Node 22 test-only ESM shim for extensionless relative TypeScript imports.
 * Production Vite / Vercel module resolution is unchanged.
 */
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND'
      || !/^\.\.?\//.test(specifier)
      || /\.[a-z0-9]+$/i.test(specifier)) throw error;
    return nextResolve(`${specifier}.ts`, context);
  }
}
