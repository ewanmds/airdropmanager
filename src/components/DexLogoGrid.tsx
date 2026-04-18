import { GlowCard } from './ui/spotlight-card';

const DEX_PROTOCOLS = [
  { name: 'Uniswap',   ticker: 'UNI',   color: '#FF007A', glow: 'red'    as const, icon: 'uniswap'    },
  { name: 'Aave',      ticker: 'AAVE',  color: '#B6509E', glow: 'purple' as const, icon: 'aave'       },
  { name: 'Curve',     ticker: 'CRV',   color: '#3366BB', glow: 'blue'   as const, icon: 'curve'      },
  { name: '1inch',     ticker: '1INCH', color: '#D82122', glow: 'red'    as const, icon: '1inch'      },
  { name: 'dYdX',      ticker: 'DYDX',  color: '#6966FF', glow: 'purple' as const, icon: 'dydx'       },
  { name: 'Compound',  ticker: 'COMP',  color: '#00D395', glow: 'green'  as const, icon: 'compound'   },
  { name: 'Lido',      ticker: 'LDO',   color: '#00A3FF', glow: 'cyan'   as const, icon: 'lido'       },
  { name: 'Balancer',  ticker: 'BAL',   color: '#A5B4FC', glow: 'purple' as const, icon: 'balancer'   },
  { name: 'SushiSwap', ticker: 'SUSHI', color: '#FA52A0', glow: 'red'    as const, icon: 'sushiswap'  },
  { name: 'Pancake',   ticker: 'CAKE',  color: '#F0B90B', glow: 'orange' as const, icon: 'pancakeswap'},
  { name: 'GMX',       ticker: 'GMX',   color: '#03D1CF', glow: 'cyan'   as const, icon: 'gmx'        },
  { name: 'Jupiter',   ticker: 'JUP',   color: '#C7F284', glow: 'green'  as const, icon: 'jupiter'    },
];

export function DexLogoGrid() {
  return (
    <section className="mb-8 animate-fade-in stagger-2">
      <h2 className="text-xs font-bold uppercase tracking-widest text-dt-muted mb-3 flex items-center gap-2">
        <span className="w-4 h-px bg-white/20" />
        DeFi Protocols
        <span className="flex-1 h-px bg-white/10" />
      </h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
        {DEX_PROTOCOLS.map((dex) => (
          <GlowCard
            key={dex.ticker}
            glowColor={dex.glow}
            className="flex flex-col items-center justify-center gap-1.5 p-2.5 cursor-pointer hover:-translate-y-0.5 transition-transform duration-200"
          >
            <img
              src={`https://cdn.simpleicons.org/${dex.icon}/${dex.color.replace('#', '')}`}
              alt={dex.name}
              className="w-6 h-6 object-contain"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            {/* Fallback colored circle with ticker */}
            <div
              className="w-6 h-6 rounded-full items-center justify-center text-[8px] font-black hidden"
              style={{ background: `${dex.color}22`, color: dex.color, border: `1px solid ${dex.color}44` }}
            >
              {dex.ticker.slice(0, 2)}
            </div>
            <span className="text-[9px] font-semibold tracking-wide text-dt-muted truncate w-full text-center">
              {dex.ticker}
            </span>
          </GlowCard>
        ))}
      </div>
    </section>
  );
}
