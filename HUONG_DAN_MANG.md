# 🌐 Hướng Dẫn Truy Cập Từ Máy Khác / Mạng Khác

## 📱 CÁCH 1: Truy cập từ máy khác CÙNG MẠNG WiFi (Dễ nhất)

### Bước 1: Chạy server
- Click đúp vào file **`START_LAN_SERVER.bat`**
- Server sẽ hiển thị địa chỉ IP của bạn, ví dụ: `http://192.168.1.100:8080`

### Bước 2: Truy cập từ máy khác
- Đảm bảo máy/điện thoại kết nối **cùng mạng WiFi**
- Mở trình duyệt và nhập địa chỉ IP hiển thị ở bước 1
- **Lưu ý**: Không dùng `localhost`, phải dùng địa chỉ IP!

### Khắc phục lỗi không truy cập được:
1. **Tắt Windows Firewall tạm thời**:
   - Mở Settings → Windows Security → Firewall
   - Tắt firewall cho mạng Private

2. **Hoặc thêm exception**:
   - Mở Windows Firewall → Advanced Settings
   - Inbound Rules → New Rule → Port → TCP: 8080 → Allow

---

## 🌍 CÁCH 2: Truy cập từ máy ở MẠNG KHÁC (Qua Internet)

### Sử dụng Ngrok (Miễn phí, dễ dùng):

#### Bước 1: Cài đặt Ngrok
1. Vào https://ngrok.com/download
2. Tải bản Windows (ZIP)
3. Giải nén, copy `ngrok.exe` vào thư mục này
4. (Tùy chọn) Đăng ký tài khoản miễn phí để có link cố định hơn

#### Bước 2: Chạy server
- Click đúp vào file **`START_INTERNET_SERVER.bat`**
- Ngrok sẽ tạo 1 link công khai, ví dụ: `https://abc123.ngrok.io`

#### Bước 3: Chia sẻ link
- Gửi link này cho bất kỳ ai
- Họ có thể truy cập từ bất kỳ đâu trên thế giới!

#### Lưu ý:
- Link thay đổi mỗi lần chạy (bản miễn phí)
- Bản trả phí có thể có link cố định

---

## 🚀 CÁCH 3: Deploy lên web miễn phí (Không cần bật máy)

### Sử dụng GitHub Pages:

#### Bước 1: Tạo repository GitHub
1. Vào https://github.com
2. Đăng ký/đăng nhập
3. Tạo repository mới, đặt tên: `lottery-analytics`

#### Bước 2: Upload code
1. Chạy file **`AUTO_DEPLOY_NOW.bat`** (nếu có)
2. Hoặc upload thủ công các file lên repository

#### Bước 3: Bật GitHub Pages
1. Vào Settings của repository
2. Chọn Pages
3. Source: Deploy from a branch
4. Branch: main, folder: / (root)
5. Chờ vài phút, website sẽ có tại: `https://username.github.io/lottery-analytics`

---

## 📊 So sánh các phương pháp

| Phương pháp | Tốc độ | Phạm vi | Cần bật máy? | Độ khó |
|-------------|--------|---------|--------------|--------|
| LAN Server | 🚀 Nhanh | Cùng WiFi | ✅ Có | ⭐ Dễ |
| Ngrok | ⚡ Nhanh | Toàn cầu | ✅ Có | ⭐⭐ TB |
| GitHub Pages | 🌐 TB | Toàn cầu | ❌ Không | ⭐⭐⭐ Khó hơn |

---

## ❓ Câu hỏi thường gặp

**Q: Tại sao không truy cập được từ điện thoại?**
- Kiểm tra điện thoại và máy tính cùng WiFi
- Đảm bảo nhập đúng địa chỉ IP
- Tắt Windows Firewall tạm thời

**Q: Link ngrok có an toàn không?**
- Có, Ngrok mã hóa HTTPS
- Chỉ chia sẻ link cho người bạn tin tưởng

**Q: Làm sao có link cố định?**
- Dùng GitHub Pages (miễn phí, cố định)
- Hoặc nâng cấp Ngrok Pro (trả phí)
