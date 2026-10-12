/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        status: {
          operational: '#34d399',
          degraded: '#f59e0b',
          down: '#ef4444',
        },
        vanguard: {
          bg: '#0e0c16',
          card: '#181426',
          cardHover: '#1f1a30',
          border: '#2a233e',
          coral: '#f97356',
          coralDark: '#7c3327',
          coralMuted: '#2b1b22',
          cream: '#fde68a',
          peach: '#fba379',
          lavender: '#c084fc',
          purple: '#818cf8',
          textMuted: '#948ca5',
          textDim: '#645c77',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      gridTemplateColumns: {
        '30': 'repeat(30, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}
