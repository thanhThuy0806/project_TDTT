const API_BASE = '/api/auth';   

// Đăng ký
export async function signUp(userEmail, userPassword, userPasswordValidation) {
  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
        passwordValidation: userPasswordValidation,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return true;
  } catch (error) {
    console.error('SignUp error:', error.message);
    alert(error.message);
    return false;
  }
}

// Đăng nhập
export async function signIn(userEmail, userPassword) {
  try {
    const res = await fetch(`${API_BASE}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, password: userPassword }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // Lưu token để dùng cho các API cần xác thực
    localStorage.setItem('token', data.idToken);
    return true;
  } catch (error) {
    console.error('SignIn error:', error.message);
    alert(error.message);
    return false;
  }
}

// Quên mật khẩu (thêm mới)
export async function forgotPassword(email) {
  try {
    const res = await fetch(`${API_BASE}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    alert(data.message);
    return true;
  } catch (error) {
    console.error('Forgot password error:', error.message);
    alert(error.message);
    return false;
  }
}

// Đăng xuất
export function logOut() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

// Lưu profile (gọi sau khi đăng nhập)
export async function saveProfile(profileData) {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return true;
  } catch (error) {
    console.error('Save profile error:', error.message);
    return false;
  }
}

// Lấy profile
export async function getProfile() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const res = await fetch('/api/user/profile', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.profile;
  } catch (error) {
    console.error('Get profile error:', error.message);
    return null;
  }
}