from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class PlantReport(Base):
    __tablename__ = "plant_reports"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Image URLs mapping to static/remote storage if needed
    image_url = Column(String, nullable=True)
    processed_image_url = Column(String, nullable=True)
    
    # ML Pipeline Metrics
    total_leaves = Column(Integer, default=0)
    infected_leaves = Column(Integer, default=0)
    infection_ratio = Column(Float, default=0.0)
    health_status = Column(String, index=True) # HEALTHY, MILD_INFECTION, SEVERE_INFECTION
    risk_level = Column(String, index=True) # LOW, MODERATE, HIGH, CRITICAL
    disease_type = Column(String, index=True, nullable=True)
    confidence_score = Column(Float, default=0.0)
    health_score = Column(Float, default=100.0) # 0-100 score
    
    # Location tracking
    field_row = Column(String, nullable=True)
    pos_x = Column(Float, nullable=True)
    pos_y = Column(Float, nullable=True)
