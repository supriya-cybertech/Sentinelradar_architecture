import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const useNeoData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);

                const startDate = format(today, 'yyyy-MM-dd');
                const endDate = format(nextWeek, 'yyyy-MM-dd');

                // Note: Using http://localhost:8000 directly.
                const response = await fetch(`http://localhost:8000/api/neo/feed?start_date=${startDate}&end_date=${endDate}`);

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const result = await response.json();

                if (result.near_earth_objects) {
                    const objects = Object.values(result.near_earth_objects).flat();

                    if (objects.length > 0) {
                        // Transform data for common use
                        const transformed = objects.map(obj => ({
                            id: obj.id,
                            name: obj.name,
                            velocity: parseFloat(obj.close_approach_data[0].relative_velocity.kilometers_per_second),
                            miss_distance_km: parseFloat(obj.close_approach_data[0].miss_distance.kilometers),
                            miss_distance_au: parseFloat(obj.close_approach_data[0].miss_distance.astronomical),
                            diameter: parseFloat(obj.estimated_diameter.kilometers.estimated_diameter_max),
                            is_hazardous: obj.is_potentially_hazardous_asteroid,
                            // Simulated Risk Index
                            risk: obj.is_potentially_hazardous_asteroid ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 20),
                            // Mining Data (Backwards compatibility if backend update pending)
                            mining: obj.mining_analytics || {
                                estimated_value_usd: 0,
                                mining_score: 0,
                                spectral_class: 'U',
                                resources: []
                            },
                            angle: Math.random() * 360,
                            raw: obj
                        })).sort((a, b) => a.miss_distance_km - b.miss_distance_km);

                        setData(transformed);
                    } else {
                        throw new Error("No objects found.");
                    }
                } else {
                    throw new Error("Invalid API response format.");
                }
            } catch (err) {
                console.error("Failed to fetch NEO data:", err);
                setError(err.message);

                // Mock fallback
                setData([
                    { id: '1', name: '(2010 PK9)', velocity: 25.8, miss_distance_km: 4200000, diameter: 0.15, is_hazardous: true, risk: 85, angle: 45 },
                    { id: '2', name: '(2021 GT2)', velocity: 18.4, miss_distance_km: 8500000, diameter: 0.08, is_hazardous: false, risk: 12, angle: 120 },
                    { id: '3', name: '(2026 XF)', velocity: 12.2, miss_distance_km: 12000000, diameter: 0.04, is_hazardous: false, risk: 5, angle: 280 },
                    { id: '4', name: '(2024 AB)', velocity: 15.6, miss_distance_km: 1500000, diameter: 0.02, is_hazardous: true, risk: 92, angle: 190 }, // Very close mock
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

export default useNeoData;
