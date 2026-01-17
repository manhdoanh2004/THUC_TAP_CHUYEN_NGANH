// /* eslint-disable react/jsx-no-undef */
import { AuthenProvider } from '@/context/AuthContext';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';


import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bevietnam', // Khớp với biến trong CSS nếu cần
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${beVietnamPro.className} dark:bg-gray-900`}>
       
       <AuthenProvider>

        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>

       </AuthenProvider>
 
      
       
      </body>
    </html>
  );
}
