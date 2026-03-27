from pydantic import BaseModel
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.core.security import get_password_hash, verify_password, create_access_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # 🔍 DEBUG (remove later)
    print("TYPE:", type(user_in.password))
    print("RAW:", user_in.password)
    print("BYTES:", len(str(user_in.password).encode("utf-8")))

    # ✅ Extract REAL password (handle bad payloads)
    if isinstance(user_in.password, dict):
        password = user_in.password.get("value", "")
    else:
        password = user_in.password

    # 🚫 Validate password
    if not password or password.strip() == "":
        raise HTTPException(status_code=400, detail="Password cannot be empty")

    # 🚫 Enforce bcrypt limit (safe)
    if len(password.encode("utf-8")) > 72:
        password = password[:72]

    # 🔍 Check if user exists
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalar_one_or_none()

    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )

    # ✅ Create user
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(password),
        full_name=user_in.full_name,
        role=user_in.role
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)

    return user


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    print("LOGIN EMAIL:", login_data.email)
    print("LOGIN PASSWORD:", login_data.password)

    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()

    print("USER FOUND:", user)

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=400, detail="Incorrect email or password")

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    return {
        "access_token": create_access_token(
            data={"sub": str(user.email)},
            expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
