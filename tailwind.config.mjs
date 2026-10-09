/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm off-white background, charcoal text, deep gold/amber accent.
        cream: '#faf7f2',
        paper: '#ffffff',
        charcoal: '#1f1d1a',
        ink: '#2b2824',
        muted: '#6b6459',
        gold: {
          DEFAULT: '#c8941f',
          dark: '#a9791a',
          light: '#e7b34a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(31,29,26,0.04), 0 8px 24px rgba(31,29,26,0.06)',
        cardHover: '0 2px 4px rgba(31,29,26,0.06), 0 16px 40px rgba(31,29,26,0.10)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};
