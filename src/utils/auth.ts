// pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    // Đây là nơi bạn cấu hình các nhà cung cấp dịch vụ (Providers)
    providers:[
        GoogleProvider({
            // Đảm bảo rằng bạn đã định nghĩa các biến môi trường này trong file .env.local
            clientId: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
            clientSecret:`${ process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}`,
        }),
    ],
    // Bạn có thể thêm các cấu hình khác như database, callbacks, pages, v.v. ở đây
};

// Export hàm NextAuth với cấu hình đã tạo
export default NextAuth(authOptions);