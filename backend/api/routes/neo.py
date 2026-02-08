from fastapi import APIRouter, Depends, HTTPException
from typing import List
from services.nasa_service import NasaService

router = APIRouter()

@router.get("/feed")
async def get_neo_feed(start_date: str, end_date: str):
    """
    Get a list of Near Earth Objects within a date range.
    """
    service = NasaService()
    try:
        data = await service.get_neo_feed(start_date, end_date)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
