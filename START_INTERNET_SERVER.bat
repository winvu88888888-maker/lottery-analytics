@echo off
chcp 65001 >nul
color 0D
title 🌍 Lottery Analytics - Internet Access via Ngrok

echo.
echo ═══════════════════════════════════════════════════════════════
echo    🌍 KHỞI ĐỘNG SERVER TRUY CẬP TỪ INTERNET (NGROK)
echo ═══════════════════════════════════════════════════════════════
echo.

REM Kiểm tra ngrok đã cài chưa
where ngrok >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Chưa cài đặt Ngrok!
    echo.
    echo 📥 HƯỚNG DẪN CÀI ĐẶT NGROK:
    echo.
    echo    1. Truy cập: https://ngrok.com/download
    echo    2. Tải bản Windows
    echo    3. Giải nén và đặt ngrok.exe vào thư mục này
    echo.
    echo    HOẶC cài bằng Chocolatey:
    echo    choco install ngrok
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo.
    
    choice /C YN /M "Bạn có muốn tải Ngrok ngay bây giờ không?"
    if %ERRORLEVEL% EQU 1 (
        start https://ngrok.com/download
    )
    
    pause
    exit /b
)

REM Kiểm tra Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Cần Python để chạy server!
    echo.
    echo Vui lòng cài Python: https://www.python.org/downloads/
    pause
    exit /b
)

echo ✅ Đã tìm thấy Ngrok và Python
echo.
echo 🚀 Đang khởi động...
echo.

REM Chạy Python server trong background
start /min cmd /c "python -m http.server 8888"

REM Chờ server khởi động
timeout /t 2 /nobreak >nul

echo ═══════════════════════════════════════════════════════════════
echo    📱 ĐANG TẠO ĐƯỜNG LINK INTERNET...
echo ═══════════════════════════════════════════════════════════════
echo.
echo 💡 Sau khi Ngrok khởi động:
echo    - Link sẽ hiển thị dạng: https://xxxx-xxx.ngrok.io
echo    - Gửi link này cho bất kỳ ai để truy cập!
echo.
echo ⚠️ Lưu ý: Link sẽ thay đổi mỗi lần chạy (bản miễn phí)
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

REM Chạy ngrok
ngrok http 8888

REM Khi ngrok tắt, tắt luôn python server
taskkill /f /im python.exe /fi "WINDOWTITLE eq *http.server*" >nul 2>nul
