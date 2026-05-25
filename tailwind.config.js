/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
        slideInLeft: "slideInLeft 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        glow: "glow 3s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          from: {
            opacity: "0",
            transform: "translateY(16px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideInLeft: {
          from: {
            opacity: "0",
            transform: "translateX(-12px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(14, 165, 233, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 0 8px rgba(14, 165, 233, 0)",
          },
        },
      },
    },
  },
  plugins: [],
};
