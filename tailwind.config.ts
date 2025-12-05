import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: '#f8f9fa',
        accent: '#3b82f6',
        accentMuted: '#bfdbfe',
        text: '#1a202c',
        textSecondary: '#718096',
        subtle: '#a0aec0',
        border: '#e2e8f0'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        display: ['var(--font-serif)', 'Georgia', 'serif']
      },
      boxShadow: {
        card: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
      }
    }
  },
  plugins: []
};

export default config;
