/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        "3xl": "rgba(0, 0, 0, 0.3) 0px 16px 24px 0px, rgba(0, 0, 0, 0.2) 0px 6px 8px 0px",
        "4xl": "rgba(0, 0, 0, 0.5) 0px 4px 60px 0px",
      }
    },
  },
  plugins: [],
}
