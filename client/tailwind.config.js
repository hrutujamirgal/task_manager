/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      purple: "#3f3cbb",
      midnight: "#040268",
      navyblue: "#0e1296",
      tahiti: "#3ab7bf",
      silver: "#ecebff",
      "bubble-gum": "#ff77e9",
      slate: "#a3acab",
      borderBlack: "#0a0b29",
      borderOpa: "#9fc5e8",
      dangerRed: "#e5454b",
      dangerfade: "#e48286",
      navyFade: "#3b3d99",
      blackFade: "#17181d",
      black: "#000000",
      blue: "#060d30",
      lightBlue: "#75b9e7",
      veryLightBlue: "#b1cde1",
      green: "#64aff4",
      red: "#fa2f2f",
    },
    extend: {
      boxShadow: {
        "purple-blue": "0.3em 0.3em 1em rgb(83 64 227 / 60%);",
        "blue-back": "0.3em 0.3em 1em rgb(7 9 102 / 30%);",
      },
    },
  },
  plugins: [],
};
