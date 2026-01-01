/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "luxury-gold": "var(--luxury-gold)",
        "luxury-copper": "var(--luxury-copper)",
        "warm-beige": "var(--warm-beige)",
        "soft-gray": "var(--soft-gray)",
        charcoal: "var(--charcoal)",
        "gold-accent": "#D4AF37",
        copper: "#B87333",
      },
    },
  },
  plugins: [],
};
