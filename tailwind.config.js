/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#0B0F19',
        panel: '#151A2D',
        accent: {
          blue: '#3B82F6',
          green: '#10B981',
          purple: '#8B5CF6'
        },
        textMain: '#F8FAFC'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
