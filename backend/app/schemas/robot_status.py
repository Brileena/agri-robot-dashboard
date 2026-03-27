from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RobotStatusBase(BaseModel):
    battery_level: float
    current_state: str
    current_row: Optional[str] = None
    error_message: Optional[str] = None

class RobotStatusCreate(RobotStatusBase):
    pass

class RobotStatusResponse(RobotStatusBase):
    id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True
