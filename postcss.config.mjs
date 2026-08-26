/** Tailwind v4 uses the dedicated PostCSS package, never the `tailwindcss` plugin directly. */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
