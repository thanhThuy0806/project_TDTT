from sqlalchemy import Column, Integer, String, Date
from src.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    firebase_uid = Column(String, unique=True)
    email = Column(String)

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True)
    firebase_uid = Column(String, unique=True)

    full_name = Column(String)
    gender = Column(String)
    birth_date = Column(Date)
    phone = Column(String)

    emergency_name = Column(String)
    emergency_phone = Column(String)