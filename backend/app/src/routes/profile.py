from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from src.db.database import SessionLocal
from src.db.schema import User, UserProfile
from src.auth import verify_token

router = APIRouter()

def get_uid(authorization):
    token = authorization.replace("Bearer ", "")
    decoded = verify_token(token)
    return decoded["uid"], decoded.get("email")


class ProfileSchema(BaseModel):
    full_name: str
    gender: str
    birth_date: str
    phone: str
    emergency_name: str
    emergency_phone: str


@router.get("/api/me")
def me(authorization: str = Header(...)):
    db = SessionLocal()
    try:
        uid, email = get_uid(authorization)

        user = db.query(User).filter_by(firebase_uid=uid).first()
        if not user:
            db.add(User(firebase_uid=uid, email=email))
            db.commit()

        profile = db.query(UserProfile).filter_by(firebase_uid=uid).first()

        return {"has_profile": profile is not None}

    finally:
        db.close()


@router.post("/api/profile")
def create_profile(data: ProfileSchema, authorization: str = Header(...)):
    db = SessionLocal()
    try:
        uid, _ = get_uid(authorization)

        old = db.query(UserProfile).filter_by(firebase_uid=uid).first()
        if old:
            raise HTTPException(400, "Profile already exists")

        profile = UserProfile(
            firebase_uid=uid,
            full_name=data.full_name,
            gender=data.gender,
            birth_date=data.birth_date,
            phone=data.phone,
            emergency_name=data.emergency_name,
            emergency_phone=data.emergency_phone
        )

        db.add(profile)
        db.commit()

        return {"message": "success"}

    finally:
        db.close()