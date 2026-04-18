import { useMemo } from 'react';
import type { ProjectData } from '../data/projects';
import { TrendingUp, TrendingDown, Trash2, Coins, Calculator, Minus, Plus } from 'lucide-react';

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
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

const getAccentColor = (project: ProjectData) => {
    const colorMap: Record<string, string> = {
        extended: '#06D6A0',
        kinetiq: '#5CC6E0',
        pacifica: '#4CC9F0',
        variational: '#FF6B9D',
    };
    return colorMap[project.id] || '#22D3EE';
};

export const AirdropListRow: React.FC<Props> = ({
    project, points, expenses, fdv,
    onPointsChange, onExpensesChange, onFdvChange, onDelete
}) => {
    const numericPoints = parseFloat(points.replace(/,/g, '')) || 0;
    const numericExpenses = parseFloat(expenses.replace(/,/g, '')) || 0;

    const calculations = useMemo(() => {
        const totalAirdropValue = fdv * (project.airdropPercent / 100);
        const valuePerPoint = project.estimatedTotalPoints > 0 ? totalAirdropValue / project.estimatedTotalPoints : 0;
        const myValue = numericPoints * valuePerPoint;
        const netProfit = myValue - numericExpenses;
        const roi = numericExpenses > 0 ? (netProfit / numericExpenses) * 100 : 0;
        return { valuePerPoint, myValue, netProfit, roi };
    }, [fdv, project.airdropPercent, project.estimatedTotalPoints, numericPoints, numericExpenses]);

    const accentColor = getAccentColor(project);
    const sliderRatio = (fdv - 100_000_000) / (project.sliderMax - 100_000_000);
    const sliderPercent = Math.min(Math.max(sliderRatio * 100, 0), 100);
    const isProfit = calculations.netProfit >= 0;

    const adjustFdv = (delta: number) => {
        onFdvChange(Math.max(100_000_000, Math.min(project.sliderMax, fdv + delta)));
    };

    return (
        <div
            className="group flex flex-col lg:flex-row items-stretch gap-0 overflow-hidden rounded-lg border transition-all duration-150"
            style={{ background: '#0D1526', borderColor: 'rgba(255,255,255,0.07)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
        >
            {/* Accent left bar (desktop) / top bar (mobile) */}
            <div className="hidden lg:block w-[3px] flex-shrink-0 self-stretch rounded-l-lg" style={{ background: accentColor }} />
            <div className="lg:hidden h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}40)` }} />

            <div className="flex flex-col lg:flex-row items-stretch gap-3 flex-1 px-4 py-3">

                {/* Identity */}
                <div className="flex items-center gap-3 lg:w-[180px] flex-shrink-0">
                    <div
                        className="size-8 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
                        style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}25` }}
                    >
                        {project.logo ? (
                            <img src={project.logo} alt={project.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-black text-xs" style={{ color: accentColor }}>{project.ticker.slice(0, 2)}</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-sm text-dt-text truncate">{project.name}</h3>
                            {project.isCustom && onDelete && (
                                <button onClick={onDelete} className="btn-danger-dark p-0.5 opacity-0 group-hover:opacity-100 transition-opacity min-h-0 min-w-0" aria-label={`Delete ${project.name}`}>
                                    <Trash2 size={10} />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono text-dt-muted">${project.ticker}</span>
                            {project.blockchain && <span className="text-[9px] px-1 rounded bg-white/5 text-dt-muted">{project.blockchain}</span>}
                        </div>
                    </div>
                </div>

                {/* Inputs */}
                <div className="flex items-center gap-2 flex-1">
                    <div className="relative flex-1">
                        <Coins size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dt-muted" />
                        <input
                            type="number"
                            value={points}
                            onChange={e => onPointsChange(e.target.value)}
                            placeholder="Points"
                            className={`dark-input pl-8 py-2 text-sm ${numericPoints > 0 ? 'filled' : ''}`}
                            aria-label={`Points for ${project.name}`}
                        />
                    </div>
                    <div className="relative flex-1">
                        <Calculator size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dt-muted" />
                        <input
                            type="number"
                            value={expenses}
                            onChange={e => onExpensesChange(e.target.value)}
                            placeholder="Expenses"
                            className={`dark-input pl-8 py-2 text-sm ${numericExpenses > 0 ? 'filled' : ''}`}
                            aria-label={`Expenses for ${project.name}`}
                        />
                    </div>
                </div>

                {/* FDV Slider */}
                <div className="lg:w-[180px] flex-shrink-0">
                    <div className="flex justify-between text-[10px] font-medium text-dt-muted mb-1.5">
                        <span className="uppercase tracking-wider">FDV</span>
                        <span className="font-mono tabular-nums" style={{ color: '#22D3EE' }}>{formatCurrency(fdv)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button onClick={() => adjustFdv(-100_000_000)} className="btn-icon-dark p-1 min-h-0 min-w-0" aria-label="Decrease FDV"><Minus size={10} /></button>
                        <input
                            type="range"
                            min="100000000"
                            max={project.sliderMax}
                            step="10000000"
                            value={fdv}
                            onChange={e => onFdvChange(Number(e.target.value))}
                            className="flex-1"
                            aria-label={`FDV slider for ${project.name}`}
                            style={{ background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${sliderPercent}%, rgba(255,255,255,0.1) ${sliderPercent}%, rgba(255,255,255,0.1) 100%)` }}
                        />
                        <button onClick={() => adjustFdv(100_000_000)} className="btn-icon-dark p-1 min-h-0 min-w-0" aria-label="Increase FDV"><Plus size={10} /></button>
                    </div>
                </div>

                {/* Results */}
                <div className="flex items-center gap-4 lg:w-[220px] flex-shrink-0 justify-between border-t border-white/6 pt-2.5 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-4">
                    <div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-dt-muted mb-0.5">Value</div>
                        <div className="text-sm font-black font-mono tabular-nums text-dt-text">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(calculations.myValue)}
                        </div>
                    </div>
                    <div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-dt-muted mb-0.5">Profit</div>
                        <div className={`text-sm font-black font-mono tabular-nums ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isProfit ? '+' : '-'}${Math.abs(calculations.netProfit).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                    </div>
                    <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${isProfit ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                        {isProfit ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {isProfit ? '+' : ''}{calculations.roi.toFixed(0)}%
                    </div>
                </div>
            </div>
        </div>
    );
};
