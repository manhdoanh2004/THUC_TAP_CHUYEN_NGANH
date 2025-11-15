// import type { Config } from "tailwindcss";
// import defaultTheme from "tailwindcss/defaultTheme";

// const config: Config = {
//   content: [
//     './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/components/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   darkMode: "class",
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['"Satoshi"', ...defaultTheme.fontFamily.sans],
//         // THÊM FONT OUTFIT ĐỂ KHẮC PHỤC LỖI "font-outfit does not exist"
//         outfit: ['"Outfit"', ...defaultTheme.fontFamily.sans],
//       },
//       screens: {
//         "2xsm": "375px",
//         xsm: "425px",
//         "3xl": "2000px",
//       },
//       colors: {
//         current: "currentColor",
//         transparent: "transparent",
//         white: "#FFFFFF",
//         primary: "#5750F1",
//         stroke: "#E6EBF1",
//         "stroke-dark": "#27303E",
//         dark: {
//           DEFAULT: "#111928",
//           2: "#1F2A37",
//           3: "#374151",
//           4: "#4B5563",
//           5: "#6B7280",
//           6: "#9CA3AF",
//           7: "#D1D5DB",
//           8: "#E5E7EB",
//         },
//         gray: {
//           DEFAULT: "#EFF4FB",
//           dark: "#122031",
//           1: "#F9FAFB",
//           2: "#F3F4F6",
//           3: "#E5E7EB",
//           4: "#D1D5DB",
//           5: "#9CA3AF",
//           6: "#6B7280",
//           7: "#374151",
//         },
//         green: {
//           DEFAULT: "#22AD5C",
//           dark: "#1A8245",
//           light: {
//             DEFAULT: "#2CD673",
//             1: "#10B981",
//             2: "#57DE8F",
//             3: "#82E6AC",
//             4: "#ACEFC8",
//             5: "#C2F3D6",
//             6: "#DAF8E6",
//             7: "#E9FBF0",
//           },
//         },
//         red: {
//           DEFAULT: "#F23030",
//           dark: "#E10E0E",
//           light: {
//             DEFAULT: "#F56060",
//             2: "#F89090",
//             3: "#FBC0C0",
//             4: "#FDD8D8",
//             5: "#FEEBEB",
//             6: "#FEF3F3",
//           },
//         },
//         blue: {
//           DEFAULT: "#3C50E0",
//           dark: "#1C3FB7",
//           light: {
//             DEFAULT: "#5475E5",
//             2: "#8099EC",
//             3: "#ADBCF2",
//             4: "#C3CEF6",
//             5: "#E1E8FF",
//           },
//         },
//         orange: {
//           light: {
//             DEFAULT: "#F59460",
//           },
//         },
//         yellow: {
//           dark: {
//             DEFAULT: "#F59E0B",
//             2: "#D97706",
//           },
//           light: {
//             DEFAULT: "#FCD34D",
//             4: "#FFFBEB",
//           },
//         },
//       },
//       fontSize: {
//         "heading-1": ["60px", "72px"],
//         "heading-2": ["48px", "58px"],
//         "heading-3": ["40px", "48px"],
//         "heading-4": ["35px", "45px"],
//         "heading-5": ["28px", "40px"],
//         "heading-6": ["24px", "30px"],
//         "body-2xlg": ["22px", "28px"],
//         "body-sm": ["14px", "22px"],
//         "body-xs": ["12px", "20px"],
//       },
//       spacing: {
//         ...defaultTheme.spacing,
//         4.5: "1.125rem",
//         5.5: "1.375rem",
//         6.5: "1.625rem",
//         7.5: "1.875rem",
//         8.5: "2.125rem",
//         9.5: "2.375rem",
//         10.5: "2.625rem",
//         11: "2.75rem",
//         11.5: "2.875rem",
//         12.5: "3.125rem",
//         13: "3.25rem",
//         13.5: "3.375rem",
//         14: "3.5rem",
//         14.5: "3.625rem",
//         15: "3.75rem",
//         15.5: "3.875rem",
//         16: "4rem",
//         16.5: "4.125rem",
//         17: "4.25rem",
//         17.5: "4.375rem",
//         18: "4.5rem",
//         18.5: "4.625rem",
//         19: "4.75rem",
//         19.5: "4.875rem",
//         21: "5.25rem",
//         21.5: "5.375rem",
//         22: "5.5rem",
//         22.5: "5.625rem",
//         24.5: "6.125rem",
//         25: "6.25rem",
//         25.5: "6.375rem",
//         26: "6.5rem",
//         27: "6.75rem",
//         27.5: "6.875rem",
//         28.5: "7.125rem",
//         29: "7.25rem",
//         29.5: "7.375rem",
//         30: "7.5rem",
//         31: "7.75rem",
//         32.5: "8.125rem",
//         33: "8.25rem",
//         34: "8.5rem",
//         34.5: "8.625rem",
//         35: "8.75rem",
//         36.5: "9.125rem",
//         37.5: "9.375rem",
//         39: "9.75rem",
//         39.5: "9.875rem",
//         40: "10rem",
//         42.5: "10.625rem",
//         44: "11rem",
//         45: "11.25rem",
//         46: "11.5rem",
//         46.5: "11.625rem",
//         47.5: "11.875rem",
//         49: "12.25rem",
//         50: "12.5rem",
//         52: "13rem",
//         52.5: "13.125rem",
//         54: "13.5rem",
//         54.5: "13.625rem",
//         55: "13.75rem",
//         55.5: "13.875rem",
//         59: "14.75rem",
//         60: "15rem",
//         62.5: "15.625rem",
//         65: "16.25rem",
//         67: "16.75rem",
//         67.5: "16.875rem",
//         70: "17.5rem",
//         72.5: "18.125rem",
//         73: "18.25rem",
//         75: "18.75rem",
//         90: "22.5rem",
//         94: "23.5rem",
//         95: "23.75rem",
//         100: "25rem",
//         103: "25.75rem",
//         115: "28.75rem",
//         125: "31.25rem",
//         132.5: "33.125rem",
//         150: "37.5rem",
//         171.5: "42.875rem",
//         180: "45rem",
//         187.5: "46.875rem",
//         203: "50.75rem",
//         230: "57.5rem",
//         242.5: "60.625rem",
//       },
//       maxWidth: {
//         2.5: "0.625rem",
//         3: "0.75rem",
//         4: "1rem",
//         7: "1.75rem",
//         9: "2.25rem",
//         10: "2.5rem",
//         10.5: "2.625rem",
//         11: "2.75rem",
//         13: "3.25rem",
//         14: "3.5rem",
//         15: "3.75rem",
//         16: "4rem",
//         22.5: "5.625rem",
//         25: "6.25rem",
//         30: "7.5rem",
//         34: "8.5rem",
//         35: "8.75rem",
//         40: "10rem",
//         42.5: "10.625rem",
//         44: "11rem",
//         45: "11.25rem",
//         46.5: "11.625rem",
//         60: "15rem",
//         70: "17.5rem",
//         90: "22.5rem",
//         94: "23.5rem",
//         100: "25rem",
//         103: "25.75rem",
//         125: "31.25rem",
//         132.5: "33.125rem",
//         142.5: "35.625rem",
//         150: "37.5rem",
//         180: "45rem",
//         203: "50.75rem",
//         230: "57.5rem",
//         242.5: "60.625rem",
//         270: "67.5rem",
//         280: "70rem",
//         292.5: "73.125rem",
//       },
//       maxHeight: {
//         35: "8.75rem",
//         70: "17.5rem",
//         90: "22.5rem",
//         550: "34.375rem",
//         300: "18.75rem",
//       },
//       minWidth: {
//         22.5: "5.625rem",
//         42.5: "10.625rem",
//         47.5: "11.875rem",
//         75: "18.75rem",
//       },
//       zIndex: {
//         999999: "999999",
//         99999: "99999",
//         9999: "9999",
//         999: "999",
//         99: "99",
//         9: "9",
//         1: "1",
//       },
//       opacity: {
//         65: ".65",
//       },
//       aspectRatio: {
//         "4/3": "4 / 3",
//         "21/9": "21 / 9",
//       },
//       backgroundImage: {
//         video: "url('../images/video/video.png')",
//       },
//       content: {
//         "icon-copy": 'url("../images/icon/icon-copy-alt.svg")',
//       },
//       transitionProperty: { width: "width", stroke: "stroke" },
//       borderWidth: {
//         6: "6px",
//         10: "10px",
//         12: "12px",
//       },
//       boxShadow: {
//         default: "0px 4px 7px 0px rgba(0, 0, 0, 0.14)",
//         error: "0px 12px 34px 0px rgba(13, 10, 44, 0.05)",
//         card: "0px 1px 2px 0px rgba(0, 0, 0, 0.12)",
//         "card-2": "0px 8px 13px -3px rgba(0, 0, 0, 0.07)",
//         "card-3": "0px 2px 3px 0px rgba(183, 183, 183, 0.50)",
//         "card-4": "0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
//         "card-5": "0px 1px 3px 0px rgba(0, 0, 0, 0.13)",
//         "card-6": "0px 3px 8px 0px rgba(0, 0, 0, 0.08)",
//         "card-7": "0px 0.5px 3px 0px rgba(0, 0, 0, 0.18)",
//         "card-8": "0px 1px 2px 0px rgba(0, 0, 0, 0.10)",
//         "card-9": "0px 1px 3px 0px rgba(0, 0, 0, 0.08)",
//         "card-10": "0px 2px 3px 0px rgba(0, 0, 0, 0.10)",
//         switcher:
//           "0px 2px 4px rgba(0, 0, 0, 0.2), inset 0px 2px 2px #FFFFFF, inset 0px -1px 1px rgba(0, 0, 0, 0.1)",
//         "switch-1": "0px 0px 4px 0px rgba(0, 0, 0, 0.10)",
//         "switch-2": "0px 0px 5px 0px rgba(0, 0, 0, 0.15)",
//         datepicker: "-5px 0 0 #1f2a37, 5px 0 0 #1f2a37",
//         1: "0px 1px 2px 0px rgba(84, 87, 118, 0.12)",
//         2: "0px 2px 3px 0px rgba(84, 87, 118, 0.15)",
//         3: "0px 8px 8.466px 0px rgba(113, 116, 152, 0.05), 0px 8px 16.224px 0px rgba(113, 116, 152, 0.07), 0px 18px 31px 0px rgba(113, 116, 152, 0.10)",
//         4: "0px 13px 40px 0px rgba(13, 10, 44, 0.22), 0px -8px 18px 0px rgba(13, 10, 44, 0.04)",
//         5: "0px 10px 30px 0px rgba(85, 106, 235, 0.12), 0px 4px 10px 0px rgba(85, 106, 235, 0.04), 0px -18px 38px 0px rgba(85, 106, 235, 0.04)",
//         6: "0px 12px 34px 0px rgba(13, 10, 44, 0.08), 0px 34px 26px 0px rgba(13, 10, 44, 0.05)",
//         7: "0px 18px 25px 0px rgba(113, 116, 152, 0.05)",
//       },
//       dropShadow: {
//         card: "0px 8px 13px rgba(0, 0, 0, 0.07)",
//         1: "0px 1px 0px #E2E8F0",
//         2: "0px 1px 4px rgba(0, 0, 0, 0.12)",
//         3: "0px 0px 4px rgba(0, 0, 0, 0.15)",
//         4: "0px 0px 2px rgba(0, 0, 0, 0.2)",
//         5: "0px 1px 5px rgba(0, 0, 0, 0.2)",
//       },
//       keyframes: {
//         linspin: {
//           "100%": { transform: "rotate(360deg)" },
//         },
//         easespin: {
//           "12.5%": { transform: "rotate(135deg)" },
//           "25%": { transform: "rotate(270deg)" },
//           "37.5%": { transform: "rotate(405deg)" },
//           "50%": { transform: "rotate(540deg)" },
//           "62.5%": { transform: "rotate(675deg)" },
//           "75%": { transform: "rotate(810deg)" },
//           "87.5%": { transform: "rotate(945deg)" },
//           "100%": { transform: "rotate(1080deg)" },
//         },
//         "left-spin": {
//           "0%": { transform: "rotate(130deg)" },
//           "50%": { transform: "rotate(-5deg)" },
//           "100%": { transform: "rotate(130deg)" },
//         },
//         "right-spin": {
//           "0%": { transform: "rotate(-130deg)" },
//           "50%": { transform: "rotate(5deg)" },
//           "100%": { transform: "rotate(-130deg)" },
//         },
//         rotating: {
//           "0%, 100%": { transform: "rotate(360deg)" },
//           "50%": { transform: "rotate(0deg)" },
//         },
//         topbottom: {
//           "0%, 100%": { transform: "translate3d(0, -100%, 0)" },
//           "50%": { transform: "translate3d(0, 0, 0)" },
//         },
//         bottomtop: {
//           "0%, 100%": { transform: "translate3d(0, 0, 0)" },
//           "50%": { transform: "translate3d(0, -100%, 0)" },
//         },
//         line: {
//           "0%, 100%": { transform: "translateY(0)" },
//           "50%": { transform: "translateY(100%)" },
//         },
//         "line-revert": {
//           "0%, 100%": { transform: "translateY(100%)" },
//           "50%": { transform: "translateY(0)" },
//         },
//       },
//       animation: {
//         linspin: "linspin 1568.2353ms linear infinite",
//         easespin: "easespin 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both",
//         "left-spin":
//           "left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both",
//         "right-spin":
//           "right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both",
//         "ping-once": "ping 5s cubic-bezier(0, 0, 0.2, 1)",
//         rotating: "rotating 30s linear infinite",
//         topbottom: "topbottom 60s infinite alternate linear",
//         bottomtop: "bottomtop 60s infinite alternate linear",
//         "spin-1.5": "spin 1.5s linear infinite",
//         "spin-2": "spin 2s linear infinite",
//         "spin-3": "spin 3s linear infinite",
//         line1: "line 10s infinite linear",
//         line2: "line-revert 8s infinite linear",
//         line3: "line 7s infinite linear",
//       },
//     },
//   },
//   plugins: [],
// };
// export default config;
/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  // Đảm bảo Tailwind quét các file sau để tìm và tạo ra các utility class.
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Thêm đường dẫn chung nếu cần
  ],
  // Thiết lập chế độ Dark Mode
  darkMode: 'class',

  theme: {
    // Breakpoints không phải là override, nên đặt trong extend.screens
    // để thêm các breakpoint mới như '2xsm', '3xl'.
    extend: {
      // 1. CHUYỂN ĐỔI @theme (Màu sắc, Font, Breakpoints, Shadows, Z-Index)
      
      // Chuyển đổi --breakpoint-* sang screens
      screens: {
        '2xsm': '375px',
        'xsm': '425px',
        '3xl': '2000px',
        // sm, md, lg, xl, 2xl đã có sẵn, nhưng đặt ở đây để đảm bảo giá trị đúng
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

      // Chuyển đổi --font-* sang fontFamily
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
      },

      // Chuyển đổi --text-* sang fontSize
      // Định dạng: 'className': [fontSize, { lineHeight: lineHeight }]
      fontSize: {
        'title-2xl': ['72px', { lineHeight: '90px' }],
        'title-xl': ['60px', { lineHeight: '72px' }],
        'title-lg': ['48px', { lineHeight: '60px' }],
        'title-md': ['36px', { lineHeight: '44px' }],
        'title-sm': ['30px', { lineHeight: '38px' }],
        'theme-xl': ['20px', { lineHeight: '30px' }],
        'theme-sm': ['14px', { lineHeight: '20px' }],
        'theme-xs': ['12px', { lineHeight: '18px' }],
      },
      
      // Chuyển đổi --color-* sang colors
      colors: {
        'current': 'currentColor',
        'transparent': 'transparent',
        'white': '#ffffff',
        'black': '#101828',
        
        // Brand Colors
        'brand': {
          '25': '#f2f7ff',
          '50': '#ecf3ff',
          '100': '#dde9ff',
          '200': '#c2d6ff',
          '300': '#9cb9ff',
          '400': '#7592ff',
          '500': '#465fff', // --color-brand-500
          '600': '#3641f5',
          '700': '#2a31d8',
          '800': '#252dae',
          '900': '#262e89',
          '950': '#161950',
        },

        // Blue Light Colors
        'blue-light': {
          '25': '#f5fbff',
          '50': '#f0f9ff',
          '100': '#e0f2fe',
          '200': '#b9e6fe',
          '300': '#7cd4fd',
          '400': '#36bffa',
          '500': '#0ba5ec',
          '600': '#0086c9',
          '700': '#026aa2',
          '800': '#065986',
          '900': '#0b4a6f',
          '950': '#062c41',
        },

        // Gray Colors
        'gray': {
          '25': '#fcfcfd',
          '50': '#f9fafb',
          '100': '#f2f4f7',
          '200': '#e4e7ec',
          '300': '#d0d5dd',
          '400': '#98a2b3',
          '500': '#667085',
          '600': '#475467',
          '700': '#344054',
          '800': '#1d2939',
          '900': '#101828',
          '950': '#0c111d',
          'dark': '#1a2231', // --color-gray-dark
        },

        // Orange Colors
        'orange': {
          '25': '#fffaf5',
          '50': '#fff6ed',
          '100': '#ffead5',
          '200': '#fddcab',
          '300': '#feb273',
          '400': '#fd853a',
          '500': '#fb6514',
          '600': '#ec4a0a',
          '700': '#c4320a',
          '800': '#9c2a10',
          '900': '#7e2410',
          '950': '#511c10',
        },

        // Success Colors
        'success': {
          '25': '#f6fef9',
          '50': '#ecfdf3',
          '100': '#d1fadf',
          '200': '#a6f4c5',
          '300': '#6ce9a6',
          '400': '#32d583',
          '500': '#12b76a',
          '600': '#039855',
          '700': '#027a48',
          '800': '#05603a',
          '900': '#054f31',
          '950': '#053321',
        },

        // Error Colors
        'error': {
          '25': '#fffbfa',
          '50': '#fef3f2',
          '100': '#fee4e2',
          '200': '#fecdca',
          '300': '#fda29b',
          '400': '#f97066',
          '500': '#f04438',
          '600': '#d92d20',
          '700': '#b42318',
          '800': '#912018',
          '900': '#7a271a',
          '950': '#55160c',
        },

        // Warning Colors
        'warning': {
          '25': '#fffcf5',
          '50': '#fffaeb',
          '100': '#fef0c7',
          '200': '#fedf89',
          '300': '#fec84b',
          '400': '#fdb022',
          '500': '#f79009',
          '600': '#dc6803',
          '700': '#b54708',
          '800': '#93370d',
          '900': '#7a2e0e',
          '950': '#4e1d09',
        },

        // Theme-specific colors
        'theme-pink-500': '#ee46bc',
        'theme-purple-500': '#7a5af8',
      },

      // Chuyển đổi --shadow-* sang boxShadow
      boxShadow: {
        'theme-md': '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
        'theme-lg': '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
        'theme-sm': '0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)',
        'theme-xs': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        'theme-xl': '0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
        'datepicker': '-5px 0 0 #262d3c, 5px 0 0 #262d3c',
        'focus-ring': '0px 0px 0px 4px rgba(70, 95, 255, 0.12)',
        'slider-navigation': '0px 1px 2px 0px rgba(16, 24, 40, 0.1), 0px 1px 3px 0px rgba(16, 24, 40, 0.1)',
        'tooltip': '0px 4px 6px -2px rgba(16, 24, 40, 0.05), -8px 0px 20px 8px rgba(16, 24, 40, 0.05)',
      },

      // Chuyển đổi --drop-shadow-* sang dropShadow
      dropShadow: {
        '4xl': '0 35px 35px rgba(0, 0, 0, 0.25), 0 45px 65px rgba(0, 0, 0, 0.15)',
      },

      // Chuyển đổi --z-index-* sang zIndex
      zIndex: {
        '1': '1',
        '9': '9',
        '99': '99',
        '999': '999',
        '9999': '9999',
        '99999': '99999',
        '999999': '999999',
      },
    },
  },
  plugins: [
    // 2. CHUYỂN ĐỔI @utility VÀ @custom-variant SANG PLUGIN
    plugin(function ({ addUtilities, addVariant }) {
      // Chuyển đổi @custom-variant dark (&:is(.dark *));
      // Tạo biến thể 'dark-child' để áp dụng class khi phần tử là con của .dark
      addVariant('dark-child', '&:is(.dark &)');

      // Chuyển đổi tất cả @utility sang addUtilities
      const newUtilities = {
        '.menu-item': {
          '@apply': 'relative flex items-center w-full px-3 py-2 font-medium rounded-lg text-theme-sm',
        },
        '.menu-item-active': {
          '@apply': 'bg-brand-50 text-brand-500 dark:bg-brand-500/[0.12] dark:text-brand-400',
        },
        '.menu-item-inactive': {
          '@apply': 'text-gray-700 hover:bg-gray-100 group-hover:text-gray-700 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gray-300',
        },
        '.menu-item-icon': {
          '@apply': 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400',
        },
        '.menu-item-icon-active': {
          '@apply': 'text-brand-500 dark:text-brand-400',
        },
        '.menu-item-icon-inactive': {
          '@apply': 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300',
        },
        '.menu-item-arrow': {
          '@apply': 'relative',
        },
        '.menu-item-arrow-active': {
          '@apply': 'rotate-180 text-brand-500 dark:text-brand-400',
        },
        '.menu-item-arrow-inactive': {
          '@apply': 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300',
        },
        '.menu-dropdown-item': {
          // Lưu ý: Tailwind đã có gap-3. Nếu bạn vẫn muốn định nghĩa này, nó sẽ dùng đúng gap-3
          '@apply': 'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-theme-sm font-medium',
        },
        '.menu-dropdown-item-active': {
          '@apply': 'bg-brand-50 text-brand-500 dark:bg-brand-500/[0.12] dark:text-brand-400',
        },
        '.menu-dropdown-item-inactive': {
          '@apply': 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5',
        },
        '.menu-dropdown-badge': {
          '@apply': 'block rounded-full px-2.5 py-0.5 text-xs font-medium uppercase text-brand-500 dark:text-brand-400',
        },
        '.menu-dropdown-badge-active': {
          '@apply': 'bg-brand-100 dark:bg-brand-500/20',
        },
        '.menu-dropdown-badge-inactive': {
          '@apply': 'bg-brand-50 group-hover:bg-brand-100 dark:bg-brand-500/15 dark:group-hover:bg-brand-500/20',
        },
        '.no-scrollbar': {
          /* Chrome, Safari and Opera */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none', /* Firefox */
        },
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            '@apply': 'size-1.5',
          },
          '&::-webkit-scrollbar-track': {
            '@apply': 'rounded-full',
          },
          '&::-webkit-scrollbar-thumb': {
            '@apply': 'bg-gray-200 rounded-full dark:bg-gray-700',
          },
        },
      };

      addUtilities(newUtilities);
    }),
  ],
};

export default config;
