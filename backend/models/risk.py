from pydantic import BaseModel
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"
    CRITICAL = "Critical"

class RiskScore(BaseModel):
    score: float  # 0-100
    level: RiskLevel
    justification: str
