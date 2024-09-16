import { join } from 'node:path';

const __dirname = new URL('.', import.meta.url).pathname;

/** @type {import('tailwindcss').Config} */
export default {
  content: [join(__dirname, '../apps/_shared/**/*.{js,ts,jsx,tsx}')],
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#fff',
      black: '#000',

      primary: 'var(--primary-color)',
      'on-primary': 'var(--on-primary-color)',
      'primary-container': 'var(--primary-container-color)',
      'on-primary-container': 'var(--on-primary-container-color)',
      secondary: 'var(--secondary-color)',
      'on-secondary': 'var(--on-secondary-color)',
      'secondary-container': 'var(--secondary-container-color)',
      'on-secondary-container': 'var(--on-secondary-container-color)',
      tertiary: 'var(--tertiary-color)',
      'on-tertiary': 'var(--on-tertiary-color)',
      'tertiary-container': 'var(--tertiary-container-color)',
      'on-tertiary-container': 'var(--on-tertiary-container-color)',
      error: 'var(--error-color)',
      'on-error': 'var(--on-error-color)',
      'error-container': 'var(--error-container-color)',
      'on-error-container': 'var(--on-error-container-color)',
      'surface-dim': 'var(--surface-dim-color)',
      surface: 'var(--surface-color)',
      'surface-bright': 'var(--surface-bright-color)',
      'surface-container-lowest': 'var(--surface-container-lowest-color)',
      'surface-container-low': 'var(--surface-container-low-color)',
      'surface-container': 'var(--surface-container-color)',
      'surface-container-high': 'var(--surface-container-high-color)',
      'surface-container-highest': 'var(--surface-container-highest-color)',
      'on-surface': 'var(--on-surface-color)',
      'on-surface-variant': 'var(--on-surface-variant-color)',
      outline: 'var(--outline-color)',
      'outline-variant': 'var(--outline-variant-color)',
      'inverse-surface': 'var(--inverse-surface-color)',
      'on-inverse-surface': 'var(--on-inverse-surface-color)',
      'on-inverse-primary': 'var(--on-inverse-primary-color)',
    },
    extend: {},
  },
  plugins: [],
};
