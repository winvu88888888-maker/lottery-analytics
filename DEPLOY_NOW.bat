@echo off
chcp 65001 >nul
color 0E
title 🚀 Deploy Website to Internet

echo.
echo ═══════════════════════════════════════════════════════════════
echo    🚀 DEPLOY WEBSITE LÊN INTERNET (GITHUB PAGES)
echo ═══════════════════════════════════════════════════════════════
echo.

echo 📦 Đang thêm tất cả file...
git add -A

echo.
echo 💾 Đang commit...
git commit -m "Deploy: Update website %date% %time%"

echo.
echo 🚀 Đang push lên GitHub...
git push origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️ Push thất bại với branch 'main', thử 'master'...
    git push origin master
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo    ✅ DEPLOY THÀNH CÔNG!
echo ═══════════════════════════════════════════════════════════════
echo.
echo 🌐 Website của bạn sẽ có tại:
echo.
echo    https://winvu8888888-maker.github.io/lottery-analytics/
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo ⏱️ Lần đầu deploy có thể mất 2-5 phút để GitHub xử lý.
echo    Sau đó mỗi lần cập nhật chỉ mất 1-2 phút.
echo.
echo 📝 NẾU LẦN ĐẦU, BẠN CẦN BẬT GITHUB PAGES:
echo    1. Vào https://github.com/winvu8888888-maker/lottery-analytics
echo    2. Click Settings → Pages
echo    3. Source: GitHub Actions
echo    4. Chờ 2-5 phút
echo.
echo ═══════════════════════════════════════════════════════════════

start https://github.com/winvu8888888-maker/lottery-analytics/settings/pages

pause
