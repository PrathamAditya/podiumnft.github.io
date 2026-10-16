// Copies the files the site actually uses into dist/ (leaving out the full-size source art),
// then fails if anything the HTML or CSS points at is missing.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
const FILES = [
  'index.html', 'style.css', 'font.css', 'script.js', 'lab.js', '_headers', '_redirects',
  'images/web', 'images/twitter.png', 'images/discord.png', 'noteworthy', 'nabana',
];

rmSync(out, { recursive: true, force: true });
for (const f of FILES) {
  mkdirSync(dirname(join(out, f)), { recursive: true });
  cpSync(join(root, f), join(out, f), { recursive: true });
}

const missing = [];
for (const file of ['index.html', 'style.css', 'font.css']) {
  const text = readFileSync(join(out, file), 'utf8');
  for (const m of text.matchAll(/(?:src|href)="([^"]*)"|url\(['"]?([^'")]+)['"]?\)/g)) {
    const ref = m[1] ?? m[2];
    if (!ref || /^(https?:|mailto:|data:|#)/.test(ref)) continue;
    if (!existsSync(normalize(join(out, dirname(file), ref.split(/[?#]/)[0])))) missing.push(`${file} -> ${ref}`);
  }
}
if (missing.length) {
  console.error(`Missing files referenced by the site:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
console.log(`Built dist/ from ${FILES.length} entries; every local reference resolves.`);
