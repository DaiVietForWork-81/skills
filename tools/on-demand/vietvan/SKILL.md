---
name: vietvan
description: Chế độ VIẾT VĂN BẢN & NỘI DUNG — đơn từ, email công việc, báo cáo, thông báo, thư, caption/post mạng xã hội. Dùng khi user cần: "viết đơn xin nghỉ phép", "viết email gửi sếp/khách", "viết báo cáo công việc tháng", "viết thông báo cho nhóm", "viết caption đăng bài", "soạn thư ngỏ". KHÔNG dùng cho nghị luận văn học (vanhoc) hay dịch tiếng Anh (tienganh).
license: MIT
metadata:
  companion: sgeneral
  library-domain: minhnv0807-ai-business-skills, coreyhaines31-marketingskills, blader-humanizer
---

# Vietvan — văn bản thực dụng

Nguyên tắc số 1: **rõ trước, hay sau** — văn bản hành chính/công việc
thắng bằng sự rõ ràng. Người nhận đọc 10 giây phải biết: ai, việc gì,
cần gì, khi nào. Hay chữ mà mất ý = thất bại.

## Quy trình 5 bước

1. **Chốt 5 thứ** (thiếu thì hỏi, đừng đoán):
   - Loại văn bản: đơn / email / báo cáo / thông báo / thư / post
   - Người nhận: sếp, khách hàng, cơ quan nhà nước, nhóm chat, công chúng
   - Mục tiêu: xin phép / thuyết phục / báo cáo / thông báo / bán hàng
   - Văn phong: trang trọng (hành chính) / chuyên nghiệp (công việc) /
     thân mật (nhóm bạn, social)
   - Dữ kiện thật: ngày, tên, số liệu, lý do — **user phải cung cấp**,
     không có thì để chỗ trống `[...]` cho user điền
2. **Theo khuôn đúng loại văn bản**:
   - **Đơn (hành chính VN)**: Quốc hiệu/tiêu ngữ (nếu đơn nộp cơ quan) →
     Kính gửi → thông tin người làm đơn → nội dung (trình bày lý do, đề
     nghị cụ thể) → cam đoan → ngày ký tên
   - **Email công việc**: Subject rõ việc + deadline → chào hỏi 1 dòng →
     mục đích trong 2 câu đầu → chi tiết gạch đầu dòng → yêu cầu cụ thể
     + hạn → cảm ơn kết
   - **Báo cáo**: tóm tắt kết quả trước → số liệu/diễn biến → vấn đề
     phát sinh → đề xuất → phụ lục (nếu dài)
   - **Thông báo**: ai cần biết, việc gì, khi nào, cần làm gì — 4 câu
     là đủ cho thông báo nhóm
   - **Post mạng xã hội**: mở bằng câu gây tò mò/giá trị → thân 2-3
     câu/ý gạch đầu dòng → CTA; caption ngắn thắng caption dài
3. **Viết:** câu ngắn; mỗi đoạn một ý; từ ngữ đúng vai (xin phép thì khiêm
   tốn, đòi quyền lợi thì chắc chắn nhưng lịch sự). Áp `natural-voice`:
   tránh công văn "máy móc hoá" khi không cần, tránh sến khi cần nghiêm.
4. **Tự kiểm 3 câu hỏi:** Người nhận có phải đọc lại lần 2 không? Yêu cầu
   có cụ thể (việc gì, hạn nào) không? Thiếu giấy tờ/thông tin gì không?
5. **Trình bày:** bản hoàn chỉnh **đánh dấu rõ các chỗ `[...]` để user
   điền/kiểm trước khi gửi** + 1-2 lưu ý quan trọng (vd. "nhớ xin chữ ký
   trưởng phòng").

## Nạp skill thư viện khi cần (tối đa 2-3)

```powershell
node D:\Skills\tools\find-skill.mjs "email writing" --limit 5
node D:\Skills\tools\find-skill.mjs "copywriting" --limit 5     # post/social
node D:\Skills\tools\find-skill.mjs "humaniz" --limit 5         # giọng tự nhiên
```

- `minhnv0807-ai-business-skills` — bộ business VN song ngữ (đọc để đúng
  văn phong doanh nghiệp Việt)
- `coreyhaines31-marketingskills` — copywriting, CTA, post social
- Bộ humanizer — làm mượt văn dài

## An toàn & giới hạn (không thoả hiệp)

1. **Không bịa dữ kiện** — số liệu, lý do, tên, ngày tháng trong đơn từ/
   báo cáo phải do user cấp; không có thì để `[...]`. Đơn từ có lý do
   bịa = rủi ro pháp lý cho user.
2. **Không viết văn bản lừa đảo/mạo danh** — thư xin tiền giả, đơn giả
   chữ ký, email giả người khác, nội dung quảng cáo lừa dối → từ chối.
3. **Pháp lý phức tạp** (tranh chấp, hợp đồng, kiện tụng) → soạn nháp
   được nhưng kèm cảnh báo "tham khảo mẫu chính thức / người có chuyên
   môn soát lại".
4. **Văn bản cho cơ quan nhà nước** → dùng đúng mẫu hiện hành (nêu rõ
   user nên tải mẫu từ cổng dịch vụ công nếu có mẫu bắt buộc).

## Chốt phiên

3 dòng: (1) văn bản đã soạn (loại gì, cho ai), (2) các chỗ `[...]` cần
user điền trước khi gửi, (3) mẹo dùng lại (lưu thành template cá nhân).
