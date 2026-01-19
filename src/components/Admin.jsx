import React, { useState } from 'react';
import { LogOut, Save, RotateCcw, FileJson, Edit3, Upload, AlertCircle, CheckCircle2, Download, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import JSZip from 'jszip';
import Papa from 'papaparse';

const TABS = [
    { id: 'upload', label: 'Upload Data (ZIP)', icon: <Upload size={16} /> },
    { id: 'updates', label: 'Updates & Context', icon: <Edit3 size={16} /> },
    { id: 'raw', label: 'Advanced (JSON)', icon: <FileJson size={16} /> },
];

export default function Admin({ data, setData, onLogout }) {
    const [activeTab, setActiveTab] = useState('upload');
    const [jsonError, setJsonError] = useState(null);
    const [tempJson, setTempJson] = useState(JSON.stringify(data, null, 2));
    const [uploadStatus, setUploadStatus] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Handler for form field updates
    const updateField = (path, value) => {
        const newData = { ...data };
        const keys = path.split('.');
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setData(newData);
        setTempJson(JSON.stringify(newData, null, 2));
    };

    const handleJsonChange = (e) => {
        const newVal = e.target.value;
        setTempJson(newVal);
        try {
            const parsed = JSON.parse(newVal);
            setData(parsed);
            setJsonError(null);
        } catch (err) {
            setJsonError(err.message);
        }
    };

    const isDev = import.meta.env.DEV;

    const triggerDownload = () => {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "data.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Determine endpoint: Local -> Vite middleware, Prod -> Vercel Function
        const endpoint = isDev ? '/save-data' : '/api/save-data';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // If Dev, reload to see changes. If Prod, reload to fetch new blob data
                setUploadStatus({ type: 'success', message: 'Data saved successfully! App reloading...' });
                setTimeout(() => window.location.reload(), 1500);
            } else {
                const errJson = await response.json().catch(() => ({}));
                throw new Error(errJson.error || 'Server error');
            }
        } catch (err) {
            console.error(err);
            setUploadStatus({ type: 'error', message: `Save failed: ${err.message}` });
        } finally {
            setIsSaving(false);
        }
    };

    const processZipFile = async (file) => {
        setUploadStatus({ type: 'info', message: 'Processing ZIP file...' });
        try {
            const zip = await JSZip.loadAsync(file);

            const readCSV = async (filename) => {
                const foundFile = Object.keys(zip.files).find(name => name.endsWith(filename) && !name.includes('__MACOSX'));
                if (!foundFile) return null;
                const text = await zip.file(foundFile).async('string');
                return Papa.parse(text, { header: true, dynamicTyping: true, skipEmptyLines: true }).data;
            };

            const navData = await readCSV('nav.csv');
            const metricsData = await readCSV('metrics.csv');
            const perfRatioData = await readCSV('performance_ratio.csv');
            const assetData = await readCSV('asset_class_exposure.csv');

            const newData = { ...data };

            // 1. NAV & Performance
            if (navData && navData.length > 0) {
                navData.sort((a, b) => new Date(a.date) - new Date(b.date));
                const lastEntry = navData[navData.length - 1];

                newData.performance = navData.map(row => ({
                    date: row.date.split(' ')[0],
                    value: row.estimated_nav
                }));
                newData.nav.current = lastEntry.estimated_nav;
                newData.lastUpdate = lastEntry.date;
            }

            // 2. Metrics
            if (metricsData) {
                const getMetric = (name) => {
                    const row = metricsData.find(r => r[''] === name || r.metric === name);
                    return row ? row.value : null;
                };

                const vol = getMetric('Annualized Volatility');
                if (vol !== null) newData.metrics.volatility = parseFloat((vol * 100).toFixed(2));

                const maxDd = getMetric('Max Drawdown');
                if (maxDd !== null) newData.metrics.maxDrawdown = parseFloat((maxDd * 100).toFixed(2));
            }

            if (perfRatioData) {
                const getRatio = (name) => {
                    const row = perfRatioData.find(r => r[''] === name);
                    return row ? row.value : null;
                };

                const ytd = getRatio('% YTD');
                if (ytd !== null) newData.nav.ytd = parseFloat((ytd * 100).toFixed(2));

                const inception = getRatio('From Inception');
                if (inception !== null) newData.nav.inception = parseFloat((inception * 100).toFixed(2));

                const mtd = getRatio('% 1M');
                if (mtd !== null) newData.nav.mtd = parseFloat((mtd * 100).toFixed(2));
            }

            // 3. Allocation
            if (assetData) {
                const strategies = assetData.map(row => ({
                    name: row.asset_class,
                    value: parseFloat((row['exposure %'] * 100).toFixed(1)),
                    range: `${Math.floor(row['exposure %'] * 100 - 5)}-${Math.ceil(row['exposure %'] * 100 + 5)}%`
                })).filter(s => s.value > 0);

                strategies.sort((a, b) => b.value - a.value);
                newData.allocation.strategies = strategies;

                const totalExp = strategies.reduce((acc, s) => acc + s.value, 0);
                newData.allocation.exposure.net = parseFloat(totalExp.toFixed(1));
            }

            setData(newData);
            setTempJson(JSON.stringify(newData, null, 2));
            setTempJson(JSON.stringify(newData, null, 2));
            setUploadStatus({ type: 'success', message: 'Data processed! Click "Save Changes" to persist.' });

        } catch (err) {
            console.error(err);
            setUploadStatus({ type: 'error', message: `Error processing file: ${err.message}` });
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <header className="border-b border-border bg-card">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">NICHE Admin</span>
                        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">v1.1</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={triggerDownload}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-3 py-2 rounded-md font-medium text-sm transition-colors"
                            title="Download local backup"
                        >
                            <Download size={16} />
                            Backup
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <div className="h-6 w-px bg-border mx-2" />
                        <button onClick={onLogout} className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors" title="Logout">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <aside className="w-full md:w-64 space-y-2">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setUploadStatus(null); }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                                    activeTab === tab.id
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 space-y-6">



                        {activeTab === 'updates' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <section className="space-y-4">
                                    <h3 className="text-lg font-medium border-b border-border pb-2">Investment Commentary</h3>
                                    <div className="space-y-4">
                                        <TextAreaField label="Market Context" value={data.updates.marketContext} onChange={(v) => updateField('updates.marketContext', v)} />
                                        <TextAreaField label="Portfolio Actions" value={data.updates.portfolioActions} onChange={(v) => updateField('updates.portfolioActions', v)} />
                                        <TextAreaField label="Focus Going Forward" value={data.updates.focus} onChange={(v) => updateField('updates.focus', v)} />
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'upload' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div className="bg-card border border-border rounded-lg p-8 text-center space-y-4">
                                    <div className="mx-auto h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium">Upload Dataset ZIP</h3>
                                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                        Upload a <code>niche_dataset.zip</code> file containing <code>nav.csv</code>, <code>metrics.csv</code>, <code>performance_ratio.csv</code>, and <code>asset_class_exposure.csv</code>.
                                    </p>

                                    <div className="flex justify-center pt-4">
                                        <label className="relative cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors">
                                            <span>Select ZIP File</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".zip"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        processZipFile(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {uploadStatus && (
                                    <div className={cn(
                                        "p-4 rounded-lg flex items-start gap-3 text-sm",
                                        uploadStatus.type === 'success' ? "bg-emerald-500/10 text-emerald-500" :
                                            uploadStatus.type === 'error' ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                                    )}>
                                        {uploadStatus.type === 'success' ? <CheckCircle2 size={18} /> :
                                            uploadStatus.type === 'error' ? <AlertCircle size={18} /> : <Upload size={18} className="animate-bounce" />}
                                        <p>{uploadStatus.message}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'raw' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Raw JSON Editor</h3>
                                    <button onClick={() => setTempJson(JSON.stringify(data, null, 2))} className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground">
                                        <RotateCcw size={12} /> Reset
                                    </button>
                                </div>
                                <div className="relative">
                                    <textarea
                                        className={cn(
                                            "w-full h-[600px] font-mono text-xs bg-card border rounded-md p-4 focus:outline-none focus:ring-1 focus:ring-primary",
                                            jsonError ? "border-destructive focus:ring-destructive" : "border-border"
                                        )}
                                        value={tempJson}
                                        onChange={handleJsonChange}
                                    />
                                    {jsonError && (
                                        <div className="absolute bottom-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded text-xs font-medium flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                            {jsonError}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Edit the raw JSON structure for complex data like chart arrays or allocation lists. Changes apply immediately if valid.
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
}

function InputField({ label, value, onChange, type = "text" }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase">{label}</label>
            <input
                type={type}
                className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function TextAreaField({ label, value, onChange }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase">{label}</label>
            <textarea
                className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all min-h-[100px]"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
