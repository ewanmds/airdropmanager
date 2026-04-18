"use client"

import * as React from "react"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface DockProps {
  className?: string
  children: React.ReactNode
  maxAdditionalSize?: number
  iconSize?: number
}

interface DockIconProps {
  className?: string
  src?: string
  href?: string
  name: string
  handleIconHover?: (e: React.MouseEvent<HTMLLIElement>) => void
  children?: React.ReactNode
  iconSize?: number
}

type ScaleValueParams = [number, number]

export const scaleValue = function (
  value: number,
  from: ScaleValueParams,
  to: ScaleValueParams
): number {
  const scale = (to[1] - to[0]) / (from[1] - from[0])
  const capped = Math.min(from[1], Math.max(from[0], value)) - from[0]
  return Math.floor(capped * scale + to[0])
}

const DOCK_STYLES = `
  .dock-item:hover + .dock-item {
    width: calc(var(--icon-size) * 1.33 + var(--dock-offset-right, 0px));
    height: calc(var(--icon-size) * 1.33 + var(--dock-offset-right, 0px));
    margin-top: calc(var(--icon-size) * -0.33 + var(--dock-offset-right, 0) * -1);
  }
  .dock-item:hover + .dock-item + .dock-item {
    width: calc(var(--icon-size) * 1.17 + var(--dock-offset-right, 0px));
    height: calc(var(--icon-size) * 1.17 + var(--dock-offset-right, 0px));
    margin-top: calc(var(--icon-size) * -0.17 + var(--dock-offset-right, 0) * -1);
  }
  .dock-item:has(+ .dock-item:hover) {
    width: calc(var(--icon-size) * 1.33 + var(--dock-offset-left, 0px));
    height: calc(var(--icon-size) * 1.33 + var(--dock-offset-left, 0px));
    margin-top: calc(var(--icon-size) * -0.33 + var(--dock-offset-left, 0) * -1);
  }
  .dock-item:has(+ .dock-item + .dock-item:hover) {
    width: calc(var(--icon-size) * 1.17 + var(--dock-offset-left, 0px));
    height: calc(var(--icon-size) * 1.17 + var(--dock-offset-left, 0px));
    margin-top: calc(var(--icon-size) * -0.17 + var(--dock-offset-left, 0) * -1);
  }
`

export function DockIcon({
  className,
  src,
  href = "#",
  name,
  handleIconHover,
  children,
  iconSize = 55,
}: DockIconProps) {
  const ref = useRef<HTMLLIElement | null>(null)

  return (
    <li
      ref={ref}
      style={
        {
          transition: "width, height, margin-top, cubic-bezier(0.25, 1, 0.5, 1) 150ms",
          "--icon-size": `${iconSize}px`,
        } as React.CSSProperties
      }
      onMouseMove={handleIconHover}
      className={cn(
        "dock-item group/li flex h-[var(--icon-size)] w-[var(--icon-size)] cursor-pointer items-center justify-center px-[calc(var(--icon-size)*0.075)] hover:-mt-[calc(var(--icon-size)/2)] hover:h-[calc(var(--icon-size)*1.5)] hover:w-[calc(var(--icon-size)*1.5)] [&_img]:object-contain",
        className
      )}
    >
      <a
        href={href}
        className="group/a relative aspect-square w-full rounded-[10px] border border-white/10 bg-gradient-to-t from-white/5 to-white/10 p-1.5 shadow-[rgba(0,0,0,0.3)_0px_1px_0px_inset] after:absolute after:inset-0 after:rounded-[inherit] after:shadow-md after:shadow-black/30"
      >
        <span className="absolute top-[-40px] left-1/2 -translate-x-1/2 rounded-md border border-white/10 bg-black/80 backdrop-blur-sm p-1 px-2 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover/li:opacity-100 z-50">
          {name}
        </span>
        {src ? (
          <img
            src={src}
            alt={name}
            className="h-full w-full rounded-[inherit]"
          />
        ) : (
          children
        )}
      </a>
    </li>
  )
}

export function Dock({
  className,
  children,
  maxAdditionalSize = 5,
  iconSize = 55,
}: DockProps) {
  const dockRef = useRef<HTMLDivElement | null>(null)

  const handleIconHover = (e: React.MouseEvent<HTMLLIElement>) => {
    if (!dockRef.current) return
    const mousePos = e.clientX
    const iconPosLeft = e.currentTarget.getBoundingClientRect().left
    const iconWidth = e.currentTarget.getBoundingClientRect().width
    const cursorDistance = (mousePos - iconPosLeft) / iconWidth
    const offsetPixels = scaleValue(cursorDistance, [0, 1], [maxAdditionalSize * -1, maxAdditionalSize])
    dockRef.current.style.setProperty("--dock-offset-left", `${offsetPixels * -1}px`)
    dockRef.current.style.setProperty("--dock-offset-right", `${offsetPixels}px`)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: DOCK_STYLES }} />
      <nav ref={dockRef} role="navigation" aria-label="DeFi Dock">
        <ul
          className={cn(
            "flex items-end rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-2 gap-1 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]",
            className
          )}
        >
          {React.Children.map(children, (child) =>
            React.isValidElement<DockIconProps>(child)
              ? React.cloneElement(child as React.ReactElement<DockIconProps>, {
                  handleIconHover,
                  iconSize,
                })
              : child
          )}
        </ul>
      </nav>
    </>
  )
}
