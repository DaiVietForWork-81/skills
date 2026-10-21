#!/usr/bin/env node
// find-skill.mjs — Tìm skills trong thư viện D:\Skills mà KHÔNG cần đọc INDEX.md/index.json.
// Dùng: node D:\Skills\tools\find-skill.mjs "tu khoa"                    -> tìm top 10
//       node D:\Skills\tools\find-skill.mjs "backtest" --limit 5
//       node D:\Skills\tools\find-skill.mjs "supabase" --source yoanbernabeu-supabase-pentest-skills
//       node D:\Skills\tools\find-skill.mjs "immune" --domain M          -> chỉ trong domain M (y sinh)
//       node D:\Skills\tools\find-skill.mjs --count "kubernetes|k8s"     -> đếm số khớp
//       node D:\Skills\tools\find-skill.mjs --list-sources               -> thống kê nguồn
//       node D:\Skills\tools\find-skill.mjs --list-domains               -> phân bố domain
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);

const loadJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const loadIndex = () => loadJson(join(ROOT, 'index.json'));
const loadSources = () => loadJson(join(ROOT, 'sources.json'));

const DOMAIN_LABELS = {
  A: 'Web frontend', B: 'Web 3D', C: 'Backend & API', D: 'Mobile', E: 'Python',
  F: 'C/C++/Rust', G: 'Thuật toán/CP', H: 'AI/ML/RAG', I: 'Data & R', J: 'DevOps/Cloud',
  K: 'Security', L: 'Luật', M: 'Y sinh', N: 'Tài chính/Trading', O: 'Marketing',
  P: 'Viết lách', Q: 'Văn phòng', R: 'Game', S: 'Design/UI-UX', T: 'Media',
  U: 'Scraping', V: 'PM/Planning', W: 'Meta agent', X: 'Obsidian/KM', Y: 'Nghiên cứu',
  Z: 'Hệ sinh thái', GEN: 'Khác',
};

if (args[0] === '--list-sources') {
  const srcs = loadSources().sort((a, b) => b.count - a.count);
  console.log(`${srcs.length} sources, ${srcs.reduce((s, x) => s + x.count, 0)} SKILL.md files`);
  for (const s of srcs) console.log(String(s.count).padStart(6), s.repo, s.sha ? `[${s.sha}]` : '');
  process.exit(0);
}

if (args[0] === '--list-domains') {
  const index = loadIndex();
  const t = {};
  for (const e of index) t[e.domain] = (t[e.domain] || 0) + 1;
  for (const [d, c] of Object.entries(t).sort((a, b) => b[1] - a[1])) {
    console.log(String(c).padStart(7), d, DOMAIN_LABELS[d] || '');
  }
  process.exit(0);
}

if (args[0] === '--related') {
  const target = args.slice(1).join(' ');
  if (!target) { console.error('Dung: node find-skill.mjs --related "<ten hoac duong dan skill>"'); process.exit(1); }
  const index = loadIndex();
  const t = index.find((e) => e.name === target) ||
    index.find((e) => e.path.toLowerCase().replace(/\\/g, '/').includes(target.toLowerCase().replace(/\\/g, '/'))) ||
    index.find((e) => e.name.toLowerCase().includes(target.toLowerCase()));
  if (!t) { console.log(`Khong tim thay skill "${target}" trong index.`); process.exit(1); }
  const tSrc = t.path.split('\\')[0];
  const same = index.filter((e) => e.domain === t.domain && e.name !== t.name && !e.path.startsWith(tSrc));
  const bySrc = {};
  for (const e of same) {
    const src = e.path.split('\\')[0];
    if (!bySrc[src]) bySrc[src] = e;
  }
  const recs = Object.values(bySrc).slice(0, 6);
  console.log(`"${t.name}" [${t.domain}] — skill bổ trợ cùng domain, mỗi nguồn 1 đại diện:`);
  for (const e of recs) console.log(`- ${e.name}\n  ${e.description.slice(0, 110)}\n  ${e.path}`);
  if (recs.length === 0) console.log('(không có skill nào khác cùng domain ngoài nguồn này)');
  process.exit(0);
}

let sourceFilter = null;
let domainFilter = null;
let limit = 10;
let one = false;
const pos = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--source') sourceFilter = args[++i];
  else if (args[i] === '--domain') domainFilter = (args[++i] || '').toUpperCase();
  else if (args[i] === '--limit') limit = parseInt(args[++i], 10) || 10;
  else if (args[i] === '--one') one = true;
  else pos.push(args[i]);
}
if (pos.length === 0) {
  console.error('Dung: node find-skill.mjs "<tu khoa>" [--source <nguon>] [--domain A,B] [--limit N]');
  console.error('      node find-skill.mjs --list-sources | --list-domains | --count "<regex>"');
  process.exit(1);
}

const mode = pos[0] === '--count' ? 'count' : 'search';
let query = mode === 'count' ? pos.slice(1).join(' ') : pos.join(' ');
const words = query.split(/\s+/).filter((w) => w.length > 1).map((w) => w.toLowerCase());
// Mở rộng từ khóa tiếng Việt → tiếng Anh (kho chủ yếu mô tả bằng tiếng Anh)
const VN_EN = [
  ['toán', 'math|algebra|calculus'],
  ['văn', 'literary|writing|essay'],
  ['dạy', 'teaching|tutor|lesson'],
  ['giảng', 'teaching|tutor|lesson'],
  ['học', 'learning|tutor'],
  ['lỗi', 'bug|error|debug'],
  ['chậm', 'performance|optimization|profiling'],
  ['ảnh', 'image|photo|picture'],
  ['vẽ', 'chart|plot|visualization'],
  ['nhạc', 'music|audio'],
  ['bảo mật', 'security|pentest'],
  ['tài chính', 'finance|trading|accounting'],
  ['kế toán', 'accounting|finance'],
  ['bán hàng', 'marketing|seo|sales'],
  ['điện thoại', 'mobile|android|ios'],
  ['dịch', 'translate|translation'],
  ['thuyết trình', 'presentation|slides|pptx'],
  ['tài liệu', 'documentation'],
  ['luật', 'legal|law'],
  ['y tế', 'medical|health'],
  ['sức khỏe', 'medical|health'],
  ['thuật toán', 'algorithm'],
  ['kiểm tra', 'test|quiz'],
];
let alts = [];
const qLower = query.toLowerCase();
for (const [vn, en] of VN_EN) if (qLower.includes(vn)) alts.push(en);
if (alts.length) query += ' | ' + [...new Set(alts.join('|').split('|'))].join('|');
let re;
try { re = new RegExp(query, 'i'); } catch { console.error(`Regex khong hop le: ${query}`); process.exit(1); }

// Tập skill có script bị flag (từ security.json) để cảnh báo
const riskMap = new Map();
const secPath = join(ROOT, 'security.json');
if (existsSync(secPath)) {
  try {
    for (const f of loadJson(secPath).flagged || []) {
      if (!f.skill) continue;
      const key = f.skill.split('\\').join('/');
      const worst = f.hits.some((h) => h.sev === 'HIGH') ? 'HIGH' : f.hits.some((h) => h.sev === 'MEDIUM') ? 'MEDIUM' : 'LOW';
      if (!riskMap.has(key) || riskMap.get(key) === 'LOW') riskMap.set(key, worst);
    }
  } catch { /* ignore */ }
}

const index = loadIndex();
const scored = [];
for (const e of index) {
  if (sourceFilter && !e.path.toLowerCase().startsWith(sourceFilter.toLowerCase())) continue;
  if (domainFilter && !domainFilter.split(',').map((d) => d.trim()).includes(e.domain)) continue;
  let score = 0;
  if (re.test(e.name)) score += 5;
  if (re.test(e.description)) score += 2;
  if (words.length > 1) {
    const hay = `${e.name} ${e.description}`.toLowerCase();
    if (words.every((w) => hay.includes(w))) score += 3;
  }
  if (score > 0) scored.push({ score, e });
}
scored.sort((a, b) => b.score - a.score || a.e.name.localeCompare(b.e.name));

if (mode === 'count') {
  console.log(`${scored.length} skills khop "${query}"${domainFilter ? ` trong domain ${domainFilter}` : ''}`);
  process.exit(0);
}

if (scored.length === 0) {
  console.log('Khong co skill nao khop. Thu: tu khoa tieng Anh khac, dong nghia, hoac --list-sources de xem nguon.');
  process.exit(0);
}

if (one) {
  const e = scored[0].e;
  const risk = riskMap.get(e.path.split('\\').join('/'));
  console.log(e.name);
  console.log(risk ? `RISK-${risk}` : 'OK');
  console.log(e.path);
  process.exit(0);
}

console.log(`${scored.length} khop (top ${Math.min(limit, scored.length)}):\n`);
for (const { e } of scored.slice(0, limit)) {
  const key = e.path.split('\\').join('/');
  const risk = riskMap.get(key);
  console.log(`- ${e.name} [${e.domain}${risk ? ' | RISK-' + risk : ''}]`);
  console.log(`  ${e.description.slice(0, 140)}`);
  console.log(`  ${e.path}\n`);
}
if (scored.slice(0, limit).some(({ e }) => riskMap.has(e.path.split('\\').join('/')))) {
  console.log('⚠ Co skill mang co RISK: doc toan bo script trong skill truoc khi chay (chi tiet D:\\Skills\\security.json).');
}
console.log('Cach dung ket qua: Read tron file SKILL.md o duong dan tren (toi da 3 skill/lan).');
