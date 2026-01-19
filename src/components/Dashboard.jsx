import React from 'react';
import { LogOut, FileText, ArrowDownToLine, TrendingUp, TrendingDown, AlertCircle, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { cn } from '../lib/utils';
// Future imports for other sections
// import PerformanceSection from './sections/PerformanceSection';
import Performance from './sections/Performance';
import Liquidity from './sections/Liquidity';
import Portfolio from './sections/Portfolio';
import Risk from './sections/Risk';
import Updates from './sections/Updates';
import Documents from './sections/Documents';
import Hero from './sections/Hero';

export default function Dashboard({ data, onLogout }) {
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(language === 'it' ? 'it-IT' : 'en-GB', {
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
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <img src="/logo.svg" alt="Equilibrium Logo" className="h-9 w-auto object-contain" />
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground/50 font-light text-sm px-1">X</span>
                                    <span className="text-xl md:text-2xl font-orbitron font-bold tracking-wide bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                        NICHE
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col items-end text-xs text-muted-foreground/60">
                                <span>{t.nav.isin}</span>
                                <span className="font-mono text-white/80">CH1456969760</span>
                            </div>
                            <div className="h-4 w-px bg-white/10 hidden md:block" />

                            <div className="hidden md:flex flex-col items-end text-xs text-muted-foreground/60">
                                <span>{t.nav.navUpdate}</span>
                                <span className="font-mono text-emerald-400">{formatDate(data.lastUpdate)}</span>
                            </div>
                            <div className="h-4 w-px bg-white/10 hidden md:block" />

                            <button
                                onClick={toggleLanguage}
                                className="text-xs font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5"
                            >
                                <Globe size={14} />
                                <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'IT'}</span>
                            </button>

                            <button
                                onClick={onLogout}
                                className="text-xs font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5"
                            >
                                <LogOut size={14} />
                                <span className="hidden sm:inline">{t.nav.logout}</span>
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
                            label={t.dashboard.currentNav}
                            value={data.nav.current.toFixed(2)}
                            subValue="EUR"
                            highlight
                        />
                        <MetricCard
                            label={t.dashboard.mtdPerf}
                            value={`${data.nav.mtd > 0 ? '+' : ''}${data.nav.mtd}%`}
                            trend={data.nav.mtd >= 0 ? 'up' : 'down'}
                            posText={t.dashboard.pos}
                            negText={t.dashboard.neg}
                        />
                        <MetricCard
                            label={t.dashboard.ytdPerf}
                            value={`${data.nav.ytd > 0 ? '+' : ''}${data.nav.ytd}%`}
                            trend={data.nav.ytd >= 0 ? 'up' : 'down'}
                            posText={t.dashboard.pos}
                            negText={t.dashboard.neg}
                        />
                        <MetricCard
                            label={t.dashboard.inceptionPerf}
                            value={`${data.nav.inception > 0 ? '+' : ''}${data.nav.inception}%`}
                            trend={data.nav.inception >= 0 ? 'up' : 'down'}
                            posText={t.dashboard.pos}
                            negText={t.dashboard.neg}
                        />
                    </div>


                    <div className="text-xs text-muted-foreground">
                        {t.dashboard.feesNote}
                    </div>
                </section>

                {/* Separator */}
                <hr className="border-border" />

                {/* 3) Performance */}
                <Performance data={data.performance} />

                <hr className="border-border" />

                {/* 3.1) Liquidity */}
                <Liquidity data={data.liquidityHistory} />

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

function MetricCard({ label, value, subValue, trend, highlight, secondary, icon, ...props }) {
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
                        <span>{trend === 'up' ? (props.posText || 'Pos') : (props.negText || 'Neg')}</span>
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
