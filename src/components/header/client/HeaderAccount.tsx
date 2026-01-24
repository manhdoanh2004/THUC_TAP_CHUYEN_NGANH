/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import avatarDefault from "../../../../public/avatarDefault.png"
import NotificationBell from "@/components/modal/NotificationBell";
import { useAuth } from "@/context/AuthContext";

export const HeaderAccount = () => {
  const pathname = usePathname();
  const { isLogin, infoUser, infoCompany } = useAuth();
  const router = useRouter();

const hasPackage = infoCompany?.currentVipPackage? infoCompany?.currentVipPackage.code!=='DEFAULT'? true:false : false;
  const handleLogout = (url: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      credentials: "include",
      method: "POST"
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == "success") {
          router.push(url);
        }
      });
  }

  return (
    <div className="inline-flex items-center gap-x-5 text-white font-[600] sm:text-[16px] text-[12px] relative">
      {isLogin ? (
        <>
          <NotificationBell userId={infoUser?.email || infoCompany?.email} />

          {/* Cụm USER */}
          {infoUser && (
            <div className="relative group/user flex items-center gap-x-3 cursor-pointer">
              <div className="w-10 h-10 overflow-hidden rounded-full border border-gray-300 flex-shrink-0">
                <Image
                  width={40}
                  height={40}
                  src={infoUser?.avatar || avatarDefault}
                  alt="avatar user"
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* CSS CẮT CHỮ: Cố định độ rộng tối đa */}
              <span 
                className="inline-block max-w-[80px] sm:max-w-[150px] truncate align-middle whitespace-nowrap" 
                title={infoUser.fullName}
              >
                {infoUser.fullName}
              </span>

              <ul className="absolute top-full right-0 w-[200px] bg-[#000065] hidden group-hover/user:block z-[999] shadow-xl pt-2">
                <li className="py-[10px] px-[16px] hover:bg-[#000096]">
                  <Link href="/user-manage/profile" className="block text-white">Thông tin cá nhân</Link>
                </li>
                <li className="py-[10px] px-[16px] hover:bg-[#000096]">
                  <Link href="/user-manage/cv/list" className="block text-white">Việc làm đã gửi</Link>
                </li>
                <li className="py-[10px] px-[16px] hover:bg-[#000096]">
                  <Link href="/user-manage/favoriteJob" className="block text-white">Việc làm yêu thích</Link>
                </li>
                <li className="py-[10px] px-[16px] hover:bg-[#000096] border-t border-white/10" onClick={() => handleLogout("/login")}>
                  Đăng xuất
                </li>
              </ul>
            </div>
          )}

          {/* Cụm COMPANY */}
          {infoCompany && (
           
           <div className="relative group/company flex items-center gap-x-3 cursor-pointer">
      
      {/* --- PHẦN AVATAR --- */}
      <div className={`w-10 h-10 overflow-hidden rounded-full flex-shrink-0 relative 
        ${hasPackage 
          ? 'border-2 border-[#FFD700] ring-2 ring-[#FFD700]/30' // Nếu có gói: Viền vàng + hiệu ứng tỏa sáng nhẹ
          : 'border border-gray-300' // Bình thường
        }`}
      >
        <Image
          width={40}
          height={40}
          src={infoCompany?.logo || avatarDefault}
          alt="logo company"
          className="object-cover w-full h-full"
        />
      </div>

      {/* --- PHẦN TÊN & ICON VIP --- */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-x-1">
          {/* Tên công ty */}
          <span 
            className={`inline-block max-w-[80px] sm:max-w-[150px] truncate align-middle whitespace-nowrap 
              ${hasPackage ? 'font-bold text-[#FFD700]' : 'text-white'} 
            `}
            title={infoCompany.companyName}
          >
            {infoCompany.companyName}
          </span>

          {/* Icon Vương miện (Chỉ hiện khi có gói) */}
          {hasPackage && (
            <div title="Tài khoản VIP" className="flex-shrink-0 text-[#FFD700]">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                 <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
               </svg>
            </div>
          )}
        </div>
        
        {/* hiển thị tên gói */}
        {hasPackage && (
           <span className="text-[10px] text-gray-300 leading-none">
             {infoCompany?.currentVipPackage?.name || "Premium Member"}
           </span>
        )}
      </div>

     
      <ul className="absolute top-full right-0 w-[200px] bg-[#000065] hidden group-hover/company:block z-[999] shadow-xl pt-2 rounded-b-md border-t-2 border-[#FFD700]">
        <li className="py-[10px] px-[16px] hover:bg-[#000096]">
          <Link href="/company-manage/profile" className="block text-white">Thông tin công ty</Link>
        </li>
        <li className="py-[10px] px-[16px] hover:bg-[#000096]">
          <Link href="/company-manage/job/list" className="block text-white">Quản lý công việc</Link>
        </li>
        <li className="py-[10px] px-[16px] hover:bg-[#000096]">
          <Link href="/company-manage/cv/list" className="block text-white">Quản lý CV</Link>
        </li>
        <li className="py-[10px] px-[16px] hover:bg-[#000096]">
          <Link href="/candidatesearch" className="block text-white">Tìm kiếm ứng viên </Link>
        </li>
        <li className="py-[10px] px-[16px] hover:bg-[#000096] border-t border-white/10" onClick={() => handleLogout("/login")}>
          Đăng xuất
        </li>
      </ul>
    </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-x-2">
          {pathname !== "/login" && <Link href="/login" className="hover:underline">Đăng Nhập</Link>}
          {pathname !== "/login" && pathname !== "/register" && <span className="opacity-50">/</span>}
          {pathname !== "/register" && <Link href="/register" className="hover:underline">Đăng Ký</Link>}
        </div>
      )}
    </div>
  )
}