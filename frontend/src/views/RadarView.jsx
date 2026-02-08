import React, { useState, useMemo, useEffect } from 'react';
import useNeoData from '../hooks/useNeoData';
import useSatelliteData from '../hooks/useSatelliteData';
import ObjectDetailsModal from '../components/ObjectDetailsModal';
import { Radar, Target, ShieldCheck, Layers, Satellite } from 'lucide-react';

const RadarView = () => {
    // Mode State: 'neo' (Near Earth Objects) or 'sat' (Satellites)
    const [mode, setMode] = useState('neo');

    const { data: neoData, loading: neoLoading } = useNeoData();
    const { data: satData, loading: satLoading } = useSatelliteData(mode === 'sat');

    const objects = mode === 'neo' ? neoData : satData;
    const loading = mode === 'neo' ? neoLoading : satLoading;

    const [selectedObject, setSelectedObject] = useState(null);
    const [hoveredObject, setHoveredObject] = useState(null);

    // Radar Configuration
    // Neo: 20M km, Sat: 2000 km (Low Earth Orbit)
    const MAX_DISTANCE_KM = mode === 'neo' ? 20000000 : 2000;
    const RINGS = mode === 'neo'
        ? [5000000, 10000000, 15000000, 20000000]
        : [500, 1000, 1500, 2000];

    // Animation State
    const [time, setTime] = useState(0);

    useEffect(() => {
        let animationFrameId;
        const animate = () => {
            setTime(prev => prev + 0.05);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Calculate position on radar with Orbit functionality
    const getPosition = (distance, angle, speed) => {
        // Normalize distance
        const normalizedDist = Math.min(distance / MAX_DISTANCE_KM, 1);
        const radius = normalizedDist * 45;

        const orbitSpeed = speed || (0.2 + (1 - normalizedDist) * 0.5);
        const currentAngle = angle + (time * orbitSpeed);

        const rad = (currentAngle - 90) * (Math.PI / 180);
        return {
            x: 50 + radius * Math.cos(rad),
            y: 50 + radius * Math.sin(rad)
        };
    };

    const highRiskObjects = useMemo(() => objects.filter(o => o.risk > 50), [objects]);

    return (
        <div className="flex h-full w-full max-w-7xl mx-auto p-4 gap-4 relative">

            {/* Mode Toggles */}
            <div className="absolute top-6 right-80 z-20 flex space-x-2">
                <button
                    onClick={() => setMode('neo')}
                    className={`px-3 py-1 flex items-center space-x-1 text-xs font-bold uppercase border ${mode === 'neo' ? 'bg-sentinel-cyan text-black border-sentinel-cyan' : 'bg-black/50 text-sentinel-dim border-sentinel-dim'}`}
                >
                    <Target className="w-3 h-3" /> <span>Deep Space</span>
                </button>
                <button
                    onClick={() => setMode('sat')}
                    className={`px-3 py-1 flex items-center space-x-1 text-xs font-bold uppercase border ${mode === 'sat' ? 'bg-sentinel-green text-black border-sentinel-green' : 'bg-black/50 text-sentinel-dim border-sentinel-dim'}`}
                >
                    <Satellite className="w-3 h-3" /> <span>Orbital Layer</span>
                </button>
            </div>

            {/* Main Radar Display */}
            <div className="flex-1 bg-sentinel-panel border border-sentinel-border relative overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="absolute top-4 left-4 flex items-center space-x-2 text-sentinel-dim text-xs z-10">
                    <Radar className="w-4 h-4 animate-spin-slow" />
                    <span>PLANETARY DEFENSE NETWORK</span>
                    <span className={mode === 'sat' ? 'text-sentinel-green' : 'text-sentinel-cyan'}>
                        // TRACKING: {mode === 'neo' ? 'NEO' : 'LEO SATELLITES'}
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-full text-sentinel-cyan animate-pulse tracking-widest">CALIBRATING SENSORS...</div>
                ) : (
                    <svg viewBox="0 0 100 100" className="w-full h-full max-w-[80vh] max-h-[80vh] p-4">
                        {/* Concentric Rings */}
                        {RINGS.map((r, i) => (
                            <g key={i}>
                                <circle cx="50" cy="50" r={(r / MAX_DISTANCE_KM) * 45} fill="none" stroke="#1e293b" strokeWidth="0.2" />
                                <text x="50" y={50 - (r / MAX_DISTANCE_KM) * 45 - 1} textAnchor="middle" fill="#475569" fontSize="2" className="opacity-50">
                                    {mode === 'neo' ? r / 1000000 + 'm km' : r + ' km'}
                                </text>
                            </g>
                        ))}

                        {/* Earth (Center) */}
                        <circle cx="50" cy="50" r="2" fill="#3b82f6" className="animate-pulse">
                            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="50" cy="50" r="0.5" fill="white" />

                        {/* Scanning Line */}
                        <line x1="50" y1="50" x2="50" y2="5" stroke={mode === 'sat' ? "rgba(0, 255, 157, 0.4)" : "rgba(0, 240, 255, 0.4)"} strokeWidth="0.5" className="origin-center animate-[spin_4s_linear_infinite]" />
                        <path d="M50 50 L50 5 A45 45 0 0 1 75 14 Z" fill={`url(#scan-gradient-${mode})`} className="origin-center animate-[spin_4s_linear_infinite] opacity-20" />
                        <defs>
                            <linearGradient id="scan-gradient-neo" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="100%" stopColor="#00f0ff" />
                            </linearGradient>
                            <linearGradient id="scan-gradient-sat" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="100%" stopColor="#00ff9d" />
                            </linearGradient>
                        </defs>

                        {/* Objects */}
                        {objects.map((obj) => {
                            const speed = mode === 'sat' ? 0.8 : (obj.risk > 50 ? 0.3 : 0.1);
                            const pos = getPosition(obj.miss_distance_km, obj.angle, speed);
                            const isHovered = hoveredObject?.id === obj.id;
                            const color = mode === 'sat' ? '#00ff9d' : (obj.risk > 50 ? '#ff003c' : '#00f0ff');

                            return (
                                <g
                                    key={obj.id}
                                    onClick={() => setSelectedObject(obj)}
                                    onMouseEnter={() => setHoveredObject(obj)}
                                    onMouseLeave={() => setHoveredObject(null)}
                                    className="cursor-pointer"
                                >
                                    {/* Ping Effect for Risky or Active Satellites */}
                                    {(obj.risk > 50 || mode === 'sat') && (
                                        <circle cx={pos.x} cy={pos.y} r="4" fill="none" stroke={color} strokeWidth="0.1" opacity="0.4">
                                            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                                            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                                        </circle>
                                    )}

                                    <circle
                                        cx={pos.x}
                                        cy={pos.y}
                                        r={Math.max(obj.diameter * 10, mode === 'sat' ? 1.5 : 0.8)}
                                        fill={color}
                                        className="transition-colors duration-300"
                                    />

                                    {isHovered && (
                                        <g>
                                            <rect x={pos.x + 2} y={pos.y - 2} width="20" height="5" fill="#020408" stroke={color} strokeWidth="0.1" rx="0.5" />
                                            <text x={pos.x + 3} y={pos.y + 1.5} fill="#fff" fontSize="2" fontWeight="bold">{obj.name}</text>
                                        </g>
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                )}
            </div>

            {/* Side Panel (Alerts) */}
            <div className="w-80 flex flex-col gap-4">
                {/* Threat List */}
                <div className="bg-sentinel-panel border border-sentinel-border p-4 flex-1 overflow-hidden flex flex-col">
                    <h3 className={`uppercase text-xs font-bold tracking-widest mb-4 border-b border-sentinel-dim/20 pb-2 flex items-center ${mode === 'sat' ? 'text-sentinel-green' : 'text-sentinel-cyan'}`}>
                        <Target className="w-4 h-4 mr-2" /> {mode === 'neo' ? 'High Risk Entities' : 'Active Satellites'}
                    </h3>

                    <div className="space-y-3 overflow-y-auto pr-2">
                        {mode === 'neo' && highRiskObjects.length === 0 && (
                            <div className="text-sentinel-dim text-xs text-center py-4 flex flex-col items-center">
                                <ShieldCheck className="w-8 h-8 mb-2 opacity-50 text-sentinel-green" />
                                NO IMMEDIATE THREATS
                            </div>
                        )}

                        {/* Show all satellites or just high risk neos */}
                        {(mode === 'sat' ? objects : highRiskObjects).map(obj => (
                            <div
                                key={obj.id}
                                onClick={() => setSelectedObject(obj)}
                                className={`p-3 border transition-colors cursor-pointer group ${mode === 'sat'
                                    ? 'border-sentinel-green/30 bg-sentinel-green/5 hover:bg-sentinel-green/10'
                                    : (obj.risk > 80 ? 'border-sentinel-red/50 bg-sentinel-red/5' : 'border-sentinel-warning/50')
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm text-white">{obj.name}</span>
                                    <span className={`text-[10px] px-1 border ${mode === 'sat' ? 'text-sentinel-green border-sentinel-green'
                                        : (obj.risk > 80 ? 'text-sentinel-red border-sentinel-red' : 'text-sentinel-warning border-sentinel-warning')
                                        }`}>
                                        {mode === 'sat' ? 'TRACKING' : 'HAZARDOUS'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[10px] text-sentinel-dim font-mono">
                                    <span>Dist: {(obj.miss_distance_km).toLocaleString()} km</span>
                                    <span>Vel: {obj.velocity} km/s</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Status / Legend */}
                <div className="bg-sentinel-panel border border-sentinel-border p-4 h-1/3">
                    <h3 className="text-sentinel-dim uppercase text-xs font-bold tracking-widest mb-2">System Advisory</h3>
                    <p className="text-[10px] text-sentinel-dim leading-relaxed">
                        <strong className="text-sentinel-cyan">NOTICE:</strong> Switching layers recalibrates range sensors.
                        {mode === 'sat' ? ' displaying Low Earth Orbit data.' : ' displaying Deep Space Telemetry.'}
                    </p>
                </div>
            </div>

            <ObjectDetailsModal
                isOpen={!!selectedObject}
                onClose={() => setSelectedObject(null)}
                data={selectedObject ? {
                    ...selectedObject.raw,
                    id: selectedObject.id,
                    name: selectedObject.name,
                    risk: selectedObject.risk,
                    diameter: selectedObject.diameter,
                    velocity: selectedObject.velocity,
                    miss_distance_km: selectedObject.miss_distance_km,
                    mining: selectedObject.mining
                } : null}
            />
        </div>
    );
};

export default RadarView;
