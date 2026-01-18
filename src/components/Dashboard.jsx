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
import Hero from './sections/Hero';

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
            <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <img src="/logo.svg" alt="Niche Logo" className="h-10 w-auto object-contain" />
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col items-end text-xs text-muted-foreground/60">
                                <span>NAV Update</span>
                                <span className="font-mono text-emerald-400">{formatDate(data.lastUpdate)}</span>
                            </div>
                            <div className="h-4 w-px bg-white/10 hidden md:block" />
                            <button
                                onClick={onLogout}
                                className="text-xs font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5"
                            >
                                <LogOut size={14} />
                                <span className="hidden sm:inline">Portal Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

                {/* 2) Hero Section */}
                <Hero />

                <section className="space-y-6">

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
            "relative p-5 rounded-xl border transition-all duration-300 group overflow-hidden",
            highlight
                ? "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_20px_-10px_rgba(16,185,129,0.2)]"
                : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10",
            secondary && "bg-transparent border-dashed border-white/10"
        )}>
            {highlight && <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50" />}

            <div className="relative flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    {icon}
                    {label}
                </span>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                        trend === 'up' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                    )}>
                        {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        <span>{trend === 'up' ? 'Pos' : 'Neg'}</span>
                    </div>
                )}
            </div>

            <div className="relative flex items-baseline gap-1.5">
                <span className={cn(
                    "text-2xl md:text-3xl font-light tracking-tighter tabular-nums",
                    highlight ? "text-white" : "text-white/90",
                    trend === 'up' && !highlight && "text-emerald-400",
                    trend === 'down' && !highlight && "text-rose-400",
                    secondary && "text-xl text-muted-foreground"
                )}>
                    {value}
                </span>
                {subValue && <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{subValue}</span>}
            </div>
        </div>
    );
}
