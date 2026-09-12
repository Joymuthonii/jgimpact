import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#102E69',
        'brand-green': '#3BA76C',
        'brand-gold': '#C6943C',
        'brand-canvas': '#F8FAF8',
        'brand-white': '#FFFFFF',
        'brand-text': '#172033',
        'brand-border': '#E2E8F0',
        'brand-muted': '#64748B',
      },
      borderRadius: {
        'radius-sm': '4px',
        'radius-md': '8px',
        'radius-lg': '12px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1-mobile': ['36px', { lineHeight: '1.15', fontWeight: '700' }],
        'h1-desktop': ['52px', { lineHeight: '1.15', fontWeight: '700' }],
        'h2-mobile': ['28px', { lineHeight: '1.2', fontWeight: '600' }],
        'h2-desktop': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
        'h3-mobile': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3-desktop': ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-desktop': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-mobile': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        'gap-standard': '24px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
export default config
