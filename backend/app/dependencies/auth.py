from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as admin_auth

# Khai báo bảo mật dạng Bearer Token
security = HTTPBearer()

def get_current_user(res: HTTPAuthorizationCredentials = Depends(security)):
    # res.credentials chính là phần Token sau chữ "Bearer "
    token = res.credentials 

    try:
        # Giải mã và kiểm tra token với Firebase
        decoded = admin_auth.verify_id_token(token)
        return {
            "uid": decoded.get("uid"),
            "email": decoded.get("email"),
            "token": token
        }
    except Exception as e:
        # In lỗi ra console để bạn dễ debug
        print(f"Firebase Auth Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn"
        )