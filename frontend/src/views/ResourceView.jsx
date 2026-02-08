
import React, { useMemo } from 'react';
import useNeoData from '../hooks/useNeoData';
import { CompositionChart } from '../components/MiningCharts';
import { Pickaxe, DollarSign, Database, Activity } from 'lucide-react';

const ResourceView = () => {
    const { data, loading } = useNeoData();

    const stats = useMemo(() => {
        if (!data.length) return { totalValue: 0, topTarget: null, mTypeCount: 0 };

        let totalVal = 0;
        let mCount = 0;
        let best = data[0];

        data.forEach(obj => {
            totalVal += obj.mining.estimated_value_usd || 0;
            if (obj.mining.spectral_class === 'M') mCount++;
            if ((obj.mining.estimated_value_usd || 0) > (best.mining.estimated_value_usd || 0)) best = obj;
        });

        return {
            totalValue: totalVal,
            topTarget: best,
            mTypeCount: mCount
        };
    }, [data]);

    const formatCurrency = (val) => {
        if (val >= 1e12) return `$${(val / 1e12).toFixed(2)} Trillion`;
        if (val >= 1e9) return `$${(val / 1e9).toFixed(2)} Billion`;
        if (val >= 1e6) return `$${(val / 1e6).toFixed(2)} Million`;
        return `$${val.toLocaleString()}`;
    };

    return (
        <div className="flex h-full w-full max-w-7xl mx-auto p-4 gap-4">

            {/* Left Column: Analytics & Stats */}
            <div className="w-1/3 flex flex-col gap-4">
                {/* Total Wealth Card */}
                <div className="bg-sentinel-panel border border-sentinel-border p-6 shadow-[0_0_20px_rgba(112,0,255,0.1)]">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sentinel-dim uppercase text-xs font-bold tracking-widest">Estimated Sector Wealth</h3>
                        <DollarSign className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-3xl font-bold text-white tracking-widest font-mono">
                        {loading ? "CALCULATING..." : formatCurrency(stats.totalValue)}
                    </div>
                    <div className="mt-2 text-[10px] text-sentinel-dim">
                        Based on visible NEOs within sensor range.
                    </div>
                </div>

                {/* Composition Chart */}
                <div className="bg-sentinel-panel border border-sentinel-border p-4 flex-1 flex flex-col">
                    <h3 className="text-sentinel-cyan uppercase text-xs font-bold tracking-widest mb-4 flex items-center">
                        <Database className="w-4 h-4 mr-2" /> Composition Analysis
                    </h3>
                    <div className="flex-1 flex items-center justify-center relative">
                        {/* Legend Overlay */}
                        <div className="absolute top-0 right-0 p-2 space-y-1 bg-black/50 text-[10px] text-sentinel-dim border border-white/5">
                            <div className="flex items-center"><span className="w-2 h-2 bg-[#00f0ff] mr-1 rounded-full" /> Volatile (C)</div>
                            <div className="flex items-center"><span className="w-2 h-2 bg-[#fce83a] mr-1 rounded-full" /> Silicate (S)</div>
                            <div className="flex items-center"><span className="w-2 h-2 bg-[#7000ff] mr-1 rounded-full" /> Metallic (M)</div>
                        </div>
                        {loading ? (
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sentinel-cyan"></div>
                        ) : (
                            <CompositionChart data={data} />
                        )}
                    </div>
                </div>

                {/* Top Prospect Card */}
                {stats.topTarget && (
                    <div className="bg-sentinel-panel border border-purple-500/30 p-4 bg-purple-500/5">
                        <h3 className="text-purple-400 uppercase text-xs font-bold tracking-widest mb-2 flex items-center">
                            <Pickaxe className="w-4 h-4 mr-2" /> Prime Extraction Target
                        </h3>
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-xl font-bold text-white">{stats.topTarget.name}</div>
                                <div className="text-xs text-sentinel-dim font-mono">Class: {stats.topTarget.mining.spectral_class}-TYPE</div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-purple-400">{formatCurrency(stats.topTarget.mining.estimated_value_usd)}</div>
                                <div className="text-[10px] text-sentinel-dim">Est. Value</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Ledger / List */}
            <div className="flex-1 bg-sentinel-panel border border-sentinel-border p-4 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-4 border-b border-sentinel-dim/20 pb-4">
                    <h2 className="text-xl font-bold text-white tracking-widest flex items-center">
                        <Activity className="w-5 h-5 mr-3 text-sentinel-cyan" />
                        RESOURCE LEDGER
                    </h2>
                    <div className="text-xs text-sentinel-dim font-mono">
                        {data.length} OBJECTS DETECTED
                    </div>
                </div>

                <div className="overflow-y-auto pr-2 flex-1 space-y-1">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-4 text-[10px] font-bold text-sentinel-dim uppercase p-2 bg-black/40">
                        <div className="col-span-3">Designation</div>
                        <div className="col-span-1">Class</div>
                        <div className="col-span-3">Est. Value</div>
                        <div className="col-span-2">Mass (kg)</div>
                        <div className="col-span-1">Score</div>
                        <div className="col-span-2 text-right">Action</div>
                    </div>

                    {/* Rows */}
                    {loading ? (
                        <div className="text-center py-8 text-sentinel-dim animate-pulse">Scanning sector...</div>
                    ) : (
                        data.map((obj) => (
                            <div key={obj.id} className="grid grid-cols-12 gap-4 text-xs p-3 hover:bg-white/5 border-b border-white/5 items-center transition-colors group">
                                <div className="col-span-3 font-bold text-sentinel-cyan md:text-white group-hover:text-sentinel-cyan truncate">
                                    {obj.name}
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${obj.mining.spectral_class === 'M' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                                            obj.mining.spectral_class === 'C' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' :
                                                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                        }`}>
                                        {obj.mining.spectral_class}
                                    </span>
                                </div>
                                <div className="col-span-3 font-mono text-sentinel-dim">
                                    {formatCurrency(obj.mining.estimated_value_usd)}
                                </div>
                                <div className="col-span-2 font-mono text-sentinel-dim text-[10px]">
                                    {obj.mining.estimated_mass_kg > 1e9
                                        ? `${(obj.mining.estimated_mass_kg / 1e9).toFixed(1)}B`
                                        : `${(obj.mining.estimated_mass_kg / 1e6).toFixed(1)}M`}
                                </div>
                                <div className="col-span-1">
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-600 to-purple-600"
                                            style={{ width: `${Math.min(100, obj.mining.mining_score)}%` }}
                                        />
                                    </div>
                                    <span className="text-[9px] text-white/50">{obj.mining.mining_score}</span>
                                </div>
                                <div className="col-span-2 text-right">
                                    <button className="px-3 py-1 bg-sentinel-cyan/10 hover:bg-sentinel-cyan text-sentinel-cyan hover:text-black border border-sentinel-cyan transition-all text-[10px] uppercase font-bold tracking-wider">
                                        Analyze
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceView;
