/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      borderRadius: {
        md: 'var(--radius-md)',
      },
      colors: {
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
      },
    },
  },
  plugins: [],
};
