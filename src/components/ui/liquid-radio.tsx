"use client";

import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function GlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter id="radio-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="30" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="2" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

interface LiquidToggleProps {
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: React.ReactNode }[];
}

export function LiquidToggle({ value, onValueChange, options }: LiquidToggleProps) {
  const cols = options.length === 2 ? "grid-cols-[1fr_1fr]" : "grid-cols-[1fr_1fr_1fr]";
  const translate = options.length === 2
    ? { [options[0].value]: "after:translate-x-0", [options[1].value]: "after:translate-x-full" }
    : { [options[0].value]: "after:translate-x-0", [options[1].value]: "after:translate-x-full", [options[2].value]: "after:translate-x-[200%]" };

  return (
    <div className="inline-flex h-9 rounded-xl p-0.5" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}>
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        data-state={value}
        className={`group relative inline-grid ${cols} items-center gap-0 text-sm font-medium
          after:absolute after:inset-y-0 after:w-1/${options.length} after:rounded-[10px]
          after:transition-transform after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]
          ${translate[value] ?? "after:translate-x-0"}
          after:[background:rgba(255,255,255,0.12)]
          after:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.3)]
          has-[:focus-visible]:after:outline has-[:focus-visible]:after:outline-2 has-[:focus-visible]:after:outline-white/40`}
      >
        <div
          className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-[10px]"
          style={{ filter: 'url("#radio-glass")' }}
        />
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-3.5 gap-1.5 transition-colors duration-200 text-xs font-semibold tracking-wide
              ${value === opt.value ? "text-white" : "text-white/40 hover:text-white/65"}`}
          >
            {opt.label}
            <RadioGroupItem value={opt.value} className="sr-only" />
          </label>
        ))}
        <GlassFilter />
      </RadioGroup>
    </div>
  );
}
