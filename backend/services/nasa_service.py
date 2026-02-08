from services.mining_service import MiningService

class NasaService:
    BASE_URL = "https://api.nasa.gov"
    
    def __init__(self):
        self.mining_service = MiningService()

    async def get_neo_feed(self, start_date: str, end_date: str):
        try:
            async with httpx.AsyncClient() as client:
                print(f"📡 Requesting NASA NEO Feed: {start_date} to {end_date}")
                print(f"🔑 API Key: {settings.NASA_API_KEY}")
                
                response = await client.get(
                    f"{self.BASE_URL}/neo/rest/v1/feed",
                    params={
                        "start_date": start_date,
                        "end_date": end_date,
                        "api_key": settings.NASA_API_KEY
                    },
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                
                # Enrich with Mining Data
                if "near_earth_objects" in data:
                    for date in data["near_earth_objects"]:
                        for neo in data["near_earth_objects"][date]:
                            neo["mining_analytics"] = self.mining_service.assess_asteroid(neo)
                
                return data
        except Exception as e:
            print(f"⚠️ NASA API Failed: {e}")
            print("🔄 Switching to MOCK DATA protocol...")
            return self._get_mock_feed(start_date)

    def _get_mock_feed(self, date_str):
        # Return a structure matching NASA API
        data = {
            "element_count": 2,
            "near_earth_objects": {
                date_str: [
                    {
                        "id": "2021_GT2",
                        "name": "(2021 GT2)",
                        "nasa_jpl_url": "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2021%20GT2",
                        "absolute_magnitude_h": 22.1,
                        "estimated_diameter": {
                            "kilometers": {
                                "estimated_diameter_min": 0.08,
                                "estimated_diameter_max": 0.19
                            }
                        },
                        "is_potentially_hazardous_asteroid": True,
                        "close_approach_data": [
                            {
                                "close_approach_date": date_str,
                                "relative_velocity": {
                                    "kilometers_per_second": "18.45",
                                    "kilometers_per_hour": "66420"
                                },
                                "miss_distance": {
                                    "astronomical": "0.1",
                                    "lunar": "32.5",
                                    "kilometers": "12500000"
                                },
                                "orbiting_body": "Earth"
                            }
                        ]
                    },
                    {
                        "id": "2026_XF",
                        "name": "(2026 XF)",
                        "nasa_jpl_url": "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2026%20XF",
                        "absolute_magnitude_h": 25.3,
                        "estimated_diameter": {
                            "kilometers": {
                                "estimated_diameter_min": 0.02,
                                "estimated_diameter_max": 0.05
                            }
                        },
                        "is_potentially_hazardous_asteroid": False,
                        "close_approach_data": [
                            {
                                "close_approach_date": date_str,
                                "relative_velocity": {
                                    "kilometers_per_second": "12.2",
                                    "kilometers_per_hour": "43920"
                                },
                                "miss_distance": {
                                    "astronomical": "0.03",
                                    "lunar": "10.9",
                                    "kilometers": "4200000"
                                },
                                "orbiting_body": "Earth"
                            }
                        ]
                    }
                ]
            }
        }
        
        # Enrich Mock Data
        for date in data["near_earth_objects"]:
            for neo in data["near_earth_objects"][date]:
                neo["mining_analytics"] = self.mining_service.assess_asteroid(neo)
        
        return data

    async def get_neo_by_id(self, asteroid_id: str):
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/neo/rest/v1/neo/{asteroid_id}",
                params={"api_key": settings.NASA_API_KEY}
            )
            try:
                response.raise_for_status()
                data = response.json()
                data["mining_analytics"] = self.mining_service.assess_asteroid(data)
                return data
            except httpx.HTTPStatusError as e:
                # Handle 404 cleanly
                if e.response.status_code == 404:
                    return None
                raise e
