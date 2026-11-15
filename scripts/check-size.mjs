// Size gate for the production build: dist/ must stay under 1 MiB.
// Uses only Node built-ins; no dependencies.
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SIZE_LIMIT = 1_048_576;

/**
 * Sums file sizes and checks the total is strictly under the limit.
 * @param {number[]} sizes file sizes in bytes
 * @param {number} [limit] limit in bytes
 * @returns {{ total: number, ok: boolean }}
 */
export function checkTotal(sizes, limit = SIZE_LIMIT) {
  const total = sizes.reduce((sum, size) => sum + size, 0);
  return { total, ok: total < limit };
}

function main() {
  const dist = resolve('dist');
  if (!existsSync(dist)) {
    console.error('dist/ not found: run npm run build first');
    return 2;
  }
  const sizes = readdirSync(dist, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => statSync(join(entry.parentPath, entry.name)).size);
  const { total, ok } = checkTotal(sizes);
  console.log(`dist total: ${total} bytes (${(total / 1024).toFixed(1)} KiB)`);
  console.log(`limit:      ${SIZE_LIMIT} bytes (${(SIZE_LIMIT / 1024).toFixed(1)} KiB)`);
  console.log(ok ? 'OK: under the limit' : 'FAIL: dist/ is not under the limit');
  return ok ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main());
}
