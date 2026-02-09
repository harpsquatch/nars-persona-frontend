/** @type {import('tailwindcss').Config} */
export default {
    mode: 'jit', // Force JIT mode
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
          helvetica: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        },
      },
      fontWeight: {
        hairline: 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 500,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
    },
    plugins: [],
  };
  