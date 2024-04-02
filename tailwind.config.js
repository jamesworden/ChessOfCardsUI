/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./projects/*/src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        sm: "0px",
        md: "700px",
        lg: "1000px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};
