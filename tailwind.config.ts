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
          primary: '#f4f7ff',
          secondary: '#ffffff',
          tertiary: '#eef3ff',
        },
        border: {
          DEFAULT: '#d7e1f2',
          hover: '#b9c8e6',
        },
        accent: '#3b82f6',
        up: '#34d399',
        down: '#f87171',
        amber: '#fbbf24',
      },
    },
  },
  plugins: [],
};

export default config;
