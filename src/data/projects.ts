export interface ProjectData {
    id: string;
    name: string;
    ticker: string;
    logo: string;
    airdropPercent: number;
    estimatedTotalPoints: number;
    referralLink?: string;
    colorFrom: string;
    colorTo: string;
    shadowColor: string;
    defaultFdv: number;
    sliderMax: number;
    tgeEstimate?: string; // e.g. "Q1 2026"
    blockchain?: string; // Optional blockchain tag
    isCustom?: boolean; // Flag for custom projects
    confidence?: 'low' | 'medium' | 'high'; // Confidence score
    unlockAtTGE?: number; // % unlocked at TGE
    vestingMonths?: number; // Vesting duration in months
    tasks?: { id: string; label: string }[]; // Default tasks
}

export const initialProjects: ProjectData[] = [
    {
        id: 'extended',
        name: 'Extended',
        ticker: 'EXT',
        logo: '/logos/extended.jpg',
        airdropPercent: 30,
        estimatedTotalPoints: 70_000_000,
        colorFrom: 'from-emerald-500',
        colorTo: 'to-teal-400',
        shadowColor: 'shadow-emerald-500',
        defaultFdv: 500_000_000,
        sliderMax: 2_000_000_000,
        tgeEstimate: 'Q2 2026',
        blockchain: 'Starknet',
        confidence: 'high',
        unlockAtTGE: 100,
        vestingMonths: 0,
        tasks: [
            { id: 't1', label: 'Use extended features' },
            { id: 't2', label: 'Refer 3 friends' }
        ]
    },
    {
        id: 'kinetiq',
        name: 'Kinetiq S2',
        ticker: 'KIN',
        logo: '/logos/kinetiq.png',
        airdropPercent: 12,
        estimatedTotalPoints: 50_000_000,
        colorFrom: 'from-sky-400',
        colorTo: 'to-cyan-500',
        shadowColor: 'shadow-sky-400',
        defaultFdv: 400_000_000,
        sliderMax: 1_500_000_000,
        tgeEstimate: 'S2',
        blockchain: 'Other',
        confidence: 'high',
        unlockAtTGE: 100,
        vestingMonths: 0,
        tasks: [
            { id: 't1', label: 'Deposit into Kinetiq' },
            { id: 't2', label: 'Complete Season 2 tasks' },
            { id: 't3', label: 'Stay active weekly' }
        ]
    },
    {
        id: 'pacifica',
        name: 'Pacifica',
        ticker: 'PAC',
        logo: '/logos/pacifica.png',
        airdropPercent: 25,
        estimatedTotalPoints: 220_000_000,
        colorFrom: 'from-cyan-400',
        colorTo: 'to-blue-500',
        shadowColor: 'shadow-cyan-400',
        defaultFdv: 300_000_000,
        sliderMax: 1_500_000_000,
        tgeEstimate: 'Q1 2026',
        blockchain: 'Solana',
        confidence: 'medium',
        unlockAtTGE: 15,
        vestingMonths: 24,
        tasks: [
            { id: 't1', label: 'Stake SOL' },
            { id: 't2', label: 'Provide LP on Orca' }
        ]
    },
    {
        id: 'grvt',
        name: 'GRVT',
        ticker: 'GRVT',
        logo: '/logos/grvt.png',
        airdropPercent: 10,
        estimatedTotalPoints: 80_000_000,
        colorFrom: 'from-zinc-400',
        colorTo: 'to-zinc-600',
        shadowColor: 'shadow-zinc-400',
        defaultFdv: 600_000_000,
        sliderMax: 2_000_000_000,
        tgeEstimate: 'TBD',
        blockchain: 'zkSync',
        confidence: 'medium',
        unlockAtTGE: 15,
        vestingMonths: 12,
        tasks: [
            { id: 't1', label: 'Trade on GRVT perps' },
            { id: 't2', label: 'Deposit collateral' },
            { id: 't3', label: 'Complete KYC' }
        ]
    },
    {
        id: 'ostium',
        name: 'Ostium',
        ticker: 'OST',
        logo: '/logos/ostium.png',
        airdropPercent: 12,
        estimatedTotalPoints: 60_000_000,
        colorFrom: 'from-orange-500',
        colorTo: 'to-red-500',
        shadowColor: 'shadow-orange-500',
        defaultFdv: 400_000_000,
        sliderMax: 1_500_000_000,
        tgeEstimate: 'TBD',
        blockchain: 'Arbitrum',
        confidence: 'medium',
        unlockAtTGE: 10,
        vestingMonths: 18,
        tasks: [
            { id: 't1', label: 'Trade real-world assets' },
            { id: 't2', label: 'Provide liquidity' },
            { id: 't3', label: 'Refer a trader' }
        ]
    },
    {
        id: 'nado',
        name: 'Nado',
        ticker: 'NADO',
        logo: '/logos/nado.png',
        airdropPercent: 15,
        estimatedTotalPoints: 40_000_000,
        colorFrom: 'from-lime-400',
        colorTo: 'to-green-500',
        shadowColor: 'shadow-lime-400',
        defaultFdv: 300_000_000,
        sliderMax: 1_000_000_000,
        tgeEstimate: 'TBD',
        blockchain: 'Ethereum',
        confidence: 'high',
        unlockAtTGE: 20,
        vestingMonths: 12,
        tasks: [
            { id: 't1', label: 'Bridge to Nado chain' },
            { id: 't2', label: 'Swap tokens on DEX' },
            { id: 't3', label: 'Hold NADO for 30 days' }
        ]
    },
    {
        id: '01exchange',
        name: '01',
        ticker: '01',
        logo: '/logos/01.png',
        airdropPercent: 8,
        estimatedTotalPoints: 50_000_000,
        colorFrom: 'from-violet-500',
        colorTo: 'to-purple-700',
        shadowColor: 'shadow-violet-500',
        defaultFdv: 500_000_000,
        sliderMax: 2_000_000_000,
        tgeEstimate: 'TBD',
        blockchain: 'Solana',
        confidence: 'medium',
        unlockAtTGE: 10,
        vestingMonths: 24,
        tasks: [
            { id: 't1', label: 'Trade perps on 01' },
            { id: 't2', label: 'Deposit USDC collateral' },
            { id: 't3', label: 'Reach volume milestone' }
        ]
    },
    {
        id: 'variational',
        name: 'Variational',
        ticker: 'VAR',
        logo: '/logos/variational.jpg',
        airdropPercent: 25,
        estimatedTotalPoints: 7_500_000,
        colorFrom: 'from-blue-500',
        colorTo: 'to-blue-700',
        shadowColor: 'shadow-blue-500',
        defaultFdv: 500_000_000,
        sliderMax: 1_000_000_000,
        tgeEstimate: 'Q2 2026',
        blockchain: 'Arbitrum',
        confidence: 'medium',
        unlockAtTGE: 10,
        vestingMonths: 12,
        tasks: [
            { id: 't1', label: 'Testnet feedback' },
            { id: 't2', label: 'Join Discord' }
        ]
    }
];

// Color options for custom projects
export const colorOptions = [
    { name: 'Purple', from: 'from-purple-500', to: 'to-purple-700' },
    { name: 'Blue', from: 'from-blue-500', to: 'to-blue-700' },
    { name: 'Cyan', from: 'from-cyan-400', to: 'to-cyan-600' },
    { name: 'Emerald', from: 'from-emerald-500', to: 'to-emerald-700' },
    { name: 'Rose', from: 'from-rose-500', to: 'to-rose-700' },
    { name: 'Orange', from: 'from-orange-500', to: 'to-orange-700' },
    { name: 'Yellow', from: 'from-yellow-500', to: 'to-yellow-700' },
];

export const blockchainOptions = ['Ethereum', 'Solana', 'Arbitrum', 'Starknet', 'Base', 'Optimism', 'Polygon', 'Other'];

