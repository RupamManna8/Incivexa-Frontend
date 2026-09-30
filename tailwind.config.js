/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#F8F9FB',
        'surface-main': '#FFFFFF',
        'surface-secondary': '#F1F3F5',
        'border-subtle': '#E2E6EA',
        'text-primary': '#17202A',
        'text-secondary': '#667085',
        'accent-primary': '#4F46E5',
        'accent-hover': '#4338CA',
        'status-success': '#15803D',
        'status-warning': '#B45309',
        'status-critical': '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'soft-xs': '0 1px 2px 0 rgba(23, 32, 42, 0.04)',
        'soft-sm': '0 1px 3px 0 rgba(23, 32, 42, 0.06), 0 1px 2px 0 rgba(23, 32, 42, 0.04)',
        'soft-md': '0 4px 10px -2px rgba(23, 32, 42, 0.06), 0 2px 4px -2px rgba(23, 32, 42, 0.04)',
        'soft-lg': '0 12px 24px -4px rgba(23, 32, 42, 0.08), 0 4px 8px -2px rgba(23, 32, 42, 0.03)',
        'soft-xl': '0 24px 36px -6px rgba(23, 32, 42, 0.10), 0 10px 14px -4px rgba(23, 32, 42, 0.04)',
      },
    },
  },
  plugins: [],
}
