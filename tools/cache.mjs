#!/usr/bin/env node
// cache.mjs — Session checkpoint cache: trí nhớ ngoài cho AI (resume khi hết context).
// File: D:\Skills\cache\active-session.md
// Dùng:
//   node cache.mjs show                          -> xem trạng thái hiện tại
//   node cache.mjs set task "<mô tả task>"       -> đặt task phiên
//   node cache.mjs set next "<việc tiếp theo>"   -> đặt việc kế tiếp
//   node cache.mjs add  "<đã xong gì>"           -> thêm checkpoint (dùng LIÊN TỤC)
//   node cache.mjs note decision "<quyết định>"  -> ghi quyết định quan trọng
//   node cache.mjs note file "<đường dẫn>"       -> ghi file đang đụng tới
//   node cache.mjs note skill "<skill đã nạp>"   -> ghi skill đã dùng
//   node cache.mjs clear                         -> xong task: archive + reset
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'cache');
const FILE = join(DIR, 'active-session.md');
const argv = process.argv.slice(2);
const cmd = argv[0];
const now = () => new Date().toISOString().slice(0, 16).replace('T', ' ');

function emptyState() {
  return { task: '', status: 'in-progress', next: '', done: [], decisions: [], files: [], skills: [] };
}

function render(s) {
  return [
    '# SESSION CACHE — trạng thái làm việc (đọc khi hết context để làm tiếp)',
    `task: ${s.task || '(chưa đặt)'}`,
    `status: ${s.status || 'in-progress'}`,
    `next: ${s.next || '(chưa đặt)'}`,
    `updated: ${now()}`,
    '## Done',
    ...(s.done.length ? s.done : ['- (chưa có bước nào)']),
    '## Decisions',
    ...(s.decisions.length ? s.decisions : ['- (không có)']),
    '## Files',
    ...(s.files.length ? s.files : ['- (không có)']),
    '## Skills used',
    ...(s.skills.length ? s.skills : ['- (không có)']),
    '',
  ].join('\n');
}

function load() {
  if (!existsSync(FILE)) return emptyState();
  const s = emptyState();
  let sec = null;
  for (const line of readFileSync(FILE, 'utf8').split('\n')) {
    if (line.startsWith('task: ')) s.task = line.slice(6);
    else if (line.startsWith('status: ')) s.status = line.slice(8);
    else if (line.startsWith('next: ')) s.next = line.slice(6);
    else if (line === '## Done') sec = 'done';
    else if (line === '## Decisions') sec = 'decisions';
    else if (line === '## Files') sec = 'files';
    else if (line === '## Skills used') sec = 'skills';
    else if (line.startsWith('## ')) sec = null;
    else if (sec && line.startsWith('- ') && !line.startsWith('- (')) s[sec].push(line);
  }
  return s;
}

function save(s) {
  if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });
  writeFileSync(FILE, render(s), 'utf8');
}

switch (cmd) {
  case 'show':
    console.log(existsSync(FILE) ? readFileSync(FILE, 'utf8') : '(cache trống — phiên mới. Dùng: set task "...")');
    break;
  case 'set': {
    const field = argv[1];
    const val = argv.slice(2).join(' ');
    if (!['task', 'next', 'status'].includes(field) || !val) {
      console.error('Dung: cache.mjs set task|next|status "<gia tri>"'); process.exit(1);
    }
    const s = load(); s[field] = val; save(s);
    console.log(`set ${field} OK`);
    break;
  }
  case 'add': {
    const val = argv.slice(1).join(' ');
    if (!val) { console.error('Dung: cache.mjs add "<da xong gi>"'); process.exit(1); }
    const s = load(); s.done.push(`- [${now().slice(11)}] ${val.slice(0, 200)}`); save(s);
    console.log('checkpoint OK');
    break;
  }
  case 'note': {
    const kind = argv[1];
    const val = argv.slice(2).join(' ');
    const map = { decision: 'decisions', file: 'files', skill: 'skills' };
    if (!map[kind] || !val) { console.error('Dung: cache.mjs note decision|file|skill "<noi dung>"'); process.exit(1); }
    const s = load(); s[map[kind]].push(`- ${val.slice(0, 200)}`); save(s);
    console.log('note OK');
    break;
  }
  case 'clear': {
    if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });
    if (existsSync(FILE)) {
      const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);
      renameSync(FILE, join(DIR, `archived-${stamp}.md`));
    }
    console.log('archived & reset OK');
    break;
  }
  default:
    console.error('Dung: cache.mjs show | set task|next|status "<gt>" | add "<done>" | note decision|file|skill "<gt>" | clear');
    process.exit(1);
}
