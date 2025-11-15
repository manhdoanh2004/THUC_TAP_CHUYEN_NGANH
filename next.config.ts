import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Thêm mục 'images' nếu chưa có
  images: {
    // Thêm tên miền của Cloudinary vào đây
    domains: [
      'res.cloudinary.com',
      // Thêm các tên miền ảnh bên ngoài khác của bạn nếu có
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
