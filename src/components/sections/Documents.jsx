import React from 'react';
import { FileText, Download, Lock, FileCheck } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';

export default function Documents({ data }) {
    const { language } = useLanguage();
    const t = translations[language];
    const { documents, transparency } = data;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Documents */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gray-500/10 border border-gray-500/20">
                        <FileText size={16} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-light tracking-tight text-white">{t.documents.title}</h2>
                </div>

                <div className="grid gap-3">
                    {documents.map((doc, i) => (
                        <a
                            key={i}
                            href={doc.url}
                            download={doc.type === 'pdf'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between p-4 bg-[#0a0a0a] hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl transition-all duration-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-white group-hover:scale-110 transition-all">
                                    <FileCheck size={20} />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-200 group-hover:text-white transition-colors">{doc.name}</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">{doc.type}</div>
                                </div>
                            </div>
                            <div className="p-2 rounded-full bg-white/5 text-gray-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                                <Download size={16} />
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* Transparency Policy */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <Lock size={16} className="text-amber-400" />
                    </div>
                    <h2 className="text-xl font-light tracking-tight text-white">{t.documents.transparency} <span className="text-muted-foreground font-normal text-sm ml-2">{t.documents.transparencySub}</span></h2>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 h-full flex flex-col justify-center space-y-6 relative overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 text-white/5 rotate-[-15deg]">
                        <Lock size={120} />
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                            <span className="text-sm text-gray-400">{t.documents.navPub}</span>
                            <span className="text-xs font-mono bg-amber-500/10 text-amber-500 px-2 py-1 rounded border border-amber-500/20">{transparency.nav}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                            <span className="text-sm text-gray-400">{t.documents.portAlloc}</span>
                            <span className="text-xs font-mono bg-amber-500/10 text-amber-500 px-2 py-1 rounded border border-amber-500/20">{transparency.allocation}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                            <span className="text-sm text-gray-400">{t.documents.riskMetrics}</span>
                            <span className="text-xs font-mono bg-amber-500/10 text-amber-500 px-2 py-1 rounded border border-amber-500/20">{transparency.risk}</span>
                        </div>
                    </div>

                    <div className="relative z-10 bg-white/5 rounded-lg p-3">
                        <p className="text-[10px] text-gray-500 leading-relaxed font-mono">
                            {t.documents.confidential}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
