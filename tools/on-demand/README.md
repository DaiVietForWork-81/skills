# tools/on-demand — Skill on-call (chỉ dùng khi được gọi)

Các skill trong đây **KHÔNG auto-nạp** vào bất kỳ agent nào (opencode,
Claude Code...). Khi user gọi — "dùng skill X...", "áp skill X" — agent
đọc file `SKILL.md` tương ứng rồi làm theo. Mục lục đầy đủ luôn nằm ở
`D:\Skills\SKILLS.md` Phụ lục A.

| Skill | Dùng khi | File |
|---|---|---|
| `debug` | Lỗi/sai hành vi cần tìm nguyên nhân gốc (code, CI, production) | `debug/SKILL.md` |
| `tracuu` | Tra cứu internet/thông tin — đa nguồn, kiểm chứng, trích dẫn | `tracuu/SKILL.md` |
| `vanphong` | Tạo/sửa Word, PowerPoint, Excel, PDF | `vanphong/SKILL.md` |
| `hinhoc` | Giải hình học phổ thông (tính + chứng minh, kiểm chứng SymPy) | `hinhoc/SKILL.md` |
| `vanhoc` | Phân tích tác phẩm, nghị luận văn học, ôn thi Văn | `vanhoc/SKILL.md` |
| `lyhoa` | Vật lý & hóa học phổ thông (kiểm chứng đơn vị + bảo toàn) | `lyhoa/SKILL.md` |
| `tienganh` | Dịch VN↔EN, sửa lỗi, giải thích ngữ pháp, luyện IELTS/TOEIC | `tienganh/SKILL.md` |
| `vietvan` | Đơn từ, email công việc, báo cáo, thông báo, caption/post | `vietvan/SKILL.md` |

## Quy ước thêm skill mới

1. Tạo thư mục `<ten>/SKILL.md` theo form chuẩn thống nhất:
   frontmatter (`name`, `description` có trigger + phạm vi loại trừ,
   `license`, `metadata`) → "Nguyên tắc số 1" → Quy trình → Nạp skill thư
   viện → An toàn & giới hạn → Chốt phiên.
2. Thêm dòng vào bảng trên + 1 bullet trong `SKILLS.md` Phụ lục A.
3. KHÔNG copy vào `~/.config/opencode/skills/`, `~/.claude/skills/`,
   `~/.agents/skills/` — những nơi đó là skill nền thường trực.
4. Commit git (repo `D:\Skills` chỉ track `tools/` + docs gốc).

*Đây cũng là bộ mẫu cấu trúc skill để tham chiếu khi viết/training skill mới.*
