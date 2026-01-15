import React from 'react';
import { cn } from '../../lib/utils'; // Fixed path

function AllocationBar({ label, value, range, colorClass }) {
    // value is expected to be a number (percentage)
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">{label}</span>
                <span className="text-muted-foreground font-mono text-xs">{range}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-500 ease-out", colorClass)}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

function StatItem({ label, value }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-border last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground font-mono">{value}</span>
        </div>
    );
}

export default function Portfolio({ data }) {
    const { strategies, geo, exposure } = data;

    return (
        <section className="space-y-6">
            <h2 className="text-xl font-medium tracking-tight">Portfolio Snapshot</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Strategy Allocation */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Allocation by Strategy</h3>
                    <div className="space-y-5">
                        {strategies.map((strat, i) => (
                            <AllocationBar
                                key={strat.name}
                                label={strat.name}
                                value={strat.value} // Use the midpoint or max of range for visual bar if pure mock
                                range={strat.range} // Display the range text
                                colorClass="bg-foreground/80"
                            />
                        ))}
                    </div>
                </div>

                {/* Geographic Exposure */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Geographic Exposure</h3>
                    <div className="space-y-5">
                        {geo.map((g) => (
                            <AllocationBar
                                key={g.name}
                                label={g.name}
                                value={g.value}
                                range={`${g.value}%`}
                                colorClass="bg-accent"
                            />
                        ))}
                    </div>
                </div>

                {/* Exposure Overview */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Exposure Overview</h3>
                    <div className="flex flex-col h-full">
                        <StatItem label="Net Exposure" value={`${exposure.net}%`} />
                        <StatItem label="Gross Exposure" value={`${exposure.gross}%`} />
                        <StatItem label="Directional Bias" value={exposure.bias} />
                        <StatItem label="Liquidity Profile" value={exposure.liquidity} />

                        <div className="mt-auto pt-6">
                            <div className="bg-accent/10 border border-accent/20 rounded-md p-4">
                                <p className="text-xs text-accent-foreground leading-relaxed">
                                    Portfolio maintains a liquid profile with &gt;90% of assets liquid within T+2 settlement cycle.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
