import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';

const TIME_RANGES = ['1M', '3M', '6M', 'YTD', '1Y', 'ALL'];

export default function Performance({ data }) {
    const [activeRange, setActiveRange] = useState('YTD');

    // Filter data based on activeRange (Mock logic for now, in real app would filter dates)
    // For demo, we just slice the array differently to simulate zoom
    const getFilteredData = () => {
        const total = data.length;
        switch (activeRange) {
            case '1M': return data.slice(Math.max(0, total - 2));
            case '3M': return data.slice(Math.max(0, total - 4));
            case '6M': return data.slice(Math.max(0, total - 7));
            case 'YTD': return data; // Assuming data starts from Jan
            case '1Y': return data;
            default: return data;
        }
    };

    const chartData = getFilteredData();

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
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString('default', { month: 'short' });
                            }}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            tickLine={false}
                            axisLine={false}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                borderRadius: '0.5rem',
                                fontSize: '12px'
                            }}
                            labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                            formatter={(value) => [`${value.toFixed(2)}`, 'NAV']}
                            labelFormatter={(label) => new Date(label).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="hsl(var(--accent))"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="text-xs text-muted-foreground text-right">
                * Performance assumes reinvestment of dividends.
            </div>
        </section>
    );
}
