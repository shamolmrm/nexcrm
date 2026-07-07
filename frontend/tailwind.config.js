/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#185FA5',
          600: '#164b85',
          700: '#113d6d',
        },
      },
    },
  },
  plugins: [],
}

