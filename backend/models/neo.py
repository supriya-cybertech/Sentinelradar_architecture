from pydantic import BaseModel
from typing import List, Optional

class NeoDiameter(BaseModel):
    min_km: float
    max_km: float

class NeoApproach(BaseModel):
    date: str
    velocity_kmh: float
    miss_distance_km: float

class Neo(BaseModel):
    id: str
    name: str
    absolute_magnitude_h: float
    diameter: NeoDiameter
    is_potentially_hazardous: bool
    close_approach_data: List[NeoApproach]
