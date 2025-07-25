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
        roboto: ['Roboto']
      },
      colors: {
        white: '#F7F7FE',
        light: '#B2B2FF',
        blue: '#4D4DFF', 
        dark: '#27273F',
        'dark-stroke': '#3A3A5F',
        'gray-100': '#C9CDD1',
        'gray-200': '#CFD3D7',
        'gray-300': '#979B9F',
        'gray-400': '#787c81ff',
        'gray-500': '#65696D',
        'gray-600': '#575b5eff',
        'gray-700': '#33373B',
        'gray-800': '#1C1F21',
        'gray-900': '#1C1F21',
        black: '#121212',
        CalenderRed: '#E50000',
        CalenderBlue: '#224CF1',
      },
    },
  },
  plugins: [],
};