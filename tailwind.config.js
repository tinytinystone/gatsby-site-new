/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    fontFamily: {
      sans: [
        'Noto Sans',
        'Noto Sans TC',
        'Noto Sans KR',
        'Noto Sans Thai',
        'sans-serif',
      ],
    },
    letterSpacing: {
      DEFAULT: '-0.03em',
    },
    extend: {
      colors: {
        sky: {
          100: '#f5faff',
          200: '#48a2eb33',
          300: '#48a2eb4d',
          400: '#48a2eb80',
          500: '#48a2eb',
          600: '#2282da',
        },
        blue: {
          100: '#eff8ff',
          200: '#0071ce33',
          300: '#0071ce4d',
          400: '#0071ce80',
          500: '#0071ce',
          600: '#1a58b5',
        },
        pink: {
          100: '#fff5f8',
          200: '#f44d7833',
          300: '#f44d784d',
          400: '#f44d7880',
          500: '#f44d78',
          600: '#e12555',
        },
        yellow: {
          100: '#fff2df',
          200: '#ff990033',
          300: '#ff99004d',
          400: '#ff990080',
          500: '#ff9900',
          600: '#f47500',
        },
        green: {
          100: '#e5f4ec',
          200: '#00994433',
          300: '#0099444d',
          400: '#00994480',
          500: '#009944',
          600: '#127c56',
        },
        grey: {
          100: '#f8f8f8',
          200: '#e7eaec',
          300: '#bbbdc3',
          400: '#606366',
          500: '#2d2f31',
        },
        greydetail: {
          100: '#afafaf',
        },
        white: {
          100: '#ffffff1a',
          200: '#ffffff33',
          300: '#ffffff4d',
          400: '#ffffff80',
          500: '#ffffff',
        },
      },
      fontSize: {
        30: ['30px', '30px'],
        27: ['27px', '27px'],
        24: ['24px', '24px'],
        21: ['21px', '21px'],
        18: ['18px', '18px'],
        16: ['16px', '16px'],
        14: ['14px', '14px'],
        13: ['13px', '13px'],
        12: ['12px', '12px'],
        10: ['10px', '10px'],
      },
    },
  },
  plugins: [],
};
