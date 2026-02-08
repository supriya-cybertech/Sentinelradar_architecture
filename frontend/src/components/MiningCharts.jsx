
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export const CompositionChart = ({ data }) => {
    // Aggregate by Spectral Class
    const classCounts = data.reduce((acc, obj) => {
        const type = obj.mining.spectral_class || 'U';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const chartData = [
        { name: 'Water/Volatile (C)', value: classCounts['C'] || 0, color: '#00f0ff' },
        { name: 'Stony/Metal (S)', value: classCounts['S'] || 0, color: '#fce83a' },
        { name: 'Precious Metal (M)', value: classCounts['M'] || 0, color: '#7000ff' } // Sentinel Purple
    ].filter(d => d.value > 0);

    return (
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#020408', borderColor: 'rgba(0, 240, 255, 0.3)' }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
