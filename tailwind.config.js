/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.tsx",
    "./src/components/**/*.tsx",
    "./src/app/**/*.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: "var(--font-roboto)",
        alt: "var(--font-rubik)",
      },
    },
  },
  plugins: [],
};
