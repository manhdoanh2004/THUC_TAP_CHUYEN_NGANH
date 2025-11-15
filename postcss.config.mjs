/** @type {import('postcss-load-config').Config} */
const config = {
 // Sử dụng @tailwindcss/postcss plugin (cú pháp mới cho v4)
  plugins: {
    '@tailwindcss/postcss': {},
    'autoprefixer': {}
  }
};

export default config;
