import React from 'react';
import { cn } from '../../lib/utils';
import { Layers, Globe, PieChart, Activity } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';

function AllocationBar({ label, value, range, colorClass }) {
    return (
        <div className="space-y-1.5 group">
            <div className="flex justify-between text-xs items-center">
                <span className="font-medium text-gray-300 group-hover:text-white transition-colors">{label}</span>
                <span className="text-muted-foreground font-mono text-[10px]">{range}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out relative", colorClass)}
                    style={{ width: `${Math.abs(value)}%` }} // handle negative if any
                >
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[2px]" />
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value, highlight }) {
    return (
        <div className={cn(
            "flex justify-between items-center py-3 border-b border-white/5 last:border-0",
            highlight && "bg-emerald-500/5 -mx-4 px-4 border-none rounded-lg"
        )}>
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className={cn(
                "text-sm font-medium font-mono",
                highlight ? "text-emerald-400" : "text-white"
            )}>{value}</span>
        </div>
    );
}

export default function Portfolio({ data }) {
    const { language } = useLanguage();
    const t = translations[language];
    const { strategies, geo, exposure } = data;

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <PieChart size={16} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-light tracking-tight text-white">{t.portfolio.title} <span className="text-muted-foreground font-normal text-sm ml-2">{t.portfolio.subtitle}</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Strategy Allocation */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="flex items-center gap-2 mb-6">
                        <Layers size={14} className="text-blue-400" />
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t.portfolio.stratAlloc}</h3>
                    </div>

                    <div className="space-y-6">
                        {strategies.map((strat, i) => (
                            <AllocationBar
                                key={strat.name}
                                label={strat.name}
                                value={strat.value}
                                range={`${strat.value}%`}
                                colorClass="bg-blue-500 shadow-[0_0_10px_-2px_rgba(59,130,246,0.5)]"
                            />
                        ))}
                    </div>
                </div>

                {/* Geographic Exposure */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="flex items-center gap-2 mb-6">
                        <Globe size={14} className="text-purple-400" />
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t.portfolio.geoExp}</h3>
                    </div>

                    <div className="space-y-6">
                        {geo.map((g) => (
                            <AllocationBar
                                key={g.name}
                                label={g.name}
                                value={g.value}
                                range={`${g.value}%`}
                                colorClass="bg-purple-500 shadow-[0_0_10px_-2px_rgba(168,85,247,0.5)]"
                            />
                        ))}
                    </div>
                </div>

                {/* Exposure Overview */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="flex items-center gap-2 mb-6">
                        <Activity size={14} className="text-emerald-400" />
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t.portfolio.expStats}</h3>
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                        <StatItem label={t.portfolio.netExp} value={`${exposure.net}%`} highlight />
                        <StatItem label={t.portfolio.grossExp} value={`${exposure.gross}%`} />
                        <StatItem label={t.portfolio.dirBias} value={exposure.bias} />
                        <StatItem label={t.portfolio.liqProfile} value={exposure.liquidity} />
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5">
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                            <p className="text-[10px] text-emerald-400/80 leading-relaxed font-mono">
                                {t.portfolio.liqNote}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
