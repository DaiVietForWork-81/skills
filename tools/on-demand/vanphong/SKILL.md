---
name: vanphong
description: Chế độ VĂN PHÒNG — tạo & sửa file Word (docx), PowerPoint (pptx), Excel (xlsx), PDF đúng chuẩn. Dùng khi user cần "làm file Word", "soạn báo cáo docx", "tạo slide thuyết trình", "làm bảng tính Excel", "tạo PPT", "điền dữ liệu vào Excel", "xuất PDF", "sửa file office". KHÔNG dùng cho đọc file office đã có sẵn mà chỉ cần trích nội dung đơn giản (Read trực tiếp nhanh hơn) — trừ khi phải sửa/tạo mới.
license: MIT
metadata:
  companion: sgeneral
  library-domain: anthropics-skills, claude-office-skills, iOfficeAI-OfficeCLI, bowenliang123-markdown-exporter
---

# Vanphong — tài liệu Office chuyên nghiệp

Nguyên tắc số 1: **nạp skill library đúng loại file trước khi làm** —
đừng tự bịa cách tạo docx/pptx/xlsx, trong kho có skill chính chủ chuẩn.

## Quy trình 5 bước

1. **Chốt yêu cầu** — loại file (docx/pptx/xlsx/pdf)? Nội dung & độ dài?
   Đối tượng (sếp, khách, nộp bài)? Có mẫu/format bắt buộc không? File
   gốc cần sửa hay tạo mới? Không rõ thì hỏi 1-2 câu trước khi làm —
   làm sai format là làm hai lần.
2. **Nạp skill đúng loại file** (đã verify: tên chính xác hiện hành):
   ```powershell
   node D:\Skills\tools\find-skill.mjs "docx" --source anthropics-skills --limit 3
   node D:\Skills\tools\find-skill.mjs "pptx" --source anthropics-skills --limit 3
   node D:\Skills\tools\find-skill.mjs "xlsx spreadsheet" --source anthropics-skills --limit 3
   ```
   Nguồn đáng tin theo thứ tự:
   - `anthropics-skills` — **chính chủ**, skill tên đúng `docx` / `pptx` /
     `xlsx` / `pdf` (Q domain) — chuẩn nhất, ưu tiên số 1
   - `claude-office-skills` — `docx-manipulation`, `excel-automation`,
     `data-analysis`, `html-to-ppt` (Marp), `office-mcp`, `pdf-converter`,
     `pdf-to-docx`
   - `iOfficeAI-OfficeCLI` — thao tác Office qua CLI
   - `bowenliang123-markdown-exporter` — Markdown → Word/PPT nhanh
3. **Làm đúng workflow của skill** — thường dùng python-docx / openpyxl /
   python-pptx hoặc OOXML trực tiếp. Giữ phong cách nhất quán: font,
   cỡ chữ, màu, header/footer theo yêu cầu (mặc định sạch, chuyên nghiệp,
   không rainbows).
4. **Tiếng Việt ưu tiên Unicode**: font Times New Roman/Calibri/Arial;
   sau khi tạo, kiểm tra lại dấu tiếng Việt không lỗi font; Excel đặt
   đúng kiểu dữ liệu (ngày là ngày, số là số — không nhét số vào text).
5. **Kiểm tra & giao** — mở lại file xác nhận (số slide/sheet, không lỗi
   mở, đúng nội dung chính), rồi báo: đường dẫn + tóm tắt nội dung +
   hạn chế (nếu có).

## Công thức nhanh theo loại

- **Word**: cấu trúc trước (tiêu đề → mục → nội dung) rồi mới trau chữ;
  heading dùng Heading 1/2 (không in đậm thủ công) để có mục lục tự động.
- **PowerPoint**: 1 slide 1 ý; tiêu đề ngắn + bullet ≤5 dòng; số liệu
  thành biểu đồ thay vì bảng chữ; slide mở/cõi cuối có call-to-action.
- **Excel**: tách "dữ liệu thô" và "bảng trình bày"; công thức thay vì
  hard-code kết quả; đặt tên vùng dữ liệu; biểu đồ gắn đúng phạm vi.
- **PDF**: xuất từ docx/pptx có sẵn (giữ layout); cần điền form thì
  kiểm tra field trước.

## An toàn & giới hạn (không thoả hiệp)

1. **Không đè file gốc của user**: sửa file có sẵn → làm trên bản copy
   (vd. `ten_file_sua.docx`), chỉ ghi đè khi user yêu cầu rõ ràng.
2. **Script của skill phải kiểm tra trước khi chạy** — file có cờ RISK
   trong `security.json` thì đọc script trước; không chạy macro/PowerShell
   lồng trong file office tải từ ngoài.
3. **Không bịa số liệu**: báo cáo có con số thì số phải đến từ user cấp
   hoặc nguồn đã tra cứu (kèm ghi rõ); trống thì để trống + ghi chú.
4. **Dung lượng hợp lý**: hình chèn nén trước (image >2MB làm file phình),
   không nhúng font không cần thiết.

## Chốt phiên

3 dòng: (1) file đã tạo/sửa ở đâu, (2) nội dung chính + cấu trúc,
(3) việc tiếp theo có thể làm (vd. "muốn thêm biểu đồ vào slide 3 thì nói").
