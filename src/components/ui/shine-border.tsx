import React, { useId } from "react"
import { cn } from "@/lib/utils"

type TColorProp = string | string[]

interface ShineBorderProps {
  borderRadius?: number
  borderWidth?: number
  duration?: number
  color?: TColorProp
  className?: string
  children: React.ReactNode
}

export function ShineBorder({
  borderRadius = 12,
  borderWidth = 1.5,
  duration = 4,
  color = "#22D3EE",
  className,
  children,
}: ShineBorderProps) {
  const uid = useId().replace(/:/g, "")
  const c1 = Array.isArray(color) ? color[0] : color
  const c2 = Array.isArray(color) ? (color[1] ?? color[0]) : color
  const c3 = Array.isArray(color) ? (color[2] ?? color[0]) : color
  const r = borderRadius
  const bw = borderWidth

  const css = `
    @property --sa-${uid} {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }
    @keyframes spin-${uid} {
      to { --sa-${uid}: 360deg; }
    }
    .sb-${uid}::before {
      --sa-${uid}: 0deg;
      content: '';
      position: absolute;
      inset: -${bw}px;
      border-radius: ${r + bw}px;
      padding: ${bw}px;
      background: conic-gradient(
        from var(--sa-${uid}),
        transparent 0deg,
        ${c1} 60deg,
        ${c2} 120deg,
        ${c3} 160deg,
        transparent 210deg
      );
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      animation: spin-${uid} ${duration}s linear infinite;
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        className={cn(`sb-${uid} relative`, className)}
        style={{ borderRadius: `${r}px` }}
      >
        {children}
      </div>
    </>
  )
}
