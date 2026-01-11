/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [infoUser, setInfoUser] = useState<any>(null);
  const [infoCompany, setInfoCompany] = useState<any>(null);
  const [infoAdmin, setInfoAdmin] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  
  const pathname = usePathname();

  useEffect(() => {
    // Xác định endpoint dựa trên đường dẫn URL để tránh gọi sai mục đích
    // Ví dụ: Nếu ở trang /admin thì gọi check-admin, ngược lại gọi check
    const endpoint = pathname.startsWith('/admin') ? '/auth/check-admin' : '/auth/check';

    fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.code === "error") {
          setIsLogin(false);
          setInfoUser(null);
          setInfoCompany(null);
          setInfoAdmin(null);
          setRole(null);
        } else {
          const user = data.result;
          setIsLogin(true);
          setRole(user.role);

          // Phân loại thông tin theo Role
          if (user.role === "ROLE_CANDIDATE") {
            setInfoUser(user);
            setInfoCompany(null);
            setInfoAdmin(null);
          } else if (user.role === "ROLE_EMPLOYER") {
            setInfoCompany(user);
            setInfoUser(null);
            setInfoAdmin(null);
          } else {
            setInfoAdmin(user);
            setInfoUser(null);
            setInfoCompany(null);
          }
        }
      })
      .catch(() => setIsLogin(false));
  }, [pathname]); // Chỉ chạy lại khi đổi trang

  return { isLogin, infoUser, infoCompany, infoAdmin, role };
};