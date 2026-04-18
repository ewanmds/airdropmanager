import { Dock, DockIcon } from "@/components/ui/dock"

const DEX_ITEMS = [
  { name: "Uniswap",    src: "https://cdn.simpleicons.org/uniswap/FF007A",   href: "https://app.uniswap.org"        },
  { name: "Aave",       src: "https://cdn.simpleicons.org/aave/B6509E",      href: "https://app.aave.com"           },
  { name: "Curve",      src: "https://cdn.simpleicons.org/curve/3366BB",     href: "https://curve.fi"               },
  { name: "1inch",      src: "https://cdn.simpleicons.org/1inch/D82122",     href: "https://app.1inch.io"           },
  { name: "Compound",   src: "https://cdn.simpleicons.org/compound/00D395",  href: "https://app.compound.finance"   },
  { name: "Lido",       src: "https://cdn.simpleicons.org/lido/00A3FF",      href: "https://lido.fi"                },
  { name: "Balancer",   src: "https://cdn.simpleicons.org/balancer/A5B4FC",  href: "https://balancer.fi"            },
  { name: "SushiSwap",  src: "https://cdn.simpleicons.org/sushiswap/FA52A0", href: "https://www.sushi.com"          },
  { name: "PancakeSwap",src: "https://cdn.simpleicons.org/pancakeswap/F0B90B",href: "https://pancakeswap.finance"  },
  { name: "dYdX",       src: "https://cdn.simpleicons.org/dydx/6966FF",      href: "https://dydx.exchange"          },
  { name: "Jupiter",    src: "https://cdn.simpleicons.org/jupiter/C7F284",   href: "https://jup.ag"                 },
  { name: "GMX",        src: "https://cdn.simpleicons.org/gmx/03D1CF",       href: "https://gmx.io"                 },
]

export function DexDock() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <Dock iconSize={44}>
        {DEX_ITEMS.map((item) => (
          <DockIcon key={item.name} src={item.src} name={item.name} href={item.href} />
        ))}
      </Dock>
    </div>
  )
}
