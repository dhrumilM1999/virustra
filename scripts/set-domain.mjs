// Replaces the placeholder domain in canonical/OG/sitemap/robots with your real one.
// Usage: npm run set-domain -- https://www.virustra.in
import { readFileSync, writeFileSync } from 'node:fs';

const arg = process.argv[2];
if (!arg || !/^https?:\/\/[^/\s]+$/.test(arg)) {
  console.error('Usage: npm run set-domain -- https://your-real-domain.com   (no trailing slash)');
  process.exit(1);
}
const files = ['public/index.html', 'public/robots.txt', 'public/sitemap.xml'];
for (const f of files) {
  const before = readFileSync(f, 'utf8');
  const after = before.replaceAll('https://your-domain.com', arg);
  writeFileSync(f, after);
  console.log(`${f}: ${before === after ? 'no change' : 'updated'}`);
}
