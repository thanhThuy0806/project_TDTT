# Các Lưu Ý Khi Sử Dụng
- Expo Go đối với các thiết bị ngoại vi như điện thoại phiên bản sử dụng SDK54.0.x  

- Node.js được sử dụng để phát triển là **phiên bản v20.20.2**, cần phải đảm bảo tải đúng  

- Do các thư viện từ npm và npx đã hỗ trợ sử dụng cho SDK55.x.x nên các bản trước đó đã trở thành ```legacy``` khi tải cần phải thêm cờ như sau  
```cmd  
# ở thư mục my-app, tải về các thư mục cần thiết  
npm install --legacy-peer-deps  
# tải expo  
npm install --legacy-peer-deps  
```

- Cần phải tạo **firebase** và điền các key tương tự với tên key có trong ```env.example```( các key này có thể được tìm thấy trong **General**)  

- Ở file ```DangerBanner.jsx``` phiên bản hiện tại sử dụng đường dẫn để truy cập backend thông thường là ```192.168.x.y```( địa chỉ mạng nội bộ cùng với máy tính tổ chức dịch vụ), khi sử dụng thì chúng ta cần phải điền lại trường này( có thể tìm được bằng cách dùng lệnh ```ipconfig``` trong **cmd** và là địa chỉ của Card mạng Wifi không dây) với cú pháp **ws://ip_address:8000/ws/tracking**