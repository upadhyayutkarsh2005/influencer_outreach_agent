from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class GoogleAuthRequest(BaseModel):
    access_token: str  # This will contain the JWT credential from Google

class TokenData(BaseModel):
    email: Optional[EmailStr] = None

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    profile_picture: Optional[str] = None

class UserCreate(UserBase):
    google_id: str

class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True