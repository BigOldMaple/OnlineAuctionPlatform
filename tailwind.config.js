module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths if your project structure is different
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
