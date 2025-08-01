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
        'light-stroke': '#CCCCFF',
        'light-button': '#CCCCFF',
        blue: '#4D4DFF', 
        dark: '#27273F',
        'dark-stroke': '#3A3A5F',
        'gray-100': '#C9CDD1',
        'gray-200': '#CFD3D7',
<<<<<<< HEAD
        'gray-300': '#B6BABE',
        'gray-400': '#9DA1A5', 
        'gray-500': '#84888C',
        'gray-600': '#6B6F73', 
        'gray-700': '#52565A',
        'gray-800': '#33373B',
        'gray-900': '#1C1F21', 
=======
        'gray-300': '#979B9F',
        'gray-400': '#9DA1A5',
        'gray-500': '#65696D',
        'gray-600': '#6B6F73',
        'gray-700': '#33373B',
        'gray-750': '#52565A',
        'gray-800': '#33373B',
        'gray-900': '#1C1F21',
>>>>>>> b80b707072dcb2f6fc9816bb35512cd07ba69ba2
        black: '#121212',
        CalenderRed: '#E50000',
        CalenderBlue: '#224CF1',
      },
    },
  },
  plugins: [],
};