#!/usr/bin/env node
// log-skill.mjs — Ghi nhật ký sử dụng skill vào D:\Skills\usage-log.md
// Dùng: node D:\Skills\tools\log-skill.mjs "<ten-skill>" "<task ngan gon>" [good|ok|bad]
import { appendFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOG = join(ROOT, 'usage-log.md');
const MAX_BYTES = 256 * 1024; // ~256KB rồi xoay (giữ 256KB cuối)

const [skill, task, ratingRaw] = process.argv.slice(2);
const rating = (ratingRaw || 'ok').toLowerCase();
if (!skill || !task || !['good', 'ok', 'bad'].includes(rating)) {
  console.error('Dung: node log-skill.mjs "<ten-skill>" "<task>" [good|ok|bad]');
  process.exit(1);
}

// Xoay log khi quá lớn: giữ nửa cuối
try {
  if (statSync(LOG).size > MAX_BYTES) {
    const { readFileSync, writeFileSync, unlinkSync, renameSync } = await import('node:fs');
    const lines = readFileSync(LOG, 'utf8').split('\n');
    const header = lines.slice(0, 4).join('\n');
    const keep = lines.slice(Math.floor(lines.length / 2)).join('\n');
    const tmp = LOG + '.tmp';
    writeFileSync(tmp, header + '\n' + keep, 'utf8');
    renameSync(tmp, LOG);
  }
} catch { /* file chưa tồn tại */ }

const line = `| ${new Date().toISOString().slice(0, 16).replace('T', ' ')} | ${skill.slice(0, 60)} | ${task.replace(/\|/g, '/').slice(0, 120)} | ${rating} |`;
appendFileSync(LOG, line + '\n', 'utf8');
console.log(`Logged: ${skill} [${rating}]`);
