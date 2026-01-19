import { Megaphone, Target, ArrowRight, Activity, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';

function UpdateCard({ title, icon, content, date }) {
    return (
        <div className="relative pl-6 pb-8 border-l border-white/10 last:pb-0 group">
            <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-[#0a0a0a] border border-blue-500 group-hover:bg-blue-500 transition-colors shadow-[0_0_8px_rgba(59,130,246,0.5)]" />

            <div className="flex items-center gap-2 mb-2 group-hover:translate-x-1 transition-transform duration-300">
                <span className="p-1 rounded bg-white/5 text-blue-400">{icon}</span>
                <span className="text-sm font-medium text-white">{title}</span>
                {date && <span className="text-[10px] text-muted-foreground font-mono ml-auto">{date}</span>}
            </div>
            <div className="bg-white/5 border border-white/5 rounded-lg p-4 group-hover:border-white/10 transition-colors">
                <p className="text-sm text-gray-400 leading-relaxed font-light">
                    {content}
                </p>
            </div>
        </div>
    );
}

export default function Updates({ data }) {
    const { language } = useLanguage();
    const t = translations[language];
    const { updates, timeline } = data;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Investment Update Column */}
            <div className="md:col-span-2 space-y-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Megaphone size={16} className="text-blue-400" />
                    </div>
                    <h2 className="text-xl font-light tracking-tight text-white">{t.updates.investUpdates} <span className="text-muted-foreground font-normal text-sm ml-2">{t.updates.investUpdatesSub}</span></h2>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 shadow-xl">
                    <div className="space-y-2">
                        <UpdateCard
                            title={t.updates.marketContext}
                            icon={<Activity size={14} />}
                            content={updates.marketContext}
                        />
                        <UpdateCard
                            title={t.updates.portfolioActions}
                            icon={<Target size={14} />}
                            content={updates.portfolioActions}
                        />
                        <UpdateCard
                            title={t.updates.focus}
                            icon={<ArrowRight size={14} />}
                            content={updates.focus}
                        />
                    </div>
                </div>
            </div>

            {/* Timeline Column */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <Calendar size={16} className="text-purple-400" />
                    </div>
                    <h2 className="text-xl font-light tracking-tight text-white">{t.updates.timeline}</h2>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl h-fit">
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                        {[...timeline]
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((item, index, arr) => {
                                const COLORS = {
                                    'Milestone': 'text-purple-400 bg-purple-500 ring-purple-500/10',
                                    'Report': 'text-blue-400 bg-blue-500 ring-blue-500/10',
                                    'Alert': 'text-orange-400 bg-orange-500 ring-orange-500/10',
                                    'default': 'text-gray-400 bg-gray-500 ring-gray-500/10'
                                };
                                const colorClass = COLORS[item.category] || COLORS['default'];
                                const [textColor, bgColor, ringColor] = colorClass.split(' ');

                                return (
                                    <div key={index} className="relative flex gap-4 group">
                                        <div className="flex-none flex flex-col items-center">
                                            <div className={cn("w-2 h-2 rounded-full ring-4 mt-1.5", bgColor, ringColor)} />
                                            {index !== arr.length - 1 && <div className="w-px h-full bg-white/5 my-1" />}
                                        </div>
                                        <div className="pb-6 last:pb-0">
                                            <span className={cn("block text-[10px] font-mono mb-1", textColor)}>
                                                {new Date(item.date).toLocaleDateString(language === 'it' ? 'it-IT' : 'en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{item.event}</span>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}
