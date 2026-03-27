from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.db.session import get_db
from app.models.robot_status import RobotStatus
from app.schemas.robot_status import RobotStatusCreate, RobotStatusResponse
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=RobotStatusResponse)
async def create_robot_status(
    status_in: RobotStatusCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_status = RobotStatus(**status_in.model_dump())
    db.add(db_status)
    await db.commit()
    await db.refresh(db_status)
    return db_status
