/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background-color)',
        'pane-bg': 'var(--pane-background-color)',
        'pane-weaker-bg': 'var(--pane-weaker-background-color)',
        'pane-success-bg': 'var(--pane-success-background-color)',
      },
    },
  },
  plugins: [],
};
