/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1BC4EA",
        success: "#009C6A",
        info: "#026FD5",
        danger: "#D7131F",
        text: {
          primary: "#222221",
          secondary: "#616161",
        },
        background: {
          primary: "#F6F6F6",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        regular: ["Montserrat-Regular"],
        medium: ["Montserrat-Medium"],
        semibold: ["Montserrat-SemiBold"],
      },
    },
  },
  plugins: [],
};
