// input: email và mật khẩu đăng ký
// output: xác thực đã đăng ký và tiến hành đăng nhập
// sử dụng hàm băm không khả nghịch và TUYỆT ĐỐI không lưu mật khẩu trực tiếp trong cơ sở dữ liệu
// nếu muốn có độ bảo mật cao hơn hãy sử dụng kĩ thuật token(JWT)
export function signUp(userEmail, userPassword, userPasswordValidation) {
  return true;
}
// input: email và mật khẩu đăng nhập
// output: xác thực đã đăng nhập thành công hay chưa
export function signIn(userEmail, userPassword) {
  return true;
}

// hàm này là sử dụng dữ liệu giả thông qua việc lưu trữ trong local storage
// khi hoàn thành nên có cách xử lý khác
export function logOut() {
  localStorage.clear();
}
