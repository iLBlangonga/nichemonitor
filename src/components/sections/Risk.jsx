import React from 'react';
import { ShieldCheck, Activity, BarChart, Clock, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';

function RiskMetric({ label, value, description, icon, highlight }) {
    return (
        <div className={cn(
            "relative bg-[#0a0a0a] border border-white/5 rounded-xl p-5 flex items-start gap-4 overflow-hidden group hover:border-white/10 transition-all duration-300",
            highlight && "border-emerald-500/20 bg-emerald-500/5"
        )}>
            {highlight && <div className="absolute inset-0 bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-colors" />}

            <div className={cn(
                "p-2 rounded-lg mt-0.5 transition-colors",
                highlight ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-muted-foreground group-hover:text-white"
            )}>
                {icon}
            </div>
            <div className="relative space-y-1">
                <div className={cn("text-xl font-bold tracking-tight font-mono", highlight ? "text-emerald-400" : "text-white")}>{value}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
                {description && <div className="text-[10px] text-muted-foreground/60 pt-1">{description}</div>}
            </div>
        </div>
    );
}

export default function Risk({ data }) {
    const { language } = useLanguage();
    const t = translations[language];
    const { metrics, riskGovernance } = data;

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <ShieldCheck size={16} className="text-orange-400" />
                </div>
                <h2 className="text-xl font-light tracking-tight text-white">{t.risk.title} <span className="text-muted-foreground font-normal text-sm ml-2">{t.risk.subtitle}</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <RiskMetric
                    label={t.risk.vol}
                    value={`${metrics.volatility}%`}
                    icon={<Activity size={18} />}
                    highlight // Vol is key, highlight it
                />
                <RiskMetric
                    label={t.risk.maxDd}
                    value={`${metrics.maxDrawdown}%`}
                    description={t.risk.maxDdSub}
                    icon={<BarChart size={18} className="rotate-180" />}
                />
                <RiskMetric
                    label={t.risk.rollingLl}
                    value={`${metrics.rollingDrawdown}%`}
                    description={t.risk.rollingLlSub}
                    icon={<BarChart size={18} className="rotate-180" />}
                />
                <RiskMetric
                    label={t.risk.liqScore}
                    value={`${metrics.liquidity}%`}
                    description={t.risk.liqScoreSub}
                    icon={<Clock size={18} />}
                />
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

                <div className="flex items-center gap-2 mb-6">
                    <Lock size={14} className="text-orange-400" />
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t.risk.governance}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-2">
                        <span className="block text-xs font-medium text-orange-400 uppercase tracking-wider">{t.risk.monitoring}</span>
                        <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-orange-500/20 pl-4">
                            {riskGovernance.monitoring}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <span className="block text-xs font-medium text-orange-400 uppercase tracking-wider">{t.risk.controls}</span>
                        <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-orange-500/20 pl-4">
                            {riskGovernance.limits}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
