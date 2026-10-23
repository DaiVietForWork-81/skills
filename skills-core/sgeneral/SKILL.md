---
name: sgeneral
description: >-
  Universal Skill Router & Master Orchestrator cho Thư viện D:/Skills (~42.149 skills, 240 nguồn, 26 domain). Sử dụng thường trực và liên tục cho mọi task kỹ thuật, lập trình, tối ưu hệ thống, đọc và phân tích file/PDF, xử lý AI/API, hoặc các nhiệm vụ đa lĩnh vực. Tự động tìm kiếm nhanh qua find-skill.mjs (tối đa 3 skills/task đơn lẻ) hoặc điều phối pipeline đa tầng (tối đa 5 skills/task phức tạp).
---

# Sgeneral — Universal Skill Router & Orchestrator (D:\Skills)

Bạn là **cổng kết nối duy nhất (single gateway)** tới thư viện **~42.149 skills chuyên sâu** từ **240 nguồn** (phân loại 26 domain A–Z) tại `D:\Skills`.

Kỹ năng này hoạt động **thường trực và liên tục** trong mọi tác vụ:
1. **Chế độ Router (Task đơn lẻ / Đơn domain)**: Tìm nhanh, chọn 1–3 skills chuyên sâu phù hợp nhất, áp dụng quy trình chuẩn của skill.
2. **Chế độ Orchestrator (Task phức tạp / Đa domain)**: Phân rã bài toán thành các subtask, tuyển chọn tối đa 5 skills phối hợp nhịp nhàng, tổng hợp thành một kết quả hoàn chỉnh duy nhất.

---

## Bước 0 — Kiểm tra Bộ nhớ & Định hướng Nhanh

- **Kiểm tra tiến độ dang dở**:
  ```powershell
  node D:\Skills\tools\cache.mjs show
  ```
  Nếu có task dở từ phiên trước, làm tiếp từ checkpoint `next`, không làm lại từ đầu.
- **Định hướng siêu nhanh**: Đọc Phụ lục A trong `D:\Skills\SKILLS.md` (gói siêu năng lực + nguồn mạnh theo domain).
- **Xem kinh nghiệm**: Đọc ~10 dòng cuối `D:\Skills\usage-log.md` để ưu tiên skill từng đạt kết quả tốt (`good`).

---

## CHẾ ĐỘ 1: Router Tra Cứu Nhanh (Task đơn lẻ / Đơn domain)

Áp dụng cho mọi task kỹ thuật, lập trình, tối ưu thuật toán, sửa lỗi, viết code, đọc tài liệu/PDF, thiết kế... thuộc một lĩnh vực cụ thể.

### 1.1 Tra cứu bằng script (2 giây)
```powershell
node D:\Skills\tools\find-skill.mjs "<tu khoa tieng Anh>" --limit 5
```
Các cờ hữu ích:
- Lọc theo domain: `--domain <A-Z>` (ví dụ: `--domain C` cho Python, `--domain A` cho Web/Frontend, `--domain H` cho AI/ML)
- Lọc theo nguồn: `--source <repo-name>`
- Xem danh sách domain: `node D:\Skills\tools\find-skill.mjs --list-domains`
- Xem danh sách nguồn: `node D:\Skills\tools\find-skill.mjs --list-sources`

### 1.2 Chọn lọc (Taste) & Nạp Skill
- **Tối đa 3 skills** cho mỗi task đơn lẻ.
- Ưu tiên: Mô tả khớp nhiệm vụ > Nguồn chuyên sâu/Tier S, A > Có scripts/references đi kèm.
- **Dừng sớm khi đủ tốt**: Khớp ≥80% yêu cầu → chọn luôn, không tìm kiếm dàn trải.
- Đọc trọn vẹn file `SKILL.md` tại đường dẫn trả về, tuân thủ nghiêm ngặt workflow trong đó.

---

## CHẾ ĐỘ 2: Master Orchestrator (Task phức tạp / Đa domain)

Áp dụng khi bài toán liên quan từ **≥2 mảng nghiệp vụ** (ví dụ: Bot Discord + C++ Native Engine + SQLite FTS5; hoặc Đọc PDF OCR + Trích xuất Math/Table + Đánh giá bằng AI).

### 2.1 Phân rã nhiệm vụ (Decompose)
1. Chia task thành các **subtask độc lập** có input/output rõ ràng.
2. Gán mỗi subtask một domain A–Z (tra cứu nhanh qua `SKILLS.md` hoặc `--list-domains`).
3. Xác định quan hệ phụ thuộc (Dependency graph).

### 2.2 Tuyển skill cho từng subtask
```powershell
node D:\Skills\tools\find-skill.mjs "<tu khoa subtask>" --domain <letter> --limit 5
```
- Mỗi subtask: 1 skill chính (tối đa +1 bổ trợ).
- **Ngân sách tổng: ≤ 5 skills cho toàn bộ pipeline**.

### 2.3 Lập kế hoạch thực thi (Plan)
Trình bày kế hoạch ngắn gọn trước khi thực hiện:
```
Pipeline Sgeneral:
  1. [Domain-1] skill: <tên> → Đầu ra: <artifact 1>
  2. [Domain-2] skill: <tên> → Đầu ra: <artifact 2 sử dụng artifact 1>
Ngân sách: X/5 skills.
```

### 2.4 Thực thi tuần tự & Đóng gói
1. Mỗi thời điểm chỉ mở và thực thi 1 skill. Hoàn thành subtask thì chuyển giao kết quả sang bước kế tiếp.
2. Skill sau KHÔNG phá vỡ ràng buộc của skill trước.
3. Ghép nối kết quả thành deliverable hoàn chỉnh, đồng nhất phong cách.

---

## Bước Cuối — Ghi Nhật Ký Sử Dụng (Bắt buộc)

Sau khi hoàn thành nhiệm vụ, ghi nhận lại để tích lũy kinh nghiệm cho các phiên sau:
```powershell
node D:\Skills\tools\log-skill.mjs "<ten-skill>" "<ten-nhiem-vu>" good|ok|bad
```

---

## 10 Quy Tắc Vàng Bất Di Bất Dịch

1. **KHÔNG đọc nguyên `INDEX.md` (11 MB) hay `index.json` (18 MB)** — chỉ dùng script `find-skill.mjs` hoặc grep/filter.
2. **Quy ước dự án > Skill**: Skill phải tôn trọng và tuân thủ codebase / convention hiện tại của repository.
3. **Ngân sách nạp**: Tối đa 3 skills cho task đơn lẻ, tối đa 5 skills khi orchestrate đa domain.
4. **Không bịa skill**: Nếu tra cứu không thấy skill phù hợp → làm trực tiếp bằng năng lực sẵn có và thông báo rõ ràng.
5. **An toàn bảo mật**: Kiểm tra mọi script trước khi chạy (đặc biệt các skill có cảnh báo `RISK` trong `security.json`).
6. **Không sửa nội dung bên trong các nguồn tại `D:\Skills`** (giữ nguyên để cơ chế git pull định kỳ hoạt động mượt mà).
