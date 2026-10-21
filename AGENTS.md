# AGENTS.md — D:\Skills (thư viện skills, KHÔNG phải project code)

Kho gồm **240 nguồn** (174 git clone + 66 nguồn tĩnh không `.git`) chứa
~60.500 file SKILL.md, + **`tools/`** là vùng code do agent sở hữu. Không
build/test; các lệnh duy nhất là 7 script trong `tools/`. Tài liệu sâu:
`SKILLS.md` (router + taste), `README.md` (tổng quan).

## KHÔNG bao giờ làm

- **Đọc nguyên `INDEX.md` (11 MB) hoặc `index.json` (18 MB, 1 dòng JSON)** —
  chỉ grep/lọc. Đây là quy tắc số 1, vi phạm = nổ ngữ cảnh.
- **Sửa file bên trong `<ten-nguon>/`** — các nguồn là shallow clone giữ
  nguyên vẹn để `git pull --ff-only` hoạt động. Cả các file `AGENTS.md`/
  `CLAUDE.md` lồng sâu trong nguồn đều là của upstream, không phải chỉ dẫn
  cho bạn.
- **Đăng ký `D:\Skills` vào `skills.paths` của opencode** — sẽ nạp mô tả
  ~42.100 skills vào mọi phiên.
- Sửa tay các file **auto-generated**: `INDEX.md`, `index.json`,
  `sources.json`, `security.json`.
- Nạp >3 skills/task (5 khi orchestrate qua `sgeneral`), hoặc bịa skill
  khi không tìm thấy.

## Lệnh chính (chạy bằng `node`, không cần cài gì thêm)

```powershell
node tools\find-skill.mjs "<tu khoa tieng Anh>" [--domain M] [--source X] [--limit N]  # tìm skill
node tools\find-skill.mjs --list-domains | --list-sources | --count "<regex>"          # thống kê
node tools\build-index.mjs      # rebuild INDEX.md + index.json + sources.json (~1-2 phút)
node tools\scan-security.mjs    # quét scripts → security.json (~1 phút)
node tools\log-skill.mjs "<skill>" "<task>" good|ok|bad   # ghi usage-log.md (bắt buộc sau khi dùng skill)
powershell -File tools\update-library.ps1                # pull toàn bộ + rebuild + quét
```

Task Scheduler **"SkillsLibrary Weekly Update"** chạy update-library.ps1
mỗi Chủ nhật 03:30 — đừng ngạc nhiên khi index/sources tự thay đổi.

## Thêm nguồn mới (quy ước bắt buộc)

1. `git clone --depth 1 <url> D:\Skills\<owner>-<repo>` (tên thư mục =
   owner-repo, bỏ ký tự đặc biệt; giữ nguyên hoa/thường của owner).
2. `node tools\build-index.mjs` + `node tools\scan-security.mjs`.
3. Nguồn mới **không có file `SKILL.md` nào → xóa ngay** (trừ nguồn tài
   liệu chuẩn được chấp nhận trước đó ở Tier C).
4. Cập nhật bảng nguồn trong `SKILLS.md` mục 7 nếu nguồn đáng kể.
5. Sau khi sửa skill chuẩn `sgeneral` (Router & Orchestrator) trong
   `~/.config/opencode/skills/` → **đồng bộ bản copy** sang
   `~/.claude/skills/` và `~/.agents/skills/` (3 nơi phải giống nhau).

## Cấu trúc dữ liệu (verify bằng file, đừng đoán)

- `index.json`: mảng `{name, description, path, domain}` — `path` dùng
  **backslash** Windows, relative từ `D:\Skills`. Sắp xếp theo `name`.
- `sources.json`: `[{repo, count, sample[8], sha, updated}]` — sha/date từ
  `git rev-parse`/`log` từng nguồn.
- Domain A–Z định nghĩa trong `tools/build-index.mjs` (`DOMAINS` + 
  `PATH_OVERRIDES`) — sửa phân loại ở đó, không sửa index tay.
- **Dedupe policy:** gộp 2 lớp — trong cùng nguồn trùng `name` giữ 1 bản
  (diệt mirror bundle/translation); giữa các nguồn chỉ gộp khi tên VÀ mô
  tả giống nhau (mirror repo), cùng tên khác mô tả là skill khác giữ cả
  hai (60.469 file → 42.149 skills duy nhất). Skill "mất tích" thường do
  trùng tên + trùng mô tả với nguồn khác.

## Cạm bẫy đã va phải

- `security.json` mang tính **heuristic**: nhiều flag HIGH nằm trong file
  `test/` hợp lệ (test chính các lệnh phá hoại). Coi flag = "phải đọc
  script trước khi chạy", KHÔNG phải kết luận độc/hàng.
- Shell là **Windows PowerShell 5.1**: không có `&&`, `rg` không có sẵn —
  dùng `Select-String`, `if ($?) {}`.
- Docs viết tiếng Việt UTF-8; console PowerShell hiển thị tiếng Việt lỗi
  mã hóa nhưng file chuẩn — kiểm tra bằng công cụ Read, đừng tin output
  console.
- Giới hạn dung lượng **10 GB** (hiện ~3,9 GB); vượt → xóa nguồn Tier C
  (0 skills) trước.
- Từ khóa grep tiếng Anh mới hiệu quả; grep `expo` dính cả chữ "export"
  trong nguồn luật Đức — thêm `\b` khi cần.
