// input: email và mật khẩu đăng ký
// output: xác thực đã đăng ký và tiến hành đăng nhập
// sử dụng hàm băm không khả nghịch và TUYỆT ĐỐI không lưu mật khẩu trực tiếp trong cơ sở dữ liệu
// nếu muốn có độ bảo mật cao hơn hãy sử dụng kĩ thuật token(JWT)
export function signUp(userEmail, userPassword) {
  return true
}
// input: email và mật khẩu đăng nhập
// output: xác thực đã đăng nhập thành công hay chưa
export function signIn(userEmail, userPassword) {
  return true
}

// hàm này là sử dụng dữ liệu giả thông qua việc lưu trữ trong local storage
// khi hoàn thành nên có cách xử lý khác
export function logOut() {
  localStorage.clear()
}


export function confirmEmailExist(userEmail) {
  setTimeout(() => { }, 2000)
  return true
}
// Được sử dụng để xác thực trong giao thức gửi lại mã OTP thông qua số điện thoại
// Hàm kiểm tra nếu như user này có tồn tại(đã tạo tài khoản bằng số điện thoại này chưa)
// Input: số điện thoại cần được xác thực
// Output: true nếu số điện thoại có tồn tại, false nếu ngược lại
export async function confirmPhoneNumberExist(userPhoneNumber) {
  setTimeout(() => { }, 2000)
  return true
}
// Kiểm tra thôngt tin user có tồn tại hay không
// Khi thực hiện mở rộng thêm phương thức xác thực cần:
// - thên hàm xác thực mới
// - thêm vào hàm này kiểm tra đối với dữ liệu trên và thêm vào hàm này
export async function confirmInforExist(userStr) {
  if (isEmail(userStr)) {
    return confirmEmailExist(userStr)
  }
  else if (isPhoneNumber(userStr)) {
    return confirmPhoneNumberExist(userStr)
  }

  throw Error('Unidentified user identity')
}
// trường userData = {phoneNumber: str, email: str}
// Input: userData chứa thông tin người sử dụng cần có mã xác thực
// Output: trả về mã OTP nếu thông tin đó có tồn tại trong DB
export async function requestOTP(userData) {
  setTimeout(() => { }, 2000)
  return "12345678"
}




// =================== Hàm phụ trợ: không cần API ============
// kiểm tra nếu chuỗi là số điện thoại
function isPhoneNumber(numStr) {
  for (const ch of numStr) {
    if (ch < '0' || '9' < ch) {
      return false
    }
  }

  return true
}
// kiểm tra nếu chuỗi là email
function isEmail(emailStr) {
  for (const ch of emailStr) {
    if (ch === '@') {
      return true
    }
  }

  return false
}
