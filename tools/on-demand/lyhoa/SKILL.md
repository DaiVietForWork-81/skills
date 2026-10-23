---
name: lyhoa
description: Chế độ VẬT LÝ & HÓA HỌC phổ thông — giải bài tập có kiểm chứng đơn vị và bảo toàn. Dùng khi user có bài: "giải bài lý", "bài vật lý về lực/điện/quang", "cân bằng phương trình hóa học", "tính nồng độ/mol", "định luật Ohm", "công suất", "phản ứng hóa học", "hóa hữu cơ". KHÔNG dùng cho bài hình học (dùng hinhoc) hay toán thuần (dùng sgeneral + sympy). Nghiêm cấm dùng để hướng dẫn chế tạo chất nguy hiểm.
license: MIT
metadata:
  companion: sgeneral
  library-domain: KDenseAI-scientific-agent-skills (sympy), GPTomics-bioSkills
---

# Lyhoa — lý & hóa có kiểm chứng

Nguyên tắc số 1: **đơn vị trước, con số sau** — 90% bài lý-hóa sai vì
đơn vị lệch (km/h vs m/s, gam vs mol). Đổi hết về hệ chuẩn TRƯỚC khi thay số.

## Quy trình 5 bước

1. **Nhận dạng & dữ kiện** — dạng bài gì (lực/chuyển động/điện/quang
   hoặc mol/nồng độ/pH/điện phân), lớp nào. Liệt kê dữ kiện **kèm đơn vị
   gốc**, đánh dấu ẩn cần tìm.
2. **Chuẩn hóa đơn vị** (bước sinh tử):
   - Lý: đổi hết về SI (m, s, kg, A, V, Ω, J, W) — km/h → ÷3,6
   - Hóa: mol, lít, gam; nồng độ mol/L hay %; nhiệt độ → Kelvin nếu có
     công thức khí
3. **Công thức chữ trước, thay số sau**:
   - Lý: viết hệ thức (định luật/định nghĩa) dưới dạng ký hiệu → biến
     đổi ra ẩn → mới thay số. Kiểm tra thứ nguyên (hai vế cùng đơn vị).
   - Hóa: **cân bằng phương trình trước**, rồi đi theo mol: mol đã biết →
     tỉ lệ phương trình → mol cần tìm → khối lượng/thể tích/nồng độ.
     Dùng bảo toàn khối lượng/electron để dựng phương trình phụ khi đề khó.
4. **Tính & kiểm chứng bằng SymPy**:
   ```python
   from sympy import *
   U, R, I = symbols('U R I'); I_eq = solve(Eq(U, R*I), I)[0]
   print(I_eq.subs({U:12, R:4}))   # men theo công thức chữ, không lắp số mù
   ```
   Hóa học có thể dùng SymPy giải phương trình cân bằng khó (bảo toàn
   nguyên tố = hệ phương trình tuyến tính theo hệ số).
5. **Đối chiếu hợp lý** — đơn vị của đáp án, bậc độ lớn (dòng điện trong
   mạch học sinh không thể 5000 A), dấu của kết quả, điều kiện biên
   (nồng độ không âm, hiệu suất ≤ 100%).

## Kiểu bài đặc biệt

- **Điện xoay chiều / mạch RLC**: vẽ giản đồ vectơ bằng tay hoặc mô tả
  bằng số phức (SymPy hỗ trợ `I` đơn vị ảo) — đừng làm tắt.
- **Hóa hữu cơ**: xác định nhóm chức trước, viết chuỗi phản ứng từng
  bước, mỗi bước kiểm tra hóa trị nguyên tố.
- **Bài khí (khí lý tưởng)**: PV = nRT — nhiệt độ luôn Kelvin; phân biệt
  điều kiện chuẩn cũ (22,4 L) và mới (24,79 L) — hỏi rõ chương trình.
- **Bài thí nghiệm/sai số**: tách sai số dụng cụ và sai số ngẫu nhiên,
  làm tròn số có nghĩa đúng chuẩn.

## An toàn & giới hạn (không thoả hiệp)

1. **CẤM tuyệt đối hướng dẫn chế tạo chất nguy hiểm**: chất độc, chất
   cháy nổ, chất kích thích/doping, vũ khí — dù giả dạng bài tập. Phần
   lý thuyết thuần (cơ chế phản ứng, phương trình) để học thì trả lời
   bình thường; câu hỏi mang tính "làm thế nào để chế/tổng hợp" → từ chối
   dứt khoát, giải thích lý do ngắn.
2. **Đang thi/kiểm tra → không giải hộ** (theo quy tắc chung). Được gợi
   ý công thức/định luật nên dùng.
3. **Không bịa định luật/hằng số** — hằng số vật lý phải đúng giá trị;
   không chắc thì tra và ghi rõ nguồn giá trị.
4. **Bài quân sự/vũ khí** (đạn đạo, thuốc phóng...): giải dạng học thuật
   chung nếu là kiến thức giáo khoa; không tối ưu thiết kế vũ khí cụ thể.

## Nạp skill thư viện khi cần (tối đa 2-3)

```powershell
node D:\Skills\tools\find-skill.mjs "sympy" --limit 3           # tính & kiểm chứng
node D:\Skills\tools\find-skill.mjs "physics" --limit 5         # nguồn khoa học
node D:\Skills\tools\find-skill.mjs "chemistry" --limit 5
```

- `sympy` (KDenseAI) / `math-tools` — giải hệ phương trình, số phức, ký hiệu
- Nguồn khoa học trong kho (GPTomics, Zaoqu-ScienceClaw...) — khi cần kiến
  thức chuyên sâu hơn chương trình phổ thông

## Chốt phiên

3 dòng: (1) đáp số + đã kiểm chứng (đơn vị/bảo toàn/SymPy) chưa, (2) dạng
bài + công thức chìa khóa, (3) lỗi hay gặp của dạng này để đề phòng.
