#!/usr/bin/env node
// verify-library.mjs — Health check thư viện D:\Skills (kiểm tra liên tục).
// node tools\verify-library.mjs [--json]
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const json = process.argv.includes('--json');
const issues = [];
const ok = [];

function ageHours(p) {
  if (!existsSync(p)) return -1;
  return (Date.now() - statSync(p).mtimeMs) / 3600000;
}

const index = existsSync(join(ROOT, 'index.json')) ? JSON.parse(readFileSync(join(ROOT, 'index.json'), 'utf8')) : null;
const sources = existsSync(join(ROOT, 'sources.json')) ? JSON.parse(readFileSync(join(ROOT, 'sources.json'), 'utf8')) : null;
const sec = existsSync(join(ROOT, 'security.json')) ? JSON.parse(readFileSync(join(ROOT, 'security.json'), 'utf8')) : null;

// 1. File bắt buộc tồn tại
for (const f of ['INDEX.md', 'index.json', 'sources.json', 'SKILLS.md', 'README.md', 'usage-log.md']) {
  if (existsSync(join(ROOT, f))) ok.push(`file: ${f}`);
  else issues.push(`THIẾU file bắt buộc: ${f}`);
}

// 2. Độ tươi index/security
const idxAge = ageHours(join(ROOT, 'INDEX.md'));
const secAge = ageHours(join(ROOT, 'security.json'));
if (idxAge < 0) issues.push('INDEX.md không tồn tại');
else if (idxAge > 24 * 8) issues.push(`INDEX.md cũ ${Math.round(idxAge / 24)} ngày — chạy build-index.mjs`);
else ok.push(`index tuổi ${idxAge.toFixed(1)}h`);
if (secAge < 0 || secAge > 24 * 8) issues.push(`security.json cũ/thiếu (${secAge.toFixed(0)}h) — chạy scan-security.mjs`);
else ok.push(`security tuổi ${secAge.toFixed(1)}h`);

// 3. Nguồn 0-skill (chỉ cảnh báo — Tier C chấp nhận)
if (sources) {
  const zeros = sources.filter((s) => s.count === 0).map((s) => s.repo);
  if (zeros.length) ok.push(`nguồn 0-skill (Tier C): ${zeros.length}`);
  const missing = zeros.length ? '' : '';
  void missing;
}

// 4. Trùng lặp giữa các nguồn trong index (name collide) — đã dedupe, chỉ đếm
if (index) {
  ok.push(`index: ${index.length} skills duy nhất`);
  const noDomain = index.filter((e) => !e.domain).length;
  if (noDomain > 0) issues.push(`${noDomain} entry thiếu domain — chạy lại build-index.mjs`);
  const badPath = index.filter((e) => !existsSync(join(ROOT, e.path))).length;
  if (badPath > 0) issues.push(`${badPath} entry trỏ tới file KHÔNG TỒN TẠI — index lệch ổ đĩa, chạy build-index.mjs`);
  else ok.push('toàn bộ path trong index tồn tại thực');
}

// 5. Security summary
if (sec) {
  ok.push(`security: ${sec.filesScanned} file quét, ${sec.flagged.length} flagged (H=${sec.summary.high}/M=${sec.summary.medium}/L=${sec.summary.low})`);
}

// 6. Session cache cũ chờ dọn? (>7 ngày chưa clear)
const activeCache = join(ROOT, 'cache', 'active-session.md');
if (existsSync(activeCache)) {
  const cAge = ageHours(activeCache);
  if (cAge > 24 * 7) issues.push(`active-session.md cũ ${Math.round(cAge / 24)} ngày — task có thể đã bỏ dở, check cache.mjs show`);
  else ok.push(`session cache hoạt động (${cAge.toFixed(1)}h)`);
}

// 7. Disk usage
function dirSize(p) {
  let total = 0;
  const stack = [p];
  while (stack.length) {
    const cur = stack.pop();
    let ents;
    try { ents = readdirSync(cur, { withFileTypes: true }); } catch { continue; }
    for (const e of ents) {
      const f = join(cur, e.name);
      if (e.isDirectory()) { if (e.name !== '.git') stack.push(f); }
      else { try { total += statSync(f).size; } catch { } }
    }
  }
  return total;
}
const gb = dirSize(ROOT) / 1073741824;
if (gb > 9) issues.push(`Dung lượng ${gb.toFixed(2)} GB — CHẠM NGƯỠNG 10 GB, dọn nguồn Tier C!`);
else ok.push(`dung lượng ${gb.toFixed(2)} / 10 GB`);

const report = { checkedAt: new Date().toISOString(), ok, issues };
if (json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`=== VERIFY LIBRARY ${report.checkedAt} ===`);
  for (const i of issues) console.log(`[!] ${i}`);
  for (const o of ok) console.log(`[ok] ${o}`);
  console.log(`\nKết luận: ${issues.length === 0 ? 'KHỎE — không có vấn đề' : issues.length + ' vấn đề cần xử lý'}`);
  process.exit(issues.length > 0 ? 1 : 0);
}
