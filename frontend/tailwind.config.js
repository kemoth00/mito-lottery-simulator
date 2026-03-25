/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'lottery-teal': '#A5D9C8',
        'lottery-bg': '#F2F2F2',
        'lottery-cream': '#F6F0C6',
        'lottery-dark': '#020056',
        'lottery-navy': '#1a1f5e',
      },
      backgroundImage: {
        'lottery-header':
          'linear-gradient(270deg, #F6F0C6 0%, #D9135D 0.01%, rgba(214, 19, 92, 0.996895) 0.02%, #F6F0C6 0.03%, #A6D9C8 80.73%, #A5D9C8 100%)',
      },
      boxShadow: {
        card: '2px 2px 10px 0px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        card: '24px',
      },
    },
  },
  plugins: [],
}
