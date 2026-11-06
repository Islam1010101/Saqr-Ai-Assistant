import { mkdtemp, writeFile, rm } from 'node:fs/promises';
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
    '--skipLibCheck', '--rewriteRelativeImportExtensions', 'true', '--allowImportingTsExtensions', 'true',
  ], { stdio: 'inherit' });
  if (compile.status !== 0) process.exitCode = compile.status || 1;
  else {
    const test = spawnSync(process.execPath, [path.join(directory, 'tests/pdfReader.test.js')], { stdio: 'inherit' });
    process.exitCode = test.status || 0;
  }
} finally { await rm(directory, { recursive: true, force: true }); }
