import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

const TIME_RANGES = ['1M', '3M', '6M', 'YTD', '1Y', 'ALL'];

export default function Performance({ data }) {
    const [activeRange, setActiveRange] = useState('ALL');

    // Filter data based on activeRange using real dates
    const getFilteredData = () => {
        if (!data || data.length === 0) return [];
        if (activeRange === 'ALL') return data;

        const lastDate = new Date(data[data.length - 1].date);
        const cutoffDate = new Date(lastDate);

        switch (activeRange) {
            case '1M':
                cutoffDate.setMonth(lastDate.getMonth() - 1);
                break;
            case '3M':
                cutoffDate.setMonth(lastDate.getMonth() - 3);
                break;
            case '6M':
                cutoffDate.setMonth(lastDate.getMonth() - 6);
                break;
            case 'YTD':
                cutoffDate.setFullYear(lastDate.getFullYear(), 0, 1); // Exact Jan 1st of current year
                // If the dataset doesn't have a point on Jan 1st, filtering >= Jan 1st is correct.
                // However, without a point on Jan 1st, the chart starts at the first available data point in the year.
                // This is mathematically correct for "YTD performance from data", but visually it might look short.
                break;
            case '1Y':
                cutoffDate.setFullYear(lastDate.getFullYear() - 1);
                break;
            default:
                return data;
        }

        return data.filter(item => new Date(item.date) >= cutoffDate);
    };

    const chartData = getFilteredData();

    // Calculate min/max for Y-axis domain to focus the chart
    // Safety check for empty data
    const hasData = chartData.length > 0;
    const minValue = hasData ? Math.min(...chartData.map(d => d.value)) : 0;
    const maxValue = hasData ? Math.max(...chartData.map(d => d.value)) : 100;
    const padding = (maxValue - minValue) * 0.1;

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <TrendingUp size={16} className="text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-light tracking-tight text-white">Performance <span className="text-muted-foreground font-normal text-sm ml-2">NAV History</span></h2>
                </div>

                <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-lg">
                    {TIME_RANGES.map((range) => (
                        <button
                            key={range}
                            onClick={() => setActiveRange(range)}
                            className={cn(
                                "px-3 py-1 text-[11px] font-medium rounded-md transition-all duration-200",
                                activeRange === range
                                    ? "bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_-5px_rgba(16,185,129,0.3)] border border-emerald-500/30"
                                    : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 h-[400px] shadow-2xl overflow-hidden group">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: '#737373', fontFamily: 'sans-serif' }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={40}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString('default', { month: 'short', year: '2-digit' });
                            }}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#737373', fontFamily: 'sans-serif' }}
                            tickLine={false}
                            axisLine={false}
                            domain={[minValue - padding, maxValue + padding]}
                            tickFormatter={(value) => value.toFixed(1)}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(10,10,10,0.8)',
                                borderColor: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: '0.75rem',
                                fontSize: '12px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                padding: '12px'
                            }}
                            labelStyle={{ color: '#a3a3a3', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            itemStyle={{ color: '#fff', fontWeight: 600 }}
                            formatter={(value) => [`${value.toFixed(2)}`, 'NAV']}
                            labelFormatter={(label) => new Date(label).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="text-[10px] text-muted-foreground/50 text-right font-mono uppercase tracking-widest">
                * Data source: Equilibrium Quantitative Models
            </div>
        </section>
    );
}
