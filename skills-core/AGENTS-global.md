# Instructions toàn cục (áp dụng cho mọi dự án)

## Thư viện Skills tại D:\Skills

Máy này có thư viện skills dùng chung tại `D:\Skills` (~42.149 skills,
240 nguồn, 26 domain), dùng được cho opencode, Claude Code, Codex, Gemini CLI,
Antigravity (và mọi agent đọc AGENTS.md). Skill duy nhất `sgeneral`
(Router tìm kiếm & Master Orchestrator tích hợp) đã đăng ký toàn cục.

**QUY TẮC THƯỜNG TRỰC — áp dụng cho MỌI task không tầm thường:**

0. **Đầu phiên**: chỉ chạy `node D:\Skills\tools\cache.mjs show` khi user
   nhắc việc dở ("làm tiếp") hoặc biết đang có task song song — phiên
   bình thường thì bỏ qua cho nhanh. Đang làm task dài: checkpoint
   (`cache.mjs add/set/note`); xong task: `cache.mjs clear`.
1. **Chỉ tra `find-skill.mjs` khi task có khả năng có skill chuyên sâu**
   (đọc PDF/Office, nghiên cứu sâu, trading, y sinh, pentest, office,
   hình học, các domain A–Z trong SKILLS.md). Hội thoại, kiến thức chung,
   viết văn đơn giản, sửa code nhỏ → **trả lời trực tiếp, KHÔNG tra**.
   Cần cả cache show lẫn find-skill thì gộp thành 1 lượt gọi.
2. Có skill phù hợp: tối đa 3 skill, Read đúng file SKILL.md trả về, làm
   đúng workflow trong đó. KHÔNG đọc nguyên INDEX.md/index.json.
3. Task chạm nhiều domain cùng lúc → dùng skill `sgeneral` để orchestrate.
4. **Chỉ log khi THẬT SỰ dùng skill từ kho:**
   `node D:\Skills\tools\log-skill.mjs "<skill>" "<task>" good|ok|bad`.
   Trả lời trực tiếp thì không cần log.
5. Giọng nói & lựa chọn: áp dụng `natural-voice` cho MỌI câu trả lời
   (viết như người, không "mùi AI") và `taste` khi phải chọn giữa các
   phương án ngang nhau — hai cái này áp tại chỗ, không tốn lượt gọi.
6. Không có skill phù hợp (sau ~4 lượt tìm) thì làm trực tiếp; không bịa skill.

Kho tự cập nhật hằng tuần (Task Scheduler "SkillsLibrary Weekly Update").
