import { GradFlow } from "gradflow"

interface StripeShaderProps {
  className?: string
  opacity?: number
  speed?: number
  /** Use original vivid colors (white/cyan/purple) or dark-adapted (navy/emerald/cyan) */
  variant?: "vivid" | "dark"
}

export function StripeShader({
  className = "",
  opacity = 1,
  speed = 0.4,
  variant = "vivid",
}: StripeShaderProps) {
  // vivid = exact 21st.dev component colors (white + #42FFE9 + #8106BE)
  // dark  = adapted for dark background layering
  const config =
    variant === "vivid"
      ? {
          color1: { r: 255, g: 255, b: 255 },
          color2: { r: 66,  g: 255, b: 233 },
          color3: { r: 129, g: 6,   b: 190 },
          speed,
          scale: 1,
          type: "stripe" as const,
          noise: 0.08,
        }
      : {
          color1: { r: 5,  g: 11,  b: 24  },
          color2: { r: 6,  g: 214, b: 160 },
          color3: { r: 34, g: 211, b: 238 },
          speed,
          scale: 1.2,
          type: "stripe" as const,
          noise: 0.06,
        }

  return (
    <div className={`absolute inset-0 ${className}`} style={{ opacity }}>
      <GradFlow config={config} />
    </div>
  )
}
