module.exports = {
  purge: ["./src/**/*.{ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        yellow: {
          light: "#FFC26D",
        },
      },
      boxShadow: {
        "3xl": "0 35px 60px -15px rgba(5, 5, 5, 0.3)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
