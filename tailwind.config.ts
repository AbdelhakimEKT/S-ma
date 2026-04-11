import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
      },
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        // Warm, dim, stone-based palette — never pure black, never pure white.
        ink: {
          DEFAULT: '#0c0a08',
          900: '#0c0a08',
          800: '#15110d',
          700: '#1d1813',
          600: '#27201a',
          500: '#33291f',
        },
        bone: {
          DEFAULT: '#efe7d9',
          100: '#f5efe4',
          200: '#efe7d9',
          300: '#e4d9c5',
          400: '#c9bba2',
          500: '#a89783',
        },
        ember: {
          // muted warm amber / old gold — used sparingly for accents
          DEFAULT: '#c69769',
          400: '#dcb084',
          500: '#c69769',
          600: '#a87a4e',
          700: '#82593a',
        },
        moss: {
          DEFAULT: '#5a6b57',
          500: '#5a6b57',
          600: '#465541',
        },
        stone: {
          DEFAULT: '#8a7f73',
        },
      },
      fontFamily: {
        // Wired in app/layout.tsx via next/font.
        serif: ['var(--font-display)', 'Fraunces', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // A refined, slightly looser scale than default.
        'display-xl': ['clamp(3.4rem, 10vw, 9.5rem)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.6rem, 6.2vw, 5.6rem)', { lineHeight: '0.96', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(2rem, 4.2vw, 3.6rem)', { lineHeight: '1.02', letterSpacing: '-0.01em' }],
        'eyebrow': ['0.72rem', { lineHeight: '1', letterSpacing: '0.22em' }],
      },
      letterSpacing: {
        'tight-1': '-0.01em',
        'tight-2': '-0.02em',
        'wide-1': '0.12em',
        'wide-2': '0.22em',
      },
      spacing: {
        'section': 'clamp(5rem, 10vw, 9rem)',
      },
      borderRadius: {
        'xl2': '1.25rem',
      },
      transitionTimingFunction: {
        // Slow, luxurious easings.
        'soma': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'soma-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '900': '900ms',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.06  0 0 0 0 0.04  0 0 0 0 0.02  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")",
        'radial-warm': 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(198,151,105,0.18), transparent 60%)',
        'radial-ember': 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(198,151,105,0.14), transparent 70%)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.04)', opacity: '1' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-8px,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        breathe: 'breathe 7s ease-in-out infinite',
        drift: 'drift 9s ease-in-out infinite',
        shimmer: 'shimmer 2.6s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
