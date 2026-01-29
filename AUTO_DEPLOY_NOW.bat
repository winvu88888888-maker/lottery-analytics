@echo off
chcp 65001 >nul
color 0A
title AUTO DEPLOY - 1 CLICK

echo.
echo ═══════════════════════════════════════════════════════════════
echo    🚀 TỰ ĐỘNG DEPLOY - CHỈ CẦN 1 CLICK
echo ═══════════════════════════════════════════════════════════════
echo.

REM Tự động khởi tạo Git
echo 🔧 Khởi tạo Git repository...
git init

echo.
echo 📝 Thêm tất cả files...
git add .

echo.
echo 💾 Commit...
git commit -m "Deploy AI Lottery Analytics Pro"

echo.
echo 🔗 Kết nối GitHub...
git branch -M main

echo.
echo ═══════════════════════════════════════════════════════════════
echo    ⚠️ QUAN TRỌNG - ĐỌC KỸ!
echo ═══════════════════════════════════════════════════════════════
echo.
echo Để push lên GitHub, bạn CẦN:
echo.
echo 1. Tạo repository trên GitHub:
echo    → Vào: https://github.com/new
echo    → Tên: lottery-analytics
echo    → Public
echo    → Nhấn "Create repository"
echo.
echo 2. Sau khi tạo xong, GitHub sẽ cho bạn 1 đường link dạng:
echo    https://github.com/[username]/lottery-analytics.git
echo.
echo 3. Copy link đó và paste vào đây:
echo.

set /p REPO_URL="📝 Paste link repository (https://github.com/...): "

echo.
echo 🚀 Đang push lên GitHub...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo    ✅ THÀNH CÔNG!
    echo ═══════════════════════════════════════════════════════════════
    echo.
    echo 🎉 Code đã được push lên GitHub!
    echo.
    echo 📋 BƯỚC CUỐI CÙNG:
    echo.
    echo 1. Vào repository trên GitHub
    echo 2. Nhấn "Settings" → "Pages"
    echo 3. Chọn Branch: main → Save
    echo 4. Đợi 1-2 phút
    echo.
    echo 🌐 Website sẽ online tại:
    echo    https://[username].github.io/lottery-analytics
    echo.
    echo 🔑 Mật khẩu: 1987
    echo.
) else (
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo    ❌ LỖI - CẦN ĐĂNG NHẬP
    echo ═══════════════════════════════════════════════════════════════
    echo.
    echo Git yêu cầu đăng nhập GitHub.
    echo.
    echo CÁCH DỄ NHẤT:
    echo 1. Tải GitHub Desktop: https://desktop.github.com/
    echo 2. Đăng nhập
    echo 3. Add thư mục này
    echo 4. Publish
    echo.
)

pause
