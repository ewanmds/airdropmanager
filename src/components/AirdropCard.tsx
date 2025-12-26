import { useState, useMemo } from 'react';
import type { ProjectData } from '../data/projects';
import { ChevronUp, TrendingUp } from 'lucide-react';

interface Props {
    project: ProjectData;
    points: string;
    expenses: string;
    fdv: number;
    onPointsChange: (val: string) => void;
    onExpensesChange: (val: string) => void;
    onFdvChange: (val: number) => void;
}

const formatCurrency = (val: number) => {
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

export const AirdropCard: React.FC<Props> = ({
    project,
    points,
    expenses,
    fdv,
    onPointsChange,
    onExpensesChange,
    onFdvChange
}) => {
    const [airdropPercent, setAirdropPercent] = useState(project.airdropPercent);
    const [totalPoints, setTotalPoints] = useState(project.estimatedTotalPoints);
    const [showSettings, setShowSettings] = useState(false);

    const numericPoints = parseFloat(points.replace(/,/g, '')) || 0;
    const numericExpenses = parseFloat(expenses.replace(/,/g, '')) || 0;

    const calculations = useMemo(() => {
        const totalAirdropValue = fdv * (airdropPercent / 100);
        const valuePerPoint = totalPoints > 0 ? totalAirdropValue / totalPoints : 0;
        const myValue = numericPoints * valuePerPoint;

        let breakEvenFdv = 0;
        if (numericPoints > 0 && airdropPercent > 0) {
            breakEvenFdv = (numericExpenses * totalPoints) / (numericPoints * (airdropPercent / 100));
        }

        const costPerPoint = numericPoints > 0 ? numericExpenses / numericPoints : 0;
        const netProfit = myValue - numericExpenses;
        const roi = numericExpenses > 0 ? (netProfit / numericExpenses) * 100 : 0;

        return {
            valuePerPoint,
            myValue,
            breakEvenFdv,
            costPerPoint,
            roi,
            netProfit
        };
    }, [fdv, airdropPercent, totalPoints, numericPoints, numericExpenses]);

    return (
        <div className={`group relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gray-900/40 border border-white/5 shadow-2xl transition-all duration-500 hover:scale-[1.01] hover:border-white/20 hover:shadow-${project.colorFrom}/30`}>
            {/* Dynamic Background Glow */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] bg-gradient-to-br ${project.colorFrom} ${project.colorTo} opacity-20 group-hover:opacity-40 transition-opacity duration-700`} />
            <div className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-[100px] bg-gradient-to-tr ${project.colorTo} ${project.colorFrom} opacity-10 group-hover:opacity-30 transition-opacity duration-700`} />

            <div className="relative p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`size-12 rounded-xl bg-gradient-to-br ${project.colorFrom} ${project.colorTo} p-[1px] shadow-lg`}>
                            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                                {project.logo ? (
                                    <img src={project.logo} alt={project.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white font-bold text-xs">{project.ticker}</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">
                                {project.name}
                            </h2>
                        </div>
                    </div>
                    {calculations.roi > 0 && (
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                            <TrendingUp size={12} className="text-emerald-400" />
                            <span className="text-emerald-400 text-xs font-bold">+{calculations.roi.toFixed(0)}% ROI</span>
                        </div>
                    )}
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 group/input">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-focus-within/input:text-indigo-400 transition-colors">My Points</label>
                        <input
                            type="number"
                            value={points}
                            onChange={(e) => onPointsChange(e.target.value)}
                            placeholder="0"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-sans text-base tracking-tight"
                        />
                    </div>
                    <div className="space-y-1.5 group/input">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-focus-within/input:text-rose-400 transition-colors">Expenses</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <input
                                type="number"
                                value={expenses}
                                onChange={(e) => onExpensesChange(e.target.value)}
                                placeholder="0"
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all font-sans text-base tracking-tight"
                            />
                        </div>
                    </div>
                </div>

                {/* Big Numbers */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Estimated Value */}
                    <div className="col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/5 p-5 text-center group-hover:border-white/10 transition-colors">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-semibold">Potential Value</p>
                        <div className="text-3xl font-bold text-white tracking-tight drop-shadow-xl">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(calculations.myValue)}
                        </div>
                        <div className="mt-2 text-xs font-medium text-gray-500 flex justify-center gap-4">
                            <span>Profit: <span className={calculations.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                {calculations.netProfit >= 0 ? '+' : ''}{parseFloat(calculations.netProfit.toFixed(0))}$
                            </span></span>
                        </div>
                    </div>

                    {/* Stats Row 1: Cost/Point & Price/Point */}
                    <div className="rounded-xl bg-black/20 p-3 border border-white/5 flex flex-col justify-center items-center">
                        <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Cost / Point</div>
                        <div className="text-sm font-semibold text-gray-300">${calculations.costPerPoint.toFixed(4)}</div>
                    </div>

                    <div className="rounded-xl bg-black/20 p-3 border border-white/5 flex flex-col justify-center items-center">
                        <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Price / Point</div>
                        <div className="text-sm font-semibold text-indigo-300">${calculations.valuePerPoint.toFixed(4)}</div>
                    </div>

                    {/* Break Even */}
                    <div className={`col-span-2 rounded-xl bg-black/20 p-2.5 border border-white/5 flex flex-col justify-center items-center transition-colors ${calculations.breakEvenFdv > fdv ? 'bg-rose-500/5 border-rose-500/10' : 'bg-emerald-500/5 border-emerald-500/10'}`}>
                        <div className="flex justify-between w-full px-4 items-center">
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${calculations.breakEvenFdv > fdv ? 'text-rose-400' : 'text-emerald-400'}`}>Break Even FDV</span>
                            <span className={`text-sm font-bold tracking-tight ${calculations.breakEvenFdv > fdv ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {formatCurrency(calculations.breakEvenFdv)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sliders & Controls */}
                <div className="pt-2">
                    <div className="flex justify-between text-xs font-medium mb-3">
                        <span className="text-gray-400">Target FDV</span>
                        <span className="text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                            {formatCurrency(fdv)}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="100000000" // 100M start
                        max={project.sliderMax}
                        step="10000000" // 10M steps for finer control
                        value={fdv}
                        onChange={(e) => onFdvChange(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                    />
                    <div className="flex justify-between text-[10px] text-gray-600 mt-1 font-medium">
                        <span>$100M</span>
                        <span>{formatCurrency(project.sliderMax / 2)}</span>
                        <span>{formatCurrency(project.sliderMax)}</span>
                    </div>
                </div>

                {/* Assumptions Toggle */}
                <div className="border-t border-white/5 pt-4">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:text-gray-300 transition-colors group/settings"
                    >
                        <span>Edit Assumptions</span>
                        <ChevronUp size={14} className={`transform transition-transform ${showSettings ? 'rotate-0' : 'rotate-180'}`} />
                    </button>

                    {showSettings && (
                        <div className="mt-4 grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
                            <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">Total Points</label>
                                <input
                                    type="number"
                                    value={totalPoints}
                                    onChange={(e) => setTotalPoints(Number(e.target.value))}
                                    className="w-full bg-transparent text-right text-xs font-medium text-gray-300 focus:outline-none font-sans"
                                />
                            </div>
                            <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">Airdrop %</label>
                                <input
                                    type="number"
                                    value={airdropPercent}
                                    onChange={(e) => setAirdropPercent(Number(e.target.value))}
                                    className="w-full bg-transparent text-right text-xs font-medium text-gray-300 focus:outline-none font-sans"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
