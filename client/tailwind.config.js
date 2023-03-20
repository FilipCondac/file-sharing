module.exports = {
  purge: ["./src/**/*.{ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        Raleway: ["Raleway", "sans-serif"],
      },
      colors: {
        primarycolor: {
          dark: "#03001C",
          dark2: "#19003c",
          purple: "#301E67",
          light: "#5B8FB9",
          lightest: "#B6EADA",
        },
      },
      boxShadow: {
        "3xl": "0 35px 60px -15px rgba(5, 5, 5, 0.3)",
      },
      screens: {
        sm: { min: "576px", max: "767px" },
        md: { min: "768px", max: "991px" },
        lg: { min: "992px", max: "1199px" },
        xl: { min: "1200px" },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
