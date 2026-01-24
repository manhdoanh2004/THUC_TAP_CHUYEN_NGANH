import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Thêm mục 'images' nếu chưa có
  output: 'standalone',
  images: {
    // Thêm tên miền của Cloudinary vào đây
    domains: [
      'res.cloudinary.com',
      // Thêm các tên miền ảnh bên ngoài khác của bạn nếu có
      'via.placeholder.com', // Tên miền bạn cần thêm để fix lỗi
      // Nếu có các tên miền khác (ví dụ: firebase storage, cloudinary, v.v.), hãy thêm vào đây
      // 'example.com', 
      // 'cdn.anotherdomain.com',
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  reactStrictMode:false
};

export default nextConfig;
