---
name: hinhoc
description: Chế độ GIẢI HÌNH HỌC phổ thông — tính toán & chứng minh có kiểm chứng bằng SymPy, dạy kèm nếu cần. Dùng khi user có bài hình: "giải giúp bài hình học", "chứng minh tam giác đồng dạng/vuông", "tính diện tích/chu vi/góc/bán kính", "đường tròn tiếp tuyến", "Pythagore", "hình học tọa độ", "vectơ", "khoảng cách hai đường thẳng". KHÔNG dùng cho hình học 3D game/render (three.js, Blender) — đó là domain B.
license: MIT
metadata:
  companion: giaovien
  library-domain: KDenseAI-scientific-agent-skills (sympy), chengziyue1222-math-model-agent, EtherealMingo-university-teacher
---

# Hinhoc — giải hình có kiểm chứng

Nguyên tắc số 1: **hình trước, tính sau**. Liệt kê giả thiết → mô tả hình
→ mới chọn phương pháp. Kết quả số phải được **SymPy kiểm chứng** trước
khi chốt — hình học sai một dấu là cả bài đổ.

## Quy trình 5 bước

1. **Liệt kê giả thiết & kết luận** — ghi rõ: cho gì (đoạn nào, góc nào,
   đường nào, quan hệ gì), phải chứng minh/tính gì. Bài thiếu hình → tự
   vẽ phác bằng mô tả/ASCII và xác nhận với user: "hiểu đề của em đúng
   chưa?".
2. **Nhận dạng dạng bài** (chương trình phổ thông VN):
   - Lớp 6-7: tam giác bằng nhau, đường song song, góc
   - Lớp 8: Pythagore, tam giác đồng dạng, tỉ lệ thức
   - Lớp 9: lượng giác (sin/cos/tan), đường tròn, tiếp tuyến, góc nội tiếp
   - Lớp 10-11: vectơ, hình học tọa độ (đường thẳng, đường tròn, khoảng cách)
   - Lớp 12: khối tròn xoay, quay quanh trục
3. **Chọn phương pháp theo thứ tự ưu tiên:**
   a. Định lý quen thuộc (Pythagore, định lý cos/sin, tính chất đồng dạng,
      tiếp tuyến ⊥ bán kính, góc nội tiếp/ngoại tiếp...)
   b. **Tọa độ hóa khi bí** — đặt hệ trục khéo (gốc tại đỉnh đặc biệt,
      trục theo cạnh dài nhất) → bài hình thành bài đại số, SymPy giải được
   c. Đại số hóa: gọi ẩn phụ, dùng Vi-ét cho quan hệ qua giao điểm
4. **Tính & kiểm chứng bằng SymPy** (nạp `math-tools` hoặc skill `sympy`
   của KDenseAI):
   ```python
   from sympy import *
   A, B, C = Point(0,0), Point(4,0), Point(0,3)
   tam_giac = Triangle(A, B, C)
   print(tam_giac.area, tam_giac.angles, tam_giac.perimeter)  # đối chiếu bài làm
   ```
   Chứng minh → mỗi bước ghi rõ **dùng định lý/hệ thức nào**; SymPy đối
   chiếu các đại lượng trung gian (độ dài, tích vô hướng, tỉ số).
5. **Đối chiếu hợp lý** — tổng góc tam giác 180°, bất đẳng thức tam giác,
   diện tích dương, đơn vị đúng. Kết quả phi thực tế (cạnh âm, cos > 1)
   = sai ở đâu đó, quay lại bước 3.

## Kiểu bài đặc biệt

- **Chứng minh**: viết thành chuỗi "⟹" từng bước, mỗi bước 1 lý do có
  tên (vd. "gt", "định lý Pythagore", "hai tam giác đồng dạng c-g-c").
  Chứng minh xong đọc ngược xem chuỗi kín chưa.
- **Tìm giá trị lớn/nhỏ**: biến thành hàm một ẩn rồi dùng bất đẳng thức
  (Cos-bu-gia, a+b≥2√ab) hoặc đạo hàm — SymPy xác nhận điểm tới hạn.
- **Hình không vẽ được bằng chữ**: đề xuất script matplotlib vẽ hình
  (đúng tọa độ, có nhãn đỉnh) để user nhìn theo.
- **Kèm dạy học** (user đang học, không phải chỉ cần đáp án): vào vai
  giáo viên theo `giaovien` — hỏi học sinh thử bước đầu trước khi giảng.

## Nạp skill thư viện khi cần (tối đa 2-3)

```powershell
node D:\Skills\tools\find-skill.mjs "sympy" --limit 3       # tính chính xác
node D:\Skills\tools\find-skill.mjs "proof mathematics" --limit 3  # chiến lược chứng minh
node D:\Skills\tools\find-skill.mjs "math modeling" --limit 3      # bài tổng hợp/lớn
```

- `sympy` (KDenseAI) / `math-tools` — tính toán chính xác, kiểm chứng
- `anmath-methods` — kiến trúc lập luận chứng minh (mức cao)
- `solve-model`, `make-model-figures` (chengziyue) — bài mô hình có hình vẽ
- `k12-lesson-plan-creation`, `gaokao-science-tutor` — khi cần soạn bài dạy

## An toàn & giới hạn (không thoả hiệp)

1. **Không bịa định lý/hệ thức** — mỗi định lý dùng phải thật, không chắc
   tên/hệ thức thì kiểm tra trước khi ghi vào lời giải.
2. **Đang thi/kiểm tra chính thức → từ chối giải hộ** (đúng quy tắc
   `giaovien`), chỉ gợi ý định lý nào nên nghĩ tới.
3. **Đáp số không khớp đề** (thiếu dữ kiện, đề vô nghiệm) → nói rõ, đừng
   ép ra số đẹp.
4. **Số liệu làm tròn**: để dạng căn/π khi có thể, làm tròn cuối cùng và
   ghi rõ số chữ số.

## Chốt phiên

3 dòng: (1) đáp số/kết luận + đã kiểm chứng SymPy chưa, (2) phương pháp
chính đã dùng, (3) bài tự luyện tương ứng (nếu user đang học).
