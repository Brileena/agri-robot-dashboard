from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.models.plant_report import PlantReport
from app.schemas.plant_report import PlantReportCreate, PlantReportResponse
from app.api.deps import get_current_user
from app.models.user import User
from app.services.ml_pipeline import process_plant_image

router = APIRouter()

@router.post("/edge", response_model=PlantReportResponse)
async def create_plant_report_edge(
    report: PlantReportCreate,
    db: AsyncSession = Depends(get_db),
    # Require authentication for UGV
    current_user: User = Depends(get_current_user)
):
    """
    Mode A (Edge ML): UGV runs ML locally and sends processed results.
    """
    db_report = PlantReport(**report.model_dump())
    db.add(db_report)
    await db.commit()
    await db.refresh(db_report)
    return db_report

@router.post("/cloud", response_model=PlantReportResponse)
async def create_plant_report_cloud(
    file: UploadFile = File(...),
    field_row: str = Form(None),
    pos_x: float = Form(None),
    pos_y: float = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mode B (Cloud ML): Backend receives image, runs ML model, stores results.
    """
    image_bytes = await file.read()
    
    # Run ML Inference
    ml_results = process_plant_image(image_bytes)
    
    db_report = PlantReport(
        image_url=f"/static/raw/{file.filename}",
        field_row=field_row,
        pos_x=pos_x,
        pos_y=pos_y,
        **ml_results
    )
    
    db.add(db_report)
    await db.commit()
    await db.refresh(db_report)
    return db_report

@router.get("/", response_model=list[PlantReportResponse])
async def get_plant_reports(
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(PlantReport).offset(skip).limit(limit))
    return result.scalars().all()

@router.get("/field-map", response_model=list[PlantReportResponse])
async def get_field_map(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PlantReport).where(PlantReport.pos_x != None))
    return result.scalars().all()
