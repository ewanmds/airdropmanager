import { useState, useMemo } from 'react';
import { initialProjects } from './data/projects';
import { AirdropCard } from './components/AirdropCard';
import { Layers, Wallet, TrendingUp, Activity } from 'lucide-react';

function App() {
  // State for all projects
  const [projectStates, setProjectStates] = useState<Record<string, { points: string; expenses: string; fdv: number }>>(() => {
    const initial: Record<string, any> = {};
    initialProjects.forEach(p => {
      initial[p.id] = { points: '', expenses: '', fdv: p.defaultFdv };
    });
    return initial;
  });

  const updateProjectState = (id: string, field: 'points' | 'expenses' | 'fdv', value: string | number) => {
    setProjectStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  // Portfolio Calculations
  const portfolio = useMemo(() => {
    let totalExpenses = 0;
    let totalValue = 0;

    initialProjects.forEach(project => {
      const state = projectStates[project.id];
      if (!state) return;

      const numericPoints = parseFloat(state.points.replace(/,/g, '')) || 0;
      const numericExpenses = parseFloat(state.expenses.replace(/,/g, '')) || 0;

      // Use defaults from data for calculation
      const totalPoints = project.estimatedTotalPoints;
      const airdropPercent = project.airdropPercent;

      const totalAirdropValue = state.fdv * (airdropPercent / 100);
      const valuePerPoint = totalPoints > 0 ? totalAirdropValue / totalPoints : 0;
      const myValue = numericPoints * valuePerPoint;

      totalExpenses += numericExpenses;
      totalValue += myValue;
    });

    const netProfit = totalValue - totalExpenses;
    const totalRoi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

    return {
      totalExpenses,
      totalValue,
      netProfit,
      totalRoi
    };
  }, [projectStates]);

  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] left-[20%] w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 lg:px-8">

        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl">
              <Layers className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                Airdrop Manager
              </h1>
              <p className="text-sm text-gray-500">
                Portfolio Tracker & Simulator
              </p>
            </div>
          </div>

          {/* Portfolio Summary Card */}
          <div className="flex-1 w-full md:w-auto max-w-3xl bg-white/5 rounded-3xl p-1 border border-white/10 backdrop-blur-md shadow-2xl">
            <div className="grid grid-cols-3 divide-x divide-white/5">
              <div className="p-4 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Wallet size={12} /> Total Spend
                </span>
                <div className="text-xl font-mono font-medium text-white tracking-tight">
                  ${portfolio.totalExpenses.toLocaleString('en-US')}
                </div>
              </div>
              <div className="p-4 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                <span className="text-xs text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Activity size={12} /> Proj. Value
                </span>
                <div className="text-2xl font-bold text-white drop-shadow-lg tracking-tight">
                  ${portfolio.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="p-4 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <TrendingUp size={12} /> Total ROI
                </span>
                <div className={`text-xl font-bold ${portfolio.totalRoi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {portfolio.totalRoi >= 0 ? '+' : ''}{portfolio.totalRoi.toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialProjects.map((project) => (
            <AirdropCard
              key={project.id}
              project={project}
              points={projectStates[project.id]?.points || ''}
              expenses={projectStates[project.id]?.expenses || ''}
              fdv={projectStates[project.id]?.fdv || 3000000000}
              onPointsChange={(val) => updateProjectState(project.id, 'points', val)}
              onExpensesChange={(val) => updateProjectState(project.id, 'expenses', val)}
              onFdvChange={(val) => updateProjectState(project.id, 'fdv', val)}
            />
          ))}
        </div>

        <footer className="mt-20 text-center text-xs text-gray-700 pb-10">
          <p>Unofficial Dashboard. Data are estimates.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
