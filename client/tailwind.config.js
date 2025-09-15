/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000", // fixed black color
        orange: {
          500: "#FF6A00", // brand orange
        },
      },
      fontSize: {
        "8xl": "48px",
      },
      fontFamily: {
        heading: ['"Bellefair"', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },

      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
      },
    },
  },
  safelist: [
    'font-heading',
    'font-body',
    'text-orange-500',
    'border-orange-500',
    'text-gray-800',
  ],
  plugins: [
    require('tailwind-scrollbar-hide'), // ✅ ADDED HERE
  ],
};
