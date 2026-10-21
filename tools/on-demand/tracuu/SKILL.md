---
name: tracuu
description: Chế độ TRA CỨU INTERNET & THÔNG TIN kỷ luật — tìm kiếm đa nguồn, đối chiếu, kiểm chứng rồi mới kết luận. Dùng khi user cần thông tin bên ngoài: "tra cứu X", "tìm thông tin về X", "tin tức mới nhất về X", "giá X hiện tại", "kiểm chứng xem X có thật không", "so sánh A và B hiện nay", "research giúp tôi". KHÔNG dùng cho kiến thức tổng quát đã vững (trả lời trực tiếp luôn nhanh hơn) hay cho code trong repo.
license: MIT
metadata:
  companion: sgeneral
  library-domain: Deep-Research-skills, mvanhorn-last30days-skill, teng-lin-notebooklm-py
---

# Tracuu — tra cứu internet có kiểm chứng

Nguyên tắc số 1: **thông tin quan trọng phải có ≥2 nguồn độc lập**. Một
nguồn = một ý kiến, chưa phải sự thật.

## Quy trình 5 bước

1. **Chốt câu hỏi** — cần biết chính xác gì? Mức độ tươi yêu cầu (số liệu
   real-time, tin tuần này, hay kiến thức tổng hợp)? Độ sâu (con số nhanh
   hay phân tích)? Không rõ thì hỏi 1 câu, đừng tra sai hướng.
2. **Tìm kiếm thông minh** — dùng công cụ web search/fetch sẵn có:
   - Viết 2-3 biến thể query (tiếng Anh thường cho kết quả tốt hơn;
     tiếng Việt chỉ khi tìm nội dung VN)
   - Song song nhiều truy vấn thay vì tuần tự
   - Query cụ thể + năm ("battery price 2026") thay vì chung chung
3. **Đối chiếu đa nguồn** — ưu tiên **nguồn gốc** (công bố chính thức,
   paper, docs chính chủ) hơn bài dẫn lại; ≥2 nguồn độc lập trùng khớp
   mới coi là tin cậy. Nguồn mâu thuẫn → trình bày cả hai phía + đánh
   giá nguồn nào nặng hơn, KHÔNG chọn bên mình thích.
4. **Kiểm chứng chất lượng nguồn** — ngày đăng (info cũ là bẫy số 1),
   tác giả/lợi ích đằng sau, domain chính chủ vs blog SEO. Số liệu
   tài chính/y tế/kỹ thuật: phải ra nguồn cấp nhất.
5. **Trả lời có trích** — mỗi thông tin kèm nguồn (link) + ngày; phần
   chưa chắc ghi rõ "chưa xác nhận". Giọng tổng hợp của mình, không
   dịch nguyên khối.

## Nạp skill thư viện khi cần (tối đa 2-3)

```powershell
node D:\Skills\tools\find-skill.mjs "deep research" --limit 3   # pipeline nghiên cứu nhiều tầng
node D:\Skills\tools\find-skill.mjs "news last 30 days" --limit 3  # tin mới theo chủ đề
```

- `Deep-Research-skills` — research sâu human-in-the-loop khi câu hỏi lớn
- `mvanhorn-last30days-skill` — tin 30 ngày qua theo chủ đề
- Domain Y (Nghiên cứu) trong `SKILLS.md` mục 6 — bản đồ nguồn nghiên cứu

## An toàn & giới hạn (không thoả hiệp)

1. **Không bịa nguồn/link** — không chắc có trang đó thì đừng trích.
   Link phải đến từ kết quả tìm kiếm thật, không "đoán URL".
2. **Phân biệt fact vs opinion** — thông tin đối thoại tranh cãi (chính
   trị, y tế, tài chính cá nhân): trình bày đa chiều, không bênh vực
   một phía, khuyên kiểm chứng với chuyên gia khi hệ quả lớn.
3. **Cảnh giác thông tin cũ** — luôn ghi ngày của số liệu; giá/tỷ giá/
   chính sách thay đổi liên tục.
4. **Tôn trọng bản quyền** — trích đoạn ngắn + dẫn nguồn, không sao chép
   nguyên trang.
5. **Dừng khi đủ** — 3-4 lượt tìm không ra → nói rõ "không tìm được nguồn
   đáng tin, đây là những gì biết được" thay vì tô hồng.

## Chốt phiên tra cứu

3 dòng: (1) kết luận chính + độ tin cậy (cao/trung bình/thấp), (2) nguồn
kèm ngày, (3) điểm còn chưa chắc cần kiểm chứng thêm.
