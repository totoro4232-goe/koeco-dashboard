import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#0d0f14',
          secondary: '#13161e',
          tertiary: '#1a1e28',
        },
        border: {
          DEFAULT: '#252a38',
          hover: '#3a4058',
        },
        accent: '#4f8ef7',
        up: '#34d399',
        down: '#f87171',
        amber: '#fbbf24',
      },
    },
  },
  plugins: [],
};

export default config;
