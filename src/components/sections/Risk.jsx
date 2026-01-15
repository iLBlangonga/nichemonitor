import React from 'react';
import { ShieldCheck, Activity, BarChart, Clock } from 'lucide-react';

function RiskMetric({ label, value, description, icon }) {
    return (
        <div className="bg-card border border-border rounded-lg p-5 flex items-start gap-4">
            <div className="bg-muted p-2 rounded-md text-muted-foreground mt-0.5">
                {icon}
            </div>
            <div className="space-y-1">
                <div className="text-xl font-semibold text-foreground tracking-tight">{value}</div>
                <div className="text-sm font-medium text-muted-foreground">{label}</div>
                {description && <div className="text-xs text-muted-foreground/70 pt-1">{description}</div>}
            </div>
        </div>
    );
}

export default function Risk({ data }) {
    const { metrics, riskGovernance } = data;

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-medium tracking-tight">Risk & Control Framework</h2>
                <ShieldCheck className="text-muted-foreground h-5 w-5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <RiskMetric
                    label="Ann. Volatility"
                    value={`${metrics.volatility}%`}
                    icon={<Activity size={18} />}
                />
                <RiskMetric
                    label="Max Drawdown"
                    value={`${metrics.maxDrawdown}%`}
                    description="Since Inception"
                    icon={<BarChart size={18} className="rotate-180" />}
                />
                <RiskMetric
                    label="Rolling 12M LL"
                    value={`${metrics.rollingDrawdown}%`}
                    description="Max loss over any 12m period"
                    icon={<BarChart size={18} className="rotate-180" />}
                />
                <RiskMetric
                    label="Liquidity Score"
                    value={`${metrics.liquidity}%`}
                    description="% liquid within 5 days"
                    icon={<Clock size={18} />}
                />
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-foreground mb-4">Risk Governance</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                        <span className="block font-medium text-foreground mb-1">Monitoring</span>
                        <p className="text-muted-foreground">{riskGovernance.monitoring}</p>
                    </div>
                    <div>
                        <span className="block font-medium text-foreground mb-1">Controls</span>
                        <p className="text-muted-foreground">{riskGovernance.limits}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
