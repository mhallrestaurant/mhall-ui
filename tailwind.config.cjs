module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue,html}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        xl: ['1.05rem', { lineHeight: '1.4' }],
        '2xl': ['1.2rem', { lineHeight: '1.3' }],
        '3xl': ['1.4rem', { lineHeight: '1.2' }],
        '4xl': ['1.6rem', { lineHeight: '1.15' }],
        '5xl': ['1.9rem', { lineHeight: '1.1' }],
        '6xl': ['2.15rem', { lineHeight: '1.05' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.15rem',
        '4xl': '1.35rem',
      },
      spacing: {
        px: '1px',
        0.5: '0.125rem',
        1: '0.25rem',
        1.5: '0.35rem',
        2: '0.5rem',
        2.5: '0.65rem',
        3: '0.75rem',
        4: '0.85rem',
        5: '1.05rem',
        6: '1.25rem',
        7: '1.45rem',
        8: '1.6rem',
        9: '1.8rem',
        10: '2rem',
        12: '2.3rem',
        14: '2.6rem',
        16: '3rem',
        20: '3.8rem',
        24: '4.6rem',
        28: '5.2rem',
        32: '6rem',
      },
      maxWidth: {
        '7xl': '72rem',
      },
      boxShadow: {
        card: '0 12px 32px rgba(15, 23, 42, 0.08)',
        '2xl': '0 14px 34px rgba(15,23,42,0.08)',
        '3xl': '0 16px 38px rgba(15,23,42,0.1)',
      },
    },
  },
  plugins: [],
}
