@echo off
chcp 65001 >nul
color 0A
title 🚀 DEPLOY ĐƠN GIẢN

echo.
echo ═══════════════════════════════════════════════════════════════
echo    🚀 DEPLOY LÊN GITHUB - PHIÊN BẢN ĐƠN GIẢN
echo ═══════════════════════════════════════════════════════════════
echo.

set /p GITHUB_USERNAME="📝 Nhập GitHub username: "
set /p REPO_NAME="📝 Nhập tên repository: "
set /p GITHUB_TOKEN="🔑 Paste token vào đây (sẽ HIỂN THỊ): "

echo.
echo ═══════════════════════════════════════════════════════════════
echo    📦 BẮT ĐẦU DEPLOY
echo ═══════════════════════════════════════════════════════════════
echo.

REM Khởi tạo Git
if not exist ".git" (
    echo 🔧 Khởi tạo Git...
    git init
)

echo.
echo 📝 Add files...
git add .

echo.
echo 💾 Commit...
git commit -m "🎯 Deploy AI Lottery Analytics Pro"

echo.
echo 🔗 Setup remote...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://%GITHUB_TOKEN%@github.com/%GITHUB_USERNAME%/%REPO_NAME%.git

echo.
echo 🚀 Push to GitHub...
git push -u origin main --force

echo.
echo ═══════════════════════════════════════════════════════════════
echo    ✅ HOÀN TẤT!
echo ═══════════════════════════════════════════════════════════════
echo.
echo 🎉 Đã push lên GitHub thành công!
echo.
echo 📋 BƯỚC TIẾP THEO:
echo.
echo 1. Vào: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo 2. Nhấn "Settings" → "Pages"
echo 3. Chọn Branch: main → Save
echo 4. Đợi 1-2 phút
echo.
echo 🌐 Website: https://%GITHUB_USERNAME%.github.io/%REPO_NAME%
echo 🔑 Mật khẩu: 1987
echo.
pause
