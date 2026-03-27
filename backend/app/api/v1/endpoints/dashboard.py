from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, desc

from app.db.session import get_db
from app.models.plant_report import PlantReport
from app.models.robot_status import RobotStatus
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/summary")
async def get_dashboard_summary(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    # Total Plants Scanned
    total_result = await db.execute(select(func.count(PlantReport.id)))
    total_scanned = total_result.scalar() or 0
    
    # Healthy vs Infected
    healthy_result = await average_stats_helper(db, PlantReport.health_status == "HEALTHY")
    infected_result = await db.execute(select(func.count(PlantReport.id)).where(PlantReport.health_status != "HEALTHY"))
    infected_count = infected_result.scalar() or 0
    
    # Average Health Score
    avg_score_result = await db.execute(select(func.avg(PlantReport.health_score)))
    avg_health_score = avg_score_result.scalar() or 0.0
    
    # Latest Robot Status
    robot_result = await db.execute(select(RobotStatus).order_by(desc(RobotStatus.timestamp)).limit(1))
    latest_robot = robot_result.scalar_one_or_none()
    
    return {
        "total_scanned": total_scanned,
        "healthy_count": total_scanned - infected_count,
        "infected_count": infected_count,
        "average_health_score": round(avg_health_score, 2),
        "robot_status": {
            "battery_level": latest_robot.battery_level if latest_robot else 0.0,
            "current_state": latest_robot.current_state if latest_robot else "UNKNOWN",
            "current_row": latest_robot.current_row if latest_robot else "N/A"
        }
    }

async def average_stats_helper(db, condition):
    # Just a dummy helper
    pass

@router.get("/disease-distribution")
async def get_disease_distribution(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(PlantReport.disease_type, func.count(PlantReport.id))
        .where(PlantReport.disease_type != None)
        .group_by(PlantReport.disease_type)
    )
    distribution = [{"name": row[0], "value": row[1]} for row in result.all()]
    return distribution

@router.get("/health-score-distribution")
async def get_health_score_distribution(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    # Grouping health scores into buckets
    buckets = {"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}
    result = await db.execute(select(PlantReport.health_score))
    
    for row in result.all():
        score = row[0]
        if score <= 20: buckets["0-20"] += 1
        elif score <= 40: buckets["21-40"] += 1
        elif score <= 60: buckets["41-60"] += 1
        elif score <= 80: buckets["61-80"] += 1
        else: buckets["81-100"] += 1
        
    return [{"name": k, "value": v} for k, v in buckets.items()]

@router.get("/infection-trend")
async def get_infection_trend(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    # Group by date (simplification: getting all and formatting in python for SQLite/Postgres compatibility)
    result = await db.execute(select(PlantReport.timestamp, PlantReport.health_status).order_by(PlantReport.timestamp))
    
    trends = {}
    for row in result.all():
        date_str = row[0].strftime("%Y-%m-%d")
        if date_str not in trends:
            trends[date_str] = {"healthy": 0, "infected": 0}
        if row[1] == "HEALTHY":
            trends[date_str]["healthy"] += 1
        else:
            trends[date_str]["infected"] += 1
            
    trend_list = [{"date": k, "healthy": v["healthy"], "infected": v["infected"]} for k, v in trends.items()]
    return trend_list[-30:] # Last 30 days
