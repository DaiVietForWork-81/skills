# D:\Skills — Thư viện Skills cho AI Agent

> Kho skills dùng chung để AI agent **tự tìm kiếm, đối chiếu và lựa chọn**
> skill phù hợp cho từng nhiệm vụ — thay vì nạp toàn bộ vào ngữ cảnh.

## Số liệu

- **Vị trí:** `D:\Skills`
- **Quy mô:** 240 nguồn, ~60.500 file SKILL.md (~42.100 skills duy nhất sau
  khi lọc trùng lặp 2 lớp), tổng dung lượng ~3,9 GB (giới hạn cho phép: 10 GB).
- **Phạm vi:** web, mobile, backend, Python, C++, thuật toán, AI/ML, data,
  DevOps, security, luật, y sinh, tài chính, marketing, văn phòng, game,
  thiết kế, media, nghiên cứu... (26 nhóm lĩnh vực).

## Cấu trúc

```text
D:\Skills\
├── README.md            ← file này (giới thiệu sơ qua)
├── SKILLS.md            ← ★ QUAN TRỌNG NHẤT — AI agent phải đọc file này đầu tiên
├── usage-log.md         ← nhật ký skill đã dùng + kết quả (tích lũy taste giữa các phiên)
├── INDEX.md             ← chỉ mục ~42.100 skills [kèm domain A–Z] — chỉ dùng GREP
├── index.json           ← chỉ mục máy đọc [{name, description, path, domain}] — chỉ LỌC
├── sources.json         ← thống kê nguồn (+ commit SHA + ngày cập nhật từng nguồn)
├── security.json        ← kết quả quét an ninh scripts (skill nào có cờ RISK)
├── tools/
│   ├── build-index.mjs  ← tạo lại INDEX/index/sources/CACHE (kèm domain tag + SHA)
│   ├── find-skill.mjs   ← ★ tìm skill: node tools\find-skill.mjs "tu khoa" [--domain M]
│   ├── scan-security.mjs← quét pattern nguy hiểm trong scripts của toàn kho
│   ├── verify-library.mjs ← health check kho: file bắt buộc, tuổi index, path lệch
│   ├── cache.mjs        ← session checkpoint (trí nhớ ngoài giữa các phiên)
│   ├── log-skill.mjs    ← ★ ghi nhật ký dùng skill: log-skill "<skill>" "<task>" good|ok|bad
│   └── update-library.ps1 ← pull toàn bộ + rebuild + quét an ninh (chạy tay hoặc hẹn giờ)
└── <ten-nguon>/         ← 240 thư mục nguồn (mỗi nguồn = 1 repo/bộ sưu tập)
    └── .../SKILL.md     ← file skill (nằm ở độ sâu bất kỳ trong nguồn)
```

## AI agent cần làm gì

1. **CHẾ ĐỘ THƯỜNG TRỰC:** mọi task không tầm thường đều bắt đầu bằng
   `node D:\Skills\tools\find-skill.mjs "tu khoa" --limit 5` — không chờ
   user nhắc. Skill duy nhất `sgeneral` (Router tìm kiếm & Master Orchestrator)
   đã đăng ký toàn cục cho opencode/Claude Code/Antigravity (và mọi agent đọc
   `~/.agents/skills`).
2. Chọn ≤3 skill → Read file SKILL.md ở đường dẫn trả về → làm đúng
   workflow. Chi tiết + gói siêu năng lực: `SKILLS.md` (Phụ lục A).
3. Task chạm **nhiều domain cùng lúc** → dùng skill `sgeneral`.
4. Sau khi dùng: `node tools\log-skill.mjs "<skill>" "<task>" good|ok|bad`
   — các phiên sau đọc `usage-log.md` để ưu tiên skill đã chạy tốt.
5. Tuyệt đối **không đọc nguyên** `INDEX.md` (~42.100 dòng) hay `index.json`
   (~14 MB) — chỉ grep/lọc lấy phần cần.

## Dùng với các agent khác

| Agent | Cách kết nối | Đã cài |
|---|---|---|
| opencode | skill toàn cục `~/.config/opencode/skills/` | ✓ |
| Claude Code | skill `~/.claude/skills/` + pointer trong `CLAUDE.md` | ✓ |
| Codex CLI | pointer `~/.codex/AGENTS.md` | ✓ |
| Gemini CLI | pointer `~/.gemini/GEMINI.md` | ✓ |
| Antigravity | pointer `~/.gemini/antigravity/AGENTS.md` | ✓ |
| Mọi agent đọc chuẩn `~/.agents/skills` | skill copy tại đó | ✓ |
| Cursor / OpenClaw / khác | chưa cài trên máy — cài xong chỉ cần copy 2 skill trên + thêm pointer AGENTS.md | — |

## Bảo trì

- **Tự động hằng tuần:** Task Scheduler `SkillsLibrary Weekly Update`
  (Chủ nhật 03:30) chạy `tools\update-library.ps1`: git pull mọi nguồn →
  rebuild index → quét an ninh. Log: `tools\update-log.txt`.
- Chạy tay: `powershell -File D:\Skills\tools\update-library.ps1`.
- Thêm nguồn mới: clone vào `D:\Skills\<ten-nguon>\` rồi chạy
  `node tools\build-index.mjs`, sau đó cập nhật bảng nguồn trong `SKILLS.md`.
- Giới hạn dung lượng 10 GB; vượt thì xóa nguồn 0-skills hoặc ít giá trị trước.
- Không sửa nội dung bên trong các nguồn (giữ nguyên để pull bản mới).

---
*Mỗi nguồn giữ license riêng của repo gốc. File SKILLS.md là kim chỉ nam —
agent phải tuân thủ quy trình và giới hạn nạp ở đó.*
