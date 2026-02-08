
import random

class MiningService:
    """
    Analyzes Near Earth Objects for their commercial mining potential.
    """

    # Approximate densities in g/cm³
    DENSITIES = {
        "C": 1.38, # Carbonaceous (Water/Volatiles)
        "S": 2.71, # Silicaceous (Stone/Iron)
        "M": 5.32  # Metallic (Nickel-Iron/PGMs)
    }

    # Estimated value per 1000kg (ton) in USD (Futuristic space-market prices)
    # C-Type: Water/Fuel is gold in space ($1M/ton in orbit)
    # S-Type: Construction materials ($500k/ton)
    # M-Type: Platinum/PGMs ($50M/ton)
    RESOURCE_VALUES = {
        "C": 1000000, 
        "S": 500000,
        "M": 50000000
    }

    def assess_asteroid(self, neo_data):
        """
        Enriches a single NEO object with mining data.
        """
        # 1. Determine Class (Simulated based on probability if unknown)
        # Real spectral data isn't in the standard NASA feed, so we simulate based on statistical distribution
        # C: ~75%, S: ~17%, M: ~8%
        rand = random.random()
        if rand < 0.75:
            spectral_class = "C"
        elif rand < 0.92:
            spectral_class = "S"
        else:
            spectral_class = "M"

        # 2. Estimate Mass
        # Volume of a sphere = 4/3 * pi * r^3
        # Diameter is in km, convert to cm for density calc
        diameter_km = neo_data.get('estimated_diameter', {}).get('kilometers', {}).get('estimated_diameter_max', 0.1)
        radius_cm = (diameter_km * 100000) / 2
        volume_cm3 = (4/3) * 3.14159 * (radius_cm ** 3)
        
        density = self.DENSITIES[spectral_class]
        mass_kg = (volume_cm3 * density) / 1000 # Convert g to kg

        # 3. Calculate Value
        price_per_ton = self.RESOURCE_VALUES[spectral_class]
        estimated_value = (mass_kg / 1000) * price_per_ton

        # 4. Generate Score (0-100)
        # Factors: Value (High), Distance (Low is better)
        # Simple heuristic: Value per km distance
        miss_distance_km = float(neo_data['close_approach_data'][0]['miss_distance']['kilometers'])
        
        # Normalize score
        # Arbitrary baseline: $1T at 1M km = 1M score -> compressed to 0-100
        raw_score = (estimated_value / miss_distance_km)
        
        # Logarithmic scaling for display (0-100)
        import math
        try:
            score = min(100, max(1, math.log(raw_score) * 4)) # Adjusted factor
        except ValueError:
            score = 10

        return {
            "spectral_class": spectral_class,
            "estimated_mass_kg": mass_kg,
            "estimated_value_usd": estimated_value,
            "mining_score": round(score, 1),
            "resources": self._get_resources(spectral_class)
        }

    def _get_resources(self, spectral_class):
        if spectral_class == "C":
            return ["Water (H2O)", "Methane", "Ammonia", "Carbon"]
        elif spectral_class == "S":
            return ["Silicates", "Nickel", "Iron", "Magnesium"]
        elif spectral_class == "M":
            return ["Platinum", "Palladium", "Iridium", "Gold"]
        return []
