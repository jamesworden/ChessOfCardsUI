/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./projects/*/src/**/*.{html,ts}', './shared/**/*.{html,ts}'],
  theme: {
    extend: {
      screens: {
        xs: '0px',
        sm: '480px',
        md: '700px',
        lg: '1000px',
        xl: '1280px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
