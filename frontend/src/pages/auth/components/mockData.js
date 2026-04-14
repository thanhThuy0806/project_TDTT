// utils/mockData.js
export const MOCK_USERS = {
  "user@example.com": {
    email: "user@example.com",
    password: "123456",
    name: "Test User",
    role: "user",
    avatar: "https://via.placeholder.com/150",
  },
  "admin@example.com": {
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    avatar: "https://via.placeholder.com/150",
  },
  "john@example.com": {
    email: "john@example.com",
    password: "john123",
    name: "John Doe",
    role: "user",
    avatar: "https://via.placeholder.com/150",
  },
};

// Hàm kiểm tra đăng nhập
export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS[email];
      if (user && user.password === password) {
        resolve({
          success: true,
          user: {
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
          },
        });
      } else {
        reject(new Error("Email hoặc mật khẩu không đúng"));
      }
    }, 500); // Giả lập độ trễ mạng
  });
};

// Hàm kiểm tra đăng ký
export const mockSignup = (email, password, confirmPassword) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (password !== confirmPassword) {
        reject(new Error("Mật khẩu xác nhận không khớp"));
      }

      if (password.length < 6) {
        reject(new Error("Mật khẩu phải có ít nhất 6 ký tự"));
      }

      if (MOCK_USERS[email]) {
        reject(new Error("Email đã tồn tại"));
      }

      resolve({
        success: true,
        message: "Đăng ký thành công",
      });
    }, 500);
  });
};
