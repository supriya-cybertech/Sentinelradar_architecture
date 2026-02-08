from models.risk import RiskScore, RiskLevel

class RiskEngine:
    def calculate_risk(self, neo_data: dict) -> RiskScore:
        # Placeholder logic for Sri calculation
        # Sri = (D_avg * V_rel) / dist_miss * k
        
        try:
            diameter_min = neo_data['estimated_diameter']['kilometers']['estimated_diameter_min']
            diameter_max = neo_data['estimated_diameter']['kilometers']['estimated_diameter_max']
            d_avg = (diameter_min + diameter_max) / 2

            approach_data = neo_data['close_approach_data'][0]
            v_rel = float(approach_data['relative_velocity']['kilometers_per_hour'])
            dist_miss = float(approach_data['miss_distance']['kilometers'])

            # Normalization constant (arbitrary for now to scale to 0-100)
            k = 10000000 

            raw_score = ((d_avg * v_rel) / dist_miss) * k
            normalized_score = min(max(raw_score, 0), 100) # Clamp 0-100

            level = RiskLevel.LOW
            if normalized_score > 25: level = RiskLevel.MODERATE
            if normalized_score > 50: level = RiskLevel.HIGH
            if normalized_score > 75: level = RiskLevel.CRITICAL

            return RiskScore(
                score=round(normalized_score, 2),
                level=level,
                justification=f"Diameter: {d_avg:.2f}km, Velocity: {v_rel:.2f} km/h, Miss Dist: {dist_miss:.2f} km"
            )
        except Exception as e:
            # Fallback for missing data
            return RiskScore(score=0, level=RiskLevel.LOW, justification="Insufficient data for calculation")
