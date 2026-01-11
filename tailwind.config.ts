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
  'bevietnam': ['"Be Vietnam Pro"', 'sans-serif'],
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
