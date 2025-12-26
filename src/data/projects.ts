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
    defaultFdv: number; // New: default FDV
    sliderMax: number;  // New: custom max for slider
}

export const initialProjects: ProjectData[] = [
    {
        id: 'lighter',
        name: 'Lighter',
        ticker: 'LIT',
        logo: '/logos/lighter.png',
        airdropPercent: 25,
        estimatedTotalPoints: 12_500_000,
        colorFrom: 'from-zinc-800',
        colorTo: 'to-zinc-950',
        shadowColor: 'shadow-zinc-500',
        defaultFdv: 3_500_000_000,
        sliderMax: 10_000_000_000,
    },
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
        sliderMax: 2_000_000_000, // 1B is roughly middle (100M - 2B)
    },
    {
        id: 'paradex',
        name: 'Paradex',
        ticker: 'DIME',
        logo: '/logos/paradex.png',
        airdropPercent: 20,
        estimatedTotalPoints: 217_000_000,
        colorFrom: 'from-violet-600',
        colorTo: 'to-fuchsia-500',
        shadowColor: 'shadow-fuchsia-500',
        defaultFdv: 500_000_000,
        sliderMax: 2_000_000_000,
    }
];
