import { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { type ProjectData, colorOptions, blockchainOptions } from '../data/projects';
import { LiquidGlass } from './LiquidGlass';
import { MetalButton } from './ui/liquid-glass-button';

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (project: ProjectData) => void;
}

const colorHex: Record<string, string> = {
    Purple: '#B388FF', Blue: '#4CC9F0', Cyan: '#22D3EE',
    Emerald: '#06D6A0', Rose: '#F472B6', Orange: '#FF8C42', Yellow: '#FFD43B',
};

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [ticker, setTicker] = useState('');
    const [airdropPercent, setAirdropPercent] = useState(10);
    const [totalPoints, setTotalPoints] = useState(1000000);
    const [defaultFdv, setDefaultFdv] = useState(500000000);
    const [tgeEstimate, setTgeEstimate] = useState('');
    const [blockchain, setBlockchain] = useState('Ethereum');
    const [selectedColor, setSelectedColor] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const color = colorOptions[selectedColor];
        const newProject: ProjectData = {
            id: `custom-${Date.now()}`,
            name,
            ticker: ticker.toUpperCase(),
            logo: '',
            airdropPercent,
            estimatedTotalPoints: totalPoints,
            colorFrom: color.from,
            colorTo: color.to,
            shadowColor: 'shadow-purple-500',
            defaultFdv,
            sliderMax: defaultFdv * 4,
            tgeEstimate: tgeEstimate || undefined,
            blockchain,
            isCustom: true,
        };
        onAdd(newProject);
        setName(''); setTicker(''); setAirdropPercent(10); setTotalPoints(1000000);
        setDefaultFdv(500000000); setTgeEstimate(''); setBlockchain('Ethereum'); setSelectedColor(0);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* Modal — glassmorphism inspired by 21st.dev Magic MCP */}
            <LiquidGlass rounded="2xl" intensity="strong" className="w-full max-w-md" style={{ backdropFilter: 'blur(40px)' }} onClick={((e: React.MouseEvent) => e.stopPropagation()) as () => void}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22D3EE22, #06D6A022)', border: '1px solid rgba(34,211,238,0.2)' }}>
                            <Sparkles size={15} style={{ color: '#22D3EE' }} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-dt-text">Add Project</h2>
                            <p className="text-[10px] text-dt-muted">Track a new airdrop</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn-icon-dark" aria-label="Close modal">
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                    {/* Name & Ticker */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="dark-label" htmlFor="modal-name">Project Name *</label>
                            <input
                                id="modal-name"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                placeholder="e.g. Jupiter"
                                className="dark-input"
                            />
                        </div>
                        <div>
                            <label className="dark-label" htmlFor="modal-ticker">Ticker *</label>
                            <input
                                id="modal-ticker"
                                type="text"
                                value={ticker}
                                onChange={e => setTicker(e.target.value.toUpperCase())}
                                required
                                placeholder="e.g. JUP"
                                maxLength={6}
                                className="dark-input uppercase"
                            />
                        </div>
                    </div>

                    {/* Airdrop % & Total Points */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="dark-label" htmlFor="modal-pct">Airdrop %</label>
                            <input
                                id="modal-pct"
                                type="number"
                                value={airdropPercent}
                                onChange={e => setAirdropPercent(Number(e.target.value))}
                                min={1} max={100}
                                className="dark-input"
                            />
                        </div>
                        <div>
                            <label className="dark-label" htmlFor="modal-points">Est. Total Points</label>
                            <input
                                id="modal-points"
                                type="number"
                                value={totalPoints}
                                onChange={e => setTotalPoints(Number(e.target.value))}
                                min={1}
                                className="dark-input"
                            />
                        </div>
                    </div>

                    {/* Default FDV & TGE */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="dark-label" htmlFor="modal-fdv">Default FDV ($)</label>
                            <input
                                id="modal-fdv"
                                type="number"
                                value={defaultFdv}
                                onChange={e => setDefaultFdv(Number(e.target.value))}
                                min={1000000}
                                step={1000000}
                                className="dark-input"
                            />
                        </div>
                        <div>
                            <label className="dark-label" htmlFor="modal-tge">TGE Estimate</label>
                            <input
                                id="modal-tge"
                                type="text"
                                value={tgeEstimate}
                                onChange={e => setTgeEstimate(e.target.value)}
                                placeholder="e.g. Q1 2026"
                                className="dark-input"
                            />
                        </div>
                    </div>

                    {/* Blockchain */}
                    <div>
                        <label className="dark-label" htmlFor="modal-chain">Blockchain</label>
                        <select
                            id="modal-chain"
                            value={blockchain}
                            onChange={e => setBlockchain(e.target.value)}
                            className="dark-select"
                        >
                            {blockchainOptions.map(bc => (
                                <option key={bc} value={bc}>{bc}</option>
                            ))}
                        </select>
                    </div>

                    {/* Color Picker */}
                    <div>
                        <label className="dark-label">Accent Color</label>
                        <div className="flex gap-2 mt-1">
                            {colorOptions.map((color, index) => {
                                const hex = colorHex[color.name] || '#22D3EE';
                                const isSelected = selectedColor === index;
                                return (
                                    <button
                                        key={color.name}
                                        type="button"
                                        onClick={() => setSelectedColor(index)}
                                        className="w-8 h-8 rounded-lg transition-all duration-150 flex items-center justify-center"
                                        style={{
                                            background: `${hex}25`,
                                            border: isSelected ? `2px solid ${hex}` : `2px solid ${hex}30`,
                                            boxShadow: isSelected ? `0 0 10px ${hex}40` : 'none',
                                            transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                                        }}
                                        title={color.name}
                                        aria-label={`Select ${color.name} color`}
                                    >
                                        <span className="w-3 h-3 rounded-full" style={{ background: hex }} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit */}
                    <MetalButton
                        type="submit"
                        variant="success"
                        className="w-full mt-2 justify-center"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        Add Project
                    </MetalButton>
                </form>
            </LiquidGlass>
        </div>
    );
};
