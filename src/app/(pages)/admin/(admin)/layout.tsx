"use client";

import { useAuth } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationAdminContext";
import { useSidebar } from "@/context/SidebarContext";

import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
 const {  isLogin , infoAdmin,isLoading} = useAuth();
     const router = useRouter();
    useEffect(() => {
  if (!isLoading && infoAdmin === null) {
    router.push("/admin/login");
  }
}, [infoAdmin, isLoading, router]);

   
  
  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";
     if(!infoAdmin) return <><div className="flex items-center justify-center min-h-[200px] w-full">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div></>
  return (
    <>
    {isLogin?(<>
     <NotificationProvider>
        <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
     </NotificationProvider>
   
    </>):(<></>)}
    </>
   
  );
}
