#!/usr/bin/env node
// Bumps the cache-busting date on every stat-card / badge URL in README.md
// and appends an entry to the CACHE REFRESH HISTORY LOG at the bottom of the
// file. This is the automated version of the manual chore documented in
// ISSUES.md (Issue #1 — Stat Card & Badge Caching).
//
// Usage:
//   node scripts/bump-cache.mjs                 # use today's date
//   node scripts/bump-cache.mjs --date 27/08/2026
//
// Exits 0 without writing anything if README.md is already on the target date.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readmePath = join(root, 'README.md');

function targetDate() {
  const i = process.argv.indexOf('--date');
  if (i === -1) return new Date();
  const m = process.argv[i + 1]?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) throw new Error('--date must be in DD/MM/YYYY format');
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
}

const now = targetDate();
const dd = String(now.getDate()).padStart(2, '0');
const mm = String(now.getMonth() + 1).padStart(2, '0');
const yyyy = String(now.getFullYear());
const stamp = `${dd}${mm}${yyyy}`;     // e.g. 27082026  (matches existing t=/v= format)
const logDate = `${dd}/${mm}/${yyyy.slice(2)}`; // e.g. 27/08/26  (matches the log format)

let readme = readFileSync(readmePath, 'utf8');
const before = readme;

// 1. Bump every ?t=/&t=/?v=/&v= eight-digit value on the card and badge URLs.
readme = readme.replace(/([?&](?:t|v)=)\d{8}(?!\d)/g, `$1${stamp}`);

// 2. Move the "(Current)" marker in the history log onto a fresh dated line.
const currentLine = /^- \[\d{2}\/\d{2}\/\d{2}\] -> v=\d{8} \/ t=\d{8}\s+\(Current\)$/m;
if (currentLine.test(readme)) {
  const fresh = `- [${logDate}] -> v=${stamp} / t=${stamp}`;
  readme = readme.replace(currentLine, (line) => {
    const demoted = line.replace(/\s+\(Current\)$/, '');
    // Same day re-run: keep a single line rather than duplicating it.
    if (demoted === fresh) return `${fresh}   (Current)`;
    return `${demoted}\n${fresh}   (Current)`;
  });
}

if (readme === before) {
  console.log(`No change — README.md is already on ${stamp}.`);
  process.exit(0);
}

writeFileSync(readmePath, readme);
console.log(`Bumped cache params to ${stamp}; logged ${logDate} in the history log.`);
