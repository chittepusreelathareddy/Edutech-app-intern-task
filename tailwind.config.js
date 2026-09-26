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
          light: '#EEF2FF',
        },
        secondary: '#7C3AED',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        foreground: '#0F172A',
        muted: {
          DEFAULT: '#64748B',
          light: '#94A3B8',
        },
        border: '#E2E8F0',
        success: '#16A34A',
        error: '#DC2626',
        warning: '#F59E0B',
        bookmark: '#F59E0B',
      },
    },
  },
  plugins: [],
};
