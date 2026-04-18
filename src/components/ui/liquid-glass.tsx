import React from "react"

interface GlassEffectProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  href?: string
  target?: string
}

interface DockIcon {
  src: string
  alt: string
  onClick?: () => void
}

/* ── SVG distortion filter — the authentic 21st.dev liquid glass ── */
export const GlassDistortionFilter: React.FC = () => (
  <svg style={{ display: "none" }} aria-hidden="true">
    <defs>
      <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
        <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
        <feDisplacementMap in="SourceGraphic" in2="softMap" scale="200" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
)

/* ── Core glass wrapper ── */
export const GlassEffect: React.FC<GlassEffectProps> = ({ children, className = "", style = {}, href, target = "_blank" }) => {
  const glassStyle: React.CSSProperties = {
    boxShadow: "0 6px 6px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.1)",
    transitionTimingFunction: "cubic-bezier(0.175,0.885,0.32,2.2)",
    ...style,
  }

  const content = (
    <div className={`relative flex font-semibold overflow-hidden cursor-pointer ${className}`} style={{ ...glassStyle, transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)' }} onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.06)')} onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
      {/* Layer 1 — blur + distortion */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]" style={{ backdropFilter: "blur(12px)", filter: "url(#glass-distortion)", isolation: "isolate" }} />
      {/* Layer 2 — fill */}
      <div className="absolute inset-0 z-10 rounded-[inherit]" style={{ background: "rgba(255,255,255,0.06)" }} />
      {/* Layer 3 — inset highlight */}
      <div className="absolute inset-0 z-20 rounded-[inherit] overflow-hidden" style={{ boxShadow: "inset 2px 2px 1px 0 rgba(255,255,255,0.18), inset -1px -1px 1px 1px rgba(255,255,255,0.08)" }} />
      {/* Content */}
      <div className="relative z-30 w-full">{children}</div>
    </div>
  )

  return href ? (
    <a href={href} target={target} rel="noopener noreferrer" className="block">{content}</a>
  ) : content
}

/* ── Dock ── */
export const GlassDock: React.FC<{ icons: DockIcon[]; href?: string }> = ({ icons, href }) => (
  <GlassEffect href={href} className="rounded-3xl p-3 hover:p-4">
    <div className="flex items-center justify-center gap-2 px-0.5">
      {icons.map((icon, i) => (
        <img
          key={i} src={icon.src} alt={icon.alt} onClick={icon.onClick}
          className="w-12 h-12 transition-all duration-700 hover:scale-110 cursor-pointer"
          style={{ transitionTimingFunction: "cubic-bezier(0.175,0.885,0.32,2.2)" }}
        />
      ))}
    </div>
  </GlassEffect>
)

/* ── Glass pill button ── */
export const GlassButton: React.FC<{
  children: React.ReactNode
  href?: string
  onClick?: () => void
  size?: 'sm' | 'md'
  active?: boolean
  className?: string
}> = ({ children, href, onClick, size = 'md', active = false, className = '' }) => {
  const padding = size === 'sm' ? 'px-3.5 py-1.5' : 'px-5 py-2.5'
  return (
    <GlassEffect
      href={href}
      className={`rounded-full ${padding} overflow-hidden ${active ? 'brightness-125' : ''} ${className}`}
      style={{ cursor: "pointer" }}
    >
      <div
        className="transition-all duration-500 text-white flex items-center gap-1.5 text-xs font-semibold"
        style={{ transitionTimingFunction: "cubic-bezier(0.175,0.885,0.32,2.2)" }}
        onClick={onClick}
      >
        {children}
      </div>
    </GlassEffect>
  )
}
