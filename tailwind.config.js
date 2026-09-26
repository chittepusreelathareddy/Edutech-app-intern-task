/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './providers/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['PlusJakartaSans_400Regular'],
        medium: ['PlusJakartaSans_500Medium'],
        semibold: ['PlusJakartaSans_600SemiBold'],
        heading: ['PlusJakartaSans_700Bold'],
        black: ['PlusJakartaSans_800ExtraBold'],
      },
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
        },
        secondary: '#7C3AED',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        muted: {
          DEFAULT: 'rgb(var(--color-muted) / <alpha-value>)',
          light: 'rgb(var(--color-muted-light) / <alpha-value>)',
        },
        border: 'rgb(var(--color-border) / <alpha-value>)',
        success: '#16A34A',
        error: '#DC2626',
        warning: '#F59E0B',
        bookmark: '#F59E0B',
      },
    },
  },
  plugins: [],
};
