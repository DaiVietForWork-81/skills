# update-library.ps1 — Cập nhật toàn bộ thư viện D:\Skills
# Chạy tay:  powershell -NoProfile -ExecutionPolicy Bypass -File D:\Skills\tools\update-library.ps1
# Tự động:   Task Scheduler "SkillsLibrary Weekly Update" (Chủ nhật 03:30)
$ErrorActionPreference = 'Continue'
$root = 'D:\Skills'
$log  = Join-Path $root 'tools\update-log.txt'
"=== Skills library update start $(Get-Date -Format s) ===" | Out-File -FilePath $log -Append -Encoding utf8

# 1) git pull mọi nguồn (ff-only, bỏ qua nguồn lỗi)
$pulled = 0; $failed = 0; $failedList = @()
Get-ChildItem $root -Directory | Where-Object { Test-Path (Join-Path $_.FullName '.git') } | ForEach-Object {
  git -C $_.FullName pull --ff-only --quiet 2>$null
  if ($LASTEXITCODE -eq 0) { $pulled++ } else { $failed++; $failedList += $_.Name }
}
$failedPart = if ($failedList.Count) { ' (' + ($failedList -join ', ') + ')' } else { '' }
"git pull: OK=$pulled FAIL=$failed$failedPart" | Out-File -FilePath $log -Append -Encoding utf8

# 2) Rebuild index (kèm domain tag + SHA nguồn)
node (Join-Path $root 'tools\build-index.mjs') 2>&1 | Out-File -FilePath $log -Append -Encoding utf8

# 3) Quét an ninh scripts → security.json
node (Join-Path $root 'tools\scan-security.mjs') 2>&1 | Out-File -FilePath $log -Append -Encoding utf8

# 4) Health check toàn kho (file bắt buộc, path lệch, độ tươi, dung lượng)
node (Join-Path $root 'tools\verify-library.mjs') 2>&1 | Out-File -FilePath $log -Append -Encoding utf8

# 5) Ghi trạng thái gần nhất
"last-update=$(Get-Date -Format s); pulled=$pulled; failed=$failed" | Out-File -FilePath (Join-Path $root 'tools\last-update.txt') -Encoding utf8
"=== Done $(Get-Date -Format s) ===" | Out-File -FilePath $log -Append -Encoding utf8
Write-Host "Update complete: pulled=$pulled failed=$failed. Log: $log"
