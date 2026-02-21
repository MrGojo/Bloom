/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pcos: {
          background: '#FDE2F3',
          primary: '#D8B4F8',
          'primary-foreground': '#4A3B5E',
          secondary: '#E5D4FF',
          'secondary-foreground': '#5D4578',
          accent: '#FFFFFF',
          'accent-foreground': '#7A5C9E',
          text: '#5D4578',
          'text-muted': '#9CA3AF',
          success: '#A7F3D0',
          error: '#FDA4AF',
          card: '#FFFFFF',
          border: '#F3E8FF',
        },
      },
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        'pcos': '2rem',
        'pcos-xl': '3rem',
      },
      boxShadow: {
        'pcos-card': '0 10px 30px -10px rgba(216, 180, 248, 0.3)',
        'pcos-button': '0 4px 14px 0 rgba(216, 180, 248, 0.39)',
      },
      animation: {
        'heart-beat': 'heartbeat 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}