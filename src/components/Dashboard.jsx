import React from 'react';
import { LogOut, FileText, ArrowDownToLine, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
// Future imports for other sections
// import PerformanceSection from './sections/PerformanceSection';
import Performance from './sections/Performance';
import Portfolio from './sections/Portfolio';
import Risk from './sections/Risk';
import Updates from './sections/Updates';
import Documents from './sections/Documents';

export default function Dashboard({ data, onLogout }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white pb-20">
            {/* 1) Header */}
            <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-xl font-bold tracking-tight">NICHE</span>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                    Issued & Managed by Equilibrium
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col items-end text-xs text-muted-foreground">
                                <span>Last NAV Update</span>
                                <span className="font-medium text-foreground">{formatDate(data.lastUpdate)}</span>
                            </div>
                            <div className="h-6 w-px bg-border hidden md:block" />
                            <button
                                onClick={onLogout}
                                className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

                {/* 2) Snapshot (Hero Section) */}
                <section className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-light tracking-tight text-foreground">
                            NICHE – Alternative Market Certificate
                        </h1>
                        <p className="text-base text-muted-foreground max-w-2xl text-balance">
                            Systematic and discretionary quantitative strategies across liquid global markets.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricCard
                            label="Current NAV"
                            value={data.nav.current.toFixed(2)}
                            subValue="EUR"
                            highlight
                        />
                        <MetricCard
                            label="MTD Performance"
                            value={`${data.nav.mtd > 0 ? '+' : ''}${data.nav.mtd}%`}
                            trend={data.nav.mtd >= 0 ? 'up' : 'down'}
                        />
                        <MetricCard
                            label="YTD Performance"
                            value={`${data.nav.ytd > 0 ? '+' : ''}${data.nav.ytd}%`}
                            trend={data.nav.ytd >= 0 ? 'up' : 'down'}
                        />
                        <MetricCard
                            label="Since Inception"
                            value={`${data.nav.inception > 0 ? '+' : ''}${data.nav.inception}%`}
                            trend={data.nav.inception >= 0 ? 'up' : 'down'}
                        />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <MetricCard
                            label="Ann. Volatility"
                            value={`${data.metrics.volatility}%`}
                            icon={<Activity size={14} />}
                            secondary
                        />
                        <MetricCard
                            label="Max Drawdown"
                            value={`${data.metrics.maxDrawdown}%`}
                            icon={<TrendingDown size={14} />}
                            secondary
                        />
                    </div>

                    <div className="text-xs text-muted-foreground">
                        * All performance figures shown net of fees.
                    </div>
                </section>

                {/* Separator */}
                <hr className="border-border" />

                {/* 3) Performance */}
                <Performance data={data.performance} />

                <hr className="border-border" />

                {/* 4) Portfolio Snapshot */}
                <Portfolio data={data.allocation} />

                <hr className="border-border" />

                {/* 5) Risk & Governance */}
                <Risk data={data} />

                <hr className="border-border" />

                {/* 6 & 7) Updates and Timeline */}
                <Updates data={data} />

                <hr className="border-border" />

                {/* 8 & 9) Documents and Transparency */}
                <Documents data={data} />

            </main>
        </div>
    );
}

function MetricCard({ label, value, subValue, trend, highlight, secondary, icon }) {
    return (
        <div className={cn(
            "p-5 rounded-lg border transition-colors",
            highlight ? "bg-accent/5 border-accent/20" : "bg-card border-border",
            secondary && "bg-transparent border-border/50"
        )}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    {icon}
                    {label}
                </span>
                {trend && (
                    trend === 'up' ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-rose-500" />
                )}
            </div>
            <div className="flex items-baseline gap-1">
                <span className={cn(
                    "text-2xl font-semibold tracking-tight",
                    highlight ? "text-accent-foreground" : "text-foreground",
                    trend === 'up' && "text-emerald-500",
                    trend === 'down' && "text-rose-500",
                    secondary && "text-lg text-foreground/80"
                )}>
                    {value}
                </span>
                {subValue && <span className="text-xs text-muted-foreground font-medium">{subValue}</span>}
            </div>
        </div>
    );
}
