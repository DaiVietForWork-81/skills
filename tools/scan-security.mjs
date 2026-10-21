#!/usr/bin/env node
// scan-security.mjs — Quét scripts trong toàn bộ nguồn skills tìm pattern nguy hiểm.
// Kết quả: D:\Skills\security.json + tổng kết ra console.
// Agent dùng find-skill.mjs sẽ tự động thấy cảnh báo ⚠ với skill bị flag.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, basename, dirname } from 'node:path';

const ROOT = 'D:\\Skills';
const EXCLUDE_DIRS = new Set(['tools']);
const MAX_FILE = 512 * 1024;
const SCRIPT_EXT = new Set(['.sh', '.bash', '.zsh', '.ps1', '.psm1', '.py', '.js', '.mjs', '.cjs', '.ts', '.bat', '.cmd', '.rb', '.pl']);

// Pattern nguy hiểm: [regex, mức, mô tả]
const PATTERNS = [
  [/\brm\s+-rf?\s+\/(?:\s|$)/, 'HIGH', 'rm -rf / — xóa gốc hệ thống'],
  [/\brm\s+-rf?\s+(?:~|\$HOME\b)/, 'HIGH', 'rm -rf thư mục home'],
  [/curl[^|;]*\|\s*(?:sudo\s+)?(?:ba)?sh\b/, 'HIGH', 'curl pipe trực tiếp vào shell'],
  [/wget[^|;]*\|\s*(?:sudo\s+)?(?:ba)?sh\b/, 'HIGH', 'wget pipe trực tiếp vào shell'],
  [/Invoke-(?:Expression|iex)\b/i, 'HIGH', 'Invoke-Expression — chạy chuỗi động (PS)'],
  [/\biwr\b[^|]*\|\s*\biex\b/i, 'HIGH', 'Invoke-WebRequest pipe vào IEX'],
  [/eval\s*\(\s*(?:atob|Buffer\.from|unescape)\s*\(/i, 'HIGH', 'eval() chuỗi decode — khả năng obfuscated'],
  [/base64\s+-d\b[^|]*\|\s*(?:ba)?sh\b/, 'HIGH', 'base64 decode pipe vào shell'],
  [/mkfs\.\w+|dd\s+if=.*of=\/dev\/(?:sd|nvme|hd)/, 'HIGH', 'Ghi đè trực tiếp ổ đĩa'],
  [/chmod\s+777\s+\/(?:\s|$)/, 'HIGH', 'chmod 777 root'],
  [/\/dev\/tcp\//, 'MEDIUM', 'Bash reverse shell /dev/tcp'],
  [/\bnc\b\s+(?:-e\b|.*\s-e\b)/, 'MEDIUM', 'netcat -e — bind/reverse shell'],
  [/\.(?:ssh\/id_(?:rsa|ed25519|ecdsa)|aws\/credentials|npmrc|netrc|gnupg)/, 'MEDIUM', 'Đọc key/credential người dùng'],
  [/\/etc\/(?:shadow|passwd)/, 'MEDIUM', 'Truy cập file account hệ thống'],
  [/(?:token|password|secret|api[_-]?key)\s*=\s*['"][A-Za-z0-9+/_-]{20,}['"]/, 'HIGH', 'Hardcoded secret/token trong code'],
  [/\breg\s+add\s+HK(?:LM|CU)|Set-ItemProperty\s+.*HK(?:LM|CU):\\/, 'MEDIUM', 'Sửa registry Windows'],
  [/\bschtasks\s+\/create\b|\bcrontab\b\s+-\b/, 'MEDIUM', 'Tạo persistence (task/cron)'],
  [/history\s+-c\b|shred\s+-\b|wevtutil\s+cl\b/, 'MEDIUM', 'Xóa dấu vết lịch sử/log'],
  [/keylog|getasynckeystate\s*\(/i, 'MEDIUM', 'Hành vi keylogger'],
  [/Add-Type\s+.*(?:DllImport|Win32)/s, 'LOW', 'Gọi Win32 APInative'],
];

function walk(dir, out) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === '.git' || e.name === 'node_modules') continue;
      walk(p, out);
    } else if (e.isFile()) {
      out.push(p);
    }
  }
}

function findSkillRoot(startDir) {
  let cur = startDir;
  for (let i = 0; i < 8; i++) {
    try {
      if (existsSync(join(cur, 'SKILL.md'))) return cur;
    } catch { return null; }
    const parent = dirname(cur);
    if (parent === cur) return null;
    cur = parent;
  }
  return null;
}

import { existsSync } from 'node:fs';

const t0 = Date.now();
const sources = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('.') && !EXCLUDE_DIRS.has(d.name))
  .map((d) => d.name);

let scanned = 0;
const flagged = [];
const flaggedSkillRoots = new Set();

for (const src of sources) {
  const files = [];
  walk(join(ROOT, src), files);
  for (const f of files) {
    const ext = f.slice(f.lastIndexOf('.')).toLowerCase();
    if (!SCRIPT_EXT.has(ext)) continue;
    let st;
    try { st = statSync(f); } catch { continue; }
    if (st.size > MAX_FILE) continue;
    let content;
    try { content = readFileSync(f, 'utf8'); } catch { continue; }
    scanned++;
    const hits = [];
    for (const [re, sev, why] of PATTERNS) {
      if (re.test(content)) hits.push({ sev, why });
    }
    if (hits.length === 0) continue;
    const skillRoot = findSkillRoot(dirname(f));
    if (skillRoot) flaggedSkillRoots.add(join(skillRoot, 'SKILL.md'));
    flagged.push({
      file: relative(ROOT, f),
      skill: skillRoot ? relative(ROOT, join(skillRoot, 'SKILL.md')) : null,
      hits: hits.slice(0, 3),
    });
  }
}

const result = {
  generated: new Date().toISOString(),
  filesScanned: scanned,
  flagged: flagged,
  summary: {
    high: flagged.filter((f) => f.hits.some((h) => h.sev === 'HIGH')).length,
    medium: flagged.filter((f) => f.hits.some((h) => h.sev === 'MEDIUM') && !f.hits.some((h) => h.sev === 'HIGH')).length,
    low: flagged.filter((f) => f.hits.every((h) => h.sev === 'LOW')).length,
  },
};
writeFileSync(join(ROOT, 'security.json'), JSON.stringify(result), 'utf8');

console.log(`Files scanned: ${scanned}`);
console.log(`Flagged files: ${flagged.length} (skills: ${flaggedSkillRoots.size})`);
console.log(`Summary: HIGH=${result.summary.high} MEDIUM=${result.summary.medium} LOW=${result.summary.low}`);
console.log(`Elapsed: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
for (const f of flagged.filter((x) => x.hits.some((h) => h.sev === 'HIGH')).slice(0, 15)) {
  console.log(`  HIGH ${f.file} :: ${f.hits.map((h) => h.why).join('; ')}`);
}
