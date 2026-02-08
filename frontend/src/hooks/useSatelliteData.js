import { useState, useEffect } from 'react';

const useSatelliteData = (active) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!active) return;

        const fetchSatellites = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8000/api/satellites');
                if (response.ok) {
                    const result = await response.json();
                    setData(result.satellites || []);
                }
            } catch (error) {
                console.error("Failed to fetch satellites:", error);
                // Mock data if backend fails or TLE not reachable
                setData([
                    { id: 'ISS', name: 'ISS (ZARYA)', miss_distance_km: 400, velocity: 7.66, angle: 45, diameter: 0.1, risk: 0 },
                    { id: 'HST', name: 'HUBBLE ST', miss_distance_km: 540, velocity: 7.5, angle: 120, diameter: 0.01, risk: 0 },
                    { id: 'TIANHE', name: 'TIANHE', miss_distance_km: 380, velocity: 7.68, angle: 200, diameter: 0.05, risk: 0 },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchSatellites();
        // Poll every 10 seconds
        const interval = setInterval(fetchSatellites, 10000);
        return () => clearInterval(interval);
    }, [active]);

    return { data, loading };
};

export default useSatelliteData;
