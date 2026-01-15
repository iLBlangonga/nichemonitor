import React from 'react';
import { Calendar, Megaphone, Target, ArrowRight } from 'lucide-react';

function UpdateCard({ title, icon, content }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                {icon}
                {title}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-6 border-l border-border ml-2">
                {content}
            </p>
        </div>
    );
}

export default function Updates({ data }) {
    const { updates, timeline } = data;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Investment Update Column */}
            <div className="md:col-span-2 space-y-6">
                <h2 className="text-xl font-medium tracking-tight">Investment Update</h2>
                <div className="bg-card border border-border rounded-lg p-6 space-y-8">
                    <UpdateCard
                        title="Market Context"
                        icon={<Megaphone size={16} className="text-muted-foreground" />}
                        content={updates.marketContext}
                    />
                    <UpdateCard
                        title="Portfolio Actions"
                        icon={<Activity size={16} className="text-muted-foreground" />}
                        content={updates.portfolioActions}
                    />
                    <UpdateCard
                        title="Focus Going Forward"
                        icon={<Target size={16} className="text-muted-foreground" />}
                        content={updates.focus}
                    />
                </div>
            </div>

            {/* Timeline Column */}
            <div className="space-y-6">
                <h2 className="text-xl font-medium tracking-tight">Investor Timeline</h2>
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                        {timeline.map((item, index) => (
                            <div key={index} className="relative flex items-start group">
                                <div className="absolute left-0 h-5 w-5 rounded-full border-2 border-background bg-muted-foreground group-hover:bg-primary transition-colors ring-4 ring-background" />
                                <div className="pl-8">
                                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                                        {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="text-sm font-medium text-foreground">{item.event}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
