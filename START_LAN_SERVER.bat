@echo off
chcp 65001 >nul
color 0B
title 🌐 Lottery Analytics - LAN Server

echo.
echo ═══════════════════════════════════════════════════════════════
echo    🌐 KHỞI ĐỘNG SERVER TRUY CẬP TỪ MÁY KHÁC (CÙNG MẠNG)
echo ═══════════════════════════════════════════════════════════════
echo.

REM Lấy địa chỉ IP của máy tính
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set "IP=%%a"
    goto :found_ip
)
:found_ip
set "IP=%IP:~1%"

REM Kiểm tra Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Đã tìm thấy Python
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo    📱 TRUY CẬP TỪ MÁY KHÁC TRONG CÙNG MẠNG WiFi:
    echo ═══════════════════════════════════════════════════════════════
    echo.
    echo    🏠 Máy này:    http://localhost:8080
    echo.
    echo    📡 Máy khác:   http://%IP%:8080
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo.
    echo 💡 Hướng dẫn:
    echo    1. Đảm bảo các máy cùng mạng WiFi
    echo    2. Trên điện thoại/máy khác, mở trình duyệt
    echo    3. Nhập địa chỉ: http://%IP%:8080
    echo.
    echo ⚠️ Nếu không truy cập được, hãy tắt Windows Firewall tạm thời
    echo.
    echo 💡 Nhấn Ctrl+C để dừng server
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo.
    
    REM Mở firewall cho port 8080
    echo 🔓 Đang mở firewall cho port 8080...
    netsh advfirewall firewall add rule name="Lottery Analytics Web Server" dir=in action=allow protocol=tcp localport=8080 >nul 2>nul
    
    REM Mở trình duyệt
    start http://localhost:8080/index.html
    
    REM Chạy server bind tất cả interfaces
    python -m http.server 8080 --bind 0.0.0.0
    
    goto :end
)

REM Nếu không có Python, thử Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Đã tìm thấy Node.js
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo    📱 TRUY CẬP TỪ MÁY KHÁC TRONG CÙNG MẠNG WiFi:
    echo ═══════════════════════════════════════════════════════════════
    echo.
    echo    🏠 Máy này:    http://localhost:8080
    echo.
    echo    📡 Máy khác:   http://%IP%:8080
    echo.
    echo ═══════════════════════════════════════════════════════════════
    echo.
    
    REM Mở firewall cho port 8080
    netsh advfirewall firewall add rule name="Lottery Analytics Web Server" dir=in action=allow protocol=tcp localport=8080 >nul 2>nul
    
    start http://localhost:8080/index.html
    
    npx -y http-server -p 8080 -a 0.0.0.0
    
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
pause

:end
