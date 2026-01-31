@echo off
chcp 65001 >nul
color 0A
title 🚀 Lottery Analytics - Local Server

echo.
echo ═══════════════════════════════════════════════════════════════
echo    🚀 KHỞI ĐỘNG SERVER LOCAL
echo ═══════════════════════════════════════════════════════════════
echo.

REM Kiểm tra Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Đã tìm thấy Python
    echo.
    echo 🌐 Server đang chạy tại: http://localhost:8000
    echo.
    echo 📋 Các trang có thể truy cập:
    echo    • http://localhost:8000/working_version.html
    echo    • http://localhost:8000/index.html
    echo.
    echo 💡 Nhấn Ctrl+C để dừng server
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo.
    
    REM Mở trình duyệt
    start http://localhost:8000/working_version.html
    
    REM Chạy server
    python -m http.server 8000
    
    goto :end
)

REM Nếu không có Python, thử Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Đã tìm thấy Node.js
    echo.
    echo 🌐 Server đang chạy tại: http://localhost:8000
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo.
    
    start http://localhost:8000/working_version.html
    
    npx -y http-server -p 8000
    
    goto :end
)

REM Không tìm thấy Python hoặc Node.js
echo ❌ Không tìm thấy Python hoặc Node.js!
echo.
echo 📥 VUI LÒNG CÀI ĐẶT:
echo.
echo CÁCH 1: Cài Python (Khuyên dùng)
echo    → Tải tại: https://www.python.org/downloads/
echo    → Tick "Add Python to PATH" khi cài
echo.
echo CÁCH 2: Dùng VS Code Live Server
echo    → Mở VS Code
echo    → Cài extension "Live Server"
echo    → Click chuột phải working_version.html
echo    → Chọn "Open with Live Server"
echo.
echo CÁCH 3: Dùng Chrome với flag
echo    → Đóng tất cả Chrome
echo    → Chạy: chrome.exe --allow-file-access-from-files
echo    → Mở working_version.html
echo.
pause

:end
