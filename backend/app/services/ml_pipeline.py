import random
import uuid

def process_plant_image(image_bytes: bytes) -> dict:
    """
    Simulates a leaf detection and disease classification model.
    In a real scenario, this would load a PyTorch/TF model and run inference on `image_bytes`.
    """
    total_leaves = random.randint(5, 50)
    
    disease_types = [None, "Spider Mite", "Late Blight", "Powdery Mildew", "Leaf Rust"]
    has_disease = random.choice([True, False, False]) # 33% chance of disease
    
    if has_disease:
        infected_leaves = random.randint(1, int(total_leaves * 0.8))
        disease_type = random.choice(disease_types[1:])
    else:
        infected_leaves = 0
        disease_type = None

    infection_ratio = infected_leaves / total_leaves if total_leaves > 0 else 0
    
    if infection_ratio == 0:
        health_status = "HEALTHY"
        risk_level = "LOW"
        health_score = random.uniform(90.0, 100.0)
    elif infection_ratio < 0.2:
        health_status = "MILD_INFECTION"
        risk_level = "MODERATE"
        health_score = random.uniform(60.0, 89.9)
    elif infection_ratio < 0.5:
        health_status = "SEVERE_INFECTION"
        risk_level = "HIGH"
        health_score = random.uniform(30.0, 59.9)
    else:
        health_status = "SEVERE_INFECTION"
        risk_level = "CRITICAL"
        health_score = random.uniform(0.0, 29.9)
        
    confidence_score = random.uniform(0.70, 0.99)
    processed_image_url = f"/static/processed/{uuid.uuid4()}.jpg"
    
    return {
        "total_leaves": total_leaves,
        "infected_leaves": infected_leaves,
        "infection_ratio": round(infection_ratio, 4),
        "health_status": health_status,
        "risk_level": risk_level,
        "disease_type": disease_type,
        "confidence_score": round(confidence_score, 4),
        "health_score": round(health_score, 2),
        "processed_image_url": processed_image_url
    }
