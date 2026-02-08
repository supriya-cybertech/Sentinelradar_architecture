from fastapi import APIRouter
from services.risk_engine import RiskEngine
from models.risk import RiskScore

router = APIRouter()

@router.post("/calculate", response_model=RiskScore)
async def calculate_risk(neo_data: dict):
    """
    Calculate the Sentinel Risk Index for a given NEO.
    """
    engine = RiskEngine()
    result = engine.calculate_risk(neo_data)
    return result
