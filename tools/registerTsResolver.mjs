import { register } from 'node:module';
// Test-only resolver; no changes to production Vercel imports or bundling.
register(new URL('./tsExtensionResolver.mjs', import.meta.url), import.meta.url);
