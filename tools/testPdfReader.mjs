import { mkdtemp, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

// Exercise emitted Node ESM too: browser bundling alone cannot validate API imports.
const require = createRequire(import.meta.url);
const directory = await mkdtemp(path.join(os.tmpdir(), 'efips-pdf-tests-'));
try {
  await writeFile(path.join(directory, 'package.json'), JSON.stringify({ type: 'module' }));
  const compile = spawnSync(process.execPath, [require.resolve('typescript/lib/tsc.js'),
    'tests/pdfReader.test.ts', '--rootDir', '.', '--outDir', directory,
    '--module', 'ESNext', '--moduleResolution', 'Bundler', '--target', 'ES2022',
    '--allowJs', 'true',
    '--skipLibCheck', '--rewriteRelativeImportExtensions', 'true', '--allowImportingTsExtensions', 'true',
  ], { stdio: 'inherit' });
  if (compile.status !== 0) process.exitCode = compile.status || 1;
  else {
    // TypeScript's Bundler module resolution preserves extensionless relative
    // specifiers. Node ESM requires the emitted .js extension in this test
    // sandbox; rewrite emitted imports only, never application sources.
    const rewriteEmittedImports = async folder => {
      for (const entry of await readdir(folder, { withFileTypes: true })) {
        const filename = path.join(folder, entry.name);
        if (entry.isDirectory()) {
          await rewriteEmittedImports(filename);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
          const original = await readFile(filename, 'utf8');
          const updated = original.replace(
            /(\\b(?:from\\s*|import\\s*\\(\\s*|import\\s*)['"])(\\.\\.?\\/[^'"]+)(['"])/g,
            (whole, prefix, specifier, suffix) =>
              path.extname(specifier) ? whole : `${prefix}${specifier}.js${suffix}`
          );
          if (updated !== original) await writeFile(filename, updated);
        }
      }
    };
    await rewriteEmittedImports(directory);
    const test = spawnSync(process.execPath, [path.join(directory, 'tests/pdfReader.test.js')], { stdio: 'inherit' });
    process.exitCode = test.status || 0;
  }
} finally { await rm(directory, { recursive: true, force: true }); }
