from fastapi import APIRouter
from app.api.v1.endpoints import auth, plant_report, robot_status, dashboard

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(plant_report.router, prefix="/plant-report", tags=["plant-reports"])
api_router.include_router(robot_status.router, prefix="/robot-status", tags=["robot-status"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
