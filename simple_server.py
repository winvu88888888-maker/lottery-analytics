#!/usr/bin/env python3
"""
🎯 AI LOTTERY ANALYTICS - NETWORK SERVER
=========================================
Server cho phép truy cập từ mạng LAN và có thể kết hợp với ngrok
để truy cập từ internet.
"""

import http.server
import socketserver
import socket
import webbrowser
import os
import sys
import threading

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class LotteryHTTPHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP handler with CORS support"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Thêm CORS headers để cho phép truy cập từ các domain khác
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    def log_message(self, format, *args):
        """Log requests với format đẹp"""
        print(f"📨 {self.address_string()} - {format % args}")


def get_local_ip():
    """Lấy địa chỉ IP local của máy"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def open_browser():
    """Mở trình duyệt sau khi server khởi động"""
    webbrowser.open(f'http://localhost:{PORT}/index.html')


def main():
    os.chdir(DIRECTORY)
    local_ip = get_local_ip()
    
    print()
    print("═" * 65)
    print("   🎯 AI LOTTERY ANALYTICS - NETWORK SERVER")
    print("═" * 65)
    print()
    print("   ✅ Server đang chạy!")
    print()
    print("═" * 65)
    print("   📱 CÁCH TRUY CẬP:")
    print("═" * 65)
    print()
    print(f"   🏠 Trên máy này:    http://localhost:{PORT}")
    print()
    print(f"   📡 Từ máy khác:     http://{local_ip}:{PORT}")
    print("      (Các máy phải cùng mạng WiFi)")
    print()
    print("═" * 65)
    print("   💡 HƯỚNG DẪN:")
    print("═" * 65)
    print()
    print("   1. Các máy cần kết nối cùng mạng WiFi")
    print("   2. Trên điện thoại/máy khác, mở trình duyệt")
    print(f"   3. Nhập địa chỉ: http://{local_ip}:{PORT}")
    print()
    print("   ⚠️  Nếu không truy cập được từ máy khác:")
    print("       - Tắt Windows Firewall tạm thời")
    print("       - Hoặc thêm exception cho port 8080")
    print()
    print("═" * 65)
    print("   Nhấn Ctrl+C để dừng server")
    print("═" * 65)
    print()
    
    # Mở trình duyệt sau 1 giây
    threading.Timer(1, open_browser).start()
    
    # Khởi động server
    with socketserver.TCPServer(("0.0.0.0", PORT), LotteryHTTPHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server đã dừng!")
            sys.exit(0)


if __name__ == "__main__":
    main()
