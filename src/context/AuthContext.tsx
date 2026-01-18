'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const useAuthContext = createContext<any | undefined>(undefined);

export const AuthenProvider=({children}:{children:React.ReactNode})=>{
const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [infoUser, setInfoUser] = useState<any>(null);
  const [infoCompany, setInfoCompany] = useState<any>(null);
  const [infoAdmin, setInfoAdmin] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const pathname = usePathname();
const checkAuth = async () => {
  setIsLoading(true);
  const endpoint = window.location.pathname.startsWith('/admin') ? '/auth/check-admin' : '/auth/check';
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (data.code !== "error") {
      const user = data.result;
      setIsLogin(true);
      setRole(user.role);
      if (user.role === "ROLE_CANDIDATE") setInfoUser(user);
      else if (user.role === "ROLE_EMPLOYER") setInfoCompany(user);
      else setInfoAdmin(user);
    } else {
      setIsLogin(false);
      setInfoAdmin(null);
    }
  } catch (error:unknown) {
    console.log(error)
    setIsLogin(false);
  } finally {
    setIsLoading(false);
  }
};
  useEffect(() => {
    // Xác định endpoint dựa trên đường dẫn URL để tránh gọi sai mục đích
    // Ví dụ: Nếu ở trang /admin thì gọi check-admin, ngược lại gọi check
     checkAuth()
  }, [pathname]); // Chỉ chạy lại khi đổi trang
 
     return (
    <useAuthContext.Provider value={{ isLogin, infoUser, infoCompany, infoAdmin, role ,isLoading,checkAuth}}>
      {children}
    </useAuthContext.Provider>
  );
}




export const useAuth = () => {
  const context = useContext(useAuthContext);
  if (!context) throw new Error("useNotifications must be used within UseAuthProvider");
  return context;
};