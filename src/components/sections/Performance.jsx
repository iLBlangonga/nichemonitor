import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
                <h2 className="text-xl font-medium tracking-tight">Performance</h2>

                <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1 w-fit">
                    {TIME_RANGES.map((range) => (
                        <button
                            key={range}
                            onClick={() => setActiveRange(range)}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                                activeRange === range
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={40}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString('default', { month: 'short', year: '2-digit' });
                            }}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                            tickLine={false}
                            axisLine={false}
                            domain={[minValue - padding, maxValue + padding]}
                            tickFormatter={(value) => value.toFixed(1)}
                            width={40}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                borderRadius: '0.5rem',
                                fontSize: '12px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}
                            itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                            formatter={(value) => [`${value.toFixed(2)}`, 'NAV']}
                            labelFormatter={(label) => new Date(label).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="hsl(var(--accent))"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="text-xs text-muted-foreground text-right border-t border-border/50 pt-2 opacity-70">
                * The NAV calculation is performed by Equilibrium and is subject to slight variations until the official release.
            </div>
        </section>
    );
}
