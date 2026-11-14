/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nhs: {
          blue: '#005EB8',
          darkBlue: '#003087',
          brightBlue: '#0072CE',
          green: '#007F3B',
          warmYellow: '#FFB81C',
        },
        ambulance: {
          green: '#006747',
          battenburgYellow: '#E8F400',
        }
      }
    },
  },
  plugins: [],
}
