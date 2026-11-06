import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

/** Keep PDF fonts, character maps and image decoders on the same origin. */
export function pdfReaderAssets(): Plugin {
  const root = path.resolve('node_modules/pdfjs-dist');
  const folders = ['cmaps', 'standard_fonts', 'wasm'];
  return {
    name: 'efips-pdf-reader-assets',
    generateBundle() {
      for (const folder of folders) for (const file of fs.readdirSync(path.join(root, folder))) {
        const source = path.join(root, folder, file);
        if (fs.statSync(source).isFile()) this.emitFile({ type: 'asset', fileName: `pdfjs/${folder}/${file}`, source: fs.readFileSync(source) });
      }
    },
    configureServer(server) {
      server.middlewares.use('/pdfjs', (req, res, next) => {
        const parts = (req.url || '').split('?')[0].split('/').filter(Boolean);
        if (parts.length !== 2 || !folders.includes(parts[0]) || !/^[\w.-]+$/.test(parts[1])) return next();
        const file = path.join(root, ...parts);
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return next();
        res.setHeader('Content-Type', file.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream');
        fs.createReadStream(file).pipe(res);
      });
    },
  };
}
