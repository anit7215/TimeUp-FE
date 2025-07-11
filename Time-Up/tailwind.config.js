/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
     
      fontFamily: {
        pretendard: ['Pretendard-Regular'],
        'pretendard-bold': ['Pretendard-Bold'],
        'pretendard-medium': ['Pretendard-Medium'],
      },
      colors: {
        white: '#F7F7FE',
        light: '#B2B2FF',
        blue: '#4D4DFF', 
        'gray-300': '#979B9F',
        'gray-500': '#65696D',
        'gray-700': '#33373B',
        'gray-800': '#1C1F21',
        black: '#121212',
      },
    },
  },
  plugins: [],
};