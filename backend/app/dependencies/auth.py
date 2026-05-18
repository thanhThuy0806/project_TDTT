<<<<<<< HEAD
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as admin_auth

security = HTTPBearer()

def get_current_user(res: HTTPAuthorizationCredentials = Depends(security)):
    token = res.credentials 
=======
from fastapi import Header, HTTPException
from firebase_admin import auth as admin_auth
from app.config.firebase import init_firebase_admin

def get_current_user(authorization: str = Header(...)):
    init_firebase_admin()

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.replace("Bearer ", "").strip()
>>>>>>> BE_Warning

    try:
        decoded = admin_auth.verify_id_token(token)
        return {
            "uid": decoded.get("uid"),
            "email": decoded.get("email"),
            "token": token
        }
<<<<<<< HEAD
    except Exception as e:
        print(f"Firebase Auth Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn"
        )
=======
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
>>>>>>> BE_Warning
