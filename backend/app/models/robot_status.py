from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class RobotStatus(Base):
    __tablename__ = "robot_status"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    battery_level = Column(Float, nullable=False) # 0.0 to 100.0
    current_state = Column(String, nullable=False) # IDLE, SCANNING, MOVING, CHARGING, ERROR
    current_row = Column(String, nullable=True)
    error_message = Column(String, nullable=True)
