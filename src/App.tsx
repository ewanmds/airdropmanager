import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { initialProjects, type ProjectData } from './data/projects';
import { AirdropCard } from './components/AirdropCard';
import { AirdropListRow } from './components/AirdropListRow';
import { PortfolioChart } from './components/PortfolioChart';
import { AddProjectModal } from './components/AddProjectModal';
import { ShaderBackground } from './components/ShaderBackground';
import { LiquidGlassFilter, LiquidGlass, LiquidGlassButton, LiquidGlassNav } from './components/LiquidGlass';
import { GlassButton } from './components/ui/liquid-glass';
import { TiltCard } from './components/ui/tilt-card';
import {
  Wallet, TrendingUp, TrendingDown, Activity, Plus, PieChart,
  LayoutGrid, List, Search, DollarSign, Check, Loader2, Filter, X
} from 'lucide-react';

const STORAGE_KEY = 'airdrop-manager-data';
const CUSTOM_PROJECTS_KEY = 'airdrop-manager-custom-projects';
const VIEW_PREFS_KEY = 'airdrop-manager-view-prefs';

const projectColors: Record<string, string> = {
  'extended':    '#06D6A0',
  'kinetiq':     '#5CC6E0',
  'pacifica':    '#4CC9F0',
  'variational': '#FF6B9D',
  'grvt':        '#A1A1AA',
  'ostium':      '#FF6130',
  'nado':        '#A3E635',
  '01exchange':  '#8B5CF6',
};

const loadSavedData = (): Record<string, { points: string; expenses: string; fdv: number }> => {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch { /* noop */ }
  return {};
};
const loadCustomProjects = (): ProjectData[] => {
  try { const s = localStorage.getItem(CUSTOM_PROJECTS_KEY); if (s) return JSON.parse(s); } catch { /* noop */ }
  return [];
};
const saveData = (data: Record<string, { points: string; expenses: string; fdv: number }>) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; } catch { return false; }
};
const saveCustomProjects = (projects: ProjectData[]) => {
  try { localStorage.setItem(CUSTOM_PROJECTS_KEY, JSON.stringify(projects)); return true; } catch { return false; }
};
const loadViewPrefs = () => {
  try { const s = localStorage.getItem(VIEW_PREFS_KEY); if (s) return JSON.parse(s); } catch { /* noop */ }
  return { viewMode: 'grid', showChart: false, sortBy: 'default' };
};
const saveViewPrefs = (prefs: { viewMode: string; showChart: boolean; sortBy: string }) => {
  try { localStorage.setItem(VIEW_PREFS_KEY, JSON.stringify(prefs)); } catch { /* noop */ }
};

type SortOption = 'default' | 'value' | 'roi' | 'expenses' | 'name';

const TAGLINES = [
  'Track your alpha.',
  'Maximize your gains.',
  'Stay ahead of TGEs.',
  'Never miss a drop.',
];

function CyclingTagline() {
  const [idx, setIdx]       = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % TAGLINES.length); setVisible(true); }, 400);
    }, 3000);
    return () => clearInterval(cycle);
  }, []);

  return (
    <p
      className="mt-3 text-sm font-mono tracking-widest uppercase"
      style={{
        color: 'rgba(34,211,238,0.65)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        letterSpacing: '0.18em',
      }}
    >
      <span style={{ color: 'rgba(34,211,238,0.35)', marginRight: '0.4em' }}>{'>'}</span>
      {TAGLINES[idx]}
      <span className="animate-pulse" style={{ color: 'rgba(34,211,238,0.5)', marginLeft: '2px' }}>_</span>
    </p>
  );
}

// Counter animation hook — animates on mount, instant updates after
function useCountUp(end: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) {
      setValue(end);
      return;
    }
    hasAnimated.current = true;
    let rafId: number;
    let startTime: number;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(end * eased));
      if (p < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration]);

  return value;
}

function App() {
  const viewPrefs = loadViewPrefs();

  const [customProjects, setCustomProjects] = useState<ProjectData[]>(loadCustomProjects);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChart, setShowChart] = useState(viewPrefs.showChart);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(viewPrefs.viewMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>(viewPrefs.sortBy || 'default');
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const allProjects = useMemo(() => [...initialProjects, ...customProjects], [customProjects]);

  const [projectStates, setProjectStates] = useState<Record<string, { points: string; expenses: string; fdv: number }>>(() => {
    const saved = loadSavedData();
    const initial: Record<string, { points: string; expenses: string; fdv: number }> = {};
    allProjects.forEach(p => {
      initial[p.id] = saved[p.id] || { points: '', expenses: '', fdv: p.defaultFdv };
    });
    return initial;
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    setProjectStates(prev => {
      const newState = { ...prev };
      let changed = false;
      allProjects.forEach(p => {
        if (!newState[p.id]) {
          newState[p.id] = { points: '', expenses: '', fdv: p.defaultFdv };
          changed = true;
        }
      });
      return changed ? newState : prev;
    });
  }, [allProjects]);

  useEffect(() => {
    const id = setTimeout(() => {
      setSaveStatus('saving');
      if (saveData(projectStates)) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    }, 500);
    return () => clearTimeout(id);
  }, [projectStates]);

  useEffect(() => { saveCustomProjects(customProjects); }, [customProjects]);
  useEffect(() => { saveViewPrefs({ viewMode, showChart, sortBy }); }, [viewMode, showChart, sortBy]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'n') { e.preventDefault(); setShowAddModal(true); }
      if (e.ctrlKey && e.key === 'g') { e.preventDefault(); setViewMode(v => v === 'grid' ? 'list' : 'grid'); }
      if (e.key === 'Escape') { setShowAddModal(false); setShowFilters(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };
    if (showFilters) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showFilters]);

  const updateProjectState = useCallback((id: string, field: 'points' | 'expenses' | 'fdv', value: string | number) => {
    setProjectStates(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }, []);

  const handleAddProject = useCallback((project: ProjectData) => {
    setCustomProjects(prev => [...prev, project]);
  }, []);

  const handleDeleteProject = useCallback((projectId: string) => {
    setCustomProjects(prev => prev.filter(p => p.id !== projectId));
    setProjectStates(prev => { const s = { ...prev }; delete s[projectId]; return s; });
  }, []);

  const portfolio = useMemo(() => {
    let totalExpenses = 0, totalValue = 0;
    const projectValues: { name: string; value: number; color: string }[] = [];

    allProjects.forEach(project => {
      const state = projectStates[project.id];
      if (!state) return;
      const numericPoints = parseFloat(state.points.replace(/,/g, '')) || 0;
      const numericExpenses = parseFloat(state.expenses.replace(/,/g, '')) || 0;
      const totalAirdropValue = state.fdv * (project.airdropPercent / 100);
      const valuePerPoint = project.estimatedTotalPoints > 0 ? totalAirdropValue / project.estimatedTotalPoints : 0;
      const myValue = numericPoints * valuePerPoint;
      totalExpenses += numericExpenses;
      totalValue += myValue;
      projectValues.push({ name: project.name, value: myValue, color: projectColors[project.id] || '#B388FF' });
    });

    const netProfit = totalValue - totalExpenses;
    const totalRoi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;
    return { totalExpenses, totalValue, netProfit, totalRoi, chartData: projectValues };
  }, [projectStates, allProjects]);

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = allProjects;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) || p.ticker.toLowerCase().includes(q) ||
        (p.blockchain && p.blockchain.toLowerCase().includes(q))
      );
    }
    if (sortBy !== 'default') {
      filtered = [...filtered].sort((a, b) => {
        const sA = projectStates[a.id], sB = projectStates[b.id];
        if (!sA || !sB) return 0;
        switch (sortBy) {
          case 'name': return a.name.localeCompare(b.name);
          case 'value': {
            const vA = (parseFloat(sA.points.replace(/,/g, '')) || 0) * (sA.fdv * (a.airdropPercent / 100) / a.estimatedTotalPoints);
            const vB = (parseFloat(sB.points.replace(/,/g, '')) || 0) * (sB.fdv * (b.airdropPercent / 100) / b.estimatedTotalPoints);
            return vB - vA;
          }
          case 'expenses': {
            return (parseFloat(sB.expenses.replace(/,/g, '')) || 0) - (parseFloat(sA.expenses.replace(/,/g, '')) || 0);
          }
          case 'roi': {
            const roi = (p: ProjectData, s: typeof sA) => {
              const pts = parseFloat(s.points.replace(/,/g, '')) || 0;
              const exp = parseFloat(s.expenses.replace(/,/g, '')) || 0;
              const val = pts * (s.fdv * (p.airdropPercent / 100) / p.estimatedTotalPoints);
              return exp > 0 ? ((val - exp) / exp) * 100 : 0;
            };
            return roi(b, sB) - roi(a, sA);
          }
          default: return 0;
        }
      });
    }
    return filtered;
  }, [allProjects, searchQuery, sortBy, projectStates]);

  // Animated portfolio values
  const animTotalExpenses = useCountUp(portfolio.totalExpenses);
  const animTotalValue = useCountUp(portfolio.totalValue);
  const animNetProfit = useCountUp(Math.abs(portfolio.netProfit));
  const animRoi = useCountUp(Math.abs(portfolio.totalRoi));

  const isProfit = portfolio.netProfit >= 0;
  const isPositiveRoi = portfolio.totalRoi >= 0;

  const sortLabels: Record<SortOption, string> = {
    default: 'Default', value: 'By Value', roi: 'By ROI', expenses: 'By Expenses', name: 'By Name'
  };

  return (
    <div className="min-h-screen text-dt-text overflow-x-hidden">

      {/* ═══ SHADER BACKGROUND ═══ */}
      <ShaderBackground />

      {/* LiquidGlassFilter is now inside ShaderBackground */}

      {/* ═══ STICKY NAVBAR — liquid glass ═══ */}
      <LiquidGlassNav className="sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm hidden md:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dt-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="dark-input pl-9 text-sm h-9 w-full"
              aria-label="Search projects"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-dt-muted hover:text-dt-text transition-colors">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {saveStatus !== 'idle' && (
              <LiquidGlass rounded="full" intensity="subtle" className="px-3 py-1 flex items-center gap-1.5 text-xs text-dt-secondary">
                {saveStatus === 'saving' ? (
                  <><Loader2 size={11} className="animate-spin" style={{ color: '#22D3EE' }} /><span>Saving</span></>
                ) : (
                  <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /><span className="text-emerald-400">Saved</span></>
                )}
              </LiquidGlass>
            )}
            <GlassButton size="sm" onClick={() => setShowAddModal(true)}>
              <Plus size={14} strokeWidth={2.5} />
              <span className="hidden sm:inline">Add Project</span>
            </GlassButton>
          </div>
        </div>
      </LiquidGlassNav>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">

        {/* ═══ HEADER ═══ */}
        <header className="mb-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            {/* Titre */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight font-display leading-none whitespace-nowrap pb-1">
                <span className="text-blur-in text-white inline" style={{ animationDelay: '80ms' }}>Airdrop </span><span className="text-shimmer text-glow-flicker inline" style={{ animationDelay: '180ms', animationFillMode: 'both' }}>Manager</span>
              </h1>
              <CyclingTagline />
            </div>

            {/* Nb projets */}
            <div className="anim-fade-up pb-1" style={{ '--delay': '320ms' } as React.CSSProperties}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-0.5">Projects</div>
              <div className="text-2xl font-black font-display text-white">{allProjects.length}</div>
            </div>
          </div>
        </header>

        {/* ═══ PORTFOLIO STATS — liquid glass cards ═══ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

          {/* Total Spend */}
          <TiltCard className="animate-fade-in-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <LiquidGlass rounded="2xl" intensity="medium" className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="section-title-dark"><Wallet size={12} /> Spent</span>
                <LiquidGlass rounded="lg" intensity="subtle" className="w-7 h-7 flex items-center justify-center">
                  <Wallet size={13} className="text-dt-secondary" />
                </LiquidGlass>
              </div>
              <div className="text-xl lg:text-2xl font-black tabular-nums font-mono text-dt-text">
                ${animTotalExpenses.toLocaleString('en-US')}
              </div>
              <div className="divider-dark mt-3" />
              <div className="mt-2 text-[10px] text-dt-muted font-medium uppercase tracking-wider">Total invested</div>
            </LiquidGlass>
          </TiltCard>

          {/* Projected Value */}
          <TiltCard glowColor="rgba(34,211,238,0.5)" className="animate-fade-in-up opacity-0" style={{ animationDelay: '280ms', animationFillMode: 'forwards' }}>
            <LiquidGlass rounded="2xl" intensity="strong" accentColor="#22D3EE" className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="section-title-dark"><Activity size={12} /> Value</span>
                <LiquidGlass rounded="lg" intensity="medium" accentColor="#22D3EE" className="w-7 h-7 flex items-center justify-center">
                  <Activity size={13} style={{ color: '#22D3EE' }} />
                </LiquidGlass>
              </div>
              <div className="text-xl lg:text-2xl font-black tabular-nums font-mono" style={{ color: '#22D3EE' }}>
                ${animTotalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <div className="divider-dark mt-3" style={{ background: 'rgba(34,211,238,0.15)' }} />
              <div className="mt-2 text-[10px] font-medium uppercase tracking-wider" style={{ color: 'rgba(34,211,238,0.5)' }}>Projected payout</div>
            </LiquidGlass>
          </TiltCard>

          {/* Net Profit */}
          <TiltCard glowColor={isProfit ? 'rgba(6,214,160,0.5)' : 'rgba(248,113,113,0.5)'} className="animate-fade-in-up opacity-0" style={{ animationDelay: '360ms', animationFillMode: 'forwards' }}>
            <LiquidGlass rounded="2xl" intensity="medium" accentColor={isProfit ? '#06D6A0' : '#F87171'} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="section-title-dark"><DollarSign size={12} /> Profit</span>
                <LiquidGlass rounded="lg" intensity="medium" accentColor={isProfit ? '#06D6A0' : '#F87171'} className="w-7 h-7 flex items-center justify-center">
                  {isProfit ? <TrendingUp size={13} style={{ color: '#06D6A0' }} /> : <TrendingDown size={13} style={{ color: '#F87171' }} />}
                </LiquidGlass>
              </div>
              <div className="text-xl lg:text-2xl font-black tabular-nums font-mono" style={{ color: isProfit ? '#06D6A0' : '#F87171' }}>
                {isProfit ? '+' : '-'}${animNetProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <div className="divider-dark mt-3" />
              <div className="mt-2 text-[10px] text-dt-muted font-medium uppercase tracking-wider">Net returns</div>
            </LiquidGlass>
          </TiltCard>

          {/* Total ROI */}
          <TiltCard glowColor="rgba(245,158,11,0.5)" className="animate-fade-in-up opacity-0" style={{ animationDelay: '440ms', animationFillMode: 'forwards' }}>
            <LiquidGlass rounded="2xl" intensity="strong" accentColor="#F59E0B" className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="section-title-dark"><TrendingUp size={12} /> ROI</span>
                <LiquidGlass rounded="lg" intensity="medium" accentColor="#F59E0B" className="w-7 h-7 flex items-center justify-center">
                  <TrendingUp size={13} style={{ color: '#F59E0B' }} />
                </LiquidGlass>
              </div>
              <div className="text-xl lg:text-2xl font-black tabular-nums font-display" style={{ color: isPositiveRoi ? '#F59E0B' : '#F87171' }}>
                {isPositiveRoi ? '+' : '-'}{animRoi.toFixed(0)}%
              </div>
              <div className="divider-dark mt-3" style={{ background: 'rgba(245,158,11,0.2)' }} />
              <div className="mt-2 text-[10px] font-medium uppercase tracking-wider" style={{ color: 'rgba(245,158,11,0.5)' }}>Return on invest</div>
            </LiquidGlass>
          </TiltCard>
        </div>

        {/* ═══ TOOLBAR ═══ */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap animate-fade-in stagger-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mobile search */}
            <div className="relative md:hidden">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-dt-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="dark-input pl-8 text-sm h-9 w-36"
              />
            </div>

            {/* Sort */}
            <div className="relative" ref={filterRef}>
              <GlassButton size="sm" active={sortBy !== 'default'} onClick={() => setShowFilters(!showFilters)}>
                <Filter size={13} />
                <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
              </GlassButton>
              {showFilters && (
                <LiquidGlass rounded="xl" intensity="strong" className="absolute top-full left-0 mt-1.5 p-1 min-w-[160px] z-30 animate-scale-in">
                  {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSortBy(key); setShowFilters(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-between"
                      style={{ color: sortBy === key ? '#22D3EE' : 'rgba(255,255,255,0.65)', background: sortBy === key ? 'rgba(34,211,238,0.08)' : 'transparent' }}
                    >
                      {label}
                      {sortBy === key && <Check size={11} />}
                    </button>
                  ))}
                </LiquidGlass>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Chart toggle */}
            <GlassButton size="sm" active={showChart} onClick={() => setShowChart(!showChart)}>
              <PieChart size={13} /><span className="hidden sm:inline">Chart</span>
            </GlassButton>

            {/* View toggle */}
            <GlassButton size="sm" active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
              <LayoutGrid size={13} /><span className="hidden sm:inline">Grid</span>
            </GlassButton>
            <GlassButton size="sm" active={viewMode === 'list'} onClick={() => setViewMode('list')}>
              <List size={13} /><span className="hidden sm:inline">List</span>
            </GlassButton>
          </div>
        </div>

        {/* ═══ CHART — liquid glass ═══ */}
        {showChart && (
          <LiquidGlass rounded="2xl" intensity="medium" className="p-5 mb-6 animate-slide-down overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title-dark"><PieChart size={12} /> Portfolio Distribution</h3>
            </div>
            <div className="h-[220px]">
              <PortfolioChart data={portfolio.chartData} />
            </div>
          </LiquidGlass>
        )}

        {/* ═══ EMPTY SEARCH STATE ═══ */}
        {filteredAndSortedProjects.length === 0 && searchQuery && (
          <div className="text-center py-16 animate-fade-in">
            <Search size={36} className="mx-auto text-dt-muted mb-4 opacity-40" />
            <p className="text-dt-secondary text-sm font-medium">No projects match "<strong className="text-dt-text">{searchQuery}</strong>"</p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-xs text-dt-cyan hover:underline">Clear search</button>
          </div>
        )}

        {/* ═══ PROJECTS ═══ */}
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
          : 'flex flex-col gap-2'
        }>
          {filteredAndSortedProjects.map((project, index) => (
            <div
              key={project.id}
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: `${(index + 1) * 60}ms`, animationFillMode: 'forwards' }}
            >
              {viewMode === 'grid' ? (
                <AirdropCard
                  project={project}
                  points={projectStates[project.id]?.points || ''}
                  expenses={projectStates[project.id]?.expenses || ''}
                  fdv={projectStates[project.id]?.fdv || project.defaultFdv}
                  onPointsChange={val => updateProjectState(project.id, 'points', val)}
                  onExpensesChange={val => updateProjectState(project.id, 'expenses', val)}
                  onFdvChange={val => updateProjectState(project.id, 'fdv', val)}
                  onDelete={project.isCustom ? () => handleDeleteProject(project.id) : undefined}
                />
              ) : (
                <AirdropListRow
                  project={project}
                  points={projectStates[project.id]?.points || ''}
                  expenses={projectStates[project.id]?.expenses || ''}
                  fdv={projectStates[project.id]?.fdv || project.defaultFdv}
                  onPointsChange={val => updateProjectState(project.id, 'points', val)}
                  onExpensesChange={val => updateProjectState(project.id, 'expenses', val)}
                  onFdvChange={val => updateProjectState(project.id, 'fdv', val)}
                  onDelete={project.isCustom ? () => handleDeleteProject(project.id) : undefined}
                />
              )}
            </div>
          ))}
        </div>

        {/* ═══ FOOTER ═══ */}
        <footer className="mt-20 pb-10 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex flex-col items-center gap-4">
            <div className="divider-dark max-w-[80px]" />
            <p className="text-[11px] text-dt-muted text-center">
              Unofficial · Data are estimates · Auto-saved locally
            </p>
            <div className="flex items-center gap-3 text-[10px] text-dt-muted">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">Ctrl+N</kbd>
                New project
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">Ctrl+G</kbd>
                Toggle view
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* ═══ SAVE TOAST ═══ */}
      {saveStatus !== 'idle' && (
        <div className="toast-dark">
          {saveStatus === 'saving' ? (
            <><Loader2 size={13} className="animate-spin" style={{ color: '#22D3EE' }} /><span>Saving...</span></>
          ) : (
            <><span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /><span className="text-emerald-400">Saved</span></>
          )}
        </div>
      )}

      <AddProjectModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddProject} />

    </div>
  );
}

export default App;
