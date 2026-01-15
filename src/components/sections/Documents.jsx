import React from 'react';
import { FileText, Download, Lock } from 'lucide-react';

export default function Documents({ data }) {
    const { documents, transparency } = data;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Documents */}
            <section className="space-y-6">
                <h2 className="text-xl font-medium tracking-tight">Documents</h2>
                <div className="space-y-2">
                    {documents.map((doc, i) => (
                        <div key={i} className="group flex items-center justify-between p-4 bg-card hover:bg-muted/50 border border-border rounded-lg transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <div className="font-medium text-foreground">{doc.name}</div>
                                    <div className="text-xs text-muted-foreground uppercase">{doc.type}</div>
                                </div>
                            </div>
                            <Download size={18} className="text-muted-foreground hover:text-primary transition-colors" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Transparency Policy */}
            <section className="space-y-6">
                <h2 className="text-xl font-medium tracking-tight">Transparency Policy</h2>
                <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col justify-center space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Lock size={16} className="text-accent-foreground" />
                        <span className="text-sm font-semibold uppercase tracking-wider text-accent-foreground">Disclosure Schedule</span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                            <span className="text-sm text-foreground">NAV Publication</span>
                            <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">{transparency.nav}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                            <span className="text-sm text-foreground">Portfolio Allocation</span>
                            <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">{transparency.allocation}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                            <span className="text-sm text-foreground">Risk Metrics</span>
                            <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">{transparency.risk}</span>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                        This schedule ensures consistent communication while preserving the confidentiality of active positions.
                    </p>
                </div>
            </section>
        </div>
    );
}
