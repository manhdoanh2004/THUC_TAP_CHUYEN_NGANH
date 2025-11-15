// /* eslint-disable react/jsx-no-undef */
// import type { Metadata } from "next";
// import "./globals.css";


// export const metadata: Metadata = {
//   title: "ITJobs",
//   description: "Trang web tuyển dụng IT hàng đầu Việt Nam.",
// };

// export default async function  RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
 
//   return (
//     <html lang="vi" suppressHydrationWarning>
//       <body>
   
    

//               {children}

        
    

//       </body>
//     </html>
//   );
// }

import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
