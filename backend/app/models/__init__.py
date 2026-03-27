from app.db.base import Base

# Import all models here so that Alembic can discover them
from .user import User
from .plant_report import PlantReport
from .robot_status import RobotStatus

# Ensure they are loaded
__all__ = ["Base", "User", "PlantReport", "RobotStatus"]
