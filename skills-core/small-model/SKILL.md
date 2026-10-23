---
name: small-model
description: Use when running on a SMALL model (2B-9B parameters) or a tiny context window, or when the user says "model nhỏ", "chạy nhẹ", "lite", "2B", "yếu máy". Replaces the standard skill workflow with an ULTRA-COMPACT loop — 1 cache read, 1 one-line search, max 1 skill, everything written to cache, scripts instead of reasoning, ultra-short replies. Lets weak models work like strong ones by externalizing memory and using deterministic tools.
license: MIT
metadata:
  search: node D:\Skills\tools\find-skill.mjs "<kw>" --one
  cache: node D:\Skills\tools\cache.mjs
---

# Small-Model Mode — model 2B cũng làm như model lớn

Nguyên lý: model nhỏ não yếu → **đừng bắt nó nhớ và suy diễn**. Cho nó:
vòng lặp cố định + script trả kết quả có sẵn + trí nhớ ngoài (cache).

## Vòng lặp cố định (không bắn tán loạn)

```
1. node D:\Skills\tools\cache.mjs show        # có việc dở? -> làm tiếp từ "next"
2. node D:\Skills\tools\find-skill.mjs "<tu khoa>" --one   # 1 lệnh, 1 kết quả
3. Nếu kết quả có đường dẫn: Read đúng file đó -> làm đúng workflow.
   Không có: TỰ LÀM, không tìm thêm quá 2 lượt.
4. node D:\Skills\tools\cache.mjs add "<vừa xong>"         # checkpoint
5. node D:\Skills\tools\cache.mjs set next "<bước kế>"     # rồi mới làm bước kế
6. Lặp 2-5 đến khi xong -> cache.mjs clear, trả lời user.
```

## Luật bất di bất dịch

- **TỐI ĐA 1 skill** mỗi lần. Không nạp thêm gì khác. Không đọc INDEX.md/index.json.
- **Mọi kế hoạch chỉ 3 dòng**, viết vào cache TRƯỚC khi làm (set task + set next).
- **Kết quả dài → ghi ra FILE**, trả lời user chỉ tóm tắt vài dòng.
- **Không giữ suy luận trong đầu**: quyết định quan trọng -> note decision ngay.
- **Ưu tiên script**: tìm = find-skill, nhớ = cache.mjs, đo = chạy lệnh thật
  (đừng "đoán" — chạy và nhìn kết quả).
- Trả lời user: câu đầu là kết quả, tối đa 5 dòng, không diễn giải lan man.
- Gặp rối/quá khó cho model nhỏ -> cache.mjs add "ĐANG KẸT: <lý do>" và
  báo user cần model lớn hơn/chỉ dẫn thêm — trung thực hơn đoán bừa.

## Khi model lớn (không dùng skill này)

Bỏ qua chế độ này — dùng đúng quy trình thường: sgeneral (≤3 skill)
+ sgeneral (đa domain) + taste (chọn lựa) + natural-voice (giọng nói).
