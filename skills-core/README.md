# skills-core — Bộ 5 skill nền toàn cục

Đây là bộ skill **thường trực** (always-on) của hệ thống — khác với
`tools/on-demand/` (chỉ chạy khi được gọi). Bản chính thức được cài tại
3 nơi trên máy:

- `~/.config/opencode/skills/` (opencode)
- `~/.claude/skills/` (Claude Code)
- `~/.agents/skills/` (chuẩn chung cho mọi agent đọc AGENTS.md)

| Skill | Vai trò |
|---|---|
| `sgeneral` | Router & Orchestrator hợp nhất — cổng vào thư viện D:\Skills (~42.149 skills, 240 nguồn) |
| `context-cache` | Trí nhớ ngoài: checkpoint tiến độ phiên qua `tools/cache.mjs` |
| `small-model` | Chế độ model nhỏ 2B-9B: vòng lặp siêu ngắn, script thay não |
| `taste` | Gu & cảm xúc khi chọn lựa; chọn 1 + lý do khi các phương án ngang nhau |
| `natural-voice` | Giọng tự nhiên cho mọi câu trả lời (chống "mùi AI") |

## Cài trên máy mới

1. Clone repo này về `D:\Skills`.
2. Copy file quy tắc gốc: `skills-core/AGENTS-global.md` →
   `~/.config/opencode/AGENTS.md` (file này chứa QUY TẮC THƯỜNG TRỰC —
   linh hồn của hệ thống, mọi phiên agent đều đọc).
3. Copy từng thư mục skill trong `skills-core/` (trừ `README.md` +
   `AGENTS-global.md`) vào cả 3 nơi:
   ```powershell
   Copy-Item D:\Skills\skills-core\* "$env:USERPROFILE\.config\opencode\skills\" -Recurse -Force
   Copy-Item D:\Skills\skills-core\* "$env:USERPROFILE\.claude\skills\" -Recurse -Force
   Copy-Item D:\Skills\skills-core\* "$env:USERPROFILE\.agents\skills\" -Recurse -Force
   ```
3. Clone các nguồn thư viện vào `D:\Skills\<owner>-<repo>\` (mỗi nguồn là
   1 repo riêng), rồi chạy `node tools\build-index.mjs` để tạo INDEX.
4. Kiểm tra: `node tools\verify-library.mjs` → "KHỎE".

## Quy tắc đồng bộ (quan trọng)

Sau MỖI lần sửa skill nền: copy sang đủ 3 nơi và kiểm tra hash giống
nhau — 3 bản phải luôn y hệt. Sửa `AGENTS.md` toàn cục thì cập nhật luôn
bản copy tại `skills-core/AGENTS-global.md`. Sửa xong commit + push repo này.

*Bộ on-call (8 skill theo domain: debug, tracuu, vanphong, hinhoc, vanhoc,
lyhoa, tienganh, vietvan) nằm ở `tools/on-demand/`.*
