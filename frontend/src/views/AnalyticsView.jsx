import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import ObjectDetailsModal from '../components/ObjectDetailsModal';
import { format } from 'date-fns';

const AnalyticsView = () => {
    const [velocityData, setVelocityData] = useState([]);
    const [distanceData, setDistanceData] = useState([]);
    const [selectedObject, setSelectedObject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const startDate = format(today, 'yyyy-MM-dd');
                const endDate = format(today, 'yyyy-MM-dd');

                // Note: Using http://localhost:8000 directly. In production, use environment variable.
                const response = await fetch(`http://localhost:8000/api/neo/feed?start_date=${startDate}&end_date=${endDate}`);

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const data = await response.json();

                // Check if we have valid data structure
                if (data.near_earth_objects) {
                    const objects = Object.values(data.near_earth_objects).flat();

                    // Transform for Velocity Chart
                    const vData = objects.map(obj => ({
                        name: obj.name,
                        velocity: parseFloat(obj.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(2),
                        risk: obj.is_potentially_hazardous_asteroid ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 20), // Mock risk calculation for now
                        diameter: obj.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3),
                        id: obj.id,
                        raw: obj
                    })).slice(0, 10); // Limit to top 10 for readability

                    setVelocityData(vData);

                    // Transform for Distance Chart (using one object for trend or multiple)
                    // For simplicity, let's just map the top 5 objects' miss distances as "events"
                    const dData = objects.slice(0, 5).map(obj => ({
                        name: obj.name.replace(/[()]/g, ''),
                        distance: (parseFloat(obj.close_approach_data[0].miss_distance.kilometers) / 1000000).toFixed(1)
                    }));
                    setDistanceData(dData);
                }
            } catch (error) {
                console.error("Failed to fetch NEO data:", error);
                setError(error.message);

                // Fallback Mock Data on Error
                const mockV = [
                    { name: '(MOCK1)', velocity: '25.5', risk: 65, diameter: '0.15', id: '9991' },
                    { name: '(MOCK2)', velocity: '18.2', risk: 12, diameter: '0.08', id: '9992' }
                ];
                setVelocityData(mockV);
                setDistanceData([{ name: 'MOCK1', distance: '12.5' }, { name: 'MOCK2', distance: '8.4' }]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-sentinel-cyan animate-pulse space-y-4">
                <div className="w-12 h-12 border-4 border-t-sentinel-cyan border-sentinel-dim/30 rounded-full animate-spin" />
                <div className="text-xl tracking-widest font-mono">ACQUIRING TELEMETRY...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full max-w-7xl mx-auto p-6 space-y-6">

            {/* Error Banner if API fails */}
            {error && (
                <div className="w-full bg-sentinel-red/10 border border-sentinel-red text-sentinel-red px-4 py-2 text-xs font-mono uppercase text-center">
                    ⚠ CONNECTION WARNING: {error} - DISPLAYING CACHED SIMULATION DATA
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-1/2">
                {/* Velocity Chart */}
                <div className="bg-sentinel-panel border border-sentinel-border p-4 flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sentinel-cyan to-transparent opacity-50" />
                    <h2 className="text-sentinel-cyan font-bold tracking-widest text-sm mb-4 uppercase flex items-center">
                        <span className="w-2 h-2 bg-sentinel-cyan mr-2" /> Relative Velocity Profile (km/s)
                    </h2>
                    <div className="flex-1 w-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={velocityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a1016', borderColor: 'rgba(0, 240, 255, 0.3)', color: '#e0f2fe' }}
                                    itemStyle={{ color: '#00f0ff' }}
                                    cursor={{ fill: 'rgba(0, 240, 255, 0.05)' }}
                                />
                                <Bar dataKey="velocity" fill="#00f0ff" barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distance Chart */}
                <div className="bg-sentinel-panel border border-sentinel-border p-4 flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sentinel-red to-transparent opacity-50" />
                    <h2 className="text-sentinel-red font-bold tracking-widest text-sm mb-4 uppercase flex items-center">
                        <span className="w-2 h-2 bg-sentinel-red mr-2" /> Miss Distance (Millions km)
                    </h2>
                    <div className="flex-1 w-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distanceData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={80} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a1016', borderColor: 'rgba(255, 0, 60, 0.3)', color: '#e0f2fe' }}
                                    itemStyle={{ color: '#ff003c' }}
                                />
                                <Bar dataKey="distance" fill="#ff003c" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Risk Table / List */}
            <div className="bg-sentinel-panel border border-sentinel-border flex-1 p-4 overflow-hidden relative">
                <h2 className="text-white font-bold tracking-widest text-sm mb-4 uppercase border-b border-sentinel-dim/20 pb-2">
                    Active Risk Assessments
                </h2>
                <div className="overflow-y-auto h-full pb-10">
                    <table className="w-full text-left text-sm font-mono">
                        <thead className="text-sentinel-dim uppercase text-xs">
                            <tr>
                                <th className="pb-3 pl-2">ID</th>
                                <th className="pb-3">Diameter (km)</th>
                                <th className="pb-3">Velocity</th>
                                <th className="pb-3">Risk Index</th>
                                <th className="pb-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sentinel-dim/10">
                            {velocityData.map((item, idx) => (
                                <tr
                                    key={idx}
                                    onClick={() => setSelectedObject(item)}
                                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                                >
                                    <td className="py-3 pl-2 text-sentinel-cyan font-bold">{item.name}</td>
                                    <td className="py-3">{item.diameter}</td>
                                    <td className="py-3">{item.velocity} km/s</td>
                                    <td className="py-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-24 h-1 bg-sentinel-dim/30 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${item.risk > 50 ? 'bg-sentinel-red' : 'bg-sentinel-cyan'}`}
                                                    style={{ width: `${item.risk}%` }}
                                                />
                                            </div>
                                            <span className={item.risk > 50 ? 'text-sentinel-red' : 'text-sentinel-cyan'}>{item.risk}/100</span>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <span className={`px-2 py-0.5 text-[10px] uppercase border ${item.risk > 50
                                                ? 'border-sentinel-red text-sentinel-red bg-sentinel-red/10'
                                                : 'border-sentinel-green text-sentinel-green bg-sentinel-green/10'
                                            }`}>
                                            {item.risk > 50 ? 'MONITOR' : 'PASSIVE'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ObjectDetailsModal
                isOpen={!!selectedObject}
                onClose={() => setSelectedObject(null)}
                data={selectedObject}
            />
        </div>
    );
};

export default AnalyticsView;
