import React from "react";

/* ─────────────────────────────────────────────────────────────
   SVG FILTER — renders the liquid-glass distortion effect
   Place once at the root, referenced via filter="url(#liquid-glass)"
───────────────────────────────────────────────────────────── */
export function LiquidGlassFilter() {
  return (
    <svg style={{ display: "none" }} aria-hidden="true">
      <defs>
        {/* Main liquid distortion */}
        <filter
          id="liquid-glass"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.015"
            numOctaves="2"
            seed="8"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2.5" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="1.5" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>

        {/* Specular light shimmer for inset highlight */}
        <filter id="glass-shimmer" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.001 0.004"
            numOctaves="1"
            seed="17"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="4"
            specularConstant="1"
            specularExponent="80"
            lightingColor="rgba(255,255,255,0.6)"
            result="specLight"
          >
            <fePointLight x="-100" y="-100" z="200" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="120"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   LIQUID GLASS WRAPPER
   Wraps any content with the multi-layer glass effect.
   Usage:
     <LiquidGlass rounded="2xl">...</LiquidGlass>
───────────────────────────────────────────────────────────── */
interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  rounded?: string; // tailwind rounded class e.g. "xl", "2xl", "full"
  intensity?: "subtle" | "medium" | "strong";
  accentColor?: string; // optional tint
  onClick?: () => void;
}

export function LiquidGlass({
  children,
  className = "",
  style,
  rounded = "xl",
  intensity = "medium",
  accentColor,
  onClick,
}: LiquidGlassProps) {
  const blurAmount = { subtle: "4px", medium: "12px", strong: "24px" }[intensity];
  const bgOpacity = { subtle: "0.04", medium: "0.08", strong: "0.14" }[intensity];

  return (
    <div
      className={`relative overflow-hidden rounded-${rounded} ${className}`}
      style={{
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.3) inset",
        ...style,
      }}
      onClick={onClick}
    >
      {/* Layer 1 — backdrop blur + distortion */}
      <div
        className="absolute inset-0 rounded-inherit"
        style={{
          backdropFilter: `blur(${blurAmount})`,
          WebkitBackdropFilter: `blur(${blurAmount})`,
          filter: "url(#liquid-glass)",
          isolation: "isolate",
        }}
      />

      {/* Layer 2 — glass fill tint */}
      <div
        className="absolute inset-0 rounded-inherit"
        style={{
          background: accentColor
            ? `rgba(${hexToRgb(accentColor)}, ${bgOpacity})`
            : `rgba(255,255,255,${bgOpacity})`,
        }}
      />

      {/* Layer 3 — top inset highlight (specular) */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] rounded-t-inherit"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 30%, rgba(255,255,255,0.5) 60%, transparent)",
        }}
      />

      {/* Layer 4 — bottom inset shadow */}
      <div
        className="absolute inset-x-0 bottom-0 h-[1px] rounded-b-inherit"
        style={{ background: "rgba(0,0,0,0.3)" }}
      />

      {/* Layer 5 — outer border */}
      <div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        style={{ border: "1px solid rgba(255,255,255,0.12)" }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LIQUID GLASS BUTTON — inspired by 21st.dev Magic MCP
───────────────────────────────────────────────────────────── */
interface LiquidGlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "accent" | "danger";
  size?: "sm" | "md" | "lg";
}

export function LiquidGlassButton({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: LiquidGlassButtonProps) {
  const padding = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" }[size];
  const accentColor =
    variant === "accent" ? "#22D3EE" : variant === "danger" ? "#F87171" : undefined;

  return (
    <button
      className={`relative overflow-hidden rounded-full font-semibold cursor-pointer transition-transform duration-200 active:scale-95 ${padding} ${className}`}
      style={{
        boxShadow:
          "0 6px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.3)",
        transitionTimingFunction: "cubic-bezier(0.175,0.885,0.32,2.2)",
      }}
      {...props}
    >
      {/* Distortion layer */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(8px) url(#liquid-glass)",
          WebkitBackdropFilter: "blur(8px)",
          filter: "url(#liquid-glass)",
        }}
      />
      {/* Fill */}
      <div
        className="absolute inset-0"
        style={{
          background: accentColor
            ? `linear-gradient(135deg, ${accentColor}22, ${accentColor}10)`
            : "rgba(255,255,255,0.1)",
        }}
      />
      {/* Shimmer top */}
      <div
        className="absolute inset-x-0 top-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.6) 50%, transparent)",
        }}
      />
      {/* Border */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: `1px solid ${accentColor ? accentColor + "40" : "rgba(255,255,255,0.18)"}`,
        }}
      />
      {/* Text */}
      <span
        className="relative z-10 flex items-center gap-2"
        style={{ color: accentColor ?? "rgba(255,255,255,0.9)" }}
      >
        {children}
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   LIQUID GLASS STAT CARD — for portfolio stats
───────────────────────────────────────────────────────────── */
export function LiquidGlassCard({
  children,
  className = "",
  accentColor,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
  style?: React.CSSProperties;
}) {
  return (
    <LiquidGlass
      rounded="2xl"
      intensity="medium"
      accentColor={accentColor}
      className={`transition-transform duration-300 hover:-translate-y-1 ${className}`}
      style={style}
    >
      {children}
    </LiquidGlass>
  );
}

/* ─────────────────────────────────────────────────────────────
   LIQUID GLASS NAVBAR
───────────────────────────────────────────────────────────── */
export function LiquidGlassNav({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        }}
    >
      {/* Top shimmer */}
      <div
        className="absolute inset-x-0 top-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.2) 60%, transparent)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   UTILITY: hex to RGB string
───────────────────────────────────────────────────────────── */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "255,255,255";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
