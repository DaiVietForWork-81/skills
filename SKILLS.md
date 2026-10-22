# SKILLS.md — Bản đồ phân phối & tuyển chọn Skills

> **FILE QUAN TRỌNG NHẤT của kho `D:\Skills`. AI agent PHẢI đọc file này
> trước khi dùng kho.** Kho có ~42.100 skills duy nhất trong 240 nguồn
> (~60.500 file SKILL.md) — nạp bừa sẽ nổ ngữ cảnh ngay lập tức. File này
> tồn tại để agent có **nhận thức (taste)**: biết cái gì nằm ở đâu, cái gì
> đáng dùng, cái nào bỏ qua, và khi nào thì dừng tìm kiếm.
>
> **CHẾ ĐỘ THƯỜNG TRỰC:** skill duy nhất "sgeneral" (Router tìm kiếm & Master
> Orchestrator tích hợp) đã đăng ký toàn cục và hoạt động với MỌI task không
> tầm thường — mỗi phiên bắt đầu bằng 1 lệnh `find-skill.mjs`, kết thúc bằng
> 1 dòng `log-skill.mjs` ghi vào `usage-log.md` để tích lũy kinh nghiệm giữa các
> phiên. Task đa domain cũng orchestrate trực tiếp qua `sgeneral`.

---

## MỤC LỤC

1. [Triết lý chống quá tải](#1-triết-lý-chống-quá-tải)
2. [10 quy tắc vàng](#2-10-quy-tắc-vàng)
3. [Taste — tư duy chọn skill](#3-taste--tư-duy-chọn-skill)
4. [Quy trình 6 bước chuẩn](#4-quy-trình-6-bước-chuẩn)
5. [Kỹ thuật tra cứu INDEX.md / index.json](#5-kỹ-thuật-tra-cứu-indexmd--indexjson)
6. [BẢN ĐỒ LĨNH VỰC (26 nhóm A–Z)](#6-bản-đồ-lĩnh-vực)
7. [Bảng phân loại nguồn theo tier](#7-bảng-phân-loại-nguồn-theo-tier)
8. [12 ví dụ end-to-end](#8-12-ví-dụ-end-to-end)
9. [Khi nào KHÔNG dùng skill nào](#9-khi-nào-không-dùng-skill-nào)
10. [An toàn khi thực thi skill](#10-an-toàn-khi-thực-thi-skill)
11. [Bảo trì kho](#11-bảo-trì-kho)
12. [FAQ](#12-faq)
13. [sgeneral — orchestrate nhiều skills](#13-sgeneral--orchestrate-nhiều-skills)

---

## 1. Triết lý chống quá tải

### 1.1 Vấn đề

Kho này là một **thư viện tra cứu**, không phải context. Nếu agent cố đọc
hết (hoặc đọc một phần lớn) kho:

- `INDEX.md` dài ~42.100 dòng (~11,7 MB) — đọc nguyên file là lãng phí
  hàng trăm nghìn token cho thông tin agent không cần.
- `index.json` là 1 dòng JSON ~18 MB — tệ hơn nữa với công cụ đọc file.
- Một nguồn lớn như `ThomasMoreAI-legal-skills` chứa **20.293** skills;
  `sickn33-agentic-awesome-skills` chứa **8.360**. Không ai đọc hết được.

### 1.2 Giải pháp: mô hình "thư viện — thẻ cứu kho — kệ sách"

Hãy hình dung kho như một thư viện:

| Vai trò | File | Cách dùng |
|---|---|---|
| **Thư ký hướng dẫn** (file này) | `SKILLS.md` | Đọc 1 lần để nắm bản đồ toàn kho. Cho biết: nhiệm vụ X → nên tra nguồn nào, grep từ gì, chọn thế nào |
| **Sổ mục tờ** | `INDEX.md`, `index.json` | CHỈ tra bằng grep/lọc, KHÔNG BAO GIỜ đọc nguyên file. Kết quả tra chỉ lấy 2–5 dòng |
| **Kệ sách** | `<nguon>/.../SKILL.md` | Chỉ đọc **đúng file skill đã chọn** (tối đa 3), đọc trọn vẹn file đó |

### 1.3 Ngân sách ngữ cảnh khuyến nghị

Một phiên chọn skill nên tiêu tốn tối đa:

- ~2–4k token đọc `SKILLS.md` (phần mục 6 liên quan, không cần đọc hết
  mỗi lần — dùng mục lục để nhảy tới đúng domain).
- ~1–2k token kết quả grep (2–5 dòng index).
- ~2–10k token nội dung 1–3 file SKILL.md đã chọn.
- **Tổng ≤ ~15k token cho toàn bộ hoạt động "dùng kho".**

Nếu nhận thấy bản thân đang đọc nhiều hơn thế — dừng lại, quay về mục 2.

---

## 2. 10 quy tắc vàng

1. **KHÔNG đọc nguyên `INDEX.md` hay `index.json`.** Chỉ grep/lọc.
2. **Tối đa 3 skills nạp mỗi lần** làm việc. Nhiều hơn chỉ khi nhiệm vụ gồm
   nhiều mảng rời rạc và agent ghi rõ lý do.
3. **Tối đa 2–3 nguồn tra cứu mỗi lần.** Dùng bản đồ mục 6 để khoanh vùng,
   đừng dò khắp 240 nguồn.
4. **Tối đa ~6 lượt grep.** Nếu sau 6 lượt vẫn không thấy ứng viên tốt →
   kết luận "kho không có", làm nhiệm vụ trực tiếp. Đừng sa lầy.
5. **Dừng sớm khi đủ tốt:** ứng viên khớp ≥80% mô tả nhiệm vụ → chọn luôn,
   không tiếp tục "săn skill hoàn hảo".
6. **Ưu tiên nguồn chuyên sâu** (Tier S/A) trước nguồn tổng hợp khổng lồ.
7. **Đọc trọn file SKILL.md đã chọn** bằng công cụ Read, làm đúng workflow
   trong đó; đọc `references/`/chạy `scripts/` khi skill chỉ dẫn.
8. **Không bịa skill.** Không có skill phù hợp thì làm trực tiếp và nói rõ.
9. **Không sửa nội dung nguồn.** Nguồn là bản clone — sửa sẽ phá việc pull.
10. **Đóng gói xong thì giải phóng:** khi nhiệm vụ đổi mảng hoàn toàn,
    bỏ ngữ cảnh skill cũ, tra lại từ đầu theo quy trình.

---

## 3. Taste — tư duy chọn skill

"Taste" là khả năng phân biệt skill **giỏi** và skill **dở** chỉ bằng cách
đọc mô tả + lướt cấu trúc. Đây là phần quan trọng nhất — hãy áp dụng 10
nguyên tắc dưới đây theo thứ tự.

### 3.1 10 nguyên tắc đánh giá

1. **Khớp nhiệm vụ > mọi thứ.** Một skill 100 dòng khớp đúng việc đang làm
   giá trị hơn skill 2.000 dòng "liên quan gần đúng".
2. **Chuyên sâu > tổng hợp.** Cần phân tích RNA-seq → nguồn bio chuyên
   (GPTomics, 562 skills) tốt hơn mò trong kho 8.000 skills chung chung.
3. **Có `scripts/` + `references/` > chỉ có chữ.** Skill kèm script chạy
   được và tài liệu tham chiếu là skill được làm nghiêm túc.
4. **Chính chủ (Tier S) khi làm việc với sản phẩm tương ứng.** Đụng
   Supabase → `supabase-agent-skills` (chính chủ). Đụng Sentry →
   `getsentry-skills`. Đụng Expo → `expo-skills`. Đụng PDF/Office →
   `anthropics-skills`. Chính chủ nắm API mới nhất và chuẩn nhất.
5. **Đơn giản, rõ ràng > phức tạp.** Workflow 5 bước liệt kê được > triết
   lý 5.000 từ không biết bắt đầu từ đâu.
6. **Actionable > lý thuyết.** Skill tốt nói "làm bước X bằng cách Y, nếu
   Z thì làm W". Skill dở chỉ nói "hãy cẩn thận, hãy suy nghĩ kỹ".
7. **Khi trùng tên giữa nhiều nguồn:** ưu tiên bản của nguồn tier cao hơn;
   ngang tier thì lấy bản có mô tả đầy đủ hơn / kèm script hơn. (Lưu ý:
   `INDEX.md` chỉ tự gộp khi trùng tên VÀ mô tả giống nhau (mirror); cùng
   tên nhưng mô tả khác là skill khác thật — cả hai đều có trong index,
   đọc path + mô tả để chọn.)
8. **Ngôn ngữ theo nhiệm vụ.** Skill tiếng Trung (`baoyu-skills`,
   `EthanYoQ-Skill-hub`, `zLanqing-...`) rất mạnh cho nội dung Trung văn;
   với task tiếng Việt/Anh, ưu tiên skill tiếng Anh. Description trộn
   nhiều ngôn ngữ vẫn dùng được — đọc phần khớp ngữ.
9. **An toàn trước tiện lợi.** Skill yêu cầu API key, gọi network, chạy
   script PowerShell/Python → đọc script trước, đánh giá rủi ro (mục 10).
10. **Biết buông.** Skill chỉ khớp 40–50% thì thôi — tự làm trực tiếp
    thường nhanh và chính xác hơn là bám vào skill sai phạm vi.

### 3.2 Checklist "green flags" khi đọc SKILL.md

- [ ] Frontmatter có `name` (kebab-case, khớp thư mục) và `description`
      viết theo mẫu "Use when..." — nói rõ **khi nào dùng**.
- [ ] Có mục tiêu rõ ràng trong 3 dòng đầu.
- [ ] Có workflow/từng bước đánh số.
- [ ] Có ví dụ input → output.
- [ ] Có `scripts/` (chạy được) hoặc `references/` (tra cứu sâu).
- [ ] Ghi rõ giới hạn: "NOT for...", "Use ONLY when...".

### 3.3 Checklist "red flags" — bỏ qua ngay khi thấy

- [ ] Description mơ hồ: "Helps you be better at coding".
- [ ] Chỉ có slogan/marketing, không có bước làm cụ thể.
- [ ] Nhắc nhiều đến sản phẩm trả phí/bắt buộc API key không khai báo.
- [ ] Script shell/PowerShell tối nghĩa, trông như obfuscated → NGUY HIỂM.
- [ ] Skill là bản sao y hệt skill khác (chọn bản chuẩn hơn ở nguồn khác).
- [ ] Hướng dẫn lỗi thời rõ ràng (API đã chết, version cũ khẳng định cứng).

### 3.4 Bảng tier nguồn — dùng khi phân vân giữa 2 nguồn

| Tier | Nghĩa | Cách dùng |
|---|---|---|
| **S** | Chính chủ hoặc chuyên sâu tuyệt đối (anthropics, NVIDIA, Vercel, Datadog, Sentry, Supabase, Expo, kepano/Obsidian, K-Dense, ThomasMoreAI-legal, GPTomics, mukul975-cyber...) | Ưu tiên số 1 khi domain khớp |
| **A** | Bộ sưu tập lớn, được tuyển chọn rõ (obra-superpowers, addyosmani, affaanm-ecc, sickn33, opencode-awesome, alirezarezvani, wshobson...) | Dùng khi không có Tier S khớp |
| **B** | Nguồn nhỏ, chuyên biệt, chất lượng tùy skill | Dùng khi domain khớp chính xác |
| **C** | 0 skills — tài liệu, danh mục link, công cụ | Chỉ đọc khi cần cài đặt/tra cứu meta |

Chi tiết từng nguồn ở **mục 7**.

---

## 4. Quy trình 6 bước chuẩn

```text
BƯỚC 1 — PHÂN TÍCH NHIỆM VỤ
  ├── Lĩnh vực nào? (→ mục 6, chọn 1–3 domain A–Z)
  ├── Công nghệ cụ thể? (React? C++? Luật Đức? RNA-seq?)
  └── Đầu ra mong muốn? (code? tài liệu? phân tích? file?)

BƯỚC 2 — KHOANH VÙNG NGUỒN
  ├── Tra bảng domain ở mục 6 → lấy 1–3 nguồn Tier cao nhất khớp
  └── Không rõ domain → dùng nguồn tổng hợp lớn (sickn33, opencode-awesome)

BƯỚC 3 — TÌM ỨNG CỦVIÊN (2–5 cái)
  ├── Grep INDEX.md theo từ khóa tiếng Anh của nhiệm vụ (mục 5)
  └── Đọc CHỈ trường description của từng ứng viên

BƯỚC 4 — CHẤM ĐIỂM & CHỌN (tối đa 3)
  ├── Áp 10 nguyên tắc taste (mục 3.1) theo thứ tự
  ├── Khớp ≥80% → dừng tìm, chọn luôn
  └── Chọn 1 chính + tối đa 2 bổ trợ (ví dụ: 1 skill domain + 1 skill review)

BƯỚC 5 — NẠP & THỰC HIỆN
  ├── Read trọn file SKILL.md đã chọn
  ├── Làm đúng workflow trong đó, đọc references/ khi được chỉ
  └── Chạy scripts/ sau khi kiểm tra nội dung (mục 10)

BƯỚC 6 — KẾT LUẬN THẲNG THẮN
  ├── Không có skill nào khớp (sau ≤6 lượt grep) → làm trực tiếp, không bịa
  └── Skill khớp nhưng dẫn sai hướng → bỏ, quay lại B3 với từ khóa khác
```

**Ghi chú quan trọng:** quy trình này thay thế mọi phản xạ kiểu "đọc thử
vài skill xem sao". Đọc thử = đốt ngữ cảnh. Grep description trước, đọc
file sau, và chỉ đọc file của người chiến thắng.

---

## 5. Kỹ thuật tra cứu INDEX.md / index.json

### 5.1 Bốn công cụ, bốn hoàn cảnh

| Công cụ | Lệnh | Khi nào dùng |
|---|---|---|
| **find-skill.mjs** (KHUYÊN DÙNG) | `node D:\Skills\tools\find-skill.mjs "tu khoa" --limit 5` | Mặc định — chấm điểm name+description, trả top N kèm đường dẫn |
| **Grep tool** (có sẵn trong opencode) | pattern = `three\.js` , path = `D:\Skills\INDEX.md` | Khi cần regex phức tạp ngay trên INDEX.md |
| **PowerShell** | `Select-String -Path "D:\Skills\INDEX.md" -Pattern "x|y" | Select-Object -First 10` | Khi cần lọc/xử lý tiếp bằng PS |
| **node one-liner** | xem 5.3 | Khi cần lọc phức tạp trên index.json (theo nguồn, thống kê...) |

**find-skill.mjs — chi tiết:**

```powershell
node D:\Skills\tools\find-skill.mjs "backtest ohlcv"            # tìm nhiều từ (AND)
node D:\Skills\tools\find-skill.mjs "supabase" --source yoanbernabeu-supabase-pentest-skills
node D:\Skills\tools\find-skill.mjs "kubernetes|k8s" --count    # đếm số khớp
node D:\Skills\tools\find-skill.mjs "backtest" --one            # 1 kết quả duy nhất (model nhỏ)
node D:\Skills\tools\find-skill.mjs --related "<ten-skill>"     # gợi ý skill BỔ TRỢ cùng domain
node D:\Skills\tools\find-skill.mjs --list-sources              # thống kê nguồn
```

- Hỗ trợ regex JS (`three\.js|webgl`), chấm điểm: khớp name +5, khớp
  description +2, đủ mọi từ khóa +3 → kết quả xếp hạng sẵn.
- Kết quả có sẵn **đường dẫn file** — chỉ cần Read đường dẫn đó.
- `--related` giúp ghép stack: chọn skill chính xong, lấy 1–2 skill bổ trợ
  cùng domain từ nguồn khác (mỗi nguồn 1 đại diện) — tổng vẫn ≤3.

**Ghi nhật ký sử dụng (bắt buộc sau khi dùng skill):**

```powershell
node D:\Skills\tools\log-skill.mjs "<ten-skill>" "<task>" good   # hoặc ok | bad
```

- `usage-log.md` là trí nhớ kinh nghiệm của kho: phiên sau đọc ~20 dòng
  cuối để ưu tiên skill từng `good`, tránh skill từng `bad`.
- File tự xoay ở 256KB — không cần quản lý.

### 5.2 Quy tắc từ khóa

- **Tiếng Anh gần như luôn hiệu quả nhất** — phần lớn description là
  tiếng Anh.
- Dùng **danh từ công nghệ + động từ nhiệm vụ**: `next.js`, `kubernetes`,
  `backtest`, `court fee`, `rna-seq`, `humanize`, `diagram`.
- **Cẩn thận false positive:** grep `expo` sẽ trúng cả chữ "export" trong
  skill luật Đức. Thêm ranh giới từ khi cần: `\bexpo\b`.
- Ghép nhiều từ bằng `|`: `react|next\.js`. Loại trừ bằng nhìn mắt —
  không cần regex phủ định phức tạp.
- Muốn giới hạn trong 1 nguồn: thêm tên nguồn vào pattern, ví dụ
  `pattern: "supabase.*\\`yoanbernabeu"` hoặc lọc theo path ở 5.3.

### 5.3 Lọc index.json bằng node (chính xác, máy đọc)

```powershell
# Tìm skills về three.js, in name + path
node -e "const a=require('D:/Skills/index.json');a.filter(s=>/three\.js|webgl/i.test(s.name+' '+s.description)).slice(0,10).forEach(s=>console.log(s.name,'::',s.path))"

# Tìm trong 1 nguồn cụ thể (ví dụ mọi skill Supabase chính chủ)
node -e "const a=require('D:/Skills/index.json');a.filter(s=>s.path.startsWith('supabase-agent-skills')).forEach(s=>console.log(s.name,'::',s.description.slice(0,100)))"

# Đếm số skill khớp từ khóa theo từng nguồn (tìm nguồn mạnh nhất cho chủ đề)
node -e "const a=require('D:/Skills/index.json');const m={};for(const s of a){if(/kubernetes|k8s/i.test(s.name+' '+s.description)){const r=s.path.split('\\\\')[0];m[r]=(m[r]||0)+1}};Object.entries(m).sort((x,y)=>y[1]-x[1]).slice(0,10).forEach(e=>console.log(e[1],e[0]))"
```

### 5.4 Lỗi thường gặp khi tra cứu

- Grep từ quá ngắn (`api`, `test`) → hàng nghìn kết quả. Hãy cụ thể:
  `fastapi`, `pytest fixture`, `api rate limit`.
- Grep từ tiếng Việt (`thuật toán`) → gần như 0 kết quả. Dùng
  `algorithm|dynamic programming|complexity`.
- Quên rằng 1 skill có thể tên không liên quan nhưng description khớp →
  grep cả `name + description` (grep INDEX.md là tự động vì 1 dòng chứa cả hai).

---

## 6. BẢN ĐỒ LĨNH VỰC

> 26 nhóm A–Z. Mỗi nhóm: nguồn ưu tiên (tên + số skills), từ khóa grep gợi
> ý, và cạm bẫy riêng. Số skills = số đã lọc trùng theo index hiện hành.

### A. Web frontend & UI web

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| soilmass-vibe-coding-plugin | 77 | Next.js 15/React 19: UI, form, chart, SEO, a11y |
| nexu-io-html-anything | 81 | HTML agentic editor, 75 skills × 9 surface |
| freshtechbro-claudedesignskills | 90 | Web hiện đại: 3D, animation, design system |
| kazdenc-builder-skills | 48 | PM + frontend + fullstack + browser |
| lukedj78-dev-flow | 53 | Idea → product: 50 skills theo pipeline |
| stareezy-1-frontend-architecture-skill | 6 | Kiến trúc frontend agnostic (React/RN) |
| lucianomenddes-frontend-skills | 2 | React 19, Next.js 15, shadcn-ui |
| sickn33 / opencode-awesome / agentskillexchange | 8339/4850/3151 | Kho dự trữ khi nguồn trên không đủ |

- **Grep:** `react|next\.js|tailwind|shadcn|component|responsive|hydration|ssr`
- **Cạm bẫy:** từ `web` quá chung (754 kết quả) — hãy grep tên công nghệ.

### B. Web 3D / WebGL / WebXR

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| ImpertioStudio-threejs-skills | 24 | Three.js/WebGL/WebGPU/R3F, 24 skills deterministic |
| freshtechbro-claudedesignskills | 90 | 3D graphics + animation cho web |
| danielcanton-webxr-dev-skill | 1 | WebXR/Meta Quest + Three.js |
| opencode-awesome-skills | (trong 4850) | Skill `3d-web-experience` (Three.js, R3F, Spline) |

- **Grep:** `three\.js|webgl|webgpu|shader|r3f|3d|spline`

### C. Backend, API & webhooks

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| hookdeck-webhook-skills | 183 | Webhook integration từng bước (Stripe, GitHub, Slack...) |
| TencentCloudBase-CloudBase-AI-Toolkit | 146 | Backend CloudBase: DB, auth, functions |
| supabase-agent-skills | 2 | CHÍNH CHỦ Supabase (CLI, migrations) |
| skills-md | 43 | fastapi, spring, docker, java, python |
| JPeetz-agent-skills | 69 | Nhóm api-backend: GraphQL, HAR, social API |
| suleyman-fullstack-agent-skills | 6 | Next.js + FastAPI + PostgreSQL + Expo |
| farmage / polip-opencode-skills | 134/132 | API design, kiến trúc, testing |
| mikehasa-golive-skill | 1 | Go-live: hosting, DB, domain, email, payments |

- **Grep:** `fastapi|graphql|webhook|rest api|endpoint|supabase|firebase|express`

### D. Mobile (iOS / Android / Flutter / React Native / Expo)

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| expo-skills | 26 | CHÍNH CHỦ Expo + EAS |
| gabuldev-flutter-skills | 15 | Flutter: Clean Architecture, Cubit, DI, theming |
| Code-with-Beto-skills | 4 | Mobile dev ship nhanh hơn |
| Appllama-appllama-skills | 2 | Pattern native app từ top-grossing |
| conorluddy-ios-simulator-skill | 1 | Điều khiển iOS Simulator từ agent |
| opencode-ultimate-skills | (trong 384) | Nhóm iOS |

- **Grep:** `\bexpo\b|react native|flutter|ios|android|swift|kotlin|eas`
- **Cạm bẫy:** `ios` trúng nhiều chữ "iOS" trong ngữ cảnh khác — thêm
  `simulator|swift|xcode` để thu hẹp.

### E. Python & hệ sinh thái

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| skills-md | 43 | python, fastapi, docker, pytest... |
| aiagentskills-skills | 191 | typescript, finance, downloader... |
| sickn33-agentic-awesome-skills | (trong 8360) | Rất nhiều python chuyên biệt |
| KDenseAI-scientific-agent-skills | (trong 177) | Python cho khoa học (numpy, scipy...) |

- **Grep:** `python|pandas|numpy|fastapi|pytest|asyncio|pip|uv\b`
- Python là domain **rất dày** trong kho (431+ kết quả) — hãy grep sát
  nhiệm vụ (`pandas merge`, `pytest mock`, `fastapi dependency`) thay vì
  grep `python`.

### F. C / C++ / Rust / hệ thống & nhúng

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| NVIDIA-skills | 412 | CHÍNH CHỦ NVIDIA: CUDA, cuDF, robotics |
| zhaoxuya520-reverse-skill | 89 | Reverse engineering + pentest ủy quyền |
| morluto-rea | 5 | Reverse engineer mọi thứ xuống native binary |
| productdevbook-skills | 5 | Rust design/review chuẩn + Sentry CLI |
| deepdark0721-mei-skills | 3 | C++ competitive programming |
| rollysys-cpp-perf-skills | 1 | Tự động tối ưu hiệu năng C++ |
| eminboydak-embedded-skills | 3 | Hardware, hệ nhúng |

- **Grep:** `c\+\+|cpp|cuda|rust|cmake|memory safety|embedded|binary|ghidra`

### G. Thuật toán & competitive programming

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| deepdark0721-mei-skills | 3 | CP C++ (Codeforces style) |
| chengziyue1222-math-model-agent | 8 | Thuật toán mô hình hóa toán + validation |
| romainsimon-skills-for-decision-making | 8 | Expected utility, MDP, planning (sách Kochenderfer) |
| NVIDIA-skills | (trong 412) | Thuật toán GPU/parallel |

- **Grep:** `algorithm|dynamic programming|graph|complexity|leetcode|codeforces|optimization`
- **Thực tế:** coverage CP trong kho còn mỏng — nếu cần luyện/giải bài CP,
  kết hợp skill trên với khả năng tự giải; đừng kỳ vọng kho có "lời giải
  mọi bài CP".

### H. AI / ML / RAG / LLM / agent

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| affaanm-ecc | 1062 | Harness performance: memory, instincts, security |
| NVIDIA-skills | 412 | RAG, cuDF, robotics (chính chủ) |
| abhisheksharma-skills-graph | 93 | LangGraph, Stripe, Prisma, Cloudflare (deep stack) |
| ml4t-skills | 61 | ML quant leakage-safe, backtest, validation |
| addyosmani-agent-skills | 25 | Production-grade engineering (107k★) |
| titanwings-distilly | 1 | Distill "cách nghĩ" thành skill tái sử dụng |

- **Grep:** `rag|embedding|llm|prompt|fine-tun|vector|langgraph|mcp|agent memory`

### I. Data science & R

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| LeoLin990405-r-analytics-skill | 358 | 93 gói R: manipulation, viz, statistics (vd `DESeq2`) |
| GPTomics-bioSkills | (trong 562) | Data bio nặng tính toán |

- **Grep:** `\br\b|ggplot|tidyverse|deseq2|dataframe|regression|statistic`

### J. DevOps, cloud, SRE, monitoring

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| datadog-agent-skills | 54 | CHÍNH CHỦ Datadog: monitors, logs, APM, RUM |
| getsentry-skills | 29 | CHÍNH CHỦ Sentry: debugging, issue triage |
| NotHarshhaa-devops-skills | 15 | k8s, terraform, CI/CD, backup, cloud cost |
| farmage / polip-opencode-skills | 134/132 | SRE, chaos engineering, k8s |
| craigspaterson-agent-skills | 7 | terraform-docs, Azure DevOps |
| kubeopencode-skills | 1 | K8sGPT MCP scan cluster |
| Wunderlandmedia-launchworthy | 1 | Audit app AI-built trước production |

- **Grep:** `kubernetes|k8s|terraform|docker|ci/cd|github actions|sre|observability|datadog|sentry`

### K. Security, pentest, reverse

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| mukul975-anthropic-cybersecurity-skills | 818 | 818 skills: MITRE ATT&CK, NIST CSF, OWASP, red/blue |
| uphiago-recon-skills | 146 | Recon/pentest: CORS, XSS, SQLi, SSRF, RCE, subdomain takeover |
| zhaoxuya520-reverse-skill | 89 | RE + pentest ủy quyền (router pack) |
| yoanbernabeu-supabase-pentest-skills | 24 | Audit bảo mật ứng dụng Supabase (RLS, keys) |
| morluto-rea | 5 | Reverse app behavior → native binary |
| JPeetz-agent-skills | (trong 69) | agentic-security-scanner |

- **Grep:** `security|pentest|vulnerability|xss|sqli|ssrf|owasp|mitre|malware|ghidra|apk`
- **Cạm bẫy:** chỉ dùng cho mục đích được ủy quyền (nguồn zhaoxuya520/morluto
  tự khai báo điều này).

### L. Luật

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| ThomasMoreAI-legal-skills | 20293 | Luật 54 quốc gia: phí tòa án, án lệ, GDPR, chứng khoán,Data protection theo từng nước |

- **Grep:** tên quốc gia + chủ đề: `german|israeli|gdpr|court fee|patent|hipaa`
- **Cạm bẫy:** nguồn khổng lồ — BẮT BUỘC grep theo `<quốc gia>/<chủ đề>`
  trong path, tuyệt đối không dò tay.

### M. Y sinh & khoa học tự nhiên

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| GPTomics-bioSkills | 562 | Sequence, RNA-seq, di truyền quần thể (63 nhóm) |
| KDenseAI-scientific-agent-skills | 177 | #1 science library: sinh, hóa, lý, y, toán |
| Zaoqu-ScienceClaw | 275 | Tin sinh học mở rộng |
| aizech-clinical-skills | 226 | Medical imaging + healthcare workflow |
| Aperivue-medsci-skills | 63 | Medical research: literature search, reporting guideline, citation check |
| skillsil-health-services | 11 | Dịch vụ y tế Israel: pharmacy, healthcare |
| wilbert-medical-illustration | 1 | Minh họa y khoa evidence-based |
| htlin222-cps-skills | 1 | Chẩn đoán Bayesian đa persona (NEJM Clinical Problems) |
| hujizhou-medical-journal-selector | 2 | Chọn tạp chí y khoa theo quartile |
| nickjlamb-redacta | 1 | Ẩn danh hóa tài liệu y tế trước khi đưa vào AI |

- **Grep:** `rna-seq|genome|protein|sequence|clinical|pubmed|chemistry|physics|hla|medical`
- Ví dụ skill thật: `DESeq2` (R, RNA-seq differential expression),
  `bio-clinical-databases-hla-typing`.

### N. Tài chính & trading

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| HimanshuJ16-Algo-Trading-Skills | 501 | 500+ algo-trading skills, mỗi skill có code chạy được |
| ml4t-skills | 61 | Quant ML leakage-safe: backtest, validation (vd `adjusted-vs-unadjusted-price-series-pitfalls`, `backtest-audit-trail-for-regulatory-review`) |
| roman-rr-trading-skills | 1 | Crypto signals: 17 trigger × 44 thuật toán |

- **Grep:** `backtest|ohlcv|portfolio|quant|crypto|trading|risk|sharpe`

### O. Marketing, SEO, sales

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| minhnv0807-ai-business-skills | 144 | ★ 138 skills marketing SONG NGỮ VIỆT–ANH (69 VN + 69 Global) |
| coreyhaines31-marketingskills | 50 | CRO, copywriting, SEO, analytics, growth |
| thatrebeccarae-claude-marketing | 56 | "Phòng marketing đầy đủ": Klaviyo, Shopify, GA4, Looker |
| antoineghigny-marketing-skills | 44 | Marketing/SEO/sales cho OpenCode |
| zubairtrabzada-ai-marketing-claude | 15 | 15 skills marketing + parallel subagents |
| Humblytics-marketing-skills | 12 | 12 skills + live web analytics |
| Accoil-product-tracking-skills | 7 | Tracking plan + instrumentation code |

- **Grep:** `seo|cro|copywriting|funnel|conversion|landing|meta description|analytics|marketing`
- Ví dụ thật: `AI Meta Description Generator`, `AI Content Readability Optimizer`.

### P. Viết lách & học thuật

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| brycewang-journal-skills | 4166 | ★ Skill pack theo TẠP CHÍ: AER, QJE, Nature, NEJM... (Stanford) |
| blader-humanizer | 1 | Khử dấu vết AI (`Remove AI Writing Fingerprints from Draft Copy`) |
| matsuikentaro1-humanizer-academic | 1 | Humanizer cho bài báo học thuật y khoa |
| Imbad0202-academic-research-skills | 5 | Research → write → review → revise → finalize |
| zLanqing-codex-claude-academic-skills | 24 | PPT/Word học thuật (tiếng Trung) |
| JimLiu-baoyu-skills | 22 | Bộ baoyu nổi tiếng — viết nội dung (tiếng Trung) |
| deusyu-translate-book | 1 | Dịch nguyên cuốn sách PDF/DOCX/EPUB giữ định dạng |

- **Grep:** `humaniz|academic|proofread|essay|draft|tone|writing|journal|manuscript`

### Q. Văn phòng (PDF / Excel / Word / PPT)

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| claude-office-skills | 137 | Văn phòng đầy đủ qua MCP |
| anthropics-skills | 20 | CHUẨN ANTHROPIC: pdf, xlsx, docx, pptx — Tier S |
| bowenliang123-markdown-exporter | 1 | Markdown → DOCX/PPTX/XLSX/PNG/PDF/HTML |
| Akxan-ppt-agent-skill | 1 | Sinh presentation: 26 style × 18 chart |

- **Grep:** `pdf|xlsx|docx|pptx|spreadsheet|powerpoint|excel|tika`
- **Quy tắc:** văn phòng cơ bản → anthropics-skills trước; nhu cầu nâng
  cao (hàng loạt, MCP) → claude-office-skills.

### R. Game dev

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| agent-skills-hub-gamedev | 813 | Router gamedev + sub-skills web/mobile/PC/VR |
| gamedev-awesome-skills | 75 | Godot, Unity, Unreal, Roblox |

- **Grep:** `godot|unity|unreal|roblox|gameplay|gamedev|vr`

### S. Thiết kế, UI/UX, diagram, taste

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| nextlevelbuilder-ui-ux-pro-max-skill | 13 | Design intelligence đa nền tảng |
| thedesignproject-agent-skills | 23 | figma-use, frontend-design, marketing psychology |
| leonxlnx-taste-skill | 14 | Art direction, reference images, browser check |
| DietrichGebert-ponytail | 12 | Tư duy "senior dev lười" — tối giản, đúng chỗ cần |
| tta1i-archify | 5 | Ý tưởng/kế hoạch/codebase → sơ đồ tương tác |
| cathrynlavery-diagram-design | 1 | Editorial diagram design |
| arumwu-design-md-skill | 1 | 74 brand design systems (Claude, Linear, Stripe, Apple...) |
| ayghri-i-have-adhd | 2 | Output không "chôn" câu trả lời |

- **Grep:** `design system|typography|color palette|figma|diagram|art direction`

### T. Media: video, audio, social

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| calesthio-OpenMontage | 139 | Hệ video production agentic: 12 pipeline, 100+ tools |
| nicojunk-claude-ig | 14 | Instagram content engine (13 sub-skill) |
| TryWorld2026-paper-algorithm | 3 | 1 câu → video voiceover hoàn chỉnh |
| tonkotsuboy-x-impact-checker | 1 | Đánh giá viral-potential bài X/Twitter |

- **Grep:** `video|ffmpeg|caption|voiceover|instagram|twitter|social media`

### U. Scraping & browser automation

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| Mahanaicoach-google-maps-scraper-kit | 1 | Google Maps scraper → CSV (leads) |
| JCodesMore-ai-website-cloner-template | 1 | Clone website bằng 1 lệnh |
| respawn-llc-firefox-cli | 1 | Điều khiển Firefox thật: form, auth, automation |
| agentskillexchange-skills | (trong 3151) | Nhóm browser/scraping lớn (Puppeteer stealth...) |

- **Grep:** `scrap|crawler|puppeteer|playwright|browser automation|headless`

### V. Sản phẩm, PM, planning

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| mohitagw15856-pm-claude-skills | 2856 | ★ 1.255+ skills PM chuyên nghiệp: PRD, postmortem, roadmap |
| OthmanAdi-planning-with-files | 18 | Planning bằng file markdown, crash-proof |
| lukedj78-dev-flow | 53 | .workflow contract + 50 skills idea → product |
| kazdenc-builder-skills | 48 | 47 skills PM + dev + browser |
| timmo001-skills | 51 | plan, code-review, diagnose, home-assistant |
| craigspaterson-agent-skills | 7 | user-story, create-pr, ADO |
| zippoxer-subtask | 1 | Chia task qua subagents trong Git worktrees |
| DenisSergeevitch-proof-loop | 1 | Spec-driven + vòng proof bằng subagents |

- **Grep:** `planning|user story|prd|roadmap|backlog|spec|task breakdown|postmortem`

### W. Meta-skills — nâng chất lượng chính công việc của agent

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| affaanm-ecc | 1062 | Harness: memory, instincts, security, research ops |
| magnus919-agent-skills | 186 | Skill format/eval, risk, ADR, agent-ops |
| JuliusBrussee-caveman | 28 | Cắt ~65% token mà giữ chất lượng |
| open-hax-opencode-skills | 125 | Tạo skill ĐÚNG CHUẨN (dùng khi cần viết skill mới) |
| obra-superpowers | 15 | TDD, debugging, brainstorming, subagent review |
| addyosmani-agent-skills | 25 | Engineering production-grade |
| houshuang-awesome-claude-code | 11 | Đúc kết từ 7500+ session: review, verify-docs |
| vadimcomanescu-agents-skills | 13 | TDD, orchestration, guardrails |
| steve-magne-hookstack | 3 | Hooks production (trung thực, guardrails) |
| kbluck-claude-tdd | 2 | TDD qua subagents |
| ayghri-i-have-adhd | 2 | Trình bày câu trả lời thẳng vấn đề |

- **Grep:** `tdd|debugging|code review|adr|guardrail|token|subagent|eval`
- **Ghi nhớ:** khi nhiệm vụ là "viết/tạo skill mới" → open-hax trước tiên.

### X. Obsidian & knowledge management

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| kepano-obsidian-skills | 6 | CHÍNH CHỦ Obsidian (kepano = CEO Obsidian): CLI, Markdown |

- **Grep:** `obsidian|vault|wikilink|markdown export`

### Y. Nghiên cứu (deep research)

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| Deep-Research-skills | 20 | Research pipeline human-in-the-loop (outline → deep → report) |
| teng-lin-notebooklm-py | 1 | Điều khiển NotebookLM bằng Python |
| mvanhorn-last30days-skill | 1 | Tin 30 ngày qua Reddit/X/YouTube/HN/Polymarket |
| Imbad0202-academic-research-skills | (trong 5) | Mảng academic |

- **Grep:** `research|outline|benchmark|deep research|trend`

### Z. Hệ sinh thái đặc thù

| Nguồn | Skills | Điểm mạnh |
|---|---|---|
| TencentCloudBase-CloudBase-AI-Toolkit | 146 | Backend Tencent CloudBase cho AI agent |
| EthanYoQ-Skill-hub | 271 | 55 skills Trung/Anh: media, business, agent |
| JimLiu-baoyu-skills | 22 | Nội dung tiếng Trung (baoyu) |
| aliilhangis-n8n-skill-claude | 1 | n8n workflow automation |

- **Grep:** `cloudbase|n8n|微信|抖音` (tiếng Trung khi cần)

---

## 7. Bảng phân loại nguồn theo tier

> Tier S = chính chủ/chuyên sâu tuyệt đối · Tier A = bộ sưu tập lớn tuyển kỹ ·
> Tier B = chuyên biệt nhỏ · Tier C = 0 skills (tài liệu/công cụ).
> Số = file SKILL.md quét được trong nguồn. Index gộp 2 lớp: trong cùng
> nguồn trùng tên → giữ 1 bản (diệt mirror bundle/translation); giữa các
> nguồn chỉ gộp khi mô tả giống nhau — cùng tên khác mô tả là skill khác,
> giữ cả hai. Nguồn mirror nhiều sẽ ghi chú riêng.

### Tier S — chính chủ / chuyên sâu tuyệt đối

| Nguồn | Skills | Domain | Ghi chú |
|---|---|---|---|
| anthropics-skills | 20 | Văn phòng, webapp-testing | Chuẩn gốc của thể loại skill |
| NVIDIA-skills | 412 | AI/GPU/CUDA | Chính chủ NVIDIA |
| vercel-agent-skills | 9 | Next.js/Vercel | Chính chủ Vercel |
| datadog-agent-skills | 54 | Monitoring | Chính chủ Datadog |
| getsentry-skills | 29 | Monitoring/debug | Chính chủ Sentry |
| supabase-agent-skills | 2 | Backend DB | Chính chủ Supabase |
| expo-skills | 26 | Mobile/Expo | Chính chủ Expo |
| kepano-obsidian-skills | 6 | Obsidian | Tác giả Obsidian |
| KDenseAI-scientific-agent-skills | 177 | Khoa học | #1 science skills |
| ThomasMoreAI-legal-skills | 20293 | Luật | 54 quốc gia |
| GPTomics-bioSkills | 562 | Bio | Chuyên sâu tin sinh học |
| mukul975-anthropic-cybersecurity-skills | 818 | Security | Khung MITRE/NIST/OWASP |

### Tier A — bộ sưu tập lớn, tuyển kỹ

| Nguồn | Skills | Domain |
|---|---|---|
| sickn33-agentic-awesome-skills | 8360 | Hub mirror: ~2.712 tên riêng nhưng đa số là bản copy của nguồn khác → 39 entry ghi về nguồn này, nội dung vẫn tìm thấy qua nguồn gốc |
| opencode-awesome-skills | 4850 | Tổng hợp: slide, 3D web, marketing... |
| agentskillexchange-skills | 3151 | Catalog: browser, image, media, email... |
| opencode-skills-collection | 2662 | github, marketing, system... |
| affaanm-ecc | 1062 | Agent harness performance |
| ericgrill-plugins | 959 | Marketplace plugin |
| alirezarezvani-claude-skills | 846 | 380 skills + 30 agents + 70 commands |
| agent-skills-hub-gamedev | 813 | Game dev router |
| mouadja02-skills | 807 | 36 nhóm: AWS, design-UI, devops, finance |
| HimanshuJ16-Algo-Trading-Skills | 501 | Algo trading + code chạy được |
| skillmds-skillmd | 464 | Kho cộng đồng skillmd.com |
| LeoLin990405-r-analytics-skill | 358 | R analytics (93 gói) |
| EthanYoQ-Skill-hub | 271 | Trung/Anh: media, business |
| Zaoqu-ScienceClaw | 275 | Tin sinh học |
| aiagentskills-skills | 191 | UI/UX, finance, typescript |
| magnus919-agent-skills | 186 | Eval, risk, ADR, agent-ops |
| wshobson-agents | 185 | Plugin marketplace đa harness |
| hookdeck-webhook-skills | 183 | Webhook integration |
| TencentCloudBase-CloudBase-AI-Toolkit | 146 | Backend CloudBase |
| uphiago-recon-skills | 146 | Recon/pentest pack |
| calesthio-OpenMontage | 139 | Video production |
| claude-office-skills | 137 | Văn phòng MCP |
| farmage / polip-opencode-skills | 134/132 | DevOps/kiến trúc/testing |
| open-hax-opencode-skills | 125 | Tạo skill chuẩn, clojure, agile |
| abhisheksharma-skills-graph | 93 | LangGraph, Stripe, Prisma... |
| freshtechbro-claudedesignskills | 90 | Web 3D/animation/design |
| zhaoxuya520-reverse-skill | 89 | RE + pentest |
| ccplugins-awesome-plugins | 84 | Plugins: meeting, memory... |
| nexu-io-html-anything | 81 | HTML agentic editor |
| soilmass-vibe-coding-plugin | 77 | Next.js/React |
| ml4t-skills | 61 | Quant ML |
| JPeetz-agent-skills | 69 | Đa nhóm devops/security/API |
| timmo001-skills | 51 | plan, review, diagnose |
| coreyhaines31-marketingskills | 50 | Marketing |
| kazdenc-builder-skills | 48 | PM + fullstack |
| lukedj78-dev-flow | 53 | Idea → product pipeline |

### Tier B — chuyên biệt, nhỏ, dùng khi domain khớp

| Nguồn | Skills | Domain |
|---|---|---|
| JanSzewczyk-claude-plugins | 42 | Next.js, Firebase, PM |
| skills-md | 43 | Ngôn ngữ/framework |
| mintuz-skills | 43 | Web + iOS |
| Deep-Research-skills | 20 | Deep research |
| ClaudeTools-marketplace | 25 | Exploring codebase, debugger |
| thedesignproject-agent-skills | 23 | Design/figma/marketing |
| JimLiu-baoyu-skills | 22 | Nội dung tiếng Trung |
| zLanqing-codex-claude-academic-skills | 24 | Học thuật (Trung) |
| yoanbernabeu-supabase-pentest-skills | 24 | Supabase security |
| JuliusBrussee-caveman | 28 | Token-cutting |
| addyosmani-agent-skills | 25 | Engineering production |
| ImpertioStudio-threejs-skills | 24 | Three.js |
| OthmanAdi-planning-with-files | 18 | Planning |
| gabuldev-flutter-skills | 15 | Flutter |
| NotHarshhaa-devops-skills | 15 | DevOps |
| obra-superpowers | 15 | TDD/debug/brainstorm |
| nicojunk-claude-ig | 14 | Instagram |
| leonxlnx-taste-skill | 14 | Taste/art direction |
| vadimcomanescu-agents-skills | 13 | TDD/orchestration |
| nextlevelbuilder-ui-ux-pro-max-skill | 13 | UI/UX |
| DietrichGebert-ponytail | 12 | Tư duy tối giản |
| Humblytics-marketing-skills | 12 | Marketing analytics |
| houshuang-awesome-claude-code | 11 | Review/research |
| vercel-agent-skills | 9 | (Tier S nhưng nhỏ) |
| dmythro-agent-skills | 8 | Bun, git, CI |
| romainsimon-skills-for-decision-making | 8 | Thuật toán quyết định |
| chengziyue1222-math-model-agent | 8 | Mô hình toán |
| Accoil-product-tracking-skills | 7 | Tracking plan |
| craigspaterson-agent-skills | 7 | Terraform/ADO |
| prangishviliAbe-agent-skills | 6 | Web/security/design |
| suleyman-fullstack-agent-skills | 6 | Fullstack |
| stareezy-1-frontend-architecture-skill | 6 | Kiến trúc FE |
| kepano-obsidian-skills | 6 | (Tier S) |
| Imbad0202-academic-research-skills | 5 | Academic |
| morluto-rea | 5 | Reverse engineering |
| productdevbook-skills | 5 | Rust |
| tta1i-archify | 5 | Diagram |
| andrewginns-collection | 5 | crawl-to-markdown, yt-transcript |
| Code-with-Beto-skills | 4 | Mobile |
| steve-magne-hookstack | 3 | Hooks |
| eminboydak-embedded-skills | 3 | Nhúng |
| Vamanakhil-agent-skills | 3 | Website QA |
| deepdark0721-mei-skills | 3 | CP C++ |
| TryWorld2026-paper-algorithm | 3 | Voiceover video |
| ayghri-i-have-adhd | 2 | Output format |
| lucianomenddes-frontend-skills | 2 | React/shadcn |
| kbluck-claude-tdd | 2 | TDD |
| zarazhangrui-frontend-slides | 2 | Slides |
| opencode-agent-skills | 2 | Plugin khám phá skills |
| supabase-agent-skills | 2 | (Tier S) |
| Appllama-appllama-skills | 2 | Native app pattern |
| titanwings-distilly | 1 | Distill thinking |
| xedlab-agent-skills | 1 | plan-and-delegate |
| aixmoyu-opencode-skills | 1 | Chọn SDK/plugin/tool |
| claude-code-opencode | 1 | Review đa agent |
| kubeopencode-skills | 1 | K8sGPT |
| opencode-skills-list | 1 | Báo cáo kho skills |
| open-agent-craft-awesome-agent-skills | 1 | List + MCP recipes |
| blader-humanizer | 1 | Humanize |
| mvanhorn-last30days-skill | 1 | Tin 30 ngày |
| conorluddy-ios-simulator-skill | 1 | iOS Simulator |
| Akxan-ppt-agent-skill | 1 | PPT generator |
| hookdeck-webhook-skills | (Tier A) | — |
| arumwu-design-md-skill | 1 | 74 design systems |
| bowenliang123-markdown-exporter | 1 | MD → Office |
| roman-rr-trading-skills | 1 | Crypto signals |
| cathrynlavery-diagram-design | 1 | Diagram design |
| danielcanton-webxr-dev-skill | 1 | WebXR |
| aliilhangis-n8n-skill-claude | 1 | n8n |
| tonkotsuboy-x-impact-checker | 1 | X/Twitter |
| JCodesMore-ai-website-cloner-template | 1 | Clone website |
| respawn-llc-firefox-cli | 1 | Firefox automation |
| mikehasa-golive-skill | 1 | Go-live |
| Wunderlandmedia-launchworthy | 1 | Production audit |
| Mahanaicoach-google-maps-scraper-kit | 1 | Maps scraper |
| rollysys-cpp-perf-skills | 1 | C++ perf |
| dstaulcu-agent-skills | 1 | Guardrails kiến trúc |
| teng-lin-notebooklm-py | 1 | NotebookLM |

### Bổ sung đợt 8 (đều là Tier B trừ khi ghi chú)

| Nguồn | Skills | Domain |
|---|---|---|
| foryourhealth-vibe-skills | 258 | Skill routing + workflow orchestration cho agent |
| simota-agent-skills | 96 | 90 chuyên gia AI + 3 extension dự án |
| gamedevskills-awesome-gamedev | 75 | Godot, Unity, Unreal, Phaser, PixiJS, three.js |
| ImpertioStudio-frappe-skills | 61 | Frappe Framework + ERPNext v14–16 |
| datagoblin-power-bi-skills | 35 | Power BI agentic development |
| bytedance-deer-flow | 33 | SuperAgent harness (ByteDance): research, code, create |
| iOfficeAI-OfficeCLI | 12 | Office suite cho AI agent (đọc/sửa/CREATE) |
| yzhao062-anywhere-agents | 12 | 1 config cho mọi agent, portable |
| kerpopule-hermes-jev-skills | 11 | Model routing, memory, compaction, skill selection |
| danium-lateral-thinking | 10 | Lateral thinking (de Bono): 8 kỹ thuật + router |
| Egonex-understand-anything | 9 | Code → knowledge graph tương tác |
| SvenMirana-sublation | 9 | Skill governance đa agent, shadow routing |
| cablate-mcp-google-map | 4 | 18 Google Maps tools + 3 skills (địa điểm, lộ trình) |
| zhayujie-CowAgent | 3 | Trợ lý cá nhân harness (plans tasks, skills) |
| axtonliu-obsidian-visual-skills | 3 | Obsidian Canvas/Excalidraw/Mermaid từ text |
| achimala-dream-loop | 1 | 3D visuals Blender + image gen + subagent critic |
| angel291592-intent-router | 1 | Intent compiler: yêu cầu mơ hồ → IntentSpec |
| ericporres-family-assistant | 1 | Trợ lý gia đình: form, lịch, nhắc việc |


### Bổ sung đợt 9–12 (Tier B trừ khi ghi chú)

| Nguồn | Skills | Domain |
|---|---|---|
| brycewang-journal-skills | 4166 | P · Viết/HT |
| mohitagw15856-pm-claude-skills | 2856 | V · PM |
| opencode-ultimate-skills | 384 | S · Design |
| aizech-clinical-skills | 226 | M · Ysinh |
| minhnv0807-ai-business-skills | 144 | O · Mkt |
| farmage-opencode-skills | 134 | C · Backend |
| first-fluke-oh-my-agent | 95 | GEN · — |
| LerianStudio-ring | 76 | C · Backend |
| gamedev-awesome-skills | 75 | R · Game |
| vaquarkhan-data-eng-skills | 74 | I · Data |
| Aperivue-medsci-skills | 63 | M · Ysinh |
| thatrebeccarae-claude-marketing | 56 | O · Mkt |
| brainbytes-finance | 51 | N · Tài chính |
| EtherealMingo-university-teacher | 49 | P · Viết/HT |
| gajeto-financeskills | 48 | N · Tài chính |
| theonly1me-shadowclone | 46 | W · Meta |
| antoineghigny-marketing-skills | 44 | O · Mkt |
| openaccountant-skills | 44 | N · Tài chính |
| composio-support-skills | 40 | C · Backend |
| unknown333-data-eng-skills | 37 | I · Data |
| aws-devops-agent-skills | 34 | J · DevOps |
| madebymustafa-design-taste | 24 | S · Design |
| acnlabs-openpersona | 19 | W · Meta |
| surendranb-writing-skills | 17 | P · Viết/HT |
| zubairtrabzada-ai-marketing-claude | 15 | O · Mkt |
| Jakeschincariol-instagram-skill | 13 | O · Mkt |
| zhinkgit-embeddedskills | 12 | F · C/C++ |
| codexstar69-bug-hunter | 11 | K · Sec |
| Jakeschincariol-linkedin-skill | 11 | O · Mkt |
| Jakeschincariol-replica-skill | 11 | C · Backend |
| rblalock-omakaseagent | 11 | W · Meta |
| skillsil-health-services | 11 | M · Ysinh |
| redhat-rca-plugin | 10 | J · DevOps (Tier S) |
| joshuadavidthomas-agent-skills | 9 | A · WebFE |
| dariushoule-x64dbg-skills | 8 | K · Sec |
| sofiaferro-esp32-skills | 6 | F · C/C++ |
| flysheep-education-skills | 5 | P · Viết/HT |
| danielrosehill-debugging-plugin | 4 | W · Meta |
| arjunkshah-design-skill | 3 | S · Design |
| uhuds-recruiting-skills | 3 | V · PM |
| hujizhou-medical-journal-selector | 2 | M · Ysinh |
| kkarpushin-tone-of-voice | 2 | T · Media |
| NulightJens-humanizer-stack | 2 | P · Viết/HT |
| sajonaro-etl-skills | 2 | I · Data |
| teamplain-skills | 2 | C · Backend |
| umit-jvm-skills | 2 | F · C/C++ |
| Adancurusul-embedded-debugger | 1 | W · Meta |
| ahmdd4vd-motioncraft | 1 | T · Media |
| AIScientists-Dev-academic-humanizer | 1 | P · Viết/HT |
| awesomeskills-5-whys | 1 | W · Meta |
| bejek-humanizer-czech | 1 | P · Viết/HT |
| bowen31337-bug-report-skills | 1 | W · Meta |
| DenisSergeevitch-proof-loop | 1 | W · Meta |
| deusyu-translate-book | 1 | Q · VP |
| DiveWind-soul-agent | 1 | V · PM |
| DonkeyKing01-tasteful-ui-skill | 1 | S · Design |
| grafana-pyroscope-skills | 1 | W · Meta (Tier S) |
| htlin222-cps-skills | 1 | M · Ysinh |
| j9o-cfo-expert | 1 | N · Tài chính |
| jzOcb-writing-style-skill | 1 | P · Viết/HT |
| kmgcc-ios-trace | 1 | D · Mobile |
| koukekoukej-feynman-tutor | 1 | P · Viết/HT |
| lapbrian2-extreme-optimizer | 1 | F · C/C++ |
| marty-paper-workflow | 1 | X · KM |
| matsuikentaro1-humanizer-academic | 1 | P · Viết/HT |
| mhmansouri-embedded-iot-mentor | 1 | F · C/C++ |
| nai0om-buddhist-method | 1 | W · Meta |
| nickjlamb-redacta | 1 | M · Ysinh |
| notaaaronfr-ship-ready | 1 | K · Sec |
| op7418-humanizer-zh | 1 | P · Viết/HT |
| pennyfan1031-powerbi-debugging | 1 | W · Meta |
| qinjobs-hrclaw | 1 | Q · VP |
| qyh9527-style-distiller | 1 | P · Viết/HT |
| redbaron-humanizer-zh-academic | 1 | P · Viết/HT |
| Rhyru9-bug-solver-pro | 1 | N · Tài chính |
| romanprigodskii-indelible | 1 | P · Viết/HT |
| rudybear-renderdoc-skill | 1 | B · Web 3D |
| shannhk-style-extractor | 1 | P · Viết/HT |
| snowmays-style-alchemy | 1 | P · Viết/HT |
| soheilmomeniii-no-slop | 1 | P · Viết/HT |
| ttttccxxui-anythingbutlaw | 1 | L · Luật |
| Tubo2333-knowledge-brain | 1 | X · KM |
| wilbert-medical-illustration | 1 | M · Ysinh |
| workersio-bug-skills | 1 | P · Viết/HT |
| yaoleifly-wechat-writing-style | 1 | Z · HCN |
| yisyeasy-writing-dna | 1 | P · Viết/HT |
| zeked-finance-super | 1 | N · Tài chính |
| zippoxer-subtask | 1 | W · Meta |

### Tier C — 0 skills (tài liệu / công cụ, chỉ đọc khi cần meta)

agentskills-spec (đặc tả chuẩn skill) · awesome-claude-skills ·
VoltAgent-awesome-agent-skills (list 1000+ link) · BadMenFinance-awesome-skill-md ·
skillmdcreator-examples (mẫu theo vai trò) · EverMind-SkillCorpus (corpus/retrieval) ·
claude-market-marketplace · linny006-plugin-tracker · cnhsn-opencode-skills (installer) ·
opencode-skill-scanner (plugin tự bơm skills) · Graphify-Labs-graphify (upstream đã rỗng) ·
zhwenchao-jungian-soul-skills (nội dung không có SKILL.md)

---

## 8. 12 ví dụ end-to-end

> Mỗi ví dụ: Task → Domain → Nguồn → Lệnh tra → Kết quả kỳ vọng → Chọn.

**V1. "Làm landing page Next.js 15 có animation mượt"**
- Domain A+B → nguồn: soilmass (77), freshtechbro (90), ImpertioStudio (24)
- Grep: `Select-String -Path D:\Skills\INDEX.md -Pattern "next\.js.*animat|framer motion"`
- Chọn tối đa 2: 1 skill Next.js UI + 1 skill animation. Không nạp thêm.

**V2. "Đoạn C++ này chạy chậm, tối ưu giúp"**
- Domain F → rollysys-cpp-perf-skills (1 skill chuyên) + NVIDIA (nếu GPU)
- Grep: `c\+\+.*perf|optimi.*c\+\+` → nạp skill perf C++, đọc workflow.

**V3. "Giải bài DP khó trên Codeforces bằng C++"**
- Domain G+F → deepdark0721-mei-skills (3) + chengziyue (8)
- Grep: `dynamic programming|competitive` → nếu không thấy skill khớp bài
  cụ thể → tự giải trực tiếp, chỉ dùng skill để nạp template/quad kiểm tra.

**V4. "Viết API FastAPI + PostgreSQL trên Supabase"**
- Domain C → supabase-agent-skills (S) + skills-md (fastapi) + suleyman (6)
- Grep: `fastapi|supabase` → chọn 1–2: skill Supabase CLI chính chủ +
  skill FastAPI pattern.

**V5. "App Expo React Native cần push notification + build EAS"**
- Domain D → expo-skills (26, chính chủ) TRƯỚC TIÊN
- Grep: `path bắt đầu 'expo-skills'` (mục 5.3) → chọn đúng skill EAS/notification.

**V6. "Audit bảo mật ứng dụng Supabase (RLS, service key)"**
- Domain K → yoanbernabeu-supabase-pentest-skills (24) + mukul975 (818, OWASP)
- Grep: `supabase.*security|rls` → nạp skill Supabase pentest; bổ trợ 1 skill
  OWASP chung nếu cần.

**V7. "Phân tích RNA-seq differential expression"**
- Domain M+I → GPTomics (562) + LeoLin R (358, có `DESeq2`)
- Grep: `rna-seq|differential expression` → chọn `DESeq2` + 1 skill pipeline.

**V8. "Tính phí tòa án Đức cho vụ dân sự"**
- Domain L → ThomasMoreAI (20293) — nguồn duy nhất, grep theo path
- Grep: `german.*court|gerichtskosten|gkg` → đọc skill khớp.

**V9. "Backtest chiến lược quant, sợ data leakage"**
- Domain N → ml4t-skills (61) + HimanshuJ16 (501)
- Grep: `leakage|backtest|ohlcv` → chọn `adjusted-vs-unadjusted-price-series-pitfalls`
  + skill audit-trail. Đúng 2, không thêm.

**V10. "Bộ slide pitch cho startup, đẹp kiểu Linear"**
- Domain S+Q → arumwu-design-md-skill (design systems) + Akxan-ppt (1) +
  anthropics-skills (pptx)
- Grep: `design system|pitch|pptx` → chọn 2: 1 thẩm mỹ + 1 sinh pptx.

**V11. "Bài blog này nghe quá 'AI', sửa giọng cho tự nhiên"**
- Domain P → blader-humanizer (1) — chính xác tuyệt đối
- Grep: `humaniz|ai fingerprint` → nạp `Remove AI Writing Fingerprints...`.

**V12. "Review PR tìm lỗ hổng bảo mật"**
- Domain W+K → mukul975 (818) + obra-superpowers + houshuang
- Grep: `secure code|security review` → ứng viên kiểu `secure-code-guardian`,
  `comprehensive-review` → chọn 1 chính (security) + 1 phụ (review process).

---

## 9. Khi nào KHÔNG dùng skill nào

Dùng skill là **chi phí** (đọc, bám workflow). Không dùng khi:

1. Nhiệm vụ nhỏ hơn chi phí: "sửa typo", "đổi tên biến", "câu hỏi ngắn".
2. Bạn đã là chuyên gia domain của chính task đó và làm trực tiếp nhanh hơn.
3. Sau ≤6 lượt grep không có description nào khớp ≥60% → làm trực tiếp,
   **nói rõ với user là kho không có skill phù hợp**.
4. Skill tìm được xung đột với quy ước dự án hiện tại (repo convention
   luôn thắng skill).
5. Skill yêu cầu dịch vụ trả phí/API key mà user chưa cung cấp.

---

## 10. An toàn khi thực thi skill

1. **Đọc script trước khi chạy** — mọi file trong `scripts/` của skill
   được chọn. Script xấu có thể xóa file, lộ key, gọi network lạ.
2. **API key/secrets:** không bao giờ hardcode; không log ra console;
   không ghi vào file trong repo nguồn.
3. **Lệnh phá hoại** (`rm -rf`, `Remove-Item -Recurse`, format, registry):
   xác nhận với user trước khi chạy.
4. **Cài dependency** do skill yêu cầu: kiểm tra tên package có thật/
   phổ biến (typosquatting), ưu tiên `--dry-run` xem trước.
5. **Network call:** đọc URL trong script; chặn URL lạ/không cần thiết.
6. **Skill Pentest/RE** (zhaoxuya520, uphiago, morluto, yoanbernabeu):
   CHỈ chạy trong phạm vi được ủy quyền rõ ràng bởi user.

---

## 11. Bảo trì kho

```powershell
# Cập nhật toàn bộ (pull + rebuild index/CACHE + quét an ninh) — hoặc để Task Scheduler chạy
powershell -File D:\Skills\tools\update-library.ps1

# Thêm nguồn mới
git clone --depth 1 https://github.com/<owner>/<repo> D:\Skills\<owner>-<repo>
node D:\Skills\tools\build-index.mjs     # ~1 phút, cập nhật INDEX/index/sources/CACHE
node D:\Skills\tools\scan-security.mjs   # quét an ninh scripts
```

- Giới hạn 10 GB (hiện ~2,8 GB). Vượt → xóa nguồn Tier C trước, rồi nguồn
  Tier B ít dùng.
- Nguồn mới phải có ≥1 SKILL.md, nếu không → xóa (trừ khi là tài liệu
  chuẩn như agentskills-spec).
- Sau khi thêm nguồn: cập nhật bảng nguồn ở mục 7 và domain map ở mục 6
  của chính file này.

---

## 12. FAQ

**Hỏi: INDEX.md 13 MB, đọc được không?**
Đáp: Không. Grep/lọc thôi (mục 5). Đây là quy tắc vàng số 1.

**Hỏi: Grep không ra kết quả nào?**
Đáp: (1) Đổi sang từ khóa tiếng Anh; (2) thử đồng nghĩa (`k8s` ↔
`kubernetes`, `deck` ↔ `slides`); (3) nới sang nguồn tổng hợp lớn (sickn33,
opencode-awesome, agentskillexchange); (4) sau 6 lượt vẫn trống → không có.

**Hỏi: 2 skill trùng tên, chọn ai?**
Đáp: Tier cao hơn thắng; ngang tier → bản mô tả đầy đủ hơn/có script hơn.
INDEX.md đã lọc sẵn phần lớn — nếu vẫn thấy cả hai nghĩa là chúng khác nhau
đáng kể, đọc description kỹ hơn.

**Hỏi: Skill tiếng Trung có dùng được không?**
Đáp: Được — nhiều nguồn (baoyu, EthanYoQ, zLanqing) chất lượng cao và
thường có mô tả song ngữ. Dùng khi task liên quan nội dung Trung văn hoặc
skill là lựa chọn tốt nhất bất kể ngôn ngữ.

**Hỏi: Script skill không chạy trên Windows?**
Đáp: Đọc script, dịch thủ công sang PowerShell/lệnh tương đương, hoặc
chạy qua WSL/Git Bash nếu có. Không sửa file gốc trong nguồn.

**Hỏi: Có nên nạp 4–5 skills cùng lúc không?**
Đáp: Chỉ khi nhiệm vụ thật sự gồm nhiều mảng rời rạc (ví dụ: "làm web +
viết tài liệu + tạo slide") và agent ghi rõ lý do từng cái. Mặc định: 3.

**Hỏi: Nguồn tôi thêm bị index bỏ qua?**
Đáp: Chạy lại `node tools\build-index.mjs`. Vẫn 0 → kiểm tra repo có file
đúng tên `SKILL.md` (viết hoa) không; nguồn 0-skill sẽ bị xếp Tier C.

**Hỏi: Làm sao mọi agent tự động biết kho này mà không cần cấu hình gì?**
Đáp: Skill router & orchestrator **`sgeneral`** đã được đăng ký tại
`~/.config/opencode/skills/sgeneral/SKILL.md` (kèm bản copy cho
Claude Code tại `~/.claude/skills/` và mọi agent đọc chuẩn
`~/.agents/skills/`). Skill này ở chế độ **THƯỜNG TRỰC**: mọi task không
tầm thường đều bắt đầu bằng `find-skill.mjs` và kết thúc bằng
`log-skill.mjs` (nhật ký `usage-log.md` tích lũy kinh nghiệm giữa các
phiên). KHÔNG đăng ký cả thư mục `D:\Skills` vào `skills.paths` (sẽ nạp
mô tả ~42.100 skills → nổ ngữ cảnh).

---

## 13. sgeneral — orchestrate nhiều skills

> Skill **`sgeneral`** đã đăng ký toàn cục (hợp nhất router + orchestrator). Khi task
> chạm ≥2 domain cùng lúc (web + marketing, phân tích + báo cáo + xuất
> file, code + security + CI/CD...), agent nên **chuyển từ "tìm 1 skill"
> sang "orchestrate pipeline"** theo quy trình của sglobal/sgeneral:

1. **Phân rã** task thành subtask độc lập, gán domain A–Z mỗi phần.
2. **Tuyển skill** từng subtask: `find-skill.mjs "<tu khoa>" --domain <letter>`.
   Ngân sách tổng **≤5 skills** cho cả pipeline (thay vì ≤3 cho task đơn).
3. **Lập kế hoạch** trình bày: subtask → skill → đầu ra → phụ thuộc.
4. **Thực thi tuần tự**: mỗi thời điểm chỉ 1 skill "đang mở"; đầu ra giữa
   các subtask là artifact cụ thể (file/code/dữ liệu), không giữ trong đầu.
5. **Tổng hợp + kiểm định**: deliverable duy nhất, đối chiếu từng yêu cầu
   gốc, báo cáo "đã dùng skills nào, còn thiếu gì".

Chi tiết đầy đủ: `~/.config/opencode/skills/sgeneral/SKILL.md`
(bản copy cho agent khác nằm ở `~/.claude/skills/` và `~/.agents/skills/`).

---

## 14. taste & natural-voice — lớp nhân cách hóa

Hai skill toàn cục đi kèm router, áp dụng cho **mọi phiên**:

- **`taste`** — cho agent gu và quyền lựa chọn: thang giá trị cá nhân
  (đơn giản > thông minh, có gu > an toàn, chạy được > lý thuyết, mới > cũ,
  chính chủ > fork, ngắn > dài), attitude theo mood task (gấp → quyết đoán,
  gãy → bình tĩnh, sáng tạo → táo bạo...), và nguyên tắc "chọn 1 + nói lý do
  + cam kết" khi các phương án ngang nhau. Là tiebreaker chính thức ở Bước 4
  của quy trình chọn skill.
- **`natural-voice`** — giọng mặc định cho mọi câu trả lời/văn bản: trả lời
  trước, viết như nói, cụ thể thắng trừu tượng, danh sách cấm AI-tells
  ("Tuyệt vời!", tricolon, câu đệm, xã giao rỗng...), bắt nhịp mood user,
  checklist 6 giây trước khi gửi. Bản dài chính thức kết hợp humanizer
  trong kho (EN/ZH/CS/academic).

Nguồn taste/voice/persona chuyên sâu trong kho (grep khi cần): đợt 10 —
`madebymustafa-design-taste`, `rblalock-omakaseagent`, `theonly1me-shadowclone`,
`kkarpushin-tone-of-voice`, `acnlabs-openpersona`, `DiveWind-soul-agent`,
`zhwenchao-jungian-soul-skills`, bộ humanizer đa ngôn ngữ... (xem Phụ lục A).

---

## 15. context-cache & small-model — trí nhớ ngoài và chế độ model nhỏ

- **`context-cache`** (thường trực): trí nhớ AI nằm ở file
  `D:\Skills\cache\active-session.md` qua `tools\cache.mjs`
  (`show`/`set task|next`/`add` checkpoint/`note decision|file|skill`/`clear`).
  Làm tới đâu checkpoint tới đó → **hết context thì phiên mới đọc cache và
  làm tiếp đúng chỗ dừng** — không mất tiến độ, không làm lại từ đầu.
- **`small-model`** (kích hoạt khi model 2B–9B hoặc context bé): vòng lặp
  cố định 6 bước — cache show → `find-skill --one` (1 kết quả tối giản) →
  nạp tối đa 1 skill → checkpoint → set next → lặp. Não yếu bù bằng:
  trí nhớ ngoài + script trả sẵn kết quả + trả lời ≤5 dòng. Kẹt thì ghi
  "ĐANG KẸT" vào cache và báo user — không đoán bừa.

> Hai skill này + `sgeneral` + `taste` + `natural-voice` tạo thành bộ skill
> nền toàn cục của thư viện (đồng bộ tại
> `~/.config/opencode/skills/`, `~/.claude/skills/`, `~/.agents/skills/`).

---

## Phụ lục A — Gói "siêu năng lực nhận thức" (nạp trước khi làm việc khó, tối đa 2–3)

- **Kế hoạch bền vững**: OthmanAdi-planning-with-files · foryourhealth-vibe-skills (routing/orchestration)
- **Tư duy tối giản kiểu senior**: DietrichGebert-ponytail
- **Lateral thinking (de Bono)**: danium-lateral-thinking
- **Ra quyết định có thuật toán (MDP/utility)**: romainsimon-skills-for-decision-making
- **TDD & debugging kỷ luật**: obra-superpowers · kbluck-claude-tdd · vadimcomanescu-agents-skills
- **Code review đúc kết 7500+ session**: houshuang-awesome-claude-code
- **Tiết kiệm token**: JuliusBrussee-caveman · trình bày thẳng vấn đề: ayghri-i-have-adhd
- **Harness năng suất**: affaanm-ecc · addyosmani-agent-skills
- **Tạo skill mới đúng chuẩn**: open-hax-opencode-skills
- **Orchestrate nhiều skill**: sgeneral (router + orchestrator)
- **Gu & cảm xúc khi chọn lựa**: skill `taste` (thang giá trị cá nhân + attitude theo mood)
- **Giọng tự nhiên**: skill `natural-voice` (áp mọi câu trả lời; chống AI-tells)
- **Trí nhớ ngoài / làm tiếp khi hết context**: skill `context-cache` + `node tools\cache.mjs` (show/add/set/note/clear)
- **Model nhỏ 2B-9B**: skill `small-model` — vòng lặp siêu ngắn, `find-skill --one`, mọi thứ ghi cache, script thay não
- **Debug/fix lỗi**: skill `debug` — 6 bước evidence-first: tái hiện → evidence → giả thuyết xếp hạng → thí nghiệm 1 biến → fix gốc → chống hồi quy; bug lớn có file kế hoạch `debug-*.md`. *On-call: KHÔNG auto-nạp ở bất kỳ agent nào — chỉ dùng khi user gọi, đọc file `D:\Skills\tools\on-demand\debug\SKILL.md`.* · dưới đó nạp từ kho: bug-hunter (adversarial auto-fix) · 5-whys + buddhist-method (root-cause, anti-hallucination) · triage-flaky-test (flaky CI) · workersio/bug-solver · x64dbg/RenderDoc (native/GPU) · umit-jvm, pyroscope, iOS-Trace (profiling) · ship-ready (production-proof)
- **Học & dạy**: feynman-tutor (Feynman technique) · indelible (học không quên) · education-skills · university-teacher (49 skills)
- **Tài chính kế toán**: openaccountant (44 skills P&L/tax/budget) · gajeto-financeskills · cfo-expert (GAAP) · brainbytes-finance (51 skills)
- **Data engineering**: vaquarkhan (74 workflows) · unknown333 (dbt/Airflow/Spark/Dagster) · etl-skills
- **Support & HR**: composio-support (triage/SLA/sentiment) · recruiting-skills (JD/screening bias-aware) · HRClaw
- **Tra cứu internet/thông tin**: skill `tracuu` — tìm đa nguồn → đối chiếu → kiểm chứng → trích nguồn kèm ngày; kết hợp web search/fetch của agent. *On-call: chỉ dùng khi user gọi, đọc file `D:\Skills\tools\on-demand\tracuu\SKILL.md`.*
- **Văn phòng (Word/PPT/Excel/PDF)**: skill `vanphong` — nạp skill chính chủ đúng loại file (anthropics-skills: docx/pptx/xlsx/pdf · claude-office-skills · iOfficeAI-OfficeCLI · markdown-exporter) rồi làm theo workflow. *On-call: chỉ dùng khi user gọi, đọc file `D:\Skills\tools\on-demand\vanphong\SKILL.md`.*
- **Giải hình học phổ thông**: skill `hinhoc` — liệt kê giả thiết → nhận dạng dạng bài (lớp 6-12) → tính/chứng minh → kiểm chứng SymPy bắt buộc; bí thì tọa độ hóa. *On-call: chỉ dùng khi user gọi, đọc file `D:\Skills\tools\on-demand\hinhoc\SKILL.md`.*
- **Taste chuyên sâu từ kho**: leonxlnx-taste-skill · madebymustafa-design-taste · rblalock-omakaseagent · theonly1me-shadowclone (học gu user) · soheilmomeniii-no-slop
- **Humanizer đa ngôn ngữ**: blader-humanizer (EN) · op7418-humanizer-zh (ZH) · bejek-humanizer-czech (CS) · NulightJens-humanizer-stack (2-pass) · AIScientists-Dev-academic-humanizer (bài báo)
- **Persona/cảm xúc nhân bản**: acnlabs-openpersona · DiveWind-soul-agent · zhwenchao-jungian-soul-skills

---

*Kết thúc SKILLS.md. Hãy nhớ: kho này phục vụ tốc độ và chính xác — không
phải cuộc thi đọc nhiều nhất. Tra nhanh, chọn ít, làm việc đúng.*
