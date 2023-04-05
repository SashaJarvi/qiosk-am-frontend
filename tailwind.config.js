/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-default": "#4f4cee",
        "grey-4": "#bdbdbd",
        lighter: "#378fe9",
        darker: "#004182",
        "yellow-base": "rgb(241, 220, 100)",
        "yellow-base-dark": "rgb(190, 169, 96)",
        "black-base": "rgb(34, 40, 48)",
      },
      fontFamily: {
        grotesk: "Cabinet Grotesk, sans-serif",
        caveat: "Caveat, sans-serif",
      },
    },
  },
  plugins: [],
};
