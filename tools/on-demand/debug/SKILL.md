---
name: debug
description: Chế độ DEBUG kỷ luật — chẩn đoán nguyên nhân gốc rồi mới sửa, không vá mù theo đoán. Dùng khi có lỗi/sai hành vi cần tìm nguyên nhân: "fix giùm bug", "chạy bị lỗi", "traceback này nghĩa là gì", "test thỉnh thoảng fail", "chạy chậm bất thường", "crash", "sai kết quả", "tại sao nó làm vậy", "gỡ lỗi", "không biết lỗi ở đâu". KHÔNG dùng cho viết tính năng mới từ đầu — đó là việc code bình thường (nạp skill theo sgeneral).
license: MIT
metadata:
  companion: sgeneral
  library-domain: awesomeskills-5-whys, nai0om-buddhist-method, codexstar69-bug-hunter, datadog-agent-skills
---

# Debug — chẩn đoán gốc rễ, không vá mù

Nguyên tắc số 1: **evidence trước, giả thuyết sau**. Đọc kỹ thông tin lỗi
đã có → mới hình thành giả thuyết → mỗi giả thuyết phải được một thí
nghiệm xác nhận hoặc loại bỏ. Sửa theo "đoán bừa rồi may" là cấm.

## Quy trình 6 bước

1. **Tái hiện (reproduce)** — lỗi tái hiện được chưa? Tìm repro nhỏ nhất.
   Lỗi thỉnh thoảng mới dính (flaky/heisenbug): ghi lại ĐIỀU KIỆN tái
   hiện (môi trường, dữ liệu, thứ tự chạy, thời điểm) — đó là mảnh
   evidence quý nhất.
2. **Thu evidence** — traceback/log/stack TRỌN VẸN, không đọc lướt.
   Lỗi xuất hiện từ khi nào? `git bisect`/diff commit gần nhất nếu repo
   có git. Hỏi user phần còn thiếu nếu không đủ — đừng đoán mù thay vì
   hỏi 1 câu.
3. **Giả thuyết có xếp hạng** — liệt kê 2-4 giả thuyết, xếp theo
   (xác suất × độ rẻ khi kiểm chứng), kiểm chứng giả thuyết rẻ nhất
   trước. Ghi rõ: giả thuyết nào bị bằng chứng nào loại bỏ.
4. **Thí nghiệm nhỏ nhất** — mỗi lần chỉ đổi MỘT biến (1 print/breakpoint,
   chạy 1 test đơn lẻ, tắt 1 cờ). Chạy nhiều "cách sửa" cùng lúc = không
   biết cái nào chữa được.
5. **Fix gốc rễ** — sửa đúng nguyên nhân, không vá triệu chứng. Chưa tìm
   được gốc? Nói rõ, vá tạm kèm TODO + rủi ro, không im lặng "vá cho
   chạy".
6. **Chống hồi quy** — chạy lại bài kiểm chứng; nếu hợp lý, viết 1 test
   bắt đúng lỗi này; ghi 1 dòng nguyên nhân gốc để lần sau đỡ đau.

## Bug lớn / nhiều lớp → lập kế hoạch debug

Khi lỗi vượt một phiên (không rõ phạm vi, nhiều hệ thống, flaky khó
tái hiện): ghi file `D:\Skills\cache\debug-<ten-loi>.md` gồm: triệu
chứng, evidence đã thu, danh sách giả thuyết + trạng thái (✓ xác nhận /
✗ loại / chưa thử), thí nghiệm đã làm + kết quả. Sau mỗi phiên: cập nhật
file + 1 dòng `node D:\Skills\tools\cache.mjs add "debug: <tiến độ>"`.
Quy tắc: **không lặp lại thí nghiệm đã loại** — file kế hoạch là nguồn
chân lý, không phải trí nhớ tạm.

## Nạp skill thư viện khi cần (tối đa 2-3)

```powershell
node D:\Skills\tools\find-skill.mjs "root cause" --limit 3    # 5-whys, buddhist-method
node D:\Skills\tools\find-skill.mjs "flaky test" --limit 3    # triage-flaky-test (Datadog)
node D:\Skills\tools\find-skill.mjs "profiling <ngon ngu>" --limit 3
```

- Root cause: `5-Whys Root Cause Analysis`, `buddhist-method` (chống
  hallucination khi tìm gốc)
- Sửa adversarial có kiểm chứng: `bug-hunter`, `hunter`, `fixer`,
  `skeptic` (codexstar69-bug-hunter)
- Flaky/CI: `triage-flaky-test`; native: `x64dbg`; GPU: `renderdoc-gpu-debug`;
  JVM: `async-profiler`/`jmh`; production: `ship-ready`
- Skill đáng nhớ: `diagnose-before-editing`, `tests-that-catch-bugs`
  (theonly1me-shadowclone)

## An toàn & giới hạn (không thoả hiệp)

1. **Không phá dữ liệu khi tái hiện/fix**: cấm `rm -rf`, `DROP TABLE`,
   xóa collection/truncate, format... Yêu cầu kiểu "xóa luôn bảng/data
   cho hết lỗi" → từ chối, đề xuất: backup → thao tác trên bản copy/
   sandbox → điều tra gốc (thường là lock/ràng buộc) rồi mới quyết.
2. **Production**: giảm thiệt hại trước (rollback/feature flag/tắt tính
   năng), debug sau trên môi trường giống prod chứ không phải đập sửa
   trực tiếp nơi có data thật của người dùng.
3. **Không giấu lỗi**: tìm ra nguyên nhân nói rõ; vá tạm phải ghi chú
   rõ ràng. "Chạy được mà không biết vì sao" là chưa xong.
4. **Không bịa nguyên nhân**: chưa chắc thì nói chưa chắc + đề xuất thí
   nghiệm tiếp theo. Nguyên nhân bịa sai còn tệ hơn không biết.
5. **Phạm vi thay đổi tối thiểu**: fix bug không kèm refactor "tiện tay"
   — refactor riêng PR/commit khác.

## Chốt phiên debug

4 dòng: (1) nguyên nhân gốc đã xác nhận bằng evidence chưa, (2) fix nào
đã áp, (3) kiểm chứng nào chống hồi quy, (4) việc còn treo + bước tiếp.
