import requests
from sgp4.api import Satrec
from sgp4.api import jday
from datetime import datetime
import math

# Source for TLE data (CelesTrak - Top 100 brightest, or Stations)
TLE_SOURCE_URL = "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle"

class SatelliteService:
    def __init__(self):
        self._cache = {}
        self._last_fetch = None

    def fetch_tles(self):
        """Fetch TLE data from CelesTrak."""
        # Simple caching strategy (1 hour)
        if self._last_fetch and (datetime.now() - self._last_fetch).seconds < 3600:
            return self._cache

        try:
            response = requests.get(TLE_SOURCE_URL)
            if response.status_code == 200:
                raw_data = response.text.splitlines()
                # Parse 3-line TLEs
                satellites = []
                i = 0
                while i < len(raw_data) - 2:
                    name = raw_data[i].strip()
                    line1 = raw_data[i+1].strip()
                    line2 = raw_data[i+2].strip()
                    satellites.append({"name": name, "line1": line1, "line2": line2})
                    i += 3
                
                self._cache = satellites
                self._last_fetch = datetime.now()
                return satellites
        except Exception as e:
            print(f"Error fetching TLEs: {e}")
            return []
        return []

    def get_satellite_positions(self):
        """Calculate current position for cached satellites."""
        tles = self.fetch_tles()
        results = []
        
        if not self._cache:
            # Fallback Simulation if TLE fetch failed
            return [
                {"id": "ISS_SIM", "name": "ISS (SIMULATED)", "miss_distance_km": 420, "velocity": 7.66, "angle": 45, "risk": 0, "diameter": 0.1},
                {"id": "HST_SIM", "name": "HUBBLE (SIMULATED)", "miss_distance_km": 540, "velocity": 7.5, "angle": 120, "risk": 0, "diameter": 0.01},
                {"id": "STARLINK_1", "name": "STARLINK-1001", "miss_distance_km": 550, "velocity": 7.6, "angle": 200, "risk": 0, "diameter": 0.002},
                {"id": "TIANGONG", "name": "TIANGONG (CSS)", "miss_distance_km": 380, "velocity": 7.68, "angle": 300, "risk": 0, "diameter": 0.05}
            ]

        # Current time for SGP4
        now = datetime.utcnow()
        jd, fr = jday(now.year, now.month, now.day, now.hour, now.minute, now.second)

        for sat in tles:
            try:
                satellite = Satrec.twoline2rv(sat['line1'], sat['line2'])
                e, r, v = satellite.sgp4(jd, fr)
                
                if e == 0:
                    # r is [x, y, z] in km (TEME frame)
                    # Calculate simple distance from Earth center (simulated radar range)
                    x, y, z = r
                    distance_km = math.sqrt(x*x + y*y + z*z)
                    
                    # Calculate velocity magnitude
                    vx, vy, vz = v
                    velocity_kms = math.sqrt(vx*vx + vy*vy + vz*vz)

                    # Simplified angle for 2D radar (atan2)
                    angle = math.degrees(math.atan2(y, x))
                    if angle < 0: angle += 360

                    results.append({
                        "id": sat['name'].replace(" ", "_"),
                        "name": sat['name'],
                        "type": "satellite",
                        "miss_distance_km": distance_km - 6371, # Altitude roughly
                        "velocity": round(velocity_kms, 2),
                        "angle": angle,
                        "risk": 0, # Satellites are tracked, usually low risk of impact
                        "is_hazardous": False,
                        "diameter": 0.005 # Default small
                    })
            except Exception as e:
                continue

        return results

satellite_service = SatelliteService()
