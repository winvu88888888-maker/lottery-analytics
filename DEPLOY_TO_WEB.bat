@echo off
chcp 65001 >nul
color 0A
title 🚀 DEPLOY AI LOTTERY ANALYTICS PRO

echo.
echo ═══════════════════════════════════════════════════════════════
echo    🚀 DEPLOY AI LOTTERY ANALYTICS PRO LÊN GITHUB PAGES
echo ═══════════════════════════════════════════════════════════════
echo.

REM Kiểm tra Git đã cài chưa
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git chưa được cài đặt!
    echo.
    echo 📥 Vui lòng tải Git tại: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✅ Git đã được cài đặt
echo.

REM Hỏi thông tin GitHub
set /p GITHUB_USERNAME="📝 Nhập tên GitHub username của bạn: "
set /p REPO_NAME="📝 Nhập tên repository (VD: lottery-analytics): "

echo.
echo ═══════════════════════════════════════════════════════════════
echo    📦 BẮT ĐẦU DEPLOY
echo ═══════════════════════════════════════════════════════════════
echo.

REM Khởi tạo Git nếu chưa có
if not exist ".git" (
    echo 🔧 Khởi tạo Git repository...
    git init
    echo ✅ Đã khởi tạo Git
) else (
    echo ✅ Git repository đã tồn tại
)

echo.
echo 📝 Thêm tất cả files...
git add .

echo.
echo 💾 Commit changes...
git commit -m "🎯 Deploy AI Lottery Analytics Pro - Full Features"

echo.
echo 🔗 Kết nối với GitHub...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git

echo.
echo 🚀 Đẩy code lên GitHub...
git push -u origin main --force

echo.
echo ═══════════════════════════════════════════════════════════════
echo    ✅ HOÀN TẤT!
echo ═══════════════════════════════════════════════════════════════
echo.
echo 🎉 Code đã được đẩy lên GitHub thành công!
echo.
echo 📋 BƯỚC TIẾP THEO:
echo.
echo 1. Vào: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo 2. Nhấn "Settings" (góc trên phải)
echo 3. Chọn "Pages" (menu bên trái)
echo 4. Tại "Branch", chọn: main
echo 5. Nhấn "Save"
echo 6. Đợi 1-2 phút
echo.
echo 🌐 Website của bạn sẽ có tại:
echo    https://%GITHUB_USERNAME%.github.io/%REPO_NAME%
echo.
echo 🔑 Mật khẩu đăng nhập: 1987
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause
