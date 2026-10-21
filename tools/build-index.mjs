import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, basename, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = 'D:\\Skills';
const EXCLUDE_DIRS = new Set(['tools', 'cache']); // cache/ = session cache, không phải nguồn
const DESC_MAX = 150;
const SAMPLE_COUNT = 8;
const SAMPLE_DESC_MAX = 120;

// ---------- Phân loại domain (26 nhóm A–Z) — thứ tự = độ ưu tiên ----------
const DOMAINS = [
  ['L', 'Luật', /court|legal|\blaw\b|gdpr|litigation|statute|attorney|notar|hipaa|kvkk|pdpl|verdict|konkurs|tva\b|gericht|khoan|hop dong/i],
  ['M', 'Y sinh & khoa học', /rna|genome|protein|sequence|bioinfor|clinical|medical|pubmed|chemistry|physics|enzyme|disease|patient|\bmedic|hla|genomic|epigenom|phylogen|biolog/i],
  ['K', 'Security & pentest', /security|pentest|vulnerab|exploit|\bxss\b|sqli|owasp|mitre|malware|reverse eng|ghidra|cve\b|forensic|red team|phishing|secret|credential/i],
  ['N', 'Tài chính & trading', /trading|backtest|ohlcv|portfolio|crypto|stock|quant|sharpe|forex|finance|invest|dividend|valuation|pricing/i],
  ['R', 'Game dev', /\bgame\b|godot|unity|unreal|roblox|gameplay|gamedev|phaser|pixijs|npc/i],
  ['J', 'DevOps & cloud', /kubernetes|k8s|docker|terraform|\bci\/cd\b|devops|\bsre\b|deploy|monitoring|observab|datadog|sentry|serverless|helm|jenkins|ansible/i],
  ['D', 'Mobile', /\bios\b|android|flutter|react native|\bexpo\b|swift|kotlin|xcode|mobile app|app store|eas build|capacitor/i],
  ['B', 'Web 3D', /three\.js|webgl|webgpu|shader|webxr|\br3f\b|blender|3d scene|spline|ar\/vr/i],
  ['Q', 'Văn phòng', /pdf|xlsx|docx|pptx|excel|spreadsheet|powerpoint|word document|\boffice\b|outlook|tika|mail merge/i],
  ['O', 'Marketing & SEO', /\bseo\b|marketing|cro\b|copywriting|funnel|conversion|landing page|\bbrand\b|\bads\b|instagram|social media|growth|newsletter/i],
  ['P', 'Viết lách & học thuật', /writing|humaniz|proofread|essay|manuscript|academic|translate|translation|citation|abstract|blog post|ghostwrit/i],
  ['Y', 'Nghiên cứu', /deep research|literature|research|survey paper|systematic review|notebooklm|trend/i],
  ['S', 'Design & UI/UX', /design|\bui\b|\bux\b|figma|typography|palette|wireframe|mockup|diagram|icon|animation/i],
  ['V', 'PM & planning', /\bprd\b|roadmap|backlog|user stor|planning|postmortem|agile|scrum|jira|sprint/i],
  ['W', 'Meta agent', /tdd|debugg|code review|\badr\b|guardrail|subagent|token|context window|memory|skill creation|\beval\b|prompt|agent harness|harness/i],
  ['I', 'Data & R', /ggplot|tidyverse|deseq2|r package|r analytics|data science|statistic|jupyter|notebook|dataframe|visualization|dashboard/i],
  ['E', 'Python', /python|pandas|numpy|pytest|fastapi|django|\bpip\b|\buv\b|asyncio|virtualenv/i],
  ['C', 'Backend & API', /\bapi\b|\brest\b|graphql|webhook|endpoint|backend|microservice|supabase|firebase|\bauth\b|database|\bsql\b|postgres|mongo|redis|n8n|automate.*\bvia\b|integrat|mcp server|workflow automation|composio|rube/i],
  ['A', 'Web frontend', /react|next\.js|vue|svelte|tailwind|shadcn|frontend|\bcss\b|\bhtml\b|component|responsive|\bssr\b|hydration|web app|browser|wordpress/i],
  ['F', 'C/C++/Rust & hệ thống', /c\+\+|\bcpp\b|cuda|rust\b|cmake|embedded|firmware|microcontroller|\bbinary\b|memory safety|kernel|driver|llvm/i],
  ['G', 'Thuật toán & CP', /algorithm|dynamic programming|complexity|competitive|leetcode|codeforces|graph theory|sorting|\bdfs\b|\bbfs\b/i],
  ['H', 'AI/ML/RAG/LLM', /\brag\b|embedding|\bllm\b|fine-tun|vector|langchain|langgraph|machine learning|deep learning|neural|transformer|\bmcp\b|fine tun|diffusion|inference/i],
  ['T', 'Media: video/audio/ảnh', /video|audio|ffmpeg|caption|voice|podcast|speech|image generation|text-to-image|\bphoto\b|movie|subtitle|music|generate image|logo gener/i],
  ['U', 'Scraping & automation', /scrap|crawl|puppeteer|playwright|selenium|headless|browser automation|spider|scraper/i],
  ['X', 'Obsidian & KM', /obsidian|vault|wikilink|zettelkasten|excalidraw|mermaid/i],
  ['Z', 'Hệ sinh thái đặc thù', /cloudbase|baoyu|wechat|weixin|微信|抖音|douyin|openclaw|antigravity|frappe|erpnext|power bi|notion|airtable/i],
  ['GEN', 'Khác', null],
];

const COMPILED_DOMAINS = DOMAINS.map(([letter, label, re]) => [letter, label, re ? new RegExp(re.source, re.flags + 'g') : null]);

// Path override: nguồn chuyên biệt gán domain cố định (chính xác hơn từ khóa)
const PATH_OVERRIDES = {
  'ThomasMoreAI-legal-skills': 'L',
  'GPTomics-bioSkills': 'M', 'Zaoqu-ScienceClaw': 'M', 'KDenseAI-scientific-agent-skills': 'M',
  'Aperivue-medsci-skills': 'M', 'aizech-clinical-skills': 'M', 'skillsil-health-services': 'M',
  'wilbert-medical-illustration': 'M', 'htlin222-cps-skills': 'M', 'hujizhou-medical-journal-selector': 'M',
  'nickjlamb-redacta': 'M',
  'mukul975-anthropic-cybersecurity-skills': 'K', 'uphiago-recon-skills': 'K',
  'zhaoxuya520-reverse-skill': 'K', 'yoanbernabeu-supabase-pentest-skills': 'K', 'morluto-rea': 'K',
  'HimanshuJ16-Algo-Trading-Skills': 'N', 'ml4t-skills': 'N', 'roman-rr-trading-skills': 'N',
  'agent-skills-hub-gamedev': 'R', 'gamedev-awesome-skills': 'R', 'gamedevskills-awesome-gamedev': 'R',
  'LeoLin990405-r-analytics-skill': 'I', 'datagoblin-power-bi-skills': 'I',
  'NVIDIA-skills': 'H', 'abhisheksharma-skills-graph': 'H',
  'kepano-obsidian-skills': 'X', 'axtonliu-obsidian-visual-skills': 'X',
  'datadog-agent-skills': 'J', 'getsentry-skills': 'J', 'NotHarshhaa-devops-skills': 'J', 'kubeopencode-skills': 'J',
  'supabase-agent-skills': 'C', 'expo-skills': 'D', 'hookdeck-webhook-skills': 'C',
  'TencentCloudBase-CloudBase-AI-Toolkit': 'C', 'iOfficeAI-OfficeCLI': 'Q',
  'nextlevelbuilder-ui-ux-pro-max-skill': 'S', 'thedesignproject-agent-skills': 'S',
  'cathrynlavery-diagram-design': 'S', 'leonxlnx-taste-skill': 'S', 'tta1i-archify': 'S',
  'ImpertioStudio-threejs-skills': 'B', 'freshtechbro-claudedesignskills': 'B', 'danielcanton-webxr-dev-skill': 'B',
  'coreyhaines31-marketingskills': 'O', 'antoineghigny-marketing-skills': 'O', 'Humblytics-marketing-skills': 'O',
  'zubairtrabzada-ai-marketing-claude': 'O', 'thatrebeccarae-claude-marketing': 'O', 'minhnv0807-ai-business-skills': 'O',
  'claude-office-skills': 'Q', 'bowenliang123-markdown-exporter': 'Q', 'Akxan-ppt-agent-skill': 'Q',
  'zarazhangrui-frontend-slides': 'Q',
  'Deep-Research-skills': 'Y', 'mvanhorn-last30days-skill': 'Y', 'teng-lin-notebooklm-py': 'Y',
  'brycewang-journal-skills': 'P', 'Imbad0202-academic-research-skills': 'P',
  'blader-humanizer': 'P', 'matsuikentaro1-humanizer-academic': 'P', 'zLanqing-codex-claude-academic-skills': 'P',
  'mohitagw15856-pm-claude-skills': 'V', 'OthmanAdi-planning-with-files': 'V', 'lukedj78-dev-flow': 'V',
  'craigspaterson-agent-skills': 'V',
  'calesthio-OpenMontage': 'T', 'TryWorld2026-paper-algorithm': 'T', 'nicojunk-claude-ig': 'T',
  'tonkotsuboy-x-impact-checker': 'T', 'achimala-dream-loop': 'T',
  'ImpertioStudio-frappe-skills': 'Z', 'JimLiu-baoyu-skills': 'Z', 'EthanYoQ-Skill-hub': 'Z',
  'aliilhangis-n8n-skill-claude': 'Z',
  'JPeetz-agent-skills': 'W', 'magnus919-agent-skills': 'W', 'affaanm-ecc': 'W',
  'obra-superpowers': 'W', 'vadimcomanescu-agents-skills': 'W', 'kbluck-claude-tdd': 'W',
  // — đợt 10–12 (rework 2026-10-18): nguồn GEN-dominant hoặc gán sai domain —
  'brainbytes-finance': 'N', 'gajeto-financeskills': 'N', 'openaccountant-skills': 'N',
  'EtherealMingo-university-teacher': 'P', 'flysheep-education-skills': 'P', 'koukekoukej-feynman-tutor': 'P', 'snowmays-style-alchemy': 'P',
  'nexu-io-html-anything': 'A', 'JCodesMore-ai-website-cloner-template': 'A',
  'teamplain-skills': 'C', 'Accoil-product-tracking-skills': 'C',
  'zhinkgit-embeddedskills': 'F', 'sofiaferro-esp32-skills': 'F', 'eminboydak-embedded-skills': 'F',
  'umit-jvm-skills': 'F', 'lapbrian2-extreme-optimizer': 'F',
  'chengziyue1222-math-model-agent': 'G',
  'aws-devops-agent-skills': 'J', 'redhat-rca-plugin': 'J',
  'vaquarkhan-data-eng-skills': 'I', 'unknown333-data-eng-skills': 'I', 'sajonaro-etl-skills': 'I',
  'bytedance-deer-flow': 'Y', 'dariushoule-x64dbg-skills': 'K', 'Jakeschincariol-linkedin-skill': 'O',
  'uhuds-recruiting-skills': 'V', 'xedlab-agent-skills': 'V',
  'open-hax-opencode-skills': 'W', 'angel291592-intent-router': 'W', 'awesomeskills-5-whys': 'W',
  'DietrichGebert-ponytail': 'W', 'JuliusBrussee-caveman': 'W', 'kerpopule-hermes-jev-skills': 'W',
  'theonly1me-shadowclone': 'W', 'rblalock-omakaseagent': 'W', 'danielrosehill-debugging-plugin': 'W',
  'steve-magne-hookstack': 'W', 'opencode-agent-skills': 'W', 'opencode-skills-list': 'W',
  'acnlabs-openpersona': 'W', 'titanwings-distilly': 'W', 'Egonex-understand-anything': 'W',
  'Tubo2333-knowledge-brain': 'X', 'zhayujie-CowAgent': 'X',
};

function classify(text, srcName) {
  if (PATH_OVERRIDES[srcName]) {
    const found = COMPILED_DOMAINS.find(([l]) => l === PATH_OVERRIDES[srcName]);
    if (found) return [found[0], found[1]];
  }
  let best = null;
  let bestScore = 0;
  for (const [letter, label, re] of COMPILED_DOMAINS) {
    if (!re) continue;
    re.lastIndex = 0;
    const score = (text.match(re) || []).length;
    if (score > bestScore) {
      bestScore = score;
      best = [letter, label];
    }
  }
  return best || ['GEN', 'Khác'];
}

// ---------- Git info ----------
function gitInfo(dir) {
  try {
    const sha = execFileSync('git', ['-C', dir, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
    const date = execFileSync('git', ['-C', dir, 'log', '-1', '--format=%cs'], { encoding: 'utf8' }).trim();
    return { sha, date };
  } catch {
    return { sha: '', date: '' };
  }
}

// ---------- Scan ----------
function listSources() {
  return readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && !EXCLUDE_DIRS.has(d.name))
    .map((d) => d.name)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

function findSkillFiles(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try { entries = readdirSync(cur, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      const p = join(cur, e.name);
      if (e.isDirectory()) {
        if (e.name === '.git' || e.name === 'node_modules') continue;
        stack.push(p);
      } else if (e.isFile() && e.name === 'SKILL.md') {
        out.push(p);
      }
    }
  }
  return out;
}

function parseFrontmatter(raw) {
  const text = raw.length > 65536 ? raw.slice(0, 65536) : raw;
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const lines = m[1].split(/\r?\n/);
  const fields = {};
  let key = null, block = false, buf = [];
  const flush = () => {
    if (key) {
      let v = buf.join(' ').trim();
      if (/^["'].*["']$/.test(v)) v = v.slice(1, -1).trim();
      fields[key] = v;
    }
    key = null; block = false; buf = [];
  };
  for (const line of lines) {
    const km = line.match(/^([A-Za-z0-9_-]+):\s?(.*)$/);
    if (km && !/^\s/.test(line)) {
      flush();
      key = km[1].toLowerCase();
      const rest = km[2].trim();
      if (rest === '>' || rest === '>-' || rest === '|' || rest === '|-') { block = true; buf = []; }
      else { block = false; buf = [rest]; }
    } else if (key && (block || /^\s+\S/.test(line))) {
      buf.push(line.trim());
    }
  }
  flush();
  return fields;
}

const t0 = Date.now();
const sources = listSources();
const byNS = new Map();       // name@nguồn -> entry (lớp 1)
const perSource = [];
const domainTally = {};       // domain -> total (entry duy nhất)
const normDesc = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 120);

for (const src of sources) {
  const srcDir = join(ROOT, src);
  const files = findSkillFiles(srcDir).sort();
  const sample = [];
  let count = 0;
  for (const f of files) {
    let raw = '';
    try { raw = readFileSync(f, 'utf8'); } catch { continue; }
    const fm = parseFrontmatter(raw);
    const rel = relative(ROOT, f);
    const name = (fm.name || basename(dirname(f))).trim();
    const description = (fm.description || '').replace(/\s+/g, ' ').trim();
    const [dLetter, dLabel] = classify(`${name}\n${description}`, src);
    count++;
    if (sample.length < SAMPLE_COUNT) sample.push([name, description.slice(0, SAMPLE_DESC_MAX)]);
    // Lớp 1: trong cùng nguồn, trùng name → giữ bản mô tả dài hơn (mirror bundle/translation)
    const kNS = name + '\u0000' + src;
    const prevNS = byNS.get(kNS);
    if (!prevNS || description.length > prevNS.description.length) {
      byNS.set(kNS, { name, description, dn: normDesc(description), path: rel, domain: dLetter });
    }
  }
  const gi = existsSync(join(srcDir, '.git')) ? gitInfo(srcDir) : { sha: '', date: '' };
  perSource.push({ repo: src, count, sample, sha: gi.sha, updated: gi.date });
}

// Lớp 2: giữa các nguồn, trùng name + mô tả giống nhau → mirror repo, giữ bản mô tả dài hơn.
//         Trùng name nhưng mô tả khác → skill khác thật, giữ cả hai.
const byMirror = new Map();
for (const e of byNS.values()) {
  const k = e.name + '\u0000' + e.dn;
  const prev = byMirror.get(k);
  if (!prev || e.description.length > prev.description.length) byMirror.set(k, e);
}
const winners = [...byMirror.values()];

for (const e of winners) {
  domainTally[e.domain] = (domainTally[e.domain] || 0) + 1;
}

const entries = winners.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
perSource.sort((a, b) => a.repo.toLowerCase().localeCompare(b.repo.toLowerCase()));

writeFileSync(join(ROOT, 'index.json'), JSON.stringify(entries), 'utf8');

const indexLines = entries.map((e) => `- **${e.name}** [${e.domain}] -- ${e.description.slice(0, DESC_MAX)} \`${e.path}\``);
writeFileSync(join(ROOT, 'INDEX.md'), `# Skills Index (${entries.length} skills)\n\n${indexLines.join('\n')}\n`, 'utf8');
writeFileSync(join(ROOT, 'sources.json'), JSON.stringify(perSource), 'utf8');

// ---------- Tổng kết ----------
const totalFiles = perSource.reduce((s, x) => s + x.count, 0);

console.log(`Sources: ${perSource.length}`);
console.log(`SKILL.md files: ${totalFiles}`);
console.log(`Unique skills: ${entries.length}`);
console.log(`Domains: ${Object.entries(domainTally).sort().map(([k, v]) => `${k}:${v}`).join(' ')}`);
console.log(`Elapsed: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
