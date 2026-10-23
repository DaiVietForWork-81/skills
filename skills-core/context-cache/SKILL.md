---
name: context-cache
description: ALWAYS-ON external memory for the agent. Persist working state to D:\Skills\cache\active-session.md continuously, so when context runs out ANY agent can read the cache and resume exactly where work stopped. Read the cache FIRST at session start and whenever the user says "làm tiếp", "tiếp tục", "tiếp đi", "resume", "còn dở", or references earlier unfinished work. Also use when the user says "lưu lại", "ghi nhớ phiên", "checkpoint", or before ending any long task. Combine with small-model mode on weak models.
license: MIT
metadata:
  store: D:\Skills\cache\active-session.md
  tool: D:\Skills\tools\cache.mjs
---

# Context Cache — trí nhớ ngoài, làm tiếp không mất dòng

Nguyên lý: **não có thể bị xóa (context hết), nhưng cache không bao giờ
quên.** Mọi việc quan trọng phải nằm trong file, không chỉ trong đầu.

## Vòng lặp bắt buộc

```powershell
# 1. ĐẦU PHIÊN / khi user nói "làm tiếp":
node D:\Skills\tools\cache.mjs show

# 2. Đặt/cập nhật mục tiêu khi bắt đầu hoặc đổi hướng:
node D:\Skills\tools\cache.mjs set task "<task hiện tại>"
node D:\Skills\tools\cache.mjs set next "<việc kế tiếp>"

# 3. CHECKPOINT SAU MỖI BƯỚC QUAN TRỌNG (xong 1 việc = 1 add):
node D:\Skills\tools\cache.mjs add "<vừa xong gì>"

# 4. Ghi điều không được phép quên:
node D:\Skills\tools\cache.mjs note decision "<quyết định quan trọng>"
node D:\Skills\tools\cache.mjs note file "<file đang sửa/tạo>"
node D:\Skills\tools\cache.mjs note skill "<skill đã nạp>"

# 5. TASK XONG: archive + reset (không để cache cũ nhầm phiên mới):
node D:\Skills\tools\cache.mjs clear
```

## Quy tắc

- **Làm tới đâu, add tới đó** — checkpoint mỗi bước đáng kể (vài phút/lần).
  Hết context giữa chừng cũng không mất gì vì `next` + `Done` là đầy đủ.
- `next` LUÔN phải đủ cụ thể để phiên mới làm được ngay ("viết hàm X trong
  file Y", không phải "tiếp tục").
- Đọc cache đầu phiên → nếu `task` khớp việc user đang yêu cầu → làm tiếp
  từ `next`, KHÔNG làm lại từ đầu.
- Khi user bảo "lưu lại/kết thúc" → set `next` cho bước kế, xong.
- Cache file là dữ liệu làm việc: KHÔNG sửa tay bằng editor, chỉ qua cache.mjs.
