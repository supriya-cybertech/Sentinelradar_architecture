import React from 'react';
import { X, Activity, ShieldAlert, Ruler, Gauge, Pickaxe } from 'lucide-react';

const ObjectDetailsModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-sentinel-panel border border-sentinel-border w-full max-w-2xl mx-4 relative shadow-[0_0_50px_rgba(0,240,255,0.1)]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-sentinel-border bg-sentinel-bg/50">
                    <div className="flex items-center space-x-3">
                        <Activity className="text-sentinel-cyan w-5 h-5" />
                        <h2 className="text-xl font-sans font-bold text-white tracking-widest">
                            TARGET ANALYSIS: <span className="text-sentinel-cyan">{data.name}</span>
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-sentinel-dim hover:text-sentinel-red transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Visual / ID Status */}
                    <div className="space-y-4">
                        <div className="border border-sentinel-border p-4 bg-black/40 text-center">
                            <div className="text-xs text-sentinel-dim uppercase mb-1">Object ID</div>
                            <div className="text-2xl font-mono text-sentinel-cyan">{data.id}</div>
                        </div>

                        <div className="border border-sentinel-border p-4 bg-black/40">
                            <div className="text-xs text-sentinel-dim uppercase mb-2">Threat Classification</div>
                            <div className="flex items-center justify-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${data.risk > 50 ? 'bg-sentinel-red animate-pulse' : 'bg-sentinel-green'}`} />
                                <span className={`text-lg font-bold ${data.risk > 50 ? 'text-sentinel-red' : 'text-sentinel-green'}`}>
                                    {data.risk > 50 ? 'HAZARDOUS' : 'NON-THREAT'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Telemetry Stats */}
                    <div className="space-y-4 font-mono text-sm">
                        <div className="flex justify-between border-b border-sentinel-dim/20 pb-2">
                            <span className="text-sentinel-dim flex items-center"><Ruler className="w-3 h-3 mr-2" /> Diameter (Max)</span>
                            <span className="text-white">{data.diameter} km</span>
                        </div>
                        <div className="flex justify-between border-b border-sentinel-dim/20 pb-2">
                            <span className="text-sentinel-dim flex items-center"><Gauge className="w-3 h-3 mr-2" /> Velocity</span>
                            <span className="text-white">{data.velocity} km/s</span>
                        </div>
                        <div className="flex justify-between border-b border-sentinel-dim/20 pb-2">
                            <span className="text-sentinel-dim">Risk Index</span>
                            <span className={data.risk > 50 ? 'text-sentinel-red' : 'text-sentinel-cyan'}>{data.risk}/100</span>
                        </div>
                        <div className="flex justify-between border-b border-sentinel-dim/20 pb-2">
                            <span className="text-sentinel-dim">Close Approach</span>
                            <span className="text-white">
                                {data.miss_distance_km < 50000
                                    ? `${data.miss_distance_km.toFixed(0)} km`
                                    : `${(data.miss_distance_km / 384400).toFixed(1)} LD`
                                }
                            </span>
                        </div>
                    </div>
                    {/* Mining / Commercial Data */}
                    {data.mining && (
                        <div className="md:col-span-2 border-t border-sentinel-dim/20 pt-4 mt-2">
                            <h3 className="text-sentinel-cyan uppercase text-xs font-bold tracking-widest mb-3 flex items-center">
                                <Pickaxe className="w-4 h-4 mr-2" /> Commercial Assessment
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-black/40 p-3 border border-sentinel-border">
                                    <div className="text-[10px] text-sentinel-dim uppercase">Est. Value</div>
                                    <div className="text-lg font-bold text-purple-400">
                                        {data.mining.estimated_value_usd > 1e9
                                            ? `$${(data.mining.estimated_value_usd / 1e9).toFixed(2)}B`
                                            : `$${(data.mining.estimated_value_usd / 1e6).toFixed(2)}M`}
                                    </div>
                                </div>
                                <div className="bg-black/40 p-3 border border-sentinel-border">
                                    <div className="text-[10px] text-sentinel-dim uppercase">Class</div>
                                    <div className="text-lg font-bold text-white">
                                        {data.mining.spectral_class}-Type
                                    </div>
                                    <div className="text-[9px] text-sentinel-dim mt-1">
                                        {data.mining.spectral_class === 'M' ? 'Metals' :
                                            data.mining.spectral_class === 'C' ? 'Volatiles' : 'Silicates'}
                                    </div>
                                </div>
                                <div className="bg-black/40 p-3 border border-sentinel-border">
                                    <div className="text-[10px] text-sentinel-dim uppercase">Mining Score</div>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <div className="flex-1 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-600 to-purple-600"
                                                style={{ width: `${Math.min(100, data.mining.mining_score)}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-white">{data.mining.mining_score}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer actions */}
                <div className="p-4 border-t border-sentinel-border bg-sentinel-bg/50 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-sentinel-dim/50 text-sentinel-dim hover:text-white hover:border-white transition-all uppercase text-xs font-bold"
                    >
                        Dismiss
                    </button>
                    <button className="px-4 py-2 bg-sentinel-cyan/10 border border-sentinel-cyan text-sentinel-cyan hover:bg-sentinel-cyan hover:text-sentinel-bg transition-all uppercase text-xs font-bold">
                        Initiate Tracking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ObjectDetailsModal;
