import { useState, useMemo } from 'react';
import type { ProjectData } from '../data/projects';
import {
    ChevronUp, Coins, Target, Calculator,
    Settings2, Trash2, Shield, Minus, Plus
} from 'lucide-react';
import { ShineBorder } from './ui/shine-border';
import { GlassDistortionFilter } from './ui/liquid-glass';

interface Props {
    project: ProjectData;
    points: string;
    expenses: string;
    fdv: number;
    onPointsChange: (val: string) => void;
    onExpensesChange: (val: string) => void;
    onFdvChange: (val: number) => void;
    onDelete?: () => void;
}

const formatCurrency = (val: number) => {
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(0)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val}`;
};

const getAccentColor = (project: ProjectData) => {
    const colorMap: Record<string, string> = {
        extended:    '#06D6A0',
        kinetiq:     '#5CC6E0',
        pacifica:    '#4CC9F0',
        variational: '#FF6B9D',
        grvt:        '#A1A1AA',
        ostium:      '#FF6130',
        nado:        '#A3E635',
        '01exchange':'#8B5CF6',
    };
    return colorMap[project.id] || '#22D3EE';
};

const ConfidenceBadge = ({ confidence }: { confidence?: 'low' | 'medium' | 'high' }) => {
    const cfg = {
        high:   { dot: 'bg-emerald-400', text: 'text-emerald-400', ring: 'border-emerald-500/30 bg-emerald-500/10', label: 'High' },
        medium: { dot: 'bg-amber-400',   text: 'text-amber-400',   ring: 'border-amber-400/30 bg-amber-400/10',     label: 'Mid'  },
        low:    { dot: 'bg-red-400',     text: 'text-red-400',     ring: 'border-red-500/30 bg-red-500/10',         label: 'Low'  },
    };
    const c = cfg[confidence ?? 'medium'];
    return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest ${c.ring} ${c.text}`}>
            <span className="relative flex h-1.5 w-1.5">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${c.dot}`} />
                <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${c.dot}`} />
            </span>
            {c.label}
        </span>
    );
};

const GlassBtn = ({ onClick, children, label }: { onClick: () => void; children: React.ReactNode; label: string }) => (
    <button
        onClick={onClick}
        aria-label={label}
        className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 active:scale-90 cursor-pointer flex-shrink-0"
        style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.18), inset -1px -1px 0 rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.75)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
    >
        {children}
    </button>
);

/* Reusable glass pill section */
const GlassSection = ({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
    <div
        className={`rounded-2xl relative overflow-hidden ${className}`}
        style={{
            background: 'rgba(255,255,255,0.035)',
            backdropFilter: 'blur(12px)',
            boxShadow: 'inset 1.5px 1.5px 0 rgba(255,255,255,0.10), inset -1px -1px 0 rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            ...style,
        }}
    >
        {children}
    </div>
);

export const AirdropCard: React.FC<Props> = ({
    project, points, expenses, fdv,
    onPointsChange, onExpensesChange, onFdvChange, onDelete
}) => {
    const [airdropPercent, setAirdropPercent] = useState(project.airdropPercent);
    const [totalPoints, setTotalPoints] = useState(project.estimatedTotalPoints);
    const [showSettings, setShowSettings] = useState(false);

    const numericPoints   = parseFloat(points.replace(/,/g, '')) || 0;
    const numericExpenses = parseFloat(expenses.replace(/,/g, '')) || 0;

    const calc = useMemo(() => {
        const totalAirdropValue = fdv * (airdropPercent / 100);
        const valuePerPoint = totalPoints > 0 ? totalAirdropValue / totalPoints : 0;
        const myValue = numericPoints * valuePerPoint;
        const breakEvenFdv = numericPoints > 0 && airdropPercent > 0
            ? (numericExpenses * totalPoints) / (numericPoints * (airdropPercent / 100))
            : 0;
        const costPerPoint = numericPoints > 0 ? numericExpenses / numericPoints : 0;
        const netProfit = myValue - numericExpenses;
        const roi = numericExpenses > 0 ? (netProfit / numericExpenses) * 100 : 0;
        return { valuePerPoint, myValue, breakEvenFdv, costPerPoint, roi, netProfit };
    }, [fdv, airdropPercent, totalPoints, numericPoints, numericExpenses]);

    const accent = getAccentColor(project);
    const sliderPercent = Math.min(Math.max(((fdv - 100_000_000) / (project.sliderMax - 100_000_000)) * 100, 0), 100);
    const isProfit = calc.netProfit >= 0;

    const shineColors = (): string[] => {
        const map: Record<string, string[]> = {
            '#06D6A0': ['#06D6A0', '#22D3EE', '#06D6A0'],
            '#FF6B9D': ['#FF6B9D', '#F472B6', '#FF6B9D'],
            '#FF6130': ['#FF6130', '#FB923C', '#FF6130'],
            '#8B5CF6': ['#8B5CF6', '#A78BFA', '#8B5CF6'],
            '#A3E635': ['#A3E635', '#84CC16', '#A3E635'],
            '#A1A1AA': ['#A1A1AA', '#E4E4E7', '#A1A1AA'],
        };
        return map[accent] ?? ['#22D3EE', '#5CC6E0', '#22D3EE'];
    };

    return (
        <>
        <GlassDistortionFilter />
        <ShineBorder color={shineColors()} borderRadius={16} borderWidth={1.5} duration={2.5}>

            {/* ── LIQUID GLASS CARD ── */}
            <div
                className="group relative w-full rounded-2xl overflow-hidden"
                style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    background: 'rgba(255,255,255,0.07)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 2px 2px 1px rgba(255,255,255,0.14), inset -1px -1px 1px rgba(255,255,255,0.04)',
                    isolation: 'isolate',
                }}
            >
                {/* Glass distortion layer */}
                <div
                    className="absolute inset-0 rounded-[inherit] pointer-events-none"
                    style={{ backdropFilter: 'blur(8px)', filter: 'url(#glass-distortion)', isolation: 'isolate', opacity: 0.6 }}
                />
                {/* Accent glow top */}
                <div
                    className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                    style={{ background: `linear-gradient(to right, transparent, ${accent}60, transparent)` }}
                />

                {/* ── CONTENT ── */}
                <div className="relative z-10">

                    {/* ── HEADER ── */}
                    <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className="size-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                                style={{
                                    background: `${accent}18`,
                                    border: `1.5px solid ${accent}40`,
                                    boxShadow: `0 0 12px ${accent}20, inset 1px 1px 0 rgba(255,255,255,0.2)`,
                                }}
                            >
                                {project.logo
                                    ? <img src={project.logo} alt={project.name} className="w-full h-full object-cover" />
                                    : <span className="font-black text-sm" style={{ color: accent }}>{project.ticker.slice(0, 2)}</span>
                                }
                            </div>
                            <div className="min-w-0 flex items-center gap-1.5">
                                <h2 className="text-sm font-bold text-white truncate font-display tracking-wide">{project.name}</h2>
                                {project.isCustom && onDelete && (
                                    <button onClick={onDelete} className="btn-danger-dark p-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 min-h-0 min-w-0" aria-label={`Delete ${project.name}`}>
                                        <Trash2 size={11} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <ConfidenceBadge confidence={project.confidence} />
                    </div>

                    <div className="px-3 pb-4 space-y-2">

                        {/* ── INPUTS ── */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="dark-label" htmlFor={`pts-${project.id}`}><Coins size={10} /> Points</label>
                                <input
                                    id={`pts-${project.id}`}
                                    type="number"
                                    value={points}
                                    onChange={e => onPointsChange(e.target.value)}
                                    placeholder="0"
                                    className={`dark-input text-sm ${numericPoints > 0 ? 'filled' : ''}`}
                                />
                            </div>
                            <div>
                                <label className="dark-label" htmlFor={`exp-${project.id}`}><Calculator size={10} /> Expenses</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dt-muted text-sm font-mono">$</span>
                                    <input
                                        id={`exp-${project.id}`}
                                        type="number"
                                        value={expenses}
                                        onChange={e => onExpensesChange(e.target.value)}
                                        placeholder="0"
                                        className={`dark-input pl-7 text-sm ${numericExpenses > 0 ? 'filled' : ''}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── POTENTIAL VALUE ── */}
                        <GlassSection className="p-3">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-white/50">
                                    <Target size={9} /> Potential Value
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isProfit ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                    {isProfit ? '+' : '−'}${Math.abs(calc.netProfit).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                            <div className="text-2xl font-black tracking-tight tabular-nums font-display text-white">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(calc.myValue)}
                            </div>
                        </GlassSection>

                        {/* ── STATS ── */}
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: 'Cost / Pt',  value: `$${calc.costPerPoint.toFixed(4)}`,  color: 'rgba(255,255,255,0.65)' },
                                { label: 'Price / Pt', value: `$${calc.valuePerPoint.toFixed(4)}`, color: accent },
                            ].map(s => (
                                <GlassSection key={s.label} className="p-2.5">
                                    <div className="text-[9px] font-bold uppercase tracking-wider text-white/30 mb-1">{s.label}</div>
                                    <div className="text-sm font-bold tabular-nums font-mono" style={{ color: s.color }}>{s.value}</div>
                                </GlassSection>
                            ))}
                        </div>

                        {/* ── BREAK EVEN ── */}
                        <GlassSection className="px-3 py-2.5 flex justify-between items-center"
                            style={{
                                background: calc.breakEvenFdv > fdv ? 'rgba(248,113,113,0.08)' : 'rgba(6,214,160,0.08)',
                            } as React.CSSProperties}
                        >
                            <span className={`text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${calc.breakEvenFdv > fdv ? 'text-red-400' : 'text-emerald-400'}`}>
                                <Shield size={9} /> Break Even FDV
                            </span>
                            <span className={`text-sm font-black font-mono tabular-nums ${calc.breakEvenFdv > fdv ? 'text-red-400' : 'text-emerald-400'}`}>
                                {formatCurrency(calc.breakEvenFdv)}
                            </span>
                        </GlassSection>

                        {/* ── TARGET FDV ── */}
                        <GlassSection className="p-3 space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Target FDV</span>
                                <span
                                    className="font-mono tabular-nums text-xs font-black px-2.5 py-1 rounded-full"
                                    style={{ background: `${accent}20`, border: `1px solid ${accent}50`, color: accent }}
                                >
                                    {formatCurrency(fdv)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <GlassBtn onClick={() => onFdvChange(Math.max(100_000_000, fdv - 100_000_000))} label="Decrease FDV">
                                    <Minus size={12} />
                                </GlassBtn>
                                <div className="flex-1">
                                    <input
                                        type="range"
                                        min="100000000"
                                        max={project.sliderMax}
                                        step="10000000"
                                        value={fdv}
                                        onChange={e => onFdvChange(Number(e.target.value))}
                                        className="w-full"
                                        style={{ background: `linear-gradient(to right, ${accent} 0%, ${accent} ${sliderPercent}%, rgba(255,255,255,0.1) ${sliderPercent}%, rgba(255,255,255,0.1) 100%)` }}
                                    />
                                </div>
                                <GlassBtn onClick={() => onFdvChange(Math.min(project.sliderMax, fdv + 100_000_000))} label="Increase FDV">
                                    <Plus size={12} />
                                </GlassBtn>
                            </div>
                            <div className="flex justify-between text-[9px] text-white/25 font-mono px-9">
                                <span>$100M</span>
                                <span>{formatCurrency(project.sliderMax / 2)}</span>
                                <span>{formatCurrency(project.sliderMax)}</span>
                            </div>
                        </GlassSection>

                        {/* ── SETTINGS ── */}
                        <div>
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="w-full flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-white/25 hover:text-white/50 transition-colors py-1 cursor-pointer"
                                aria-expanded={showSettings}
                            >
                                <span className="flex items-center gap-1.5">
                                    <Settings2 size={9} className={`transition-transform duration-200 ${showSettings ? 'rotate-90' : ''}`} />
                                    Assumptions
                                </span>
                                <ChevronUp size={11} className={`transition-transform duration-200 ${showSettings ? 'rotate-0' : 'rotate-180'}`} />
                            </button>
                            {showSettings && (
                                <div className="mt-2 grid grid-cols-2 gap-2 animate-fade-in">
                                    {[
                                        { label: 'Total Points', value: totalPoints,    onChange: (v: number) => setTotalPoints(v) },
                                        { label: 'Airdrop %',    value: airdropPercent, onChange: (v: number) => setAirdropPercent(v) },
                                    ].map(f => (
                                        <GlassSection key={f.label} className="p-2.5">
                                            <label className="block text-[9px] font-bold uppercase text-white/30 mb-1.5">{f.label}</label>
                                            <input
                                                type="number"
                                                value={f.value}
                                                onChange={e => f.onChange(Number(e.target.value))}
                                                className="w-full bg-transparent text-right text-sm font-bold focus:outline-none font-mono tabular-nums text-white/80"
                                            />
                                        </GlassSection>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

        </ShineBorder>
        </>
    );
};
