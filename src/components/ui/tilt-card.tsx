import { useRef, useEffect } from 'react'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  glowColor?: string
}

export function TiltCard({ children, className = '', style }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onEnter = () => {
      el.style.transform  = 'scale(1.04)'
      el.style.transition = 'transform 0.35s cubic-bezier(0.16,1,0.3,1)'
    }
    const onLeave = () => {
      el.style.transform  = 'scale(1)'
      el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)'
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={ref} className={`cursor-pointer ${className}`} style={{ willChange: 'transform', ...style }}>
      {children}
    </div>
  )
}
