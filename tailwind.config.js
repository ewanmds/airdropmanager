/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Exo 2', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      colors: {
        dt: {
          bg:       '#050B18',
          surface:  '#0D1526',
          surface2: '#111827',
          surface3: '#1A2744',
          border:   'rgba(255,255,255,0.08)',
          text:     '#E2E8F0',
          secondary:'#94A3B8',
          muted:    '#475569',
          emerald:  '#06D6A0',
          cyan:     '#22D3EE',
          pink:     '#F472B6',
          red:      '#F87171',
          amber:    '#FBBF24',
          gold:     '#F59E0B',
          purple:   '#8B5CF6',
        },
        // Keep nb colors for any remaining references
        nb: {
          bg: '#FFFDF7', card: '#FFFFFF', black: '#1a1a1a', border: '#1a1a1a',
          yellow: '#FFD43B', pink: '#FF6B9D', blue: '#4CC9F0', green: '#06D6A0',
          purple: '#B388FF', orange: '#FF8C42', red: '#EF476F', gray: '#E8E4DD',
          'gray-dark': '#71717a', 'text': '#1a1a1a', 'text-secondary': '#52525b',
          'text-muted': '#a1a1aa',
        },
      },
      borderWidth: { '3': '3px' },
      animation: {
        'fade-in':     'fadeIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in-up':  'fadeInUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in':    'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'slide-up':    'slideUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-down':  'slideDown 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'shine':       'shine var(--duration,10s) infinite linear',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp:  { '0%': { opacity: '0', transform: 'translateY(16px) translateZ(0)' }, '100%': { opacity: '1', transform: 'translateY(0) translateZ(0)' } },
        scaleIn:   { '0%': { opacity: '0', transform: 'scale(0.92)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        slideUp:   { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        glowPulse: { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        shine: {
          '0%':   { backgroundPosition: '0% 0%' },
          '50%':  { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
