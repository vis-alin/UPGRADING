module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: "#00ffff",
      },
      boxShadow: {
        neon: "0 0 15px #00ffff, 0 0 30px #00ffff",
        "neon-hover": "0 0 25px #00ffff, 0 0 50px #00ffff",
      },
    },
  },
  plugins: [],
};
