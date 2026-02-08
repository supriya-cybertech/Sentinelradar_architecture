from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, values):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        json_schema = handler(core_schema)
        json_schema.update(type="string")
        return json_schema

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str
    full_name: Optional[str] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    alert_preferences: Optional[Dict[str, Any]] = None
    watchlist: Optional[List[str]] = None

class UserInDB(UserBase):
    hashed_password: str
    full_name: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    watchlist: List[str] = []
    alert_preferences: Dict[str, Any] = {
        "email_alerts": True,
        "risk_threshold": 50,
        "distance_threshold_km": 5000000
    }

class User(UserBase):
    id: Optional[str] = Field(default=None, alias="_id")
    full_name: Optional[str] = None
    is_active: bool
    is_verified: bool
    watchlist: List[str] = []
    alert_preferences: Dict[str, Any] = {}

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
