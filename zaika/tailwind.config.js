/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — off-white/cream ground + dark forest green accent.
        // No pink, no black-heavy sections (that was Dil Se's look, not ours).
        cream: {
          DEFAULT: '#FAF7F0', // primary background
          100: '#FFFDF8',
          200: '#F3EEE2', // subtle card / alt-section tint
          300: '#E8E0CE', // borders / dividers
        },
        forest: {
          DEFAULT: '#1F4A3A', // primary accent — buttons, headings, dividers
          600: '#1A3F31',
          700: '#153328', // hover / deep
          800: '#0F261D',
        },
        leaf: '#4E9C6E', // small green flourish / highlight accent
        ink: '#20221E', // near-black body text (warm, not pure #000)
      },
      fontFamily: {
        serif: ['Fraunces', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Work Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}
