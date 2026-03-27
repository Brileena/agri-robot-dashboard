from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PlantReportBase(BaseModel):
    image_url: Optional[str] = None
    processed_image_url: Optional[str] = None
    total_leaves: int = 0
    infected_leaves: int = 0
    infection_ratio: float = 0.0
    health_status: str
    risk_level: str
    disease_type: Optional[str] = None
    confidence_score: float = 0.0
    health_score: float = 100.0
    field_row: Optional[str] = None
    pos_x: Optional[float] = None
    pos_y: Optional[float] = None

class PlantReportCreate(PlantReportBase):
    pass

class PlantReportResponse(PlantReportBase):
    id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True
